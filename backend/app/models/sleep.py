from datetime import datetime, timezone
from typing import TYPE_CHECKING, Optional
from sqlalchemy import DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from backend.app.core.database import Base

if TYPE_CHECKING:
    from backend.app.models.user import User


class SleepEntry(Base):
    __tablename__ = "sleep_logs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[Optional[str]] = mapped_column(
        String(36),
        ForeignKey("users.id", ondelete="CASCADE"),
        index=True,
        nullable=True,
    )
    session_id: Mapped[Optional[str]] = mapped_column(String(64), index=True, nullable=True)
    bed: Mapped[str] = mapped_column(String(20), nullable=False)
    wake: Mapped[str] = mapped_column(String(20), nullable=False)
    awk: Mapped[int] = mapped_column(Integer, default=0)
    qual: Mapped[int] = mapped_column(Integer, default=3)  # 1 to 5
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    dur_hrs: Mapped[float] = mapped_column(Float, default=7.0)
    iso_date: Mapped[str] = mapped_column(String(30), nullable=False, index=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
    )

    user: Mapped[Optional["User"]] = relationship("User", back_populates="sleep_entries")
