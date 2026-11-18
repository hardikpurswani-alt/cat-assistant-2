import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from backend.app.core.database import Base, get_db
from backend.app.core.security import verify_password
from backend.app.main import create_application


@pytest_asyncio.fixture
async def test_app(tmp_path):
    """Provides a fresh isolated test database and FastAPI application per test suite."""
    test_db_file = tmp_path / "test_cbt.db"
    test_db_url = f"sqlite+aiosqlite:///{test_db_file}"

    engine = create_async_engine(
        test_db_url,
        echo=False,
        connect_args={"check_same_thread": False},
    )
    async_session = async_sessionmaker(
        bind=engine,
        class_=AsyncSession,
        expire_on_commit=False,
        autoflush=False,
    )

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    app = create_application()

    # Override get_db dependency
    async def override_get_db():
        async with async_session() as session:
            try:
                yield session
                await session.commit()
            except Exception:
                await session.rollback()
                raise
            finally:
                await session.close()

    app.dependency_overrides[get_db] = override_get_db

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://testserver") as client:
        yield client

    await engine.dispose()


@pytest.mark.asyncio
async def test_system_health(test_app):
    resp = await test_app.get("/api/v1/health")
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "healthy"


@pytest.mark.asyncio
async def test_auth_registration_and_login_flow(test_app):
    # 1. Register User
    reg_payload = {
        "email": "sarah.cbt@example.com",
        "password": "SecurePassword123!",
        "full_name": "Sarah Connor",
    }
    reg_resp = await test_app.post("/api/v1/auth/register", json=reg_payload)
    assert reg_resp.status_code == 201
    reg_data = reg_resp.json()
    assert "access_token" in reg_data
    assert "refresh_token" in reg_data
    assert reg_data["email"] == "sarah.cbt@example.com"
    assert reg_data["full_name"] == "Sarah Connor"

    access_token = reg_data["access_token"]
    refresh_token = reg_data["refresh_token"]

    # 2. Duplicate registration rejected with 409
    dup_resp = await test_app.post("/api/v1/auth/register", json=reg_payload)
    assert dup_resp.status_code == 409

    # 3. Get profile with Bearer token
    me_resp = await test_app.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {access_token}"},
    )
    assert me_resp.status_code == 200
    me_data = me_resp.json()
    assert me_data["email"] == "sarah.cbt@example.com"
    assert me_data["is_active"] is True

    # 4. Login with correct password
    login_resp = await test_app.post(
        "/api/v1/auth/login",
        json={"email": "sarah.cbt@example.com", "password": "SecurePassword123!"},
    )
    assert login_resp.status_code == 200
    login_data = login_resp.json()
    assert "access_token" in login_data

    # 5. Login with invalid password fails
    bad_login = await test_app.post(
        "/api/v1/auth/login",
        json={"email": "sarah.cbt@example.com", "password": "WrongPassword!"},
    )
    assert bad_login.status_code == 401

    # 6. Rotate refresh token
    refresh_resp = await test_app.post(
        "/api/v1/auth/refresh",
        json={"refresh_token": refresh_token},
    )
    assert refresh_resp.status_code == 200
    new_tokens = refresh_resp.json()
    assert new_tokens["access_token"] != access_token

    # 7. Old refresh token is now revoked
    old_refresh_reuse = await test_app.post(
        "/api/v1/auth/refresh",
        json={"refresh_token": refresh_token},
    )
    assert old_refresh_reuse.status_code == 401

    # 8. Logout revokes token
    logout_resp = await test_app.post(
        "/api/v1/auth/logout",
        json={"refresh_token": new_tokens["refresh_token"]},
    )
    assert logout_resp.status_code == 200


@pytest.mark.asyncio
async def test_mood_tracking_and_summary(test_app):
    # Register user
    reg = await test_app.post(
        "/api/v1/auth/register",
        json={"email": "mood.tester@example.com", "password": "StrongPassword99!"},
    )
    token = reg.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Log 3 mood entries
    for score, note in [(8, "Feeling calm"), (7, "Productive work"), (9, "Great morning walk")]:
        resp = await test_app.post(
            "/api/v1/moods",
            headers=headers,
            json={"score": score, "note": note},
        )
        assert resp.status_code == 201

    # List moods
    list_resp = await test_app.get("/api/v1/moods", headers=headers)
    assert list_resp.status_code == 200
    moods = list_resp.json()
    assert len(moods) == 3

    # Summary
    sum_resp = await test_app.get("/api/v1/moods/summary", headers=headers)
    assert sum_resp.status_code == 200
    summary = sum_resp.json()
    assert summary["average_score"] == 8.0
    assert summary["total_entries"] == 3


@pytest.mark.asyncio
async def test_cbt_thought_diary_crud(test_app):
    reg = await test_app.post(
        "/api/v1/auth/register",
        json={"email": "thought.tester@example.com", "password": "StrongPassword99!"},
    )
    token = reg.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 1. Create Thought Entry
    create_payload = {
        "situation": "Team presentation tomorrow",
        "thought": "I will freeze and everyone will judge me",
        "emotion": "Anxiety",
        "intensity": 85,
        "distortion": "Catastrophizing",
        "rational_response": "I have prepared thoroughly and freezing for a second is human.",
    }
    create_resp = await test_app.post("/api/v1/journal", headers=headers, json=create_payload)
    assert create_resp.status_code == 201
    entry = create_resp.json()
    entry_id = entry["id"]
    assert entry["distortion"] == "Catastrophizing"

    # 2. Get Thought Entry
    get_resp = await test_app.get(f"/api/v1/journal/{entry_id}", headers=headers)
    assert get_resp.status_code == 200
    assert get_resp.json()["intensity"] == 85

    # 3. Patch Thought Entry (lower intensity after reflection)
    patch_resp = await test_app.patch(
        f"/api/v1/journal/{entry_id}",
        headers=headers,
        json={"intensity": 40},
    )
    assert patch_resp.status_code == 200
    assert patch_resp.json()["intensity"] == 40

    # 4. Delete Thought Entry
    del_resp = await test_app.delete(f"/api/v1/journal/{entry_id}", headers=headers)
    assert del_resp.status_code == 200

    # 5. Verify 404
    check_resp = await test_app.get(f"/api/v1/journal/{entry_id}", headers=headers)
    assert check_resp.status_code == 404


@pytest.mark.asyncio
async def test_user_data_isolation(test_app):
    """Verifies that User B cannot access or modify User A's private thought records or conversations."""
    # Register User A
    reg_a = await test_app.post(
        "/api/v1/auth/register",
        json={"email": "user.a@example.com", "password": "PasswordUserA1!"},
    )
    token_a = reg_a.json()["access_token"]

    # Register User B
    reg_b = await test_app.post(
        "/api/v1/auth/register",
        json={"email": "user.b@example.com", "password": "PasswordUserB1!"},
    )
    token_b = reg_b.json()["access_token"]

    # User A creates a thought
    create_resp = await test_app.post(
        "/api/v1/journal",
        headers={"Authorization": f"Bearer {token_a}"},
        json={
            "situation": "Private thought",
            "thought": "Deep personal concern",
            "emotion": "Sadness",
            "intensity": 70,
        },
    )
    thought_id = create_resp.json()["id"]

    # User B attempts to read User A's thought -> 403 Forbidden
    hack_read = await test_app.get(
        f"/api/v1/journal/{thought_id}",
        headers={"Authorization": f"Bearer {token_b}"},
    )
    assert hack_read.status_code == 403

    # User B attempts to delete User A's thought -> 403 Forbidden
    hack_del = await test_app.delete(
        f"/api/v1/journal/{thought_id}",
        headers={"Authorization": f"Bearer {token_b}"},
    )
    assert hack_del.status_code == 403


@pytest.mark.asyncio
async def test_cbt_exercises_and_progress(test_app):
    # List seeded exercises
    ex_resp = await test_app.get("/api/v1/exercises")
    assert ex_resp.status_code == 200
    exercises = ex_resp.json()
    assert len(exercises) >= 4
    assert any(e["id"] == "box_breathing" for e in exercises)

    # Record progress
    prog_resp = await test_app.post(
        "/api/v1/exercises/box_breathing/progress",
        json={
            "exercise_id": "box_breathing",
            "completed": True,
            "duration_spent_seconds": 240,
            "feedback": "Felt calmer immediately",
        },
    )
    assert prog_resp.status_code == 201
    assert prog_resp.json()["completed"] is True


@pytest.mark.asyncio
async def test_dashboard_summary_aggregation(test_app):
    reg = await test_app.post(
        "/api/v1/auth/register",
        json={"email": "dash.user@example.com", "password": "StrongPassword99!", "full_name": "Alex"},
    )
    token = reg.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Add mood, sleep, thought
    await test_app.post("/api/v1/moods", headers=headers, json={"score": 8, "note": "Balanced"})
    await test_app.post(
        "/api/v1/sleep",
        headers=headers,
        json={"bed": "23:00", "wake": "07:00", "awk": 0, "qual": 4, "dur_hrs": 8.0, "iso_date": "2026-11-17"},
    )
    await test_app.post(
        "/api/v1/journal",
        headers=headers,
        json={"situation": "Day recap", "thought": "I did well today", "emotion": "Contentment", "intensity": 80},
    )

    dash_resp = await test_app.get("/api/v1/dashboard/summary", headers=headers)
    assert dash_resp.status_code == 200
    dash_data = dash_resp.json()
    assert dash_data["user_name"] == "Alex"
    assert dash_data["avg_mood_14d"] == 8.0
    assert dash_data["avg_sleep_hrs"] == 8.0
    assert dash_data["tracked_days"] >= 1
    assert "insights" in dash_data
