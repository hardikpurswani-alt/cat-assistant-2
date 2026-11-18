from datetime import datetime, timezone
from typing import Optional
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.models.user import RefreshSession, User


class UserRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, user_id: str) -> Optional[User]:
        result = await self.db.execute(select(User).where(User.id == user_id))
        return result.scalar_one_or_none()

    async def get_by_email(self, email: str) -> Optional[User]:
        result = await self.db.execute(select(User).where(User.email == email.lower()))
        return result.scalar_one_or_none()

    async def create_user(
        self,
        email: str,
        hashed_password: str,
        full_name: Optional[str] = None,
        role: str = "user",
    ) -> User:
        user = User(
            email=email.lower().strip(),
            hashed_password=hashed_password,
            full_name=full_name.strip() if full_name else None,
            role=role,
        )
        self.db.add(user)
        await self.db.flush()
        return user

    async def update_user(self, user: User, **kwargs) -> User:
        for key, value in kwargs.items():
            if hasattr(user, key) and value is not None:
                setattr(user, key, value)
        await self.db.flush()
        return user

    # Refresh Session Management
    async def create_refresh_session(
        self,
        user_id: str,
        token_hash: str,
        expires_at: datetime,
        ip_address: Optional[str] = None,
        user_agent: Optional[str] = None,
    ) -> RefreshSession:
        session = RefreshSession(
            user_id=user_id,
            token_hash=token_hash,
            expires_at=expires_at,
            ip_address=ip_address,
            user_agent=user_agent,
        )
        self.db.add(session)
        await self.db.flush()
        return session

    async def get_refresh_session_by_hash(self, token_hash: str) -> Optional[RefreshSession]:
        result = await self.db.execute(
            select(RefreshSession).where(
                RefreshSession.token_hash == token_hash,
                RefreshSession.is_revoked.is_(False),
                RefreshSession.expires_at > datetime.now(timezone.utc),
            )
        )
        return result.scalar_one_or_none()

    async def revoke_refresh_session(self, session_id: str) -> None:
        await self.db.execute(
            update(RefreshSession)
            .where(RefreshSession.id == session_id)
            .values(is_revoked=True)
        )
        await self.db.flush()

    async def revoke_all_user_sessions(self, user_id: str) -> None:
        await self.db.execute(
            update(RefreshSession)
            .where(RefreshSession.user_id == user_id)
            .values(is_revoked=True)
        )
        await self.db.flush()
