from datetime import datetime, timedelta, timezone
from typing import Any, Dict, List, Optional
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.repositories.activity_repository import ActivityRepository
from backend.app.repositories.assessment_repository import AssessmentRepository
from backend.app.repositories.journal_repository import JournalRepository
from backend.app.repositories.mood_repository import MoodRepository
from backend.app.repositories.sleep_repository import SleepRepository
from backend.app.schemas.dashboard import DashboardSummaryRead


class DashboardService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.mood_repo = MoodRepository(db)
        self.sleep_repo = SleepRepository(db)
        self.journal_repo = JournalRepository(db)
        self.activity_repo = ActivityRepository(db)
        self.assessment_repo = AssessmentRepository(db)

    async def get_dashboard_summary(
        self,
        user_id: Optional[str] = None,
        session_id: Optional[str] = None,
        user_name: Optional[str] = None,
    ) -> DashboardSummaryRead:
        # 1. 14-day Mood Stats
        mood_stats = await self.mood_repo.get_14d_stats(user_id=user_id, session_id=session_id)
        avg_mood = mood_stats.get("avg_score")
        mood_entries = mood_stats.get("entries", [])
        mood_chart_data = [
            {"score": m.score, "note": m.note, "date": m.timestamp.strftime("%b %d")}
            for m in mood_entries
        ]

        # 2. Sleep logs
        sleep_entries = await self.sleep_repo.list_sleep(user_id=user_id, session_id=session_id, limit=14)
        avg_sleep = None
        if sleep_entries:
            total_dur = sum(s.dur_hrs for s in sleep_entries)
            avg_sleep = round(total_dur / len(sleep_entries), 1)

        recent_sleep_data = [
            {"date": s.iso_date, "dur_hrs": s.dur_hrs, "qual": s.qual, "bed": s.bed, "wake": s.wake}
            for s in sleep_entries[:7]
        ]

        # 3. Activities
        activities = await self.activity_repo.list_activities(user_id=user_id, session_id=session_id, limit=50)
        completed_activities = sum(1 for a in activities if a.done)

        # 4. Thought records
        thoughts = await self.journal_repo.list_thoughts(user_id=user_id, session_id=session_id, limit=50)

        # 5. Assessments
        assessments = await self.assessment_repo.list_assessments(user_id=user_id, session_id=session_id, limit=10)
        recent_tests_data = [
            {"test": a.test_name, "score": a.score, "level": a.level, "date": a.iso_date}
            for a in assessments
        ]

        # Calculate tracked days across all features
        active_dates = set()
        for m in mood_entries:
            active_dates.add(m.timestamp.strftime("%Y-%m-%d"))
        for s in sleep_entries:
            active_dates.add(s.iso_date)
        for t in thoughts:
            active_dates.add(t.timestamp.strftime("%Y-%m-%d"))
        for a in activities:
            active_dates.add(a.iso_date)
        tracked_days = max(len(active_dates), 1 if (mood_entries or sleep_entries or thoughts) else 0)

        # Synthesize supportive insight message
        insights = "Keep tracking your daily mood, sleep, and thoughts. Patterns will emerge as you log entries."
        if avg_mood is not None:
            if avg_mood >= 7.0:
                insights = "Your recent mood intensity is resilient. Consistent sleep and cognitive awareness are supporting your emotional stability."
            elif avg_mood <= 4.0:
                insights = "You've been experiencing increased emotional strain recently. Practicing sensory grounding or writing an automatic thought in your diary can help restore clarity."
            else:
                insights = "Your mood is steady. Notice the activities and thinking patterns that contribute to your balanced moments."

        return DashboardSummaryRead(
            user_name=user_name,
            avg_mood_14d=avg_mood,
            avg_sleep_hrs=avg_sleep,
            activities_completed=completed_activities,
            tracked_days=tracked_days,
            mood_history_14d=mood_chart_data,
            recent_thoughts_count=len(thoughts),
            recent_tests_summary=recent_tests_data,
            recent_sleep_entries=recent_sleep_data,
            insights=insights,
        )
