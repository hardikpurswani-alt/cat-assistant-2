from src.memory.profile import (
    extract_profile_updates,
    has_profile_updates,
    merge_profiles,
)
from src.utils.db import SQLiteSessionManager


def test_extracts_explicit_names_pets_people_and_preferences():
    updates = extract_profile_updates(
        "My name is Arthur. I have a dog named Rex. "
        "My wife is named Anna. I love long walks."
    )
    assert updates["user_name"] == "Arthur"
    assert updates["pets"] == [{"kind": "dog", "name": "Rex"}]
    assert updates["people"] == [{"relation": "partner", "name": "Anna"}]
    assert updates["preferences"] == ["long walks"]
    assert has_profile_updates(updates) is True


def test_extracts_pet_from_natural_conversation():
    updates = extract_profile_updates(
        "I have a dog named Rex, I usually walk with him to calm down."
    )
    assert updates["pets"] == [{"kind": "dog", "name": "Rex"}]


def test_profile_merge_updates_name_without_duplicating_facts():
    initial = merge_profiles(
        {}, extract_profile_updates("My name is Arthur. I love tea.")
    )
    updated = merge_profiles(
        initial, extract_profile_updates("Actually, call me Art. I love tea.")
    )
    assert updated["user_name"] == "Art"
    assert updated["preferences"] == ["tea"]


def test_profile_survives_database_reopen(tmp_path):
    db_path = tmp_path / "persistent.db"
    first_process = SQLiteSessionManager(db_path)
    profile = merge_profiles(
        {}, extract_profile_updates("My name is Alice. My dog is named Charlie.")
    )
    first_process.save_profile_memory("browser-session", profile)

    after_restart = SQLiteSessionManager(db_path)
    restored = after_restart.get_profile_memory("browser-session")
    assert restored["user_name"] == "Alice"
    assert restored["pets"] == [{"kind": "dog", "name": "Charlie"}]


def test_clear_memory_preserves_messages(tmp_path):
    manager = SQLiteSessionManager(tmp_path / "memory.db")
    manager.add_message("session", "user", "My name is Arthur")
    manager.save_profile_memory("session", {"user_name": "Arthur"})
    manager.save_session_summary("session", "The user's name is Arthur")
    manager.clear_memory("session")
    assert manager.get_profile_memory("session") == {}
    assert manager.get_session_summary("session") == ""
    assert manager.get_history("session")[0]["content"] == "My name is Arthur"
