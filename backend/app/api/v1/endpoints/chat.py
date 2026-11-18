from typing import List, Optional
import uuid
from fastapi import APIRouter, Depends, Header, HTTPException, status
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.core.database import get_db
from backend.app.core.dependencies import get_current_user, get_optional_user
from backend.app.core.exceptions import EntityNotFoundError, PermissionDeniedError
from backend.app.models.user import User
from backend.app.repositories.chat_repository import ChatRepository
from backend.app.schemas.chat import (
    ChatRequest,
    ChatResponse,
    ConversationCreate,
    ConversationRead,
    MessageCreate,
    MessageRead,
)
from backend.app.services.chat_service import ChatService

router = APIRouter(prefix="/chat", tags=["AI Chatbot"])


@router.post("/conversations", response_model=ConversationRead, status_code=status.HTTP_201_CREATED)
async def create_new_conversation(
    data: ConversationCreate,
    optional_user: Optional[User] = Depends(get_optional_user),
    db: AsyncSession = Depends(get_db),
):
    """Creates a new CBT conversation container."""
    conv_id = f"session_{uuid.uuid4().hex[:12]}"
    repo = ChatRepository(db)
    user_id = optional_user.id if optional_user else None
    conv = await repo.get_or_create_conversation(conv_id, user_id=user_id, title=data.title or "New CBT Conversation")
    return conv


@router.get("/conversations", response_model=List[ConversationRead])
async def list_user_conversations(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Lists conversations owned by the authenticated user."""
    repo = ChatRepository(db)
    return await repo.list_conversations_for_user(current_user.id)


@router.get("/conversations/{conversation_id}", response_model=ConversationRead)
async def get_conversation_details(
    conversation_id: str,
    optional_user: Optional[User] = Depends(get_optional_user),
    db: AsyncSession = Depends(get_db),
):
    """Retrieves conversation details and full message history with privacy isolation."""
    repo = ChatRepository(db)
    conv = await repo.get_conversation(conversation_id)
    if not conv:
        raise EntityNotFoundError("Conversation", conversation_id)

    # Privacy check: If conversation has an owner, only the owner can read it
    if conv.user_id and (not optional_user or optional_user.id != conv.user_id):
        raise PermissionDeniedError("You do not have permission to view this conversation")

    return conv


@router.post("/conversations/{conversation_id}/messages", response_model=ChatResponse)
async def send_chat_message(
    conversation_id: str,
    data: MessageCreate,
    optional_user: Optional[User] = Depends(get_optional_user),
    db: AsyncSession = Depends(get_db),
):
    """Submits a message and receives the AI cognitive behavioral response."""
    repo = ChatRepository(db)
    conv = await repo.get_conversation(conversation_id)
    if conv and conv.user_id and (not optional_user or optional_user.id != conv.user_id):
        raise PermissionDeniedError("You do not have permission to post to this conversation")

    service = ChatService(db)
    user_id = optional_user.id if optional_user else None
    reply, trace = await service.process_user_message(
        conversation_id=conversation_id,
        message_text=data.content,
        user_id=user_id,
    )
    return ChatResponse(response=reply, session_id=conversation_id, trace=trace)


@router.post("/conversations/{conversation_id}/stream")
async def stream_chat_message(
    conversation_id: str,
    data: MessageCreate,
    optional_user: Optional[User] = Depends(get_optional_user),
    db: AsyncSession = Depends(get_db),
):
    """Streams the AI response chunk-by-chunk using Server-Sent Events (SSE)."""
    repo = ChatRepository(db)
    conv = await repo.get_conversation(conversation_id)
    if conv and conv.user_id and (not optional_user or optional_user.id != conv.user_id):
        raise PermissionDeniedError("Access denied")

    service = ChatService(db)
    user_id = optional_user.id if optional_user else None

    async def event_generator():
        async for chunk in service.stream_user_message(conversation_id, data.content, user_id=user_id):
            yield f"data: {chunk}\n\n"
        yield "data: [DONE]\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")


@router.delete("/conversations/{conversation_id}", status_code=status.HTTP_200_OK)
async def delete_conversation(
    conversation_id: str,
    optional_user: Optional[User] = Depends(get_optional_user),
    db: AsyncSession = Depends(get_db),
):
    """Deletes a conversation and its messages."""
    repo = ChatRepository(db)
    conv = await repo.get_conversation(conversation_id)
    if not conv:
        raise EntityNotFoundError("Conversation", conversation_id)

    if conv.user_id and (not optional_user or optional_user.id != conv.user_id):
        raise PermissionDeniedError("Access denied")

    await repo.delete_conversation(conversation_id)
    return {"message": "Conversation successfully deleted"}
