from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field


class MessageCreate(BaseModel):
    role: str = Field(..., description="'user', 'assistant', or 'system'")
    content: str = Field(..., min_length=1)


class MessageRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    conversation_id: str
    role: str
    content: str
    timestamp: datetime


class ConversationCreate(BaseModel):
    title: Optional[str] = "New Conversation"


class ConversationRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    user_id: Optional[str] = None
    title: str
    summary: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    messages: List[MessageRead] = []


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=10000)
    session_id: Optional[str] = None
    stream: bool = False
    context_window: int = 10


class ChatResponse(BaseModel):
    response: str
    session_id: str
    trace: Optional[dict] = None
