from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field


class ExerciseRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    title: str
    category: str
    description: str
    steps_json: Optional[str] = None
    duration_seconds: int


class ExerciseProgressCreate(BaseModel):
    exercise_id: str
    completed: bool = True
    duration_spent_seconds: int = Field(0, ge=0)
    feedback: Optional[str] = None
    session_id: Optional[str] = None


class ExerciseProgressRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    user_id: Optional[str] = None
    session_id: Optional[str] = None
    exercise_id: str
    completed: bool
    duration_spent_seconds: int
    feedback: Optional[str] = None
    timestamp: datetime
