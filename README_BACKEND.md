# CBT Assistant AI — Enterprise Backend Architecture
## Python 3 + FastAPI + PostgreSQL (SQLAlchemy 2.0 Async) + Alembic + Argon2id JWT + AI Integration

This document outlines the complete backend architecture, relational database schema, authentication system, AI integration pipeline, and operational procedures for **CBT Assistant AI**.

---

## 1. Architectural Overview

CBT Assistant AI is built with an asynchronous, layered service-repository architecture designed for high throughput, sub-second response times, and uncompromising security.

```
┌───────────────────────────────────────────────────────────┐
│                    Web & Mobile Client                    │
│      (Vanilla JS SPA, Frosted Glassmorphism, Doodles)     │
└──────────────┬─────────────────────────────▲──────────────┘
               │ HTTP / JSON                 │ SSE Stream
               ▼                             │
┌───────────────────────────────────────────────────────────┐
│                    FastAPI HTTP Engine                    │
│  - Middleware: CORS, Request Tracing, Error Shield        │
│  - Routers: /api/v1 (REST) & /api (Backward-Compatible)   │
└──────────────┬─────────────────────────────┬──────────────┘
               │                             │
    ┌──────────▼──────────┐       ┌──────────▼──────────┐
    │  Business Services  │       │  AI / RAG Pipeline  │
    │  - AuthService      │       │  - SemanticRAG      │
    │  - ChatService      │       │  - GatewayClient    │
    │  - DashboardService │       │  - CrisisDetector   │
    └──────────┬──────────┘       └──────────┬──────────┘
               │                             │
    ┌──────────▼──────────┐                  │
    │ Repositories (ORM)  │                  │
    │ - User, Mood, Sleep │                  │
    │ - Thought, Activity │                  │
    └──────────┬──────────┘                  │
               │ AsyncSession                │
┌──────────────▼─────────────────────────────▼──────────────┐
│                    Data Persistence                       │
│  - PostgreSQL 16 (asyncpg) [Production / Docker]          │
│  - SQLite 3 (aiosqlite)    [Zero-Config Local Dev]        │
│  - ChromaDB / FastEmbed    [Clinical Knowledge Vectors]   │
└───────────────────────────────────────────────────────────┘
```

### Core Technologies
- **Runtime:** Python 3.12+ with asynchronous event loops.
- **Web Framework:** [FastAPI](https://fastapi.tiangolo.com/) with native Pydantic v2 schemas and streaming response support.
- **Database ORM:** [SQLAlchemy 2.0](https://www.sqlalchemy.org/) (pure asynchronous `AsyncSession`).
- **Database Drivers:** `asyncpg` for PostgreSQL and `aiosqlite` for local file-based storage.
- **Schema Migrations:** [Alembic](https://alembic.sqlalchemy.org/) with async engine compatibility.
- **Authentication:** Password hashing via **Argon2id** (`argon2-cffi`), and stateless authentication via **PyJWT** (access tokens + SHA-256 stored refresh token rotation).
- **AI Core:** Hybrid RAG integrating semantic retrieval, crisis signposting, small talk suppression, and multi-turn conversational memory.

---

## 2. Directory Structure

```
cbt_assisant-ai/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── v1/
│   │   │       ├── router.py          # Unified v1 route aggregator
│   │   │       ├── auth.py            # Register, login, refresh, logout
│   │   │       ├── users.py           # User profile & preferences
│   │   │       ├── chat.py            # AI conversation & streaming
│   │   │       ├── mood.py            # Mood logs & analytics
│   │   │       ├── journal.py         # Thought records & cognitive distortions
│   │   │       ├── sleep.py           # Sleep duration & quality logs
│   │   │       ├── assessment.py      # PHQ-9, GAD-7, Rosenberg clinical tests
│   │   │       ├── exercises.py       # Box breathing, 4-7-8, grounding, PMR
│   │   │       ├── dashboard.py       # Bento analytics aggregator
│   │   │       └── system.py          # Health check & system status
│   │   ├── core/
│   │   │   ├── config.py              # Pydantic Settings (.env loader)
│   │   │   ├── database.py            # SQLAlchemy async engine & sessionmaker
│   │   │   ├── security.py            # Argon2id hashing & JWT token management
│   │   │   ├── exceptions.py          # Domain-specific HTTP exceptions
│   │   │   ├── dependencies.py        # Dependency injectors (get_db, get_current_user)
│   │   │   └── logging.py             # Sensitive data log sanitization filter
│   │   ├── models/                    # Declarative SQLAlchemy models
│   │   │   ├── user.py                # User & RefreshSession
│   │   │   ├── conversation.py        # Conversation & Message
│   │   │   ├── mood.py                # MoodEntry
│   │   │   ├── journal.py             # ThoughtRecord
│   │   │   ├── sleep.py               # SleepEntry
│   │   │   ├── assessment.py          # AssessmentResult
│   │   │   ├── activity.py            # ActivityEntry
│   │   │   ├── exercise.py            # CBTExercise & ExerciseProgress
│   │   │   └── settings.py            # UserSettings
│   │   ├── schemas/                   # Pydantic validation schemas
│   │   │   ├── auth.py, chat.py, mood.py, journal.py, ...
│   │   ├── repositories/              # Database isolation layer
│   │   │   ├── user_repository.py, chat_repository.py, ...
│   │   └── services/                  # Business logic orchestration
│   │       ├── auth_service.py
│   │       ├── ai_service.py
│   │       ├── chat_service.py
│   │       └── dashboard_service.py
│   ├── server.py                      # Main entrypoint & backward-compatible routes
├── migrations/                        # Alembic async migration versions
├── data/                              # SQLite databases & RAG vector data
├── frontend/                          # Client-side web application
├── tests/                             # Comprehensive Pytest suite
├── Dockerfile                         # Production container image
├── docker-compose.yml                 # Orchestrated PostgreSQL + Backend setup
├── requirements.txt                   # Pinned production Python dependencies
└── alembic.ini                        # Alembic configuration
```

---

## 3. Relational Database Schema & Entities

The relational database enforces user data isolation through foreign key relationships and index optimization:

1. **`users`**: UUID primary key, unique indexed `email`, hashed password (`argon2id`), `full_name`, `is_active`, `is_admin`, timestamps.
2. **`refresh_sessions`**: Refresh token rotation management; stores SHA-256 hashed token, `expires_at`, `revoked_at`, device/client IP metadata.
3. **`conversations`**: Chat thread header tied to `user_id` or `session_id`, holding title and last active timestamp.
4. **`messages`**: Individual messages in thread (`role`, `content`, `tokens_used`, `rag_context`, `crisis_flagged`).
5. **`mood_entries`**: Daily mood ratings (0–10 scale), tags, journal notes, energy level.
6. **`thought_records`**: 7-column CBT thought diary (`situation`, `automatic_thoughts`, `cognitive_distortions`, `evidence_for`, `evidence_against`, `alternative_thought`, `outcome_rating`).
7. **`sleep_logs`**: Sleep duration (`hours`), sleep quality (1–5), bed time, wake time, awakenings count, disruptions.
8. **`assessment_results`**: Clinical screenings (`PHQ-9` depression, `GAD-7` anxiety, `Rosenberg` self-esteem), total score, severity category, responses map.
9. **`activities`**: Behavioral activation logs (`title`, `category`, `pleasure_rating`, `mastery_rating`, `completed`).
10. **`cbt_exercises`**: Library of evidence-based somatic exercises (Box Breathing, 4-7-8, 5-4-3-2-1 Grounding, Progressive Muscle Relaxation, STOP technique).
11. **`exercise_progress`**: User exercise completions, duration seconds, before/after stress ratings.
12. **`user_settings`**: Privacy and reminder preferences, dark/light theme, language, and clinical profile metadata.

---

## 4. Setup & Installation

### Prerequisites
- Python 3.12+ (or 3.10+)
- Node.js & npm (optional, for project root scripts)
- PostgreSQL 14+ or Docker (optional; SQLite fallback requires zero setup)

### Step 1: Initialize Virtual Environment
```bash
python3 -m venv .venv
source .venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
```

### Step 2: Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
*For local development with SQLite, defaults work immediately without modification.*

### Step 3: Run Database Migrations
Apply all schema migrations to create tables and indexes:
```bash
alembic upgrade head
```

---

## 5. Running the Application

### Development Server (Recommended)
You can boot using `npm run dev` or directly via Python:
```bash
# Using npm
npm run dev

# Or directly with Python
.venv/bin/python backend/server.py
```
The server will start on `http://localhost:8000`.

### Interactive API Documentation
Once running, explore and test the endpoints directly in your browser:
- **Swagger UI:** [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc UI:** [http://localhost:8000/redoc](http://localhost:8000/redoc)

---

## 6. Docker & Production Deployment

A complete production-ready multi-container configuration is provided with PostgreSQL 16:

```bash
# Build and run containers in background
docker compose up -d --build

# View logs
docker compose logs -f cbt-backend

# Stop containers
docker compose down
```

The database automatically initializes and runs Alembic migrations on startup. Data is persisted in named Docker volumes (`postgres_data`).

---

## 7. Key API Endpoints Reference

### Authentication (`/api/v1/auth`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/auth/register` | Register new user with Argon2id hash |
| `POST` | `/api/v1/auth/login` | Authenticate, returns access + refresh JWT |
| `POST` | `/api/v1/auth/refresh` | Rotate refresh token and issue new access token |
| `POST` | `/api/v1/auth/logout` | Revoke active refresh session |
| `GET`  | `/api/v1/auth/me` | Fetch currently authenticated user profile |

### Clinical & CBT Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/chat` | Send message to AI assistant (RAG + Safety) |
| `GET`  | `/api/v1/chat/history` | Retrieve user conversation history |
| `POST` | `/api/v1/mood` | Log daily mood score (0–10) |
| `GET`  | `/api/v1/mood` | Fetch mood logs with 14-day history |
| `POST` | `/api/v1/journal/thoughts` | Create CBT thought record with distortion tags |
| `GET`  | `/api/v1/journal/thoughts` | List user thought records |
| `POST` | `/api/v1/sleep` | Log sleep hours and quality |
| `POST` | `/api/v1/assessments` | Submit PHQ-9, GAD-7, or Rosenberg questionnaire |
| `GET`  | `/api/v1/dashboard/summary` | Bento analytics aggregator (14-day trends & scores) |
| `GET`  | `/api/v1/health` | Service health status and database connectivity |

---

## 8. Automated Testing & Verification

The backend includes a comprehensive Pytest test suite testing auth flows, token rotation, CRUD operations, user isolation, and security controls:

```bash
# Run test suite
.venv/bin/python -m pytest tests/

# Run with verbose output
.venv/bin/python -m pytest tests/ -v
```

All 67+ tests pass with 100% green status.
