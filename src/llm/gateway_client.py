"""
Gateway LLM Client for OpenAI-compatible Hackathon AI Gateway.
Replaces local Ollama client with cloud/remote inference.
"""

from __future__ import annotations

import asyncio
import json
import logging
import os
import re
from typing import Any, AsyncGenerator
from pathlib import Path

import httpx
try:
    from dotenv import load_dotenv
    # Load .env from project root
    env_file = Path(__file__).resolve().parent.parent.parent / ".env"
    if env_file.exists():
        load_dotenv(env_file, override=False)
except ImportError:
    pass

from .base import BaseLLMClient

logger = logging.getLogger(__name__)


class ContentCleaner:
    @staticmethod
    def strip_think_tags(text: str) -> str:
        """Strip <think>...</think> reasoning tags if present."""
        if not text:
            return text
        return re.sub(r"<think>.*?</think>", "", text, flags=re.DOTALL).strip()


class GatewayClient(BaseLLMClient):
    """Client for generating completions via OpenAI-compatible AI Gateway."""

    def __init__(
        self,
        base_url: str | None = None,
        model: str | None = None,
        api_key: str | None = None,
        timeout: float = 60.0,
    ):
        self.base_url = (
            base_url
            or os.getenv("OPENAI_BASE_URL")
            or "http://103.73.181.90:4000/v1"
        ).rstrip("/")
        self.model = model or os.getenv("LLM_MODEL") or "qwen-7b"
        self.api_key = api_key or os.getenv("OPENAI_API_KEY") or ""
        self.timeout = timeout

    def _get_headers(self) -> dict[str, str]:
        headers = {"Content-Type": "application/json"}
        key = self.api_key or os.getenv("OPENAI_API_KEY") or ""
        if key:
            headers["Authorization"] = f"Bearer {key}"
        return headers

    def _sanitize_messages(self, messages: list[dict[str, Any]]) -> list[dict[str, Any]]:
        """Ensure all messages conform to OpenAI specification before sending."""
        sanitized = []
        last_tool_id = "call_default"
        for msg in messages:
            cleaned = dict(msg)
            # Ensure tool_calls arguments are JSON string as required by OpenAI spec
            if "tool_calls" in cleaned and isinstance(cleaned["tool_calls"], list):
                tool_calls = []
                for tc in cleaned["tool_calls"]:
                    tc_copy = dict(tc)
                    tc_id = tc_copy.get("id") or f"call_{id(tc)}"
                    last_tool_id = tc_id
                    tc_copy["id"] = tc_id
                    if "function" in tc_copy:
                        fn = dict(tc_copy["function"])
                        if isinstance(fn.get("arguments"), dict):
                            fn["arguments"] = json.dumps(fn["arguments"], ensure_ascii=False)
                        tc_copy["function"] = fn
                    tool_calls.append(tc_copy)
                cleaned["tool_calls"] = tool_calls
                if not cleaned.get("content"):
                    cleaned["content"] = ""

            # Ensure tool response has tool_call_id
            if cleaned.get("role") == "tool":
                if not cleaned.get("tool_call_id"):
                    cleaned["tool_call_id"] = last_tool_id

            sanitized.append(cleaned)
        return sanitized

    async def chat(
        self,
        messages: list[dict],
        options: dict | None = None,
        tools: list | None = None,
    ) -> dict[str, Any]:
        """Send chat completion request to the gateway."""
        opts = options or {}
        max_tokens = opts.get("max_tokens") or opts.get("num_predict") or 1024
        temperature = opts.get("temperature", 0.7)
        top_p = opts.get("top_p", 0.9)

        payload: dict[str, Any] = {
            "model": self.model,
            "messages": self._sanitize_messages(messages),
            "stream": False,
            "max_tokens": max_tokens,
            "temperature": temperature,
            "top_p": top_p,
        }
        if tools:
            payload["tools"] = tools

        max_retries = 4
        last_error = None
        for attempt in range(max_retries):
            try:
                async with httpx.AsyncClient(timeout=self.timeout) as client:
                    resp = await client.post(
                        f"{self.base_url}/chat/completions",
                        headers=self._get_headers(),
                        json=payload,
                    )
                    if resp.status_code == 429:
                        wait_sec = 0.5 * (2**attempt)
                        logger.warning(
                            "Rate limit (429) on gateway chat. Backing off for %.2fs...",
                            wait_sec,
                        )
                        await asyncio.sleep(wait_sec)
                        continue
                    resp.raise_for_status()
                    data = resp.json()
                    choice = data.get("choices", [{}])[0]
                    message = choice.get("message", {})

                    content = message.get("content") or ""
                    if content:
                        content = ContentCleaner.strip_think_tags(content)

                    # Normalize tool call arguments so client logic can access them as dict
                    tool_calls = message.get("tool_calls") or []
                    parsed_tool_calls = []
                    for tc in tool_calls:
                        tc_dict = dict(tc)
                        fn = dict(tc_dict.get("function", {}))
                        raw_args = fn.get("arguments", {})
                        if isinstance(raw_args, str):
                            try:
                                fn["arguments"] = json.loads(raw_args)
                            except json.JSONDecodeError:
                                fn["arguments"] = {}
                        tc_dict["function"] = fn
                        parsed_tool_calls.append(tc_dict)

                    return {
                        "role": "assistant",
                        "content": content,
                        "tool_calls": parsed_tool_calls,
                    }
            except httpx.HTTPError as exc:
                last_error = exc
                wait_sec = 0.5 * (2**attempt)
                logger.warning(
                    "HTTP error (%s) contacting gateway chat. Retry %d/%d in %.2fs...",
                    exc,
                    attempt + 1,
                    max_retries,
                    wait_sec,
                )
                await asyncio.sleep(wait_sec)

        raise RuntimeError(f"Gateway chat completion failed after {max_retries} attempts: {last_error}")

    async def chat_stream(
        self,
        messages: list[dict],
        options: dict | None = None,
        tools: list | None = None,
    ) -> AsyncGenerator[dict[str, Any], None]:
        """Stream chat completion tokens from the gateway."""
        opts = options or {}
        max_tokens = opts.get("max_tokens") or opts.get("num_predict") or 1024
        temperature = opts.get("temperature", 0.7)
        top_p = opts.get("top_p", 0.9)

        payload: dict[str, Any] = {
            "model": self.model,
            "messages": self._sanitize_messages(messages),
            "stream": True,
            "max_tokens": max_tokens,
            "temperature": temperature,
            "top_p": top_p,
        }
        if tools:
            payload["tools"] = tools

        max_retries = 3
        for attempt in range(max_retries):
            try:
                async with httpx.AsyncClient(timeout=self.timeout) as client:
                    async with client.stream(
                        "POST",
                        f"{self.base_url}/chat/completions",
                        headers=self._get_headers(),
                        json=payload,
                    ) as response:
                        if response.status_code == 429:
                            await asyncio.sleep(0.5 * (2**attempt))
                            continue
                        response.raise_for_status()

                        tool_calls_accumulator: list[dict[str, Any]] = []
                        async for line in response.aiter_lines():
                            line = line.strip()
                            if not line or not line.startswith("data: "):
                                continue
                            data_str = line[6:]
                            if data_str == "[DONE]":
                                break
                            try:
                                chunk = json.loads(data_str)
                            except json.JSONDecodeError:
                                continue

                            choice = chunk.get("choices", [{}])[0]
                            delta = choice.get("delta", {})
                            finish_reason = choice.get("finish_reason")

                            # Accumulate delta tool calls
                            if delta.get("tool_calls"):
                                for tc in delta["tool_calls"]:
                                    tc_dict = dict(tc)
                                    fn = dict(tc_dict.get("function", {}))
                                    raw_args = fn.get("arguments", {})
                                    if isinstance(raw_args, str):
                                        try:
                                            fn["arguments"] = json.loads(raw_args)
                                        except json.JSONDecodeError:
                                            pass
                                    tc_dict["function"] = fn
                                    tool_calls_accumulator.append(tc_dict)

                            token = delta.get("content", "")
                            is_done = finish_reason in {"stop", "tool_calls"}

                            yield {
                                "message": {
                                    "content": token,
                                    "tool_calls": tool_calls_accumulator if is_done else [],
                                },
                                "done": is_done,
                            }
                        return
            except httpx.HTTPError as exc:
                if attempt == max_retries - 1:
                    raise RuntimeError(f"Gateway streaming failed after {max_retries} attempts: {exc}") from exc
                await asyncio.sleep(0.5 * (2**attempt))
