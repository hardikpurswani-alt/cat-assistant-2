from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field


class MoodCreate(BaseModel):
    score: int = Field(..., ge=0, le=10, description="Mood score on 0-10 intensity scale")
    note: Optional[str] = Field(None, max_length=1000)
    session_id: Optional[str] = None
    timestamp: Optional[str] = None


class MoodRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: Optional[str] = None
    session_id: Optional[str] = None
    score: int
    note: Optional[str] = None
    timestamp: datetime


class MoodSummary(BaseModel):
    average_score: Optional[float]
    total_entries: int
    trend_direction: str  # "improving", "stable", "declining", "insufficient_data"
    recent_entries: List[MoodRead] = []
