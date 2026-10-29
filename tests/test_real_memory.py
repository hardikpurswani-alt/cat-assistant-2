import pytest
import os
from pathlib import Path
try:
    from dotenv import load_dotenv
    load_dotenv(Path(__file__).resolve().parent.parent / ".env")
except ImportError:
    pass

from src.utils.db import SQLiteSessionManager
from src.llm.gateway_client import GatewayClient
from src.memory.summarizer import MemorySummarizer


# Skipped by default in CI unless running explicitly locally
@pytest.mark.asyncio
async def test_real_memory_summarization(tmp_path):
    gateway_url = os.getenv("OPENAI_BASE_URL", "http://103.73.181.90:4000/v1")
    model_name = os.getenv("LLM_MODEL", "qwen-7b")
    api_key = os.getenv("OPENAI_API_KEY", "")

    if not api_key:
        pytest.skip("No gateway API key configured")

    # Check if Gateway is accessible
    import httpx

    headers = {"Authorization": f"Bearer {api_key}"}
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            resp = await client.get(f"{gateway_url}/models", headers=headers)
            if resp.status_code != 200:
                pytest.skip("AI Gateway is not responding")
            available_models = {
                model.get("id") for model in resp.json().get("data", [])
            }
            if model_name not in available_models:
                pytest.skip(f"Configured live-test model {model_name} is not installed")
    except Exception:
        pytest.skip("AI Gateway is not accessible")

    # Set up DB path
    db_file = tmp_path / "test_real_memory.db"
    db_manager = SQLiteSessionManager(db_file)

    # Init client
    llm_client = GatewayClient(base_url=gateway_url, api_key=api_key, model=model_name)

    # Init summarizer with low threshold to quickly trigger
    summarizer = MemorySummarizer(db_manager, llm_client)
    summarizer.trigger_threshold = 2

    session_id = "real_mem_test_1"

    # Insert a conversation
    db_manager.add_message(
        session_id,
        "user",
        "I am very worried about an upcoming job interview.",
    )
    db_manager.add_message(
        session_id,
        "assistant",
        "It is normal to feel nervous before an interview. Have you tried preparing answers to common questions?",
    )
    db_manager.add_message(
        session_id,
        "user",
        "Yes, but I start to panic and forget everything. I have a dog named Rex, and I usually walk him to calm down.",
    )

    # Trigger summarizer manually
    await summarizer._process_summarization(session_id)

    # Fetch summary
    summary = db_manager.get_session_summary(session_id)

    # Assertions
    assert summary is not None
    assert summary != ""
    assert len(summary) > 20
    assert "Rex" in summary

    # Since LLM output varies, we just print it. When pytest runs, we'll see it in stdout if we use -s.
    print(f"\n[LLM Generated Summary]:\n{summary}\n")

    # Add a follow-up conversation to test recursive summarizing
    db_manager.add_message(
        session_id,
        "assistant",
        "Walking with Rex is a great strategy. Let us try a breathing technique: inhale for 4 counts, exhale for 4 counts.",
    )
    db_manager.add_message(session_id, "user", "Okay, that feels a bit lighter.")

    await summarizer._process_summarization(session_id)

    new_summary = db_manager.get_session_summary(session_id)
    assert new_summary is not None
    assert len(new_summary) > 20
    assert new_summary != summary  # should be updated with new context
    assert "Rex" in new_summary

    print(f"\n[Updated LLM Generated Summary]:\n{new_summary}\n")
