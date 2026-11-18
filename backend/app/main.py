from contextlib import asynccontextmanager
import logging
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from backend.app.api.v1.router import api_router
from backend.app.core.config import settings
from backend.app.core.database import init_db
from backend.app.core.exceptions import CBTAppException
from backend.app.core.logging import setup_logging
from backend.app.services.ai_service import AIService

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    setup_logging()
    logger.info("Starting up %s v%s...", settings.APP_NAME, settings.APP_VERSION)
    await init_db()
    ai_service = AIService.get_instance()
    await ai_service.initialize()
    logger.info("Application initialized successfully.")
    try:
        yield
    finally:
        logger.info("Shutting down %s...", settings.APP_NAME)


def create_application() -> FastAPI:
    app = FastAPI(
        title=settings.APP_NAME,
        version=settings.APP_VERSION,
        description="Production-grade FastAPI backend for CBT Assistant AI mental healthcare platform.",
        docs_url="/docs",
        redoc_url="/redoc",
        openapi_url="/api/v1/openapi.json",
        lifespan=lifespan,
    )

    # CORS Middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Global Exception Handlers
    @app.exception_handler(CBTAppException)
    async def cbt_exception_handler(request: Request, exc: CBTAppException):
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "error": exc.detail,
                "code": exc.code,
                "extra": exc.extra,
            },
        )

    # Mount modern v1 API router
    app.include_router(api_router)

    return app


app = create_application()
