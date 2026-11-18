# ==============================================================================
# CBT ASSISTANT AI — PRODUCTION DOCKERFILE
# ==============================================================================

FROM python:3.12-slim-bookworm AS base

# Prevent Python from writing .pyc files and enable unbuffered logging
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONPATH=/app

WORKDIR /app

# Install system dependencies (build-essential, curl, libpq for PostgreSQL)
RUN apk add --no-cache \
    build-base \
    curl \
    postgresql-dev

# Install python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy application source code
COPY . .

# Ensure data directory exists with write permissions
RUN mkdir -p /app/data

# Expose FastAPI port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:8000/api/v1/health || exit 1

# Start command: apply Alembic migrations then run the server
CMD ["sh", "-c", "alembic upgrade head && python backend/server.py"]
