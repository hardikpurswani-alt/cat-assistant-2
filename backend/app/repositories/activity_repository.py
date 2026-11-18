from typing import List, Optional
from sqlalchemy import delete, desc, or_, select, update
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.models.activity import ActivityEntry


class ActivityRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_activity(
        self,
        activity_text: str,
        iso_date: str,
        done: bool = False,
        user_id: Optional[str] = None,
        session_id: Optional[str] = None,
    ) -> ActivityEntry:
        entry = ActivityEntry(
            user_id=user_id,
            session_id=session_id,
            activity_text=activity_text,
            done=done,
            iso_date=iso_date,
        )
        self.db.add(entry)
        await self.db.flush()
        return entry

    async def list_activities(
        self,
        user_id: Optional[str] = None,
        session_id: Optional[str] = None,
        limit: int = 100,
    ) -> List[ActivityEntry]:
        if not user_id and not session_id:
            return []

        conditions = []
        if user_id:
            conditions.append(ActivityEntry.user_id == user_id)
        elif session_id:
            conditions.append(ActivityEntry.session_id == session_id)

        query = select(ActivityEntry).where(or_(*conditions)).order_by(desc(ActivityEntry.iso_date)).limit(limit)
        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def toggle_done(self, activity_id: int, done: bool) -> Optional[ActivityEntry]:
        await self.db.execute(
            update(ActivityEntry)
            .where(ActivityEntry.id == activity_id)
            .values(done=done)
        )
        await self.db.flush()
        result = await self.db.execute(
            select(ActivityEntry).where(ActivityEntry.id == activity_id)
        )
        return result.scalar_one_or_none()
