from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field


class ThoughtCreate(BaseModel):
    situation: str = Field(..., min_length=1, description="Event or context triggering the thought")
    thought: str = Field(..., min_length=1, description="Automatic negative thought")
    emotion: str = Field(..., min_length=1, description="Primary emotion felt")
    intensity: int = Field(50, ge=0, le=100, description="Emotion intensity percentage")
    distortion: Optional[str] = Field(None, description="Identified cognitive distortion")
    rational_response: Optional[str] = Field(None, description="Rational alternative thought")
    session_id: Optional[str] = None


class ThoughtUpdate(BaseModel):
    situation: Optional[str] = None
    thought: Optional[str] = None
    emotion: Optional[str] = None
    intensity: Optional[int] = Field(None, ge=0, le=100)
    distortion: Optional[str] = None
    rational_response: Optional[str] = None


class ThoughtRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: Optional[str] = None
    session_id: Optional[str] = None
    situation: str
    thought: str
    emotion: str
    intensity: int
    distortion: Optional[str] = None
    rational_response: Optional[str] = None
    timestamp: datetime
