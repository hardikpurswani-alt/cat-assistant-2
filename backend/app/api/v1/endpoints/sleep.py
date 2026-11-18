from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.core.database import get_db
from backend.app.core.dependencies import get_optional_user
from backend.app.core.exceptions import EntityNotFoundError, PermissionDeniedError
from backend.app.models.user import User
from backend.app.repositories.sleep_repository import SleepRepository
from backend.app.schemas.sleep import SleepCreate, SleepRead

router = APIRouter(prefix="/sleep", tags=["Sleep Journal"])


@router.post("", response_model=SleepRead, status_code=status.HTTP_201_CREATED)
async def log_sleep_entry(
    data: SleepCreate,
    optional_user: Optional[User] = Depends(get_optional_user),
    db: AsyncSession = Depends(get_db),
):
    """Logs a sleep record (bedtime, wake time, awakenings, quality rating, and duration)."""
    repo = SleepRepository(db)
    user_id = optional_user.id if optional_user else None
    return await repo.create_sleep(
        bed=data.bed,
        wake=data.wake,
        awk=data.awk,
        qual=data.qual,
        dur_hrs=data.dur_hrs,
        iso_date=data.iso_date,
        notes=data.notes,
        user_id=user_id,
        session_id=data.session_id,
    )


@router.get("", response_model=List[SleepRead])
async def list_sleep_entries(
    session_id: Optional[str] = Query(None),
    limit: int = Query(30, ge=1, le=100),
    optional_user: Optional[User] = Depends(get_optional_user),
    db: AsyncSession = Depends(get_db),
):
    """Retrieves sleep history."""
    repo = SleepRepository(db)
    user_id = optional_user.id if optional_user else None
    return await repo.list_sleep(user_id=user_id, session_id=session_id, limit=limit)


@router.delete("/{sleep_id}", status_code=status.HTTP_200_OK)
async def delete_sleep_entry(
    sleep_id: int,
    optional_user: Optional[User] = Depends(get_optional_user),
    db: AsyncSession = Depends(get_db),
):
    """Deletes a sleep entry with ownership validation."""
    repo = SleepRepository(db)
    entry = await repo.get_by_id(sleep_id)
    if not entry:
        raise EntityNotFoundError("SleepEntry", sleep_id)

    if entry.user_id and (not optional_user or optional_user.id != entry.user_id):
        raise PermissionDeniedError("Access denied")

    await repo.delete_sleep(sleep_id)
    return {"message": "Sleep entry deleted"}
