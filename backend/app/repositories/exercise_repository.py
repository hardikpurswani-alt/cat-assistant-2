from datetime import datetime, timezone
import json
from typing import List, Optional
from sqlalchemy import desc, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.models.exercise import CBTExercise, ExerciseProgress

# Standard evidence-informed CBT exercises
SEED_EXERCISES = [
    {
        "id": "box_breathing",
        "title": "Box Breathing (4-4-4-4)",
        "category": "breathing",
        "description": "Slows autonomic pulse, lowers acute arousal, and restores parasympathetic tone through equal rhythmic intervals.",
        "duration_seconds": 240,
        "steps_json": json.dumps([
            {"phase": "Inhale", "seconds": 4, "guidance": "Inhale gently through your nose"},
            {"phase": "Hold", "seconds": 4, "guidance": "Hold your breath softly"},
            {"phase": "Exhale", "seconds": 4, "guidance": "Exhale steadily through your mouth"},
            {"phase": "Hold", "seconds": 4, "guidance": "Pause and notice the stillness"}
        ])
    },
    {
        "id": "478_breathing",
        "title": "4-7-8 Parasympathetic Breathing",
        "category": "breathing",
        "description": "Extended exhale technique developed to calm intrusive anxiety and assist nocturnal sleep induction.",
        "duration_seconds": 300,
        "steps_json": json.dumps([
            {"phase": "Inhale", "seconds": 4, "guidance": "Quiet inhale through your nose"},
            {"phase": "Hold", "seconds": 7, "guidance": "Hold comfortably without straining"},
            {"phase": "Exhale", "seconds": 8, "guidance": "Slow whoosh exhale emptying your lungs"}
        ])
    },
    {
        "id": "grounding_54321",
        "title": "5-4-3-2-1 Sensory Grounding",
        "category": "grounding",
        "description": "Anchors conscious attention into immediate sensory reality to detach from catastrophic racing thoughts.",
        "duration_seconds": 360,
        "steps_json": json.dumps([
            {"step": 5, "sense": "Sight", "prompt": "Acknowledge 5 things you can see around you"},
            {"step": 4, "sense": "Touch", "prompt": "Acknowledge 4 things you can physically touch"},
            {"step": 3, "sense": "Sound", "prompt": "Acknowledge 3 distinct sounds you can hear"},
            {"step": 2, "sense": "Smell", "prompt": "Acknowledge 2 scents in your environment"},
            {"step": 1, "sense": "Taste", "prompt": "Acknowledge 1 taste in your mouth"}
        ])
    },
    {
        "id": "pmr_relaxation",
        "title": "Progressive Muscle Relaxation (PMR)",
        "category": "relaxation",
        "description": "Systematic isometric tensing and release of major muscle groups to dissolve physical stress holding patterns.",
        "duration_seconds": 600,
        "steps_json": json.dumps([
            {"group": "Hands & Forearms", "tension_sec": 7, "release_sec": 15},
            {"group": "Biceps & Shoulders", "tension_sec": 7, "release_sec": 15},
            {"group": "Face & Jaw", "tension_sec": 7, "release_sec": 15},
            {"group": "Chest & Abdomen", "tension_sec": 7, "release_sec": 15},
            {"group": "Legs & Feet", "tension_sec": 7, "release_sec": 15}
        ])
    },
    {
        "id": "stop_technique",
        "title": "STOP Grounding Technique",
        "category": "crisis",
        "description": "Rapid distress interrupt: Stop, Take a breath, Observe thoughts without judgement, Proceed mindfully.",
        "duration_seconds": 180,
        "steps_json": json.dumps([
            {"step": "S", "title": "Stop", "action": "Pause what you are doing. Freeze physical reaction."},
            {"step": "T", "title": "Take a breath", "action": "Inhale slowly and ground into your core."},
            {"step": "O", "title": "Observe", "action": "Notice automatic thoughts and physical sensations without labelling them bad."},
            {"step": "P", "title": "Proceed", "action": "Choose a constructive, rational next action that serves your wellbeing."}
        ])
    }
]


class ExerciseRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def seed_exercises_if_empty(self) -> None:
        result = await self.db.execute(select(CBTExercise).limit(1))
        if not result.scalar_one_or_none():
            for ex in SEED_EXERCISES:
                self.db.add(CBTExercise(**ex))
            await self.db.flush()

    async def list_exercises(self, category: Optional[str] = None) -> List[CBTExercise]:
        await self.seed_exercises_if_empty()
        query = select(CBTExercise)
        if category:
            query = query.where(CBTExercise.category == category)
        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def get_exercise(self, exercise_id: str) -> Optional[CBTExercise]:
        result = await self.db.execute(
            select(CBTExercise).where(CBTExercise.id == exercise_id)
        )
        return result.scalar_one_or_none()

    async def record_progress(
        self,
        exercise_id: str,
        completed: bool = True,
        duration_spent_seconds: int = 0,
        feedback: Optional[str] = None,
        user_id: Optional[str] = None,
        session_id: Optional[str] = None,
    ) -> ExerciseProgress:
        progress = ExerciseProgress(
            exercise_id=exercise_id,
            completed=completed,
            duration_spent_seconds=duration_spent_seconds,
            feedback=feedback,
            user_id=user_id,
            session_id=session_id,
        )
        self.db.add(progress)
        await self.db.flush()
        return progress

    async def list_user_progress(
        self,
        user_id: Optional[str] = None,
        session_id: Optional[str] = None,
        limit: int = 50,
    ) -> List[ExerciseProgress]:
        if not user_id and not session_id:
            return []

        conditions = []
        if user_id:
            conditions.append(ExerciseProgress.user_id == user_id)
        elif session_id:
            conditions.append(ExerciseProgress.session_id == session_id)

        query = select(ExerciseProgress).where(or_(*conditions)).order_by(desc(ExerciseProgress.timestamp)).limit(limit)
        result = await self.db.execute(query)
        return list(result.scalars().all())
