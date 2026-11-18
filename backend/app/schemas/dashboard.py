from typing import Any, Dict, List, Optional
from pydantic import BaseModel


class DashboardSummaryRead(BaseModel):
    user_name: Optional[str] = None
    avg_mood_14d: Optional[float] = None
    avg_sleep_hrs: Optional[float] = None
    activities_completed: int = 0
    tracked_days: int = 0
    mood_history_14d: List[Dict[str, Any]] = []
    recent_thoughts_count: int = 0
    recent_tests_summary: List[Dict[str, Any]] = []
    recent_sleep_entries: List[Dict[str, Any]] = []
    insights: Optional[str] = None
