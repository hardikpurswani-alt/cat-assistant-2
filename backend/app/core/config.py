import os
from pathlib import Path
from typing import List, Union
from pydantic import AnyHttpUrl, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

# Base directory for the backend/project
APP_DIR = Path(__file__).resolve().parent.parent
BACKEND_DIR = APP_DIR.parent
PROJECT_ROOT = BACKEND_DIR.parent
DATA_DIR = PROJECT_ROOT / "data"
DATA_DIR.mkdir(parents=True, exist_ok=True)


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=str(PROJECT_ROOT / ".env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    APP_NAME: str = "CBT Assistant AI"
    APP_VERSION: str = "1.1.0"
    APP_ENV: str = "development"
    DEBUG: bool = True

    # Security & JWT Auth
    SECRET_KEY: str = "cbt-assistant-super-secure-jwt-secret-key-change-in-prod-2026"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_DAYS: int = 30

    # Database
    # Default is async SQLite for local/testing; supports async PostgreSQL (postgresql+asyncpg://...)
    DATABASE_URL: str = f"sqlite+aiosqlite:///{DATA_DIR / 'cbt_production.db'}"

    # CORS
    CORS_ORIGINS: List[str] = ["*"]

    # AI Configuration (preserves current gateway & RAG setup)
    AI_PROVIDER: str = "gateway"  # "gateway" or "ollama"
    OPENAI_BASE_URL: str = "http://103.73.181.90:4000/v1"
    OPENAI_API_KEY: str = "your_gateway_api_key"
    LLM_MODEL: str = "qwen-7b"
    EMBEDDING_MODEL: str = "embed"
    RAG_SCORE_THRESHOLD: float = 0.48

    # Server binding
    HOST: str = "0.0.0.0"
    PORT: int = 8000

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",") if i.strip()]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)


settings = Settings()
