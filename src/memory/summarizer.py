import asyncio
from typing import List, Dict
import logging

from src.llm.base import BaseLLMClient
from src.utils.db import SQLiteSessionManager

logger = logging.getLogger(__name__)


class MemorySummarizer:
    def __init__(self, db: SQLiteSessionManager, llm_client: BaseLLMClient):
        self.db = db
        self.llm_client = llm_client
        self.trigger_threshold = 15  # Summarize every 15 new messages
        self._tasks: set[asyncio.Task] = set()
        self._session_locks: dict[str, asyncio.Lock] = {}

    async def _generate_summary(
        self, old_summary: str, recent_messages: List[Dict]
    ) -> str:
        prompt = """
        You are an expert clinical psychologist keeping concise, durable clinical notes about a client.
        Your task is to update the current client summary based on new chat messages.

        RULES:
        1. Extract only ESSENTIAL facts: user's name, loved ones and pet names, preferences, triggers, core concerns, coping techniques used, and agreements.
        2. Write concisely, clearly, and in a professional tone.
        3. Preserve context from the old summary, integrating new details. Do not delete names or established personal facts unless explicitly corrected by the user. Only remove what has clearly become obsolete.
        4. If there is no previous summary, create a new one directly.
        5. Do not use filler phrases like "the patient states" or "I responded".

        --- PREVIOUS SUMMARY ---
        {old}
        
        --- NEW MESSAGES ---
        {new}
        
        UPDATED CLIENT SUMMARY:
        """

        formatted_msgs = "\n".join(
            [f"{m['role']}: {m['content']}" for m in recent_messages]
        )
        final_prompt = prompt.format(
            old=old_summary or "None", new=formatted_msgs
        )

        try:
            resp = await self.llm_client.chat(
                [{"role": "user", "content": final_prompt}]
            )
            return resp.get("content", "").strip()
        except Exception as e:
            logger.error(f"Failed to generate memory summary: {e}")
            return old_summary

    async def maybe_summarize(self, session_id: str):
        task = asyncio.create_task(self._process_summarization(session_id))
        self._tasks.add(task)
        task.add_done_callback(self._tasks.discard)

    async def close(self):
        """Let scheduled summaries finish during an orderly server shutdown."""
        if self._tasks:
            await asyncio.gather(*tuple(self._tasks), return_exceptions=True)

    async def _process_summarization(self, session_id: str):
        lock = self._session_locks.setdefault(session_id, asyncio.Lock())
        async with lock:
            await self._process_summarization_locked(session_id)

    async def _process_summarization_locked(self, session_id: str):
        try:
            # 1. Check if we need to summarize
            msg_count = self.db.get_message_count_since_last_summary(session_id)
            if msg_count < self.trigger_threshold:
                return

            # 2. Get old summary and un-summarized messages
            old_summary = self.db.get_session_summary(session_id)
            messages = self.db.get_unsummarized_messages(session_id)

            if not messages:
                return

            logger.info(
                f"Summarizing {len(messages)} messages for session {session_id}"
            )

            # 3. Generate new summary
            new_summary = await self._generate_summary(old_summary, messages)

            if new_summary and new_summary != old_summary:
                # 4. Save to DB
                self.db.save_session_summary(session_id, new_summary)
                logger.info(f"Saved new summary for session {session_id}")

        except Exception as e:
            logger.error(f"Error in background summarization process: {e}")
