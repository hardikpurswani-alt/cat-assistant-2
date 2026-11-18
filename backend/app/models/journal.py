from datetime import datetime, timezone
from typing import TYPE_CHECKING, Optional
from sqlalchemy import DateTime, ForeignKey, Index, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from backend.app.core.database import Base

if TYPE_CHECKING:
    from backend.app.models.user import User


class ThoughtRecord(Base):
    __tablename__ = "thought_records"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[Optional[str]] = mapped_column(
        String(36),
        ForeignKey("users.id", ondelete="CASCADE"),
        index=True,
        nullable=True,
    )
    session_id: Mapped[Optional[str]] = mapped_column(String(64), index=True, nullable=True)
    situation: Mapped[str] = mapped_column(Text, nullable=False)
    thought: Mapped[str] = mapped_column(Text, nullable=False)
    emotion: Mapped[str] = mapped_column(String(100), nullable=False)
    intensity: Mapped[int] = mapped_column(Integer, default=50)  # 0 to 100
    distortion: Mapped[Optional[str]] = mapped_column(String(200), nullable=True)
    rational_response: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    timestamp: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        index=True,
    )

    user: Mapped[Optional["User"]] = relationship("User", back_populates="thought_records")
