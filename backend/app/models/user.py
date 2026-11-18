from datetime import datetime, timezone
import uuid
from typing import TYPE_CHECKING, List, Optional
from sqlalchemy import Boolean, DateTime, ForeignKey, Index, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from backend.app.core.database import Base

if TYPE_CHECKING:
    from backend.app.models.conversation import Conversation
    from backend.app.models.mood import MoodEntry
    from backend.app.models.journal import ThoughtRecord
    from backend.app.models.sleep import SleepEntry
    from backend.app.models.assessment import AssessmentResult
    from backend.app.models.activity import ActivityEntry
    from backend.app.models.exercise import ExerciseProgress
    from backend.app.models.settings import UserSettings


class User(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
    )
    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        index=True,
        nullable=False,
    )
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    full_name: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False)
    role: Mapped[str] = mapped_column(String(30), default="user")  # "user", "admin"

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    # Relationships
    refresh_sessions: Mapped[List["RefreshSession"]] = relationship(
        "RefreshSession",
        back_populates="user",
        cascade="all, delete-orphan",
    )
    conversations: Mapped[List["Conversation"]] = relationship(
        "Conversation",
        back_populates="user",
        cascade="all, delete-orphan",
    )
    mood_entries: Mapped[List["MoodEntry"]] = relationship(
        "MoodEntry",
        back_populates="user",
        cascade="all, delete-orphan",
    )
    thought_records: Mapped[List["ThoughtRecord"]] = relationship(
        "ThoughtRecord",
        back_populates="user",
        cascade="all, delete-orphan",
    )
    sleep_entries: Mapped[List["SleepEntry"]] = relationship(
        "SleepEntry",
        back_populates="user",
        cascade="all, delete-orphan",
    )
    assessments: Mapped[List["AssessmentResult"]] = relationship(
        "AssessmentResult",
        back_populates="user",
        cascade="all, delete-orphan",
    )
    activities: Mapped[List["ActivityEntry"]] = relationship(
        "ActivityEntry",
        back_populates="user",
        cascade="all, delete-orphan",
    )
    exercise_progress: Mapped[List["ExerciseProgress"]] = relationship(
        "ExerciseProgress",
        back_populates="user",
        cascade="all, delete-orphan",
    )
    settings: Mapped[Optional["UserSettings"]] = relationship(
        "UserSettings",
        back_populates="user",
        uselist=False,
        cascade="all, delete-orphan",
    )


class RefreshSession(Base):
    __tablename__ = "refresh_sessions"

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
    )
    user_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("users.id", ondelete="CASCADE"),
        index=True,
        nullable=False,
    )
    token_hash: Mapped[str] = mapped_column(
        String(64),
        unique=True,
        index=True,
        nullable=False,
    )
    expires_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
    )
    is_revoked: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
    )
    ip_address: Mapped[Optional[str]] = mapped_column(String(45), nullable=True)
    user_agent: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    user: Mapped["User"] = relationship("User", back_populates="refresh_sessions")
