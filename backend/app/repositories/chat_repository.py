from datetime import datetime, timezone
from typing import List, Optional
from sqlalchemy import delete, desc, select, update
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from backend.app.models.conversation import Conversation, Message


class ChatRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_or_create_conversation(
        self,
        conversation_id: str,
        user_id: Optional[str] = None,
        title: str = "New CBT Conversation",
    ) -> Conversation:
        result = await self.db.execute(
            select(Conversation)
            .options(selectinload(Conversation.messages))
            .where(Conversation.id == conversation_id)
        )
        conv = result.scalar_one_or_none()
        if not conv:
            conv = Conversation(
                id=conversation_id,
                user_id=user_id,
                title=title,
            )
            self.db.add(conv)
            await self.db.flush()
            # Reload with messages list
            result = await self.db.execute(
                select(Conversation)
                .options(selectinload(Conversation.messages))
                .where(Conversation.id == conversation_id)
            )
            conv = result.scalar_one()
        elif user_id and not conv.user_id:
            # Associate anonymous conversation with logged-in user
            conv.user_id = user_id
            await self.db.flush()

        return conv

    async def get_conversation(self, conversation_id: str) -> Optional[Conversation]:
        result = await self.db.execute(
            select(Conversation)
            .options(selectinload(Conversation.messages))
            .where(Conversation.id == conversation_id)
        )
        return result.scalar_one_or_none()

    async def list_conversations_for_user(
        self,
        user_id: str,
        limit: int = 50,
        offset: int = 0,
    ) -> List[Conversation]:
        result = await self.db.execute(
            select(Conversation)
            .where(Conversation.user_id == user_id)
            .order_by(desc(Conversation.updated_at))
            .limit(limit)
            .offset(offset)
        )
        return list(result.scalars().all())

    async def add_message(
        self,
        conversation_id: str,
        role: str,
        content: str,
        timestamp: Optional[datetime] = None,
    ) -> Message:
        msg = Message(
            conversation_id=conversation_id,
            role=role,
            content=content,
            timestamp=timestamp or datetime.now(timezone.utc),
        )
        self.db.add(msg)
        # Update parent conversation updated_at
        await self.db.execute(
            update(Conversation)
            .where(Conversation.id == conversation_id)
            .values(updated_at=datetime.now(timezone.utc))
        )
        await self.db.flush()
        return msg

    async def get_messages(
        self,
        conversation_id: str,
        limit: int = 100,
    ) -> List[Message]:
        result = await self.db.execute(
            select(Message)
            .where(Message.conversation_id == conversation_id)
            .order_by(Message.timestamp.asc())
            .limit(limit)
        )
        return list(result.scalars().all())

    async def clear_messages(self, conversation_id: str) -> None:
        await self.db.execute(
            delete(Message).where(Message.conversation_id == conversation_id)
        )
        await self.db.flush()

    async def delete_conversation(self, conversation_id: str) -> None:
        await self.db.execute(
            delete(Conversation).where(Conversation.id == conversation_id)
        )
        await self.db.flush()

    async def update_summary(self, conversation_id: str, summary: str) -> None:
        await self.db.execute(
            update(Conversation)
            .where(Conversation.id == conversation_id)
            .values(summary=summary, updated_at=datetime.now(timezone.utc))
        )
        await self.db.flush()

    async def update_profile(self, conversation_id: str, profile_json: str) -> None:
        await self.db.execute(
            update(Conversation)
            .where(Conversation.id == conversation_id)
            .values(profile_json=profile_json, updated_at=datetime.now(timezone.utc))
        )
        await self.db.flush()
