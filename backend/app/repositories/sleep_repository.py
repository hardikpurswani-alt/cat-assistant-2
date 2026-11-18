from datetime import datetime, timezone
from typing import List, Optional
from sqlalchemy import delete, desc, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.models.sleep import SleepEntry


class SleepRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_sleep(
        self,
        bed: str,
        wake: str,
        awk: int,
        qual: int,
        dur_hrs: float,
        iso_date: str,
        notes: Optional[str] = None,
        user_id: Optional[str] = None,
        session_id: Optional[str] = None,
    ) -> SleepEntry:
        entry = SleepEntry(
            user_id=user_id,
            session_id=session_id,
            bed=bed,
            wake=wake,
            awk=awk,
            qual=qual,
            dur_hrs=dur_hrs,
            iso_date=iso_date,
            notes=notes,
        )
        self.db.add(entry)
        await self.db.flush()
        return entry

    async def list_sleep(
        self,
        user_id: Optional[str] = None,
        session_id: Optional[str] = None,
        limit: int = 60,
    ) -> List[SleepEntry]:
        if not user_id and not session_id:
            return []

        conditions = []
        if user_id:
            conditions.append(SleepEntry.user_id == user_id)
        elif session_id:
            conditions.append(SleepEntry.session_id == session_id)

        query = select(SleepEntry).where(or_(*conditions)).order_by(desc(SleepEntry.iso_date)).limit(limit)
        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def get_by_id(self, sleep_id: int) -> Optional[SleepEntry]:
        result = await self.db.execute(select(SleepEntry).where(SleepEntry.id == sleep_id))
        return result.scalar_one_or_none()

    async def delete_sleep(self, sleep_id: int) -> None:
        await self.db.execute(delete(SleepEntry).where(SleepEntry.id == sleep_id))
        await self.db.flush()
