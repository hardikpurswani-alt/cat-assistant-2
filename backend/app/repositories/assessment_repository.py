from typing import List, Optional
from sqlalchemy import delete, desc, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.models.assessment import AssessmentResult


class AssessmentRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_assessment(
        self,
        test_name: str,
        score: int,
        level: str,
        iso_date: str,
        user_id: Optional[str] = None,
        session_id: Optional[str] = None,
    ) -> AssessmentResult:
        result = AssessmentResult(
            user_id=user_id,
            session_id=session_id,
            test_name=test_name,
            score=score,
            level=level,
            iso_date=iso_date,
        )
        self.db.add(result)
        await self.db.flush()
        return result

    async def list_assessments(
        self,
        user_id: Optional[str] = None,
        session_id: Optional[str] = None,
        test_name: Optional[str] = None,
        limit: int = 50,
    ) -> List[AssessmentResult]:
        if not user_id and not session_id:
            return []

        conditions = []
        if user_id:
            conditions.append(AssessmentResult.user_id == user_id)
        elif session_id:
            conditions.append(AssessmentResult.session_id == session_id)

        query = select(AssessmentResult).where(or_(*conditions))
        if test_name:
            query = query.where(AssessmentResult.test_name == test_name)
        query = query.order_by(desc(AssessmentResult.iso_date)).limit(limit)

        result = await self.db.execute(query)
        return list(result.scalars().all())
