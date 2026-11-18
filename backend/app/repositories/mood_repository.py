from datetime import datetime, timedelta, timezone
from typing import List, Optional
from sqlalchemy import and_, delete, desc, func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.models.mood import MoodEntry


class MoodRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_mood(
        self,
        score: int,
        note: Optional[str] = None,
        user_id: Optional[str] = None,
        session_id: Optional[str] = None,
        timestamp: Optional[datetime] = None,
    ) -> MoodEntry:
        entry = MoodEntry(
            user_id=user_id,
            session_id=session_id,
            score=score,
            note=note,
            timestamp=timestamp or datetime.now(timezone.utc),
        )
        self.db.add(entry)
        await self.db.flush()
        return entry

    async def list_moods(
        self,
        user_id: Optional[str] = None,
        session_id: Optional[str] = None,
        limit: int = 100,
    ) -> List[MoodEntry]:
        if not user_id and not session_id:
            return []

        conditions = []
        if user_id:
            conditions.append(MoodEntry.user_id == user_id)
        elif session_id:
            conditions.append(MoodEntry.session_id == session_id)

        query = select(MoodEntry).where(or_(*conditions)).order_by(desc(MoodEntry.timestamp)).limit(limit)
        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def get_by_id(self, mood_id: int) -> Optional[MoodEntry]:
        result = await self.db.execute(select(MoodEntry).where(MoodEntry.id == mood_id))
        return result.scalar_one_or_none()

    async def delete_mood(self, mood_id: int) -> None:
        await self.db.execute(delete(MoodEntry).where(MoodEntry.id == mood_id))
        await self.db.flush()

    async def get_14d_stats(
        self,
        user_id: Optional[str] = None,
        session_id: Optional[str] = None,
    ) -> dict:
        if not user_id and not session_id:
            return {"avg_score": None, "total_count": 0, "entries": []}

        cutoff = datetime.now(timezone.utc) - timedelta(days=14)
        conditions = [MoodEntry.timestamp >= cutoff]
        if user_id:
            conditions.append(MoodEntry.user_id == user_id)
        elif session_id:
            conditions.append(MoodEntry.session_id == session_id)

        query = select(
            func.avg(MoodEntry.score).label("avg_score"),
            func.count(MoodEntry.id).label("total_count"),
        ).where(and_(*conditions))

        result = await self.db.execute(query)
        row = result.fetchone()

        avg_score = float(row.avg_score) if row and row.avg_score is not None else None
        total_count = int(row.total_count) if row and row.total_count is not None else 0

        # Fetch recent entries for chart
        recent_query = (
            select(MoodEntry)
            .where(and_(*conditions))
            .order_by(MoodEntry.timestamp.asc())
        )
        recent_res = await self.db.execute(recent_query)
        recent_entries = list(recent_res.scalars().all())

        return {
            "avg_score": round(avg_score, 1) if avg_score is not None else None,
            "total_count": total_count,
            "entries": recent_entries,
        }
