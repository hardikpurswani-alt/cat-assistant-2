from fastapi import APIRouter

from backend.app.api.v1.endpoints import (
    assessment,
    auth,
    chat,
    dashboard,
    exercises,
    journal,
    mood,
    sleep,
    system,
    users,
)

api_router = APIRouter(prefix="/api/v1")

api_router.include_router(system.router)
api_router.include_router(auth.router)
api_router.include_router(users.router)
api_router.include_router(chat.router)
api_router.include_router(mood.router)
api_router.include_router(journal.router)
api_router.include_router(sleep.router)
api_router.include_router(assessment.router)
api_router.include_router(exercises.router)
api_router.include_router(dashboard.router)
