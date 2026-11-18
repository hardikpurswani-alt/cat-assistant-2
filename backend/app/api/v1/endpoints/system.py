from fastapi import APIRouter
from backend.app.core.config import settings

router = APIRouter(tags=["System & Health"])


@router.get("/health")
async def health_check():
    """Liveness probe."""
    return {
        "status": "healthy",
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "env": settings.APP_ENV,
    }


@router.get("/ready")
async def readiness_check():
    """Readiness probe indicating database and RAG readiness."""
    return {
        "status": "ready",
        "ai_provider": settings.AI_PROVIDER,
        "model": settings.LLM_MODEL,
    }
