from datetime import datetime, timezone
from typing import List, Optional
from sqlalchemy import delete, desc, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.models.journal import ThoughtRecord


class JournalRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_thought(
        self,
        situation: str,
        thought: str,
        emotion: str,
        intensity: int,
        distortion: Optional[str] = None,
        rational_response: Optional[str] = None,
        user_id: Optional[str] = None,
        session_id: Optional[str] = None,
        timestamp: Optional[datetime] = None,
    ) -> ThoughtRecord:
        record = ThoughtRecord(
            user_id=user_id,
            session_id=session_id,
            situation=situation,
            thought=thought,
            emotion=emotion,
            intensity=intensity,
            distortion=distortion,
            rational_response=rational_response,
            timestamp=timestamp or datetime.now(timezone.utc),
        )
        self.db.add(record)
        await self.db.flush()
        return record

    async def list_thoughts(
        self,
        user_id: Optional[str] = None,
        session_id: Optional[str] = None,
        limit: int = 100,
    ) -> List[ThoughtRecord]:
        if not user_id and not session_id:
            return []

        conditions = []
        if user_id:
            conditions.append(ThoughtRecord.user_id == user_id)
        elif session_id:
            conditions.append(ThoughtRecord.session_id == session_id)

        query = select(ThoughtRecord).where(or_(*conditions)).order_by(desc(ThoughtRecord.timestamp)).limit(limit)
        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def get_by_id(self, thought_id: int) -> Optional[ThoughtRecord]:
        result = await self.db.execute(
            select(ThoughtRecord).where(ThoughtRecord.id == thought_id)
        )
        return result.scalar_one_or_none()

    async def update_thought(
        self,
        record: ThoughtRecord,
        **kwargs,
    ) -> ThoughtRecord:
        for key, value in kwargs.items():
            if hasattr(record, key) and value is not None:
                setattr(record, key, value)
        await self.db.flush()
        return record

    async def delete_thought(self, thought_id: int) -> None:
        await self.db.execute(
            delete(ThoughtRecord).where(ThoughtRecord.id == thought_id)
        )
        await self.db.flush()
