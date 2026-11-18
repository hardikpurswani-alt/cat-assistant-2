import json
from typing import AsyncGenerator, Dict, List, Optional, Tuple
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.models.conversation import Conversation
from backend.app.repositories.chat_repository import ChatRepository
from backend.app.services.ai_service import AIService
from src.memory.profile import extract_profile_updates, has_profile_updates, merge_profiles


class ChatService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.chat_repo = ChatRepository(db)
        self.ai_service = AIService.get_instance()

    async def get_or_create_conversation(
        self,
        conversation_id: str,
        user_id: Optional[str] = None,
    ) -> Conversation:
        return await self.chat_repo.get_or_create_conversation(
            conversation_id=conversation_id,
            user_id=user_id,
        )

    async def get_conversation_history(
        self,
        conversation_id: str,
    ) -> List[Dict[str, str]]:
        messages = await self.chat_repo.get_messages(conversation_id)
        return [{"role": m.role, "content": m.content} for m in messages]

    async def process_user_message(
        self,
        conversation_id: str,
        message_text: str,
        user_id: Optional[str] = None,
    ) -> Tuple[str, dict]:
        conv = await self.get_or_create_conversation(conversation_id, user_id=user_id)

        # 1. Store user message
        await self.chat_repo.add_message(
            conversation_id=conversation_id,
            role="user",
            content=message_text,
        )

        # 2. Extract profile memory updates
        profile = json.loads(conv.profile_json) if conv.profile_json else {}
        updates = extract_profile_updates(message_text)
        if has_profile_updates(updates):
            profile = merge_profiles(profile, updates)
            await self.chat_repo.update_profile(conversation_id, json.dumps(profile))

        # 3. Fetch past messages for context
        history = await self.get_conversation_history(conversation_id)

        # 4. Generate AI response
        ai_reply, trace = await self.ai_service.generate_response(
            user_message=message_text,
            history=history[:-1],  # Exclude latest user message as it is passed explicitly
            summary=conv.summary,
            profile=profile,
        )

        # 5. Store AI response
        await self.chat_repo.add_message(
            conversation_id=conversation_id,
            role="assistant",
            content=ai_reply,
        )

        return ai_reply, trace

    async def stream_user_message(
        self,
        conversation_id: str,
        message_text: str,
        user_id: Optional[str] = None,
    ) -> AsyncGenerator[str, None]:
        conv = await self.get_or_create_conversation(conversation_id, user_id=user_id)

        # Store user message
        await self.chat_repo.add_message(
            conversation_id=conversation_id,
            role="user",
            content=message_text,
        )

        history = await self.get_conversation_history(conversation_id)
        profile = json.loads(conv.profile_json) if conv.profile_json else {}

        accumulated_chunks: List[str] = []
        async for chunk in self.ai_service.stream_response(
            user_message=message_text,
            history=history[:-1],
            summary=conv.summary,
            profile=profile,
        ):
            accumulated_chunks.append(chunk)
            yield chunk

        # Store full assistant response after stream completes
        full_reply = "".join(accumulated_chunks)
        if full_reply.strip():
            await self.chat_repo.add_message(
                conversation_id=conversation_id,
                role="assistant",
                content=full_reply,
            )
