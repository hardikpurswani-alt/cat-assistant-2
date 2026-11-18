from datetime import datetime, timezone
import uuid
from typing import TYPE_CHECKING, List, Optional
from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from backend.app.core.database import Base

if TYPE_CHECKING:
    from backend.app.models.user import User


class CBTExercise(Base):
    __tablename__ = "cbt_exercises"

    id: Mapped[str] = mapped_column(String(50), primary_key=True)  # e.g. "box_breathing"
    title: Mapped[str] = mapped_column(String(150), nullable=False)
    category: Mapped[str] = mapped_column(String(50), nullable=False)  # "breathing", "relaxation", "grounding"
    description: Mapped[str] = mapped_column(Text, nullable=False)
    steps_json: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    duration_seconds: Mapped[int] = mapped_column(Integer, default=300)

    progress_records: Mapped[List["ExerciseProgress"]] = relationship(
        "ExerciseProgress",
        back_populates="exercise",
        cascade="all, delete-orphan",
    )


class ExerciseProgress(Base):
    __tablename__ = "exercise_progress"

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
    )
    user_id: Mapped[Optional[str]] = mapped_column(
        String(36),
        ForeignKey("users.id", ondelete="CASCADE"),
        index=True,
        nullable=True,
    )
    session_id: Mapped[Optional[str]] = mapped_column(String(64), index=True, nullable=True)
    exercise_id: Mapped[str] = mapped_column(
        String(50),
        ForeignKey("cbt_exercises.id", ondelete="CASCADE"),
        index=True,
        nullable=False,
    )
    completed: Mapped[bool] = mapped_column(Boolean, default=True)
    duration_spent_seconds: Mapped[int] = mapped_column(Integer, default=0)
    feedback: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    timestamp: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        index=True,
    )

    user: Mapped[Optional["User"]] = relationship("User", back_populates="exercise_progress")
    exercise: Mapped["CBTExercise"] = relationship("CBTExercise", back_populates="progress_records")
