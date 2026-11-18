from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.core.database import get_db
from backend.app.core.dependencies import get_optional_user
from backend.app.core.exceptions import EntityNotFoundError, PermissionDeniedError
from backend.app.models.user import User
from backend.app.repositories.journal_repository import JournalRepository
from backend.app.schemas.journal import ThoughtCreate, ThoughtRead, ThoughtUpdate

router = APIRouter(prefix="/journal", tags=["CBT Journal & Thought Diary"])


@router.post("", response_model=ThoughtRead, status_code=status.HTTP_201_CREATED)
async def create_thought_entry(
    data: ThoughtCreate,
    optional_user: Optional[User] = Depends(get_optional_user),
    db: AsyncSession = Depends(get_db),
):
    """Creates a structured CBT thought diary record."""
    repo = JournalRepository(db)
    user_id = optional_user.id if optional_user else None
    return await repo.create_thought(
        situation=data.situation,
        thought=data.thought,
        emotion=data.emotion,
        intensity=data.intensity,
        distortion=data.distortion,
        rational_response=data.rational_response,
        user_id=user_id,
        session_id=data.session_id,
    )


@router.get("", response_model=List[ThoughtRead])
async def list_thought_entries(
    session_id: Optional[str] = Query(None),
    limit: int = Query(50, ge=1, le=200),
    optional_user: Optional[User] = Depends(get_optional_user),
    db: AsyncSession = Depends(get_db),
):
    """Retrieves thought diary entries for the current user or guest session."""
    repo = JournalRepository(db)
    user_id = optional_user.id if optional_user else None
    return await repo.list_thoughts(user_id=user_id, session_id=session_id, limit=limit)


@router.get("/{entry_id}", response_model=ThoughtRead)
async def get_thought_entry(
    entry_id: int,
    optional_user: Optional[User] = Depends(get_optional_user),
    db: AsyncSession = Depends(get_db),
):
    """Retrieves a single thought diary entry with privacy checks."""
    repo = JournalRepository(db)
    record = await repo.get_by_id(entry_id)
    if not record:
        raise EntityNotFoundError("ThoughtRecord", entry_id)

    if record.user_id and (not optional_user or optional_user.id != record.user_id):
        raise PermissionDeniedError("Access denied")

    return record


@router.patch("/{entry_id}", response_model=ThoughtRead)
async def update_thought_entry(
    entry_id: int,
    data: ThoughtUpdate,
    optional_user: Optional[User] = Depends(get_optional_user),
    db: AsyncSession = Depends(get_db),
):
    """Updates a thought diary entry (e.g. adding rational reframe or adjusting intensity)."""
    repo = JournalRepository(db)
    record = await repo.get_by_id(entry_id)
    if not record:
        raise EntityNotFoundError("ThoughtRecord", entry_id)

    if record.user_id and (not optional_user or optional_user.id != record.user_id):
        raise PermissionDeniedError("Access denied")

    return await repo.update_thought(record, **data.model_dump(exclude_unset=True))


@router.delete("/{entry_id}", status_code=status.HTTP_200_OK)
async def delete_thought_entry(
    entry_id: int,
    optional_user: Optional[User] = Depends(get_optional_user),
    db: AsyncSession = Depends(get_db),
):
    """Deletes a thought diary entry."""
    repo = JournalRepository(db)
    record = await repo.get_by_id(entry_id)
    if not record:
        raise EntityNotFoundError("ThoughtRecord", entry_id)

    if record.user_id and (not optional_user or optional_user.id != record.user_id):
        raise PermissionDeniedError("Access denied")

    await repo.delete_thought(entry_id)
    return {"message": "Thought entry deleted"}
