from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.core.database import get_db
from backend.app.core.dependencies import get_optional_user
from backend.app.core.exceptions import EntityNotFoundError, PermissionDeniedError
from backend.app.models.user import User
from backend.app.repositories.mood_repository import MoodRepository
from backend.app.schemas.mood import MoodCreate, MoodRead, MoodSummary

router = APIRouter(prefix="/moods", tags=["Mood Tracking"])


@router.post("", response_model=MoodRead, status_code=status.HTTP_201_CREATED)
async def log_mood(
    data: MoodCreate,
    optional_user: Optional[User] = Depends(get_optional_user),
    db: AsyncSession = Depends(get_db),
):
    """Creates a new emotional mood entry."""
    repo = MoodRepository(db)
    user_id = optional_user.id if optional_user else None
    entry = await repo.create_mood(
        score=data.score,
        note=data.note,
        user_id=user_id,
        session_id=data.session_id,
    )
    return entry


@router.get("", response_model=List[MoodRead])
async def list_moods(
    session_id: Optional[str] = Query(None),
    limit: int = Query(50, ge=1, le=200),
    optional_user: Optional[User] = Depends(get_optional_user),
    db: AsyncSession = Depends(get_db),
):
    """Retrieves mood history for the authenticated user or guest session."""
    repo = MoodRepository(db)
    user_id = optional_user.id if optional_user else None
    return await repo.list_moods(user_id=user_id, session_id=session_id, limit=limit)


@router.get("/summary", response_model=MoodSummary)
async def get_mood_summary(
    session_id: Optional[str] = Query(None),
    optional_user: Optional[User] = Depends(get_optional_user),
    db: AsyncSession = Depends(get_db),
):
    """Returns 14-day aggregated mood statistics and trend analysis."""
    repo = MoodRepository(db)
    user_id = optional_user.id if optional_user else None
    stats = await repo.get_14d_stats(user_id=user_id, session_id=session_id)

    avg_score = stats["avg_score"]
    total = stats["total_count"]
    entries = stats["entries"]

    trend = "insufficient_data"
    if len(entries) >= 2:
        first_half = entries[:len(entries)//2]
        second_half = entries[len(entries)//2:]
        avg1 = sum(e.score for e in first_half) / len(first_half)
        avg2 = sum(e.score for e in second_half) / len(second_half)
        if avg2 - avg1 > 0.5:
            trend = "improving"
        elif avg1 - avg2 > 0.5:
            trend = "declining"
        else:
            trend = "stable"

    return MoodSummary(
        average_score=avg_score,
        total_entries=total,
        trend_direction=trend,
        recent_entries=[MoodRead.model_validate(e) for e in entries[-10:]],
    )


@router.delete("/{mood_id}", status_code=status.HTTP_200_OK)
async def delete_mood(
    mood_id: int,
    optional_user: Optional[User] = Depends(get_optional_user),
    db: AsyncSession = Depends(get_db),
):
    """Deletes a specific mood record with ownership verification."""
    repo = MoodRepository(db)
    entry = await repo.get_by_id(mood_id)
    if not entry:
        raise EntityNotFoundError("MoodEntry", mood_id)

    if entry.user_id and (not optional_user or optional_user.id != entry.user_id):
        raise PermissionDeniedError("Access denied")

    await repo.delete_mood(mood_id)
    return {"message": "Mood entry deleted"}
