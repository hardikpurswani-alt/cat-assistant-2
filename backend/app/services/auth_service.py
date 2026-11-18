from datetime import datetime, timezone
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.core.config import settings
from backend.app.core.exceptions import AuthenticationError, ConflictError, EntityNotFoundError
from backend.app.core.security import (
    create_access_token,
    generate_refresh_token,
    hash_password,
    hash_token,
    verify_password,
)
from backend.app.models.user import User
from backend.app.repositories.user_repository import UserRepository
from backend.app.schemas.auth import TokenResponse, UserLogin, UserRegister


class AuthService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.user_repo = UserRepository(db)

    async def register(
        self,
        data: UserRegister,
        ip_address: Optional[str] = None,
        user_agent: Optional[str] = None,
    ) -> TokenResponse:
        # Duplicate email check
        existing = await self.user_repo.get_by_email(data.email)
        if existing:
            raise ConflictError(detail="An account with this email already exists")

        hashed_pw = hash_password(data.password)
        user = await self.user_repo.create_user(
            email=data.email,
            hashed_password=hashed_pw,
            full_name=data.full_name,
        )

        # Generate tokens
        access_token = create_access_token(
            subject=user.id,
            extra_claims={"email": user.email, "role": user.role},
        )
        raw_refresh, token_hash, expires_at = generate_refresh_token()
        await self.user_repo.create_refresh_session(
            user_id=user.id,
            token_hash=token_hash,
            expires_at=expires_at,
            ip_address=ip_address,
            user_agent=user_agent,
        )

        return TokenResponse(
            access_token=access_token,
            refresh_token=raw_refresh,
            token_type="bearer",
            expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
            user_id=user.id,
            email=user.email,
            full_name=user.full_name,
        )

    async def login(
        self,
        data: UserLogin,
        ip_address: Optional[str] = None,
        user_agent: Optional[str] = None,
    ) -> TokenResponse:
        user = await self.user_repo.get_by_email(data.email)
        if not user or not verify_password(data.password, user.hashed_password):
            raise AuthenticationError(detail="Incorrect email or password")

        if not user.is_active:
            raise AuthenticationError(detail="Account is currently inactive")

        access_token = create_access_token(
            subject=user.id,
            extra_claims={"email": user.email, "role": user.role},
        )
        raw_refresh, token_hash, expires_at = generate_refresh_token()
        await self.user_repo.create_refresh_session(
            user_id=user.id,
            token_hash=token_hash,
            expires_at=expires_at,
            ip_address=ip_address,
            user_agent=user_agent,
        )

        return TokenResponse(
            access_token=access_token,
            refresh_token=raw_refresh,
            token_type="bearer",
            expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
            user_id=user.id,
            email=user.email,
            full_name=user.full_name,
        )

    async def refresh_token(
        self,
        raw_refresh_token: str,
        ip_address: Optional[str] = None,
        user_agent: Optional[str] = None,
    ) -> TokenResponse:
        token_hash = hash_token(raw_refresh_token)
        session = await self.user_repo.get_refresh_session_by_hash(token_hash)
        if not session:
            raise AuthenticationError(detail="Invalid or expired refresh token")

        user = await self.user_repo.get_by_id(session.user_id)
        if not user or not user.is_active:
            raise AuthenticationError(detail="User no longer active")

        # Refresh Token Rotation: Revoke current refresh token
        await self.user_repo.revoke_refresh_session(session.id)

        # Issue fresh token pair
        new_access = create_access_token(
            subject=user.id,
            extra_claims={"email": user.email, "role": user.role},
        )
        new_raw_refresh, new_hash, new_expires = generate_refresh_token()
        await self.user_repo.create_refresh_session(
            user_id=user.id,
            token_hash=new_hash,
            expires_at=new_expires,
            ip_address=ip_address,
            user_agent=user_agent,
        )

        return TokenResponse(
            access_token=new_access,
            refresh_token=new_raw_refresh,
            token_type="bearer",
            expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
            user_id=user.id,
            email=user.email,
            full_name=user.full_name,
        )

    async def logout(self, raw_refresh_token: str) -> None:
        token_hash = hash_token(raw_refresh_token)
        session = await self.user_repo.get_refresh_session_by_hash(token_hash)
        if session:
            await self.user_repo.revoke_refresh_session(session.id)
