from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.core.database import get_db
from backend.app.core.dependencies import get_optional_user
from backend.app.models.user import User
from backend.app.repositories.assessment_repository import AssessmentRepository
from backend.app.schemas.assessment import AssessmentCreate, AssessmentRead

router = APIRouter(prefix="/assessment", tags=["Clinical Assessments"])


@router.post("", response_model=AssessmentRead, status_code=status.HTTP_201_CREATED)
async def record_assessment(
    data: AssessmentCreate,
    optional_user: Optional[User] = Depends(get_optional_user),
    db: AsyncSession = Depends(get_db),
):
    """Stores standardized self-assessment scores (PHQ-9, GAD-7, Rosenberg)."""
    repo = AssessmentRepository(db)
    user_id = optional_user.id if optional_user else None
    return await repo.create_assessment(
        test_name=data.test_name,
        score=data.score,
        level=data.level,
        iso_date=data.iso_date,
        user_id=user_id,
        session_id=data.session_id,
    )


@router.get("", response_model=List[AssessmentRead])
async def list_assessments(
    session_id: Optional[str] = Query(None),
    test_name: Optional[str] = Query(None),
    limit: int = Query(30, ge=1, le=100),
    optional_user: Optional[User] = Depends(get_optional_user),
    db: AsyncSession = Depends(get_db),
):
    """Retrieves assessment history."""
    repo = AssessmentRepository(db)
    user_id = optional_user.id if optional_user else None
    return await repo.list_assessments(
        user_id=user_id,
        session_id=session_id,
        test_name=test_name,
        limit=limit,
    )
