from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field


class SleepCreate(BaseModel):
    bed: str = Field(..., description="Bedtime in HH:MM format")
    wake: str = Field(..., description="Wake time in HH:MM format")
    awk: int = Field(0, ge=0, description="Number of awakenings")
    qual: int = Field(3, ge=1, le=5, description="Sleep quality rating (1-5)")
    notes: Optional[str] = None
    dur_hrs: float = Field(..., ge=0.0, le=24.0, description="Calculated duration in hours")
    iso_date: str = Field(..., description="Target date ISO format (YYYY-MM-DD)")
    session_id: Optional[str] = None


class SleepRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: Optional[str] = None
    session_id: Optional[str] = None
    bed: str
    wake: str
    awk: int
    qual: int
    notes: Optional[str] = None
    dur_hrs: float
    iso_date: str
    created_at: datetime
