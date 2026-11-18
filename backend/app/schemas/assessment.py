from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field


class AssessmentCreate(BaseModel):
    test_name: str = Field(..., description="e.g. 'PHQ-9', 'GAD-7', 'Rosenberg'")
    score: int = Field(..., ge=0)
    level: str = Field(..., description="e.g. 'Mild', 'Moderate', 'Severe'")
    iso_date: str = Field(..., description="Date taken YYYY-MM-DD")
    session_id: Optional[str] = None


class AssessmentRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: Optional[str] = None
    session_id: Optional[str] = None
    test_name: str
    score: int
    level: str
    iso_date: str
    created_at: datetime
