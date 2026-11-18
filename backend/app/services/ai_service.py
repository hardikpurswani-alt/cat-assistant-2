import asyncio
from datetime import datetime
import json
import logging
import os
from pathlib import Path
import re
from typing import AsyncGenerator, Dict, List, Optional, Tuple

from backend.app.core.config import settings
from src.llm.gateway_client import GatewayClient
from src.llm.ollama_client import OllamaClient
from src.prompts.templates import PromptManager
from src.rag.knowledge_base import SemanticRAG
from src.memory.profile import (
    extract_profile_updates,
    has_profile_updates,
    merge_profiles,
)

logger = logging.getLogger(__name__)

# Crisis and self-harm keywords for instant safe intervention
CRISIS_KEYWORDS = [
    "kill myself", "suicide", "end my life", "want to die",
    "hurt myself", "self harm", "cut myself", "hang myself",
    "overdose", "not want to live", "better off dead"
]

CRISIS_RESPONSE = (
    "I'm hearing how much pain you're in right now, and I want to make sure you're safe. "
    "Please know that you do not have to carry this alone. Please reach out to emergency support immediately:\n\n"
    "• **National Crisis Lifeline:** Call or text **988** (Available 24/7, free and confidential)\n"
    "• **Crisis Text Line:** Text **HOME** to **741741**\n"
    "• **Emergency Services:** Call **911** or go to your nearest emergency room.\n\n"
    "I am an AI assistant and cannot provide crisis intervention or medical care. Please contact a professional or someone you trust right now."
)


class AIService:
    _instance: Optional["AIService"] = None

    def __init__(self):
        project_root = Path(__file__).resolve().parent.parent.parent.parent
        kb_path = project_root / "knowledge_base"
        cache_path = project_root / "data" / "rag_cache.npz"
        trace_path = project_root / "data" / "rag_traces.jsonl"
        cache_path.parent.mkdir(parents=True, exist_ok=True)

        self.kb = SemanticRAG(
            kb_dir=kb_path,
            gateway_url=settings.OPENAI_BASE_URL,
            api_key=settings.OPENAI_API_KEY,
            embed_model=settings.EMBEDDING_MODEL,
            cache_path=cache_path,
            trace_path=trace_path,
            score_threshold=settings.RAG_SCORE_THRESHOLD,
        )

        if settings.AI_PROVIDER == "ollama":
            self.llm_client = OllamaClient(
                base_url=settings.OPENAI_BASE_URL,
                model_name=settings.LLM_MODEL,
            )
        else:
            self.llm_client = GatewayClient(
                base_url=settings.OPENAI_BASE_URL,
                api_key=settings.OPENAI_API_KEY,
                model_name=settings.LLM_MODEL,
            )

        self.prompt_manager = PromptManager(project_root / "config" / "prompts.yaml")

    @classmethod
    def get_instance(cls) -> "AIService":
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    async def initialize(self) -> None:
        """Initializes RAG embeddings asynchronously in degraded mode if offline."""
        try:
            await self.kb.load_and_embed()
        except Exception as exc:
            logger.warning(
                "RAG knowledge base could not be embedded at startup (%s). Running in degraded mode.",
                exc,
            )

    @staticmethod
    def is_crisis_message(message: str) -> bool:
        normalized = message.lower()
        return any(k in normalized for k in CRISIS_KEYWORDS)

    @staticmethod
    def is_conversational_greeting_or_smalltalk(message: str) -> bool:
        cleaned = re.sub(r"[^\w\s]", "", message.strip().lower())
        if not cleaned:
            return True
        greetings = {
            "hello", "hi", "hey", "hi there", "hello there", "good morning", "good afternoon",
            "good evening", "good day", "how are you", "how are you doing", "how do you do",
            "who are you", "what can you do", "what is your name", "what are your capabilities",
            "nice to meet you", "thanks", "thank you", "bye", "goodbye"
        }
        if cleaned in greetings:
            return True
        words = cleaned.split()
        if len(words) <= 4 and all(w in {
            "hello", "hi", "hey", "there", "good", "morning", "afternoon", "evening", "day",
            "how", "are", "you", "doing", "who", "what", "can", "do", "thanks", "thank"
        } for w in words):
            return True
        return False

    async def retrieve_context(self, message: str) -> Tuple[List[dict], dict]:
        """Retrieves clinical context from knowledge base or skips for small talk."""
        if self.is_conversational_greeting_or_smalltalk(message):
            return [], {
                "status": "no_relevant_context",
                "trace_id": f"trace_smalltalk_{int(datetime.now().timestamp())}",
                "index_version": getattr(self.kb, "index_version", "unindexed"),
                "latency_ms": 0.0,
                "selected": [],
                "must_abstain": False,
            }

        try:
            retrieval = await self.kb.search_with_trace(message, top_k=3)
            return retrieval.get("results", []), retrieval.get("trace", {})
        except Exception as exc:
            logger.debug("Knowledge base retrieval failed: %s", exc)
            return [], {
                "status": "no_relevant_context",
                "trace_id": f"trace_fallback_{int(datetime.now().timestamp())}",
                "index_version": getattr(self.kb, "index_version", "unindexed"),
                "latency_ms": 0.0,
                "selected": [],
                "must_abstain": False,
                "error": str(exc),
            }

    async def generate_response(
        self,
        user_message: str,
        history: List[dict],
        summary: Optional[str] = None,
        profile: Optional[dict] = None,
    ) -> Tuple[str, dict]:
        """Generates an AI response incorporating CBT guardrails, RAG, and memory."""
        # Check crisis triggers first
        if self.is_crisis_message(user_message):
            return CRISIS_RESPONSE, {"status": "crisis_signpost"}

        context, trace = await self.retrieve_context(user_message)
        system_prompt = self.prompt_manager.build_system_prompt(
            context=context,
            summary=summary,
            profile=profile,
        )

        messages = [{"role": "system", "content": system_prompt}]
        for item in history[-10:]:
            messages.append({"role": item["role"], "content": item["content"]})
        messages.append({"role": "user", "content": user_message})

        try:
            response_text = await self.llm_client.generate(messages)
            # Add citations if clinical context was retrieved
            if context and not any(f"[KB:{item.get('chunk_id')}]" in response_text for item in context):
                citations = ", ".join(f"[KB:{c.get('chunk_id')}]" for c in context if c.get("chunk_id"))
                if citations:
                    response_text = f"{response_text.rstrip()}\n\n*Retrieved CBT Reference: {citations}*"
            return response_text, trace
        except Exception as exc:
            logger.error("LLM Generation failed: %s", exc)
            fallback = (
                "I'm here with you. It seems our connection to the core language processor is temporarily degraded. "
                "While we reconnect, would you like to log a thought in your Thought Diary or try a 4-4-4-4 Box Breathing exercise?"
            )
            return fallback, {"status": "degraded", "error": str(exc)}

    async def stream_response(
        self,
        user_message: str,
        history: List[dict],
        summary: Optional[str] = None,
        profile: Optional[dict] = None,
    ) -> AsyncGenerator[str, None]:
        """Streams chunked response text for real-time frontend typing animation."""
        if self.is_crisis_message(user_message):
            yield CRISIS_RESPONSE
            return

        context, _ = await self.retrieve_context(user_message)
        system_prompt = self.prompt_manager.build_system_prompt(
            context=context,
            summary=summary,
            profile=profile,
        )

        messages = [{"role": "system", "content": system_prompt}]
        for item in history[-10:]:
            messages.append({"role": item["role"], "content": item["content"]})
        messages.append({"role": "user", "content": user_message})

        try:
            async for chunk in self.llm_client.stream(messages):
                yield chunk
        except Exception as exc:
            logger.error("LLM Streaming failed: %s", exc)
            yield "\n[Notice: Communication degraded. Please try again in a moment.]"
