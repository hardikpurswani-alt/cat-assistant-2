from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field


class ActivityCreate(BaseModel):
    activity_text: str = Field(..., min_length=1)
    done: bool = False
    iso_date: str = Field(..., description="Target date YYYY-MM-DD")
    session_id: Optional[str] = None


class ActivityRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: Optional[str] = None
    session_id: Optional[str] = None
    activity_text: str
    done: bool
    iso_date: str
    created_at: datetime
