from fastapi import APIRouter, Depends, Header, Request, status
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.core.database import get_db
from backend.app.core.dependencies import get_current_user
from backend.app.models.user import User
from backend.app.schemas.auth import (
    TokenRefreshRequest,
    TokenResponse,
    UserLogin,
    UserRead,
    UserRegister,
)
from backend.app.services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register_user(
    data: UserRegister,
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    """Registers a new user and returns JWT access & refresh tokens."""
    service = AuthService(db)
    client_ip = request.client.host if request.client else None
    user_agent = request.headers.get("user-agent")
    return await service.register(data, ip_address=client_ip, user_agent=user_agent)


@router.post("/login", response_model=TokenResponse)
async def login_user(
    data: UserLogin,
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    """Authenticates credentials using Argon2id and returns tokens."""
    service = AuthService(db)
    client_ip = request.client.host if request.client else None
    user_agent = request.headers.get("user-agent")
    return await service.login(data, ip_address=client_ip, user_agent=user_agent)


@router.post("/refresh", response_model=TokenResponse)
async def refresh_access_token(
    data: TokenRefreshRequest,
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    """Rotates refresh token and issues a new access token."""
    service = AuthService(db)
    client_ip = request.client.host if request.client else None
    user_agent = request.headers.get("user-agent")
    return await service.refresh_token(data.refresh_token, ip_address=client_ip, user_agent=user_agent)


@router.post("/logout")
async def logout_user(
    data: TokenRefreshRequest,
    db: AsyncSession = Depends(get_db),
):
    """Revokes the refresh token session."""
    service = AuthService(db)
    await service.logout(data.refresh_token)
    return {"message": "Logged out successfully"}


@router.get("/me", response_model=UserRead)
async def get_current_user_profile(
    current_user: User = Depends(get_current_user),
):
    """Returns the authenticated user's profile."""
    return current_user
