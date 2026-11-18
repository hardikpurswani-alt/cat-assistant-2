from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.core.database import get_db
from backend.app.core.dependencies import get_current_user
from backend.app.core.security import hash_password
from backend.app.models.user import User
from backend.app.repositories.user_repository import UserRepository
from backend.app.schemas.auth import UserRead, UserUpdate

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/me", response_model=UserRead)
async def read_user_me(
    current_user: User = Depends(get_current_user),
):
    """Retrieves current user details."""
    return current_user


@router.patch("/me", response_model=UserRead)
async def update_user_me(
    data: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Updates user full name or password."""
    repo = UserRepository(db)
    updates = {}
    if data.full_name is not None:
        updates["full_name"] = data.full_name
    if data.password:
        updates["hashed_password"] = hash_password(data.password)

    user = await repo.update_user(current_user, **updates)
    return user


@router.delete("/me", status_code=status.HTTP_200_OK)
async def delete_user_account(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Soft-deactivates the user's account and revokes active sessions."""
    repo = UserRepository(db)
    await repo.update_user(current_user, is_active=False)
    await repo.revoke_all_user_sessions(current_user.id)
    return {"message": "User account successfully deactivated"}
