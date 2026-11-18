from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.core.database import get_db
from backend.app.core.dependencies import get_optional_user
from backend.app.models.user import User
from backend.app.schemas.dashboard import DashboardSummaryRead
from backend.app.services.dashboard_service import DashboardService

router = APIRouter(prefix="/dashboard", tags=["Bento Dashboard Analytics"])


@router.get("/summary", response_model=DashboardSummaryRead)
async def get_dashboard_summary(
    session_id: Optional[str] = Query(None),
    optional_user: Optional[User] = Depends(get_optional_user),
    db: AsyncSession = Depends(get_db),
):
    """Retrieves complete, structured dashboard metrics for bento visualization."""
    service = DashboardService(db)
    user_id = optional_user.id if optional_user else None
    user_name = optional_user.full_name or optional_user.email if optional_user else None
    return await service.get_dashboard_summary(
        user_id=user_id,
        session_id=session_id,
        user_name=user_name,
    )
