from typing import Optional
from fastapi import Depends, Header, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.core.database import get_db
from backend.app.core.exceptions import AuthenticationError, PermissionDeniedError
from backend.app.core.security import decode_access_token
from backend.app.models.user import User


async def get_current_user(
    authorization: Optional[str] = Header(None),
    db: AsyncSession = Depends(get_db),
) -> User:
    """Dependency that requires a valid Bearer JWT access token."""
    if not authorization or not authorization.startswith("Bearer "):
        raise AuthenticationError(detail="Missing or malformed Authorization header")

    token = authorization.split(" ", 1)[1].strip()
    payload = decode_access_token(token)
    if not payload or not payload.get("sub"):
        raise AuthenticationError(detail="Invalid or expired access token")

    user_id = payload["sub"]
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()

    if not user:
        raise AuthenticationError(detail="User no longer exists")
    if not user.is_active:
        raise AuthenticationError(detail="User account is deactivated")

    return user


async def get_optional_user(
    authorization: Optional[str] = Header(None),
    db: AsyncSession = Depends(get_db),
) -> Optional[User]:
    """
    Dependency for endpoints that can serve both authenticated users and guest sessions.
    Returns User if valid Bearer token provided, None otherwise.
    """
    if not authorization or not authorization.startswith("Bearer "):
        return None

    token = authorization.split(" ", 1)[1].strip()
    payload = decode_access_token(token)
    if not payload or not payload.get("sub"):
        return None

    user_id = payload["sub"]
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()

    if user and user.is_active:
        return user
    return None


async def get_current_admin(
    current_user: User = Depends(get_current_user),
) -> User:
    """Dependency that ensures the authenticated user has an 'admin' role."""
    if current_user.role != "admin":
        raise PermissionDeniedError(detail="Administrator access required")
    return current_user
