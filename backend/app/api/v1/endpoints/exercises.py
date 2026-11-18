from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.core.database import get_db
from backend.app.core.dependencies import get_optional_user
from backend.app.core.exceptions import EntityNotFoundError
from backend.app.models.user import User
from backend.app.repositories.exercise_repository import ExerciseRepository
from backend.app.schemas.exercise import (
    ExerciseProgressCreate,
    ExerciseProgressRead,
    ExerciseRead,
)

router = APIRouter(prefix="/exercises", tags=["CBT Exercises & SOS"])


@router.get("", response_model=List[ExerciseRead])
async def list_exercises(
    category: Optional[str] = Query(None, description="'breathing', 'relaxation', 'grounding', 'crisis'"),
    db: AsyncSession = Depends(get_db),
):
    """Lists available evidence-based CBT exercises."""
    repo = ExerciseRepository(db)
    return await repo.list_exercises(category=category)


@router.get("/{exercise_id}", response_model=ExerciseRead)
async def get_exercise_details(
    exercise_id: str,
    db: AsyncSession = Depends(get_db),
):
    """Retrieves full exercise guidance and step-by-step instructions."""
    repo = ExerciseRepository(db)
    ex = await repo.get_exercise(exercise_id)
    if not ex:
        raise EntityNotFoundError("CBTExercise", exercise_id)
    return ex


@router.post("/{exercise_id}/progress", response_model=ExerciseProgressRead, status_code=status.HTTP_201_CREATED)
async def record_exercise_progress(
    exercise_id: str,
    data: ExerciseProgressCreate,
    optional_user: Optional[User] = Depends(get_optional_user),
    db: AsyncSession = Depends(get_db),
):
    """Records completion of a breathing, grounding, or relaxation exercise session."""
    repo = ExerciseRepository(db)
    ex = await repo.get_exercise(exercise_id)
    if not ex:
        raise EntityNotFoundError("CBTExercise", exercise_id)

    user_id = optional_user.id if optional_user else None
    return await repo.record_progress(
        exercise_id=exercise_id,
        completed=data.completed,
        duration_spent_seconds=data.duration_spent_seconds,
        feedback=data.feedback,
        user_id=user_id,
        session_id=data.session_id,
    )


@router.get("/progress/history", response_model=List[ExerciseProgressRead])
async def get_exercise_progress_history(
    session_id: Optional[str] = Query(None),
    limit: int = Query(30, ge=1, le=100),
    optional_user: Optional[User] = Depends(get_optional_user),
    db: AsyncSession = Depends(get_db),
):
    """Retrieves user's exercise progress records."""
    repo = ExerciseRepository(db)
    user_id = optional_user.id if optional_user else None
    return await repo.list_user_progress(user_id=user_id, session_id=session_id, limit=limit)
