"""
CBT Depression AI Assistant — Backend Server
=============================================
FastAPI server integrating Modular genAI components.
"""

import os
import json
from datetime import datetime
from pathlib import Path
from contextlib import asynccontextmanager
import yaml
import sys

# Ensure src can be imported
PROJECT_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(PROJECT_ROOT))

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException  # noqa: E402
from fastapi.staticfiles import StaticFiles  # noqa: E402
from fastapi.responses import PlainTextResponse, Response  # noqa: E402
from fastapi.middleware.cors import CORSMiddleware  # noqa: E402
from pydantic import BaseModel  # noqa: E402

try:
    from dotenv import load_dotenv
    env_path = PROJECT_ROOT / ".env"
    if env_path.exists():
        load_dotenv(env_path, override=False)
except ImportError:
    pass

from src.llm.gateway_client import GatewayClient, ContentCleaner  # noqa: E402
from src.utils.db import SQLiteSessionManager  # noqa: E402
from src.rag.knowledge_base import SemanticRAG  # noqa: E402
from src.prompts.templates import PromptManager  # noqa: E402
from src.memory.summarizer import MemorySummarizer  # noqa: E402
from src.memory.profile import (  # noqa: E402
    extract_profile_updates,
    has_profile_updates,
    merge_profiles,
)
from src import __version__  # noqa: E402

# ─── Configuration ───────────────────────────────────────────────
GATEWAY_BASE_URL = os.getenv("OPENAI_BASE_URL", "http://103.73.181.90:4000/v1").rstrip("/")
OLLAMA_BASE_URL = GATEWAY_BASE_URL  # backward compatibility alias

# Load configs
CONFIG_DIR = Path(__file__).parent.parent / "config"
with open(CONFIG_DIR / "model_config.yaml", "r", encoding="utf-8") as f:
    model_config = yaml.safe_load(f)["models"]

DEFAULT_MODEL = os.getenv("LLM_MODEL", model_config["qwen"]["model_name"])
DEFAULT_OLLAMA_MODEL = DEFAULT_MODEL
EMBED_CONFIG = model_config.get("embeddings", {})
EMBED_MODEL = os.getenv(
    "EMBEDDING_MODEL",
    EMBED_CONFIG.get("model_name", "embed"),
)
DEFAULT_SCORE_THRESHOLD = float(EMBED_CONFIG.get("score_threshold", 0.48))
SCORE_THRESHOLD = float(os.getenv("RAG_SCORE_THRESHOLD", str(DEFAULT_SCORE_THRESHOLD)))
LLM_OPTIONS = {
    "temperature": model_config["qwen"]["temperature"],
    "top_p": model_config["qwen"]["top_p"],
    "max_tokens": model_config["qwen"]["max_tokens"],
    "num_predict": model_config["qwen"]["max_tokens"],
}

KNOWLEDGE_BASE_DIR = Path(__file__).parent.parent / "knowledge_base"
DATA_DIR = Path(__file__).parent.parent / "data"
DATA_DIR.mkdir(exist_ok=True)
FRONTEND_DIR = Path(__file__).parent.parent / "frontend"
MODEL_SETTINGS_PATH = DATA_DIR / "model_settings.json"


def load_selected_model() -> str:
    """Restore the model selected in the UI, falling back to startup config."""
    try:
        saved = json.loads(MODEL_SETTINGS_PATH.read_text(encoding="utf-8"))
        model = saved.get("chat_model")
        if isinstance(model, str) and model.strip():
            return model.strip()
    except (OSError, ValueError, TypeError):
        pass
    return DEFAULT_MODEL


def persist_selected_model(model: str) -> None:
    """Persist a UI model choice without modifying repository configuration."""
    temporary_path = MODEL_SETTINGS_PATH.with_suffix(".tmp")
    temporary_path.write_text(
        json.dumps({"chat_model": model}, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    temporary_path.replace(MODEL_SETTINGS_PATH)


SELECTED_MODEL = load_selected_model()
OLLAMA_MODEL = SELECTED_MODEL

# ─── Component Initialization ─────────────────────────────────────
llm_client = GatewayClient(base_url=GATEWAY_BASE_URL, model=SELECTED_MODEL)
kb = SemanticRAG(
    KNOWLEDGE_BASE_DIR,
    gateway_url=GATEWAY_BASE_URL,
    embed_model=EMBED_MODEL,
    cache_path=DATA_DIR / "rag_index.npz",
    trace_path=DATA_DIR / "rag_traces.jsonl",
    score_threshold=SCORE_THRESHOLD,
)
sessions = SQLiteSessionManager(DATA_DIR / "cbt_sessions.db")
prompt_manager = PromptManager(CONFIG_DIR / "prompts.yaml")
summarizer = MemorySummarizer(sessions, llm_client)


@asynccontextmanager
async def lifespan(app: FastAPI):
    await kb.load_and_embed()
    try:
        yield
    finally:
        await summarizer.close()


# ─── FastAPI App ─────────────────────────────────────────────────
app = FastAPI(title="CBT Depression AI Assistant", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── REST Endpoints ─────────────────────────────────────────────


class ChatRequest(BaseModel):
    message: str
    session_id: str = "default"
    language: str = "en"


class MoodRequest(BaseModel):
    score: int
    note: str = ""
    session_id: str = "default"


class TTSRequest(BaseModel):
    text: str
    language: str = "en"
    voice: str | None = None


class ModelSelectionRequest(BaseModel):
    model: str


class ThoughtRecordRequest(BaseModel):
    session_id: str = "default"
    situation: str
    thought: str
    emotion: str
    intensity: int
    distortion: str
    rational_response: str


class ThoughtRecordUpdateRequest(BaseModel):
    session_id: str = "default"
    situation: str
    thought: str
    emotion: str
    intensity: int
    distortion: str
    rational_response: str


class SyncRequest(BaseModel):
    session_id: str = "default"
    items: list[dict]


def get_user_data_tools():
    return [
        {
            "type": "function",
            "function": {
                "name": "get_user_sleep_history",
                "description": "Retrieve the user's recent sleep log entries.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "days": {
                            "type": "integer",
                            "description": "Number of days of sleep history to retrieve (default 14).",
                        }
                    },
                },
            },
        },
        {
            "type": "function",
            "function": {
                "name": "get_user_test_results",
                "description": "Retrieve the user's latest psychological assessment scores (PHQ-9 depression, GAD-7 anxiety).",
                "parameters": {"type": "object", "properties": {}},
            },
        },
        {
            "type": "function",
            "function": {
                "name": "get_user_activities",
                "description": "Retrieve the user's scheduled behavioral activation activities.",
                "parameters": {"type": "object", "properties": {}},
            },
        },
        {
            "type": "function",
            "function": {
                "name": "add_user_activity",
                "description": "Add a new activity or behavioral activation task to the user's schedule.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "activity_text": {
                            "type": "string",
                            "description": "Text of the activity to add. Maximum 50 characters.",
                        }
                    },
                    "required": ["activity_text"],
                },
            },
        },
        {
            "type": "function",
            "function": {
                "name": "start_sos_exercise",
                "description": (
                    "Immediately open an interactive fullscreen SOS grounding exercise "
                    "with visual scene animation, ambient audio, and timer. Use only "
                    "when the user agrees to or asks for a practice."
                ),
                "parameters": {
                    "type": "object",
                    "properties": {
                        "technique": {
                            "type": "string",
                            "enum": ["breathing", "grounding", "pmr", "stop"],
                            "description": "Exercise type: breathing, 5-4-3-2-1 grounding, progressive muscle relaxation, or STOP.",
                        },
                        "scene": {
                            "type": "string",
                            "enum": ["air", "field", "sea", "night_forest"],
                            "description": "Portal visual theme: air, field, sea, or night_forest.",
                        },
                        "duration": {
                            "type": "integer",
                            "minimum": 1,
                            "maximum": 10,
                            "description": "Duration in minutes, from 1 to 10.",
                        },
                    },
                    "required": ["technique", "scene", "duration"],
                },
            },
        },
        {
            "type": "function",
            "function": {
                "name": "recommend_test",
                "description": "Recommend and open a clinical screening questionnaire (PHQ-9 for depressive symptoms, GAD-7 for anxiety symptoms).",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "test_type": {
                            "type": "string",
                            "enum": ["PHQ-9", "GAD-7"],
                            "description": "Type of questionnaire to open.",
                        }
                    },
                    "required": ["test_type"],
                },
            },
        },
        {
            "type": "function",
            "function": {
                "name": "add_thought_record",
                "description": (
                    "Add a new record to the user's Thought Diary after exploring "
                    "an automatic thought, emotion, cognitive distortion, and rational response, "
                    "or upon direct user request."
                ),
                "parameters": {
                    "type": "object",
                    "properties": {
                        "situation": {
                            "type": "string",
                            "description": "Situation or trigger (e.g., 'Work presentation').",
                        },
                        "thought": {
                            "type": "string",
                            "description": "Automatic negative thought (e.g., 'I will fail completely').",
                        },
                        "emotion": {
                            "type": "string",
                            "description": "Primary emotion (e.g., 'Anxiety', 'Sadness', 'Guilt').",
                        },
                        "intensity": {
                            "type": "integer",
                            "minimum": 1,
                            "maximum": 10,
                            "description": "Emotion intensity from 1 to 10 (default 7).",
                        },
                        "distortion": {
                            "type": "string",
                            "description": "Cognitive distortion (e.g., 'Catastrophizing', 'All-or-Nothing', 'Mind Reading').",
                        },
                        "rational_response": {
                            "type": "string",
                            "description": "Balanced, adaptive rational response.",
                        },
                    },
                    "required": [
                        "situation",
                        "thought",
                        "emotion",
                        "rational_response",
                    ],
                },
            },
        },
        {
            "type": "function",
            "function": {
                "name": "add_sleep_diary_record",
                "description": (
                    "Add an entry directly to the user's Sleep Diary: bedtime, wake time, "
                    "sleep quality, night awakenings, and notes. "
                    "Use this tool instead of add_thought_record when recording sleep."
                ),
                "parameters": {
                    "type": "object",
                    "properties": {
                        "bed": {
                            "type": "string",
                            "description": "Bedtime in HH:MM format (e.g., '23:30').",
                        },
                        "wake": {
                            "type": "string",
                            "description": "Wake time in HH:MM format (e.g., '07:30').",
                        },
                        "quality": {
                            "type": "integer",
                            "minimum": 1,
                            "maximum": 10,
                            "description": "Subjective sleep quality from 1 to 10 (default 7).",
                        },
                        "awakenings": {
                            "type": "integer",
                            "minimum": 0,
                            "description": "Number of nighttime awakenings (default 0).",
                        },
                        "notes": {
                            "type": "string",
                            "description": "Brief notes on sleep or morning feeling.",
                        },
                        "date": {
                            "type": "string",
                            "description": "Sleep date in YYYY-MM-DD format (optional, default today).",
                        },
                    },
                    "required": ["bed", "wake"],
                },
            },
        },
    ]


def build_language_instruction(language: str) -> str:
    return (
        "IMPORTANT: Reply in English only. "
        "Keep your response empathetic, natural, and helpful in English."
    )


TTS_VOICES = {
    "en": {
        "en-US-JennyNeural",
        "en-US-GuyNeural",
    },
}


def get_tts_voice(language: str, voice: str | None = None) -> str:
    if voice and voice in TTS_VOICES.get("en", set()):
        return voice
    return "en-US-JennyNeural"


def serialize_rag_context(results: list[dict], trace: dict) -> list[dict]:
    return [
        {
            "chunk_id": item["chunk"]["chunk_id"],
            "document_id": item["chunk"]["document_id"],
            "source": item["chunk"]["source"],
            "title": item["chunk"]["title"],
            "section_path": item["chunk"]["section_path"],
            "score": round(item["score"], 4),
            "index_version": trace["index_version"],
        }
        for item in results
    ]


def requires_grounded_clinical_answer(message: str) -> bool:
    normalized = message.casefold()
    clinical_terms = (
        "anxiety",
        "depress",
        "insomnia",
        "sleep",
        "panic",
        "emotion",
        "psych",
        "self-harm",
        "suicid",
        "therapy",
        "cbt",
        "trauma",
        "stress",
        "worry",
        "phq",
        "gad",
    )
    advice_terms = (
        "what to do",
        "should i",
        "what should",
        "how ",
        "technique",
        "exercise",
        "protocol",
        "treat",
        "therapy",
        "help with",
        "advice",
    )
    return any(term in normalized for term in clinical_terms) and any(
        term in normalized for term in advice_terms
    )


def grounded_abstention(language: str) -> str:
    return (
        "I couldn't find sufficiently relevant support for a specific answer in the local "
        "CBT knowledge base, so I won't invent a technique or clinical recommendation. "
        "You can rephrase the question, or discuss it with a qualified professional."
    )


def ensure_rag_citations(content: str, context_used: list[dict], language: str) -> str:
    """Guarantee that a grounded answer exposes only citations from retrieved context."""
    if not context_used or any(
        f"[KB:{item['chunk_id']}]" in content for item in context_used
    ):
        return content
    citations = ", ".join(
        f"[KB:{item['chunk_id']}] ({item['source']})" for item in context_used
    )
    return f"{content.rstrip()}\n\nRetrieved evidence: {citations}"


def is_conversational_greeting_or_smalltalk(message: str) -> bool:
    """Identify simple conversational greetings and pleasantries that do not warrant clinical RAG search."""
    import re
    cleaned = re.sub(r"[^\w\s]", "", message.strip().lower())
    if not cleaned:
        return True
    greetings = {
        "hello", "hi", "hey", "hi there", "hello there", "good morning", "good afternoon",
        "good evening", "good day", "how are you", "how are you doing", "how do you do",
        "who are you", "what can you do", "what is your name", "what are your capabilities",
        "nice to meet you", "thanks", "thank you", "bye", "goodbye"
    }
    if cleaned in greetings:
        return True
    words = cleaned.split()
    if len(words) <= 4 and all(w in {
        "hello", "hi", "hey", "there", "good", "morning", "afternoon", "evening", "day",
        "how", "are", "you", "doing", "who", "what", "can", "do", "thanks", "thank"
    } for w in words):
        return True
    return False


async def prepare_chat_messages(
    message: str, session_id: str, language: str
) -> tuple[list[dict], list[dict], dict]:
    """The single retrieval and prompt-assembly path used by every chat transport."""
    profile_updates = extract_profile_updates(message)
    if has_profile_updates(profile_updates):
        current_profile = sessions.get_profile_memory(session_id)
        sessions.save_profile_memory(
            session_id, merge_profiles(current_profile, profile_updates)
        )
    if is_conversational_greeting_or_smalltalk(message):
        context = []
        trace = {
            "status": "no_relevant_context",
            "trace_id": f"trace_smalltalk_{session_id[-6:]}",
            "index_version": kb.index_version,
            "latency_ms": 0.0,
            "selected": [],
            "must_abstain": False,
        }
    else:
        retrieval = await kb.search_with_trace(message, top_k=3)
        context = retrieval["results"]
        trace = retrieval["trace"]
        trace["must_abstain"] = not context and requires_grounded_clinical_answer(message)
    session = sessions.get_or_create(session_id)
    system_prompt = prompt_manager.build_system_prompt(
        context,
        session.get("mood_log"),
        session.get("thought_records"),
        session.get("summary"),
        retrieval_status=trace["status"],
        profile_memory=session.get("profile_memory"),
    )
    system_prompt = f"{system_prompt}\n\n{build_language_instruction(language)}"
    messages = [{"role": "system", "content": system_prompt}]
    messages.extend(
        {"role": msg["role"], "content": msg["content"]}
        for msg in sessions.get_history(session_id)
    )
    messages.append({"role": "user", "content": message})
    return messages, serialize_rag_context(context, trace), trace


def execute_app_tool(session_id: str, tool_call: dict) -> tuple[str, dict | None]:
    function = tool_call.get("function", {})
    name = function.get("name")
    args = function.get("arguments", {})
    if isinstance(args, str):
        try:
            args = json.loads(args)
        except json.JSONDecodeError:
            args = {}
    if name == "get_user_sleep_history":
        return (
            json.dumps(
                sessions.get_sleep_logs(session_id, limit=args.get("days", 14)),
                ensure_ascii=False,
            ),
            None,
        )
    if name == "get_user_test_results":
        return json.dumps(sessions.get_tests(session_id), ensure_ascii=False), None
    if name == "get_user_activities":
        return (
            json.dumps(
                sessions.get_activities(session_id, limit=30), ensure_ascii=False
            ),
            None,
        )
    if name == "add_user_activity":
        text = args.get("activity_text", "")
        return f"Activity queued in the interface: {text}", {
            "type": "add_activity",
            "text": text,
        }
    if name in {"start_sos_exercise", "start_breathing"}:
        technique = args.get("technique", "breathing")
        if technique not in {"breathing", "grounding", "pmr", "stop"}:
            return f"Error: Unsupported SOS technique {technique}", None
        default_scenes = {
            "breathing": "air",
            "grounding": "field",
            "pmr": "sea",
            "stop": "night_forest",
        }
        scene = args.get("scene", default_scenes[technique])
        if scene not in {"air", "field", "sea", "night_forest"}:
            scene = default_scenes[technique]
        try:
            duration = int(args.get("duration", 2))
        except (TypeError, ValueError):
            duration = 2
        duration = max(1, min(duration, 10))
        return (
            f"SOS exercise opened: {technique}, scene {scene}, {duration} min.",
            {
                "type": "start_sos_exercise",
                "technique": technique,
                "scene": scene,
                "duration": duration,
            },
        )
    if name == "recommend_test":
        test_type = args.get("test_type", "PHQ-9")
        return f"The {test_type} test was opened in the interface.", {
            "type": "open_test",
            "test_type": test_type,
        }
    if name == "add_thought_record":
        situation = args.get("situation", "Conversation with assistant")
        thought = args.get("thought", "")
        emotion = args.get("emotion", "Anxiety")
        try:
            intensity = int(args.get("intensity", 7))
        except (TypeError, ValueError):
            intensity = 7
        intensity = max(1, min(intensity, 10))
        distortion = args.get("distortion", "Automatic thought")
        rational_response = args.get("rational_response", "")
        record_id = sessions.add_thought_record(
            session_id=session_id,
            situation=situation,
            thought=thought,
            emotion=emotion,
            intensity=intensity,
            distortion=distortion,
            rational_response=rational_response,
        )
        return f"Thought record #{record_id} saved to diary.", {
            "type": "add_thought_record",
            "record": {
                "id": record_id,
                "situation": situation,
                "thought": thought,
                "emotion": emotion,
                "intensity": intensity,
                "distortion": distortion,
                "rational_response": rational_response,
                "timestamp": datetime.now().isoformat(),
            },
        }
    if name in {"add_sleep_diary_record", "add_sleep_record", "add_sleep_log"}:
        bed = args.get("bed", "23:00")
        wake = args.get("wake", "07:00")
        try:
            quality = int(args.get("quality", 7))
        except (TypeError, ValueError):
            quality = 7
        quality = max(1, min(quality, 10))
        try:
            awakenings = int(args.get("awakenings", 0))
        except (TypeError, ValueError):
            awakenings = 0
        notes = args.get("notes", "")
        date_str = args.get("date")
        try:
            bed_time = datetime.strptime(bed.strip(), "%H:%M")
            wake_time = datetime.strptime(wake.strip(), "%H:%M")
            duration_hours = (wake_time - bed_time).total_seconds() / 3600.0
            if duration_hours < 0:
                duration_hours += 24.0
            duration_hours = round(duration_hours, 1)
        except (AttributeError, TypeError, ValueError):
            duration_hours = 8.0
        log_id = sessions.add_sleep_log(
            session_id=session_id,
            bed=bed,
            wake=wake,
            awk=awakenings,
            qual=quality,
            notes=notes,
            dur_hrs=duration_hours,
            iso_date=date_str,
        )
        return f"Sleep record #{log_id} saved to sleep diary.", {
            "type": "add_sleep_log",
            "log": {
                "id": log_id,
                "bed": bed,
                "wake": wake,
                "qual": quality,
                "awk": awakenings,
                "notes": notes,
                "durHrs": duration_hours,
                "isoDate": date_str or datetime.now().strftime("%Y-%m-%d"),
            },
        }
    return f"Error: Unknown tool {name}", None


@app.post("/api/chat")
async def chat(req: ChatRequest):
    try:
        messages, context_used, rag_trace = await prepare_chat_messages(
            req.message, req.session_id, req.language
        )
        if rag_trace["must_abstain"]:
            content = grounded_abstention(req.language)
            sessions.add_message(req.session_id, "user", req.message)
            sessions.add_message(req.session_id, "assistant", content)
            await summarizer.maybe_summarize(req.session_id)
            return {
                "response": content,
                "context_used": [],
                "rag_trace": {
                    "trace_id": rag_trace["trace_id"],
                    "status": "abstained",
                    "latency_ms": rag_trace["latency_ms"],
                    "index_version": rag_trace["index_version"],
                },
                "session_id": req.session_id,
                "client_events": [],
            }
        client_events = []
        for _tool_round in range(4):
            resp = await llm_client.chat(
                messages, options=LLM_OPTIONS, tools=get_user_data_tools()
            )
            tool_calls = resp.get("tool_calls", [])
            content = resp.get("content", "")
            if tool_calls:
                messages.append(
                    {"role": "assistant", "content": content, "tool_calls": tool_calls}
                )
                for tc in tool_calls:
                    tool_content, event = execute_app_tool(req.session_id, tc)
                    if event:
                        client_events.append(event)
                    messages.append(
                        {
                            "role": "tool",
                            "tool_call_id": tc.get("id") or "call_default",
                            "content": tool_content,
                            "name": tc.get("function", {}).get("name"),
                        }
                    )
            else:
                content = ensure_rag_citations(content, context_used, req.language)
                sessions.add_message(req.session_id, "user", req.message)
                sessions.add_message(req.session_id, "assistant", content)
                await summarizer.maybe_summarize(req.session_id)
                return {
                    "response": content,
                    "context_used": context_used,
                    "rag_trace": {
                        "trace_id": rag_trace["trace_id"],
                        "status": rag_trace["status"],
                        "latency_ms": rag_trace["latency_ms"],
                        "index_version": rag_trace["index_version"],
                    },
                    "session_id": req.session_id,
                    "client_events": client_events,
                }
        raise RuntimeError("Model exceeded the maximum of 4 tool rounds")
    except Exception as e:
        raise HTTPException(500, f"Error communicating with model: {str(e)}")


@app.post("/api/chat/stream")
async def chat_stream(req: ChatRequest):
    from fastapi.responses import StreamingResponse

    try:
        messages, context_used, rag_trace = await prepare_chat_messages(
            req.message, req.session_id, req.language
        )
    except Exception as exc:
        raise HTTPException(503, f"RAG retrieval failed: {exc}") from exc

    async def generate():
        nonlocal messages
        yield f"data: {json.dumps({'context_used': context_used, 'rag_trace': rag_trace['trace_id']})}\n\n"
        if rag_trace["must_abstain"]:
            content = grounded_abstention(req.language)
            sessions.add_message(req.session_id, "user", req.message)
            sessions.add_message(req.session_id, "assistant", content)
            await summarizer.maybe_summarize(req.session_id)
            yield f"data: {json.dumps({'token': content})}\n\n"
            yield f"data: {json.dumps({'done': True, 'full_response': content, 'context_used': []})}\n\n"
            return
        for _tool_round in range(4):
            full_response = ""
            tool_calls = []
            try:
                async for chunk in llm_client.chat_stream(
                    messages, options=LLM_OPTIONS, tools=get_user_data_tools()
                ):
                    msg = chunk.get("message", {})
                    if msg.get("tool_calls"):
                        tool_calls = msg["tool_calls"]
                    token = msg.get("content", "")
                    if token:
                        full_response += token
                        if token.strip():
                            yield f"data: {json.dumps({'token': token})}\n\n"
                    if chunk.get("done"):
                        if tool_calls:
                            messages.append(
                                {
                                    "role": "assistant",
                                    "content": full_response,
                                    "tool_calls": tool_calls,
                                }
                            )
                            for tc in tool_calls:
                                fn_name = tc.get("function", {}).get("name")
                                tool_content, event = execute_app_tool(
                                    req.session_id, tc
                                )
                                payload = (
                                    {"client_event": event}
                                    if event
                                    else {"tool_call": fn_name}
                                )
                                yield f"data: {json.dumps(payload)}\n\n"
                                messages.append(
                                    {
                                        "role": "tool",
                                        "tool_call_id": tc.get("id") or "call_default",
                                        "content": tool_content,
                                        "name": fn_name,
                                    }
                                )
                            break
                        else:
                            clean = ContentCleaner.strip_think_tags(full_response)
                            cited = ensure_rag_citations(
                                clean, context_used, req.language
                            )
                            citation_suffix = cited[len(clean) :]
                            if citation_suffix:
                                yield f"data: {json.dumps({'token': citation_suffix})}\n\n"
                            sessions.add_message(req.session_id, "user", req.message)
                            sessions.add_message(req.session_id, "assistant", cited)
                            await summarizer.maybe_summarize(req.session_id)
                            yield f"data: {json.dumps({'done': True, 'full_response': cited, 'context_used': context_used})}\n\n"
                            return
            except Exception as e:
                yield f"data: {json.dumps({'error': str(e)})}\n\n"
                return
        yield f"data: {json.dumps({'error': 'Model exceeded the maximum of 4 tool rounds'})}\n\n"

    return StreamingResponse(generate(), media_type="text/event-stream")


@app.post("/api/mood")
async def log_mood(req: MoodRequest):
    sessions.add_mood(req.session_id, req.score, req.note)
    return {
        "status": "ok",
        "mood_log": sessions.get_or_create(req.session_id)["mood_log"],
    }


@app.post("/api/tts")
async def synthesize_tts(req: TTSRequest):
    text = (req.text or "").strip()
    if not text:
        raise HTTPException(400, "Text is required")

    safe_text = " ".join(text.split())[:1500]

    try:
        import edge_tts
    except ImportError as exc:
        raise HTTPException(500, "Microsoft TTS backend is not installed") from exc

    audio_chunks = []
    try:
        communicate = edge_tts.Communicate(
            text=safe_text,
            voice=get_tts_voice(req.language, req.voice),
        )
        async for chunk in communicate.stream():
            if chunk.get("type") == "audio":
                audio_chunks.append(chunk.get("data", b""))
    except Exception as exc:
        raise HTTPException(500, f"TTS synthesis failed: {str(exc)}") from exc

    audio_data = b"".join(audio_chunks)
    if not audio_data:
        raise HTTPException(500, "TTS synthesis returned no audio")

    return Response(
        content=audio_data,
        media_type="audio/mpeg",
        headers={"Cache-Control": "no-store"},
    )


@app.get("/api/mood/{session_id}")
async def get_mood(session_id: str):
    session = sessions.get_or_create(session_id)
    return {"mood_log": session["mood_log"]}


@app.post("/api/thoughts")
async def add_thought_record(req: ThoughtRecordRequest):
    sessions.add_thought_record(
        req.session_id,
        req.situation,
        req.thought,
        req.emotion,
        req.intensity,
        req.distortion,
        req.rational_response,
    )
    return {
        "status": "ok",
        "thought_records": sessions.get_or_create(req.session_id)["thought_records"],
    }



@app.get("/api/thoughts/{session_id}")
async def get_thought_records(session_id: str):
    session = sessions.get_or_create(session_id)
    return {"thought_records": session.get("thought_records", [])}


@app.put("/api/thoughts/{thought_id}")
async def update_thought_record(thought_id: int, req: ThoughtRecordUpdateRequest):
    updated = sessions.update_thought_record(
        thought_id,
        req.session_id,
        req.situation,
        req.thought,
        req.emotion,
        req.intensity,
        req.distortion,
        req.rational_response,
    )
    if not updated:
        raise HTTPException(status_code=404, detail="Thought record not found")

    return {
        "status": "ok",
        "thought_records": sessions.get_or_create(req.session_id)["thought_records"],
    }


@app.delete("/api/thoughts/{thought_id}")
async def delete_thought_record(thought_id: int, session_id: str = "default"):
    deleted = sessions.delete_thought_record(thought_id, session_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Thought record not found")
    return {
        "status": "ok",
        "thought_records": sessions.get_or_create(session_id)["thought_records"],
    }


@app.delete("/api/sleep/{sleep_id}")
async def delete_sleep_entry(sleep_id: int, session_id: str = "default"):
    deleted = sessions.delete_sleep_log(sleep_id, session_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Sleep entry not found")
    return {
        "status": "ok",
        "sleep_logs": sessions.get_sleep_logs(session_id),
    }


@app.get("/api/session/{session_id}")
async def get_session(session_id: str):
    return sessions.get_or_create(session_id)


@app.post("/api/session/{session_id}/clear")
async def clear_session(session_id: str):
    sessions.clear_messages(session_id)
    sessions.clear_memory(session_id)
    return {"status": "ok", "message": "Chat history and memory cleared"}


@app.delete("/api/session/{session_id}/messages")
async def delete_session_messages(session_id: str):
    sessions.clear_messages(session_id)
    return {"status": "ok", "message": "Messages deleted"}


@app.post("/api/session/{session_id}/save")
async def save_session(session_id: str):
    sessions.save_session(session_id)
    return {"status": "saved"}


@app.get("/api/memory/{session_id}")
async def get_memory(session_id: str):
    return {
        "session_id": session_id,
        "profile": sessions.get_profile_memory(session_id),
        "summary": sessions.get_session_summary(session_id),
    }


@app.delete("/api/memory/{session_id}")
async def clear_memory(session_id: str):
    sessions.clear_memory(session_id)
    return {"status": "cleared", "session_id": session_id}


# DATA SYNC ENDPOINTS


@app.post("/api/sync/sleep")
async def sync_sleep(req: SyncRequest):
    sessions.sync_sleep_logs(req.session_id, req.items)
    return {"status": "ok"}


@app.get("/api/sync/sleep/{session_id}")
async def get_sleep_logs_endpoint(session_id: str):
    return {"sleep_logs": sessions.get_sleep_logs(session_id)}


@app.post("/api/sync/tests")
async def sync_tests(req: SyncRequest):
    sessions.sync_test_results(req.session_id, req.items)
    return {"status": "ok"}


@app.post("/api/sync/activities")
async def sync_activities(req: SyncRequest):
    sessions.sync_activities(req.session_id, req.items)
    return {"status": "ok"}


# ─── INSIGHTS ENDPOINT ───────────────────────────────────────────


class InsightsRequest(BaseModel):
    session_id: str = "default"
    lang: str = "ru"
    mood_log: list[dict] = []
    sleep_log: list[dict] = []
    activities: list[dict] = []
    phq_history: list[dict] = []
    gad_history: list[dict] = []
    thought_records: list[dict] = []


def _build_insights_prompt(req: InsightsRequest) -> str:
    """Build a data summary for the LLM, only including sections that have real data."""
    en = req.lang == "en"
    sections = []

    # IMPORTANT: we only include a section if data actually exists.
    # Absence of data = not tracked, NOT a negative signal.

    if req.mood_log:
        recent = sorted(req.mood_log, key=lambda x: x.get("date", ""), reverse=True)[
            :14
        ]
        scores = [e.get("score") for e in recent if e.get("score") is not None]
        if scores:
            avg = round(sum(scores) / len(scores), 1)
            sections.append(
                f"MOOD (from mood journal — {len(scores)} entries over recent days):\n"
                f"  Average score: {avg}/10. Scores: {scores[:10]}"
            )

    if req.sleep_log:
        recent_sleep = sorted(
            req.sleep_log, key=lambda x: x.get("isoDate", ""), reverse=True
        )[:7]
        sleep_info = []
        for s in recent_sleep:
            hours = s.get("hours") or s.get("duration")
            quality = s.get("quality")
            if hours or quality:
                sleep_info.append(f"hours slept: {hours}, quality: {quality}")
        if sleep_info:
            sections.append(
                f"SLEEP (sleep journal — {len(sleep_info)} days):\n  "
                + "\n  ".join(sleep_info)
            )

    if req.activities:
        done = [a for a in req.activities if a.get("done")]
        pending = [a for a in req.activities if not a.get("done")]
        sections.append(
            f"ACTIVITIES (planner): completed {len(done)}, pending/planned {len(pending)}"
        )

    if req.phq_history:
        recent_phq = sorted(
            req.phq_history, key=lambda x: x.get("date", ""), reverse=True
        )[:3]
        phq_info = [
            f"PHQ-9: {e.get('score')} ({e.get('date', '')[:10]})" for e in recent_phq
        ]
        sections.append("PHQ-9 TESTS (depression):\n  " + "\n  ".join(phq_info))

    if req.gad_history:
        recent_gad = sorted(
            req.gad_history, key=lambda x: x.get("date", ""), reverse=True
        )[:3]
        gad_info = [
            f"GAD-7: {e.get('score')} ({e.get('date', '')[:10]})" for e in recent_gad
        ]
        sections.append("GAD-7 TESTS (anxiety):\n  " + "\n  ".join(gad_info))

    if req.thought_records:
        emotions = [
            t.get("emotion", "") for t in req.thought_records if t.get("emotion")
        ]
        distortions = [
            t.get("distortion", "") for t in req.thought_records if t.get("distortion")
        ]
        sections.append(
            f"CBT THOUGHT JOURNAL ({len(req.thought_records)} entries):\n"
            f"  Emotions mentioned: {', '.join(emotions[:8])}\n"
            f"  Cognitive distortions: {', '.join(set(distortions[:6]))}"
        )

    if not sections:
        return None  # No data at all

    data_block = "\n\n".join(sections)

    return f"""You are a caring assistant helping a person better understand themselves.
Below is data from their personal journal over recent days. This is only what they have filled in themselves.

CRITICAL RULE: The absence of data in any section means only that the person did not fill in that section — it does NOT mean they slept poorly, were inactive, or were in a bad mood. Never draw conclusions from missing data.

Data:
{data_block}

Task: Write 2–3 gentle observations in English, based ONLY on what is present in the data above.
Rules:
- Use phrases like: "it seems", "possibly", "it looks like", "interestingly", "noticeably", "based on the entries"
- Do NOT make diagnoses or definitive conclusions
- You may end an observation with a gentle question
- Each observation is a separate paragraph, 1–2 sentences
- Tone: warm, like an attentive friend, not a doctor
- Reply only in English, no headings, no bullet lists — just paragraphs

If there is too little data for meaningful observations, write one gentle sentence about that."""


@app.post("/api/insights")
async def generate_insights(req: InsightsRequest):
    """Generate soft AI observations based only on available user data."""
    prompt = _build_insights_prompt(req)

    if prompt is None:
        no_data_msg = (
            "Not enough data for observations yet — "
            "the more you fill in your journal, the better I can notice patterns."
        )
        return {"insights": no_data_msg, "has_data": False}

    user_prompt = "Write the observations."
    messages = [
        {"role": "system", "content": prompt},
        {"role": "user", "content": user_prompt},
    ]

    try:
        resp = await llm_client.chat(
            messages,
            options={
                "temperature": 0.7,
                "top_p": 0.9,
                "num_predict": 800,
            },
        )
        text = resp.get("content", "").strip()
        if not text:
            text = "Nothing definitive to notice yet — keep filling in your journal."
        return {"insights": text, "has_data": True}
    except Exception as e:
        err_msg = "Could not fetch insights right now."
        return {"insights": err_msg, "has_data": False, "error": str(e)}


@app.get("/api/knowledge/search")
async def search_knowledge(q: str, top_k: int = 3):
    try:
        retrieval = await kb.search_with_trace(q, top_k)
    except ValueError as exc:
        raise HTTPException(400, str(exc)) from exc
    except Exception as exc:
        raise HTTPException(503, f"RAG retrieval failed: {exc}") from exc
    results = retrieval["results"]
    trace = retrieval["trace"]
    return {
        "query": q,
        "status": trace["status"],
        "trace_id": trace["trace_id"],
        "index_version": trace["index_version"],
        "embedding_model": trace["embedding_model"],
        "latency_ms": trace["latency_ms"],
        "results": [
            {
                "chunk_id": r["chunk"]["chunk_id"],
                "document_id": r["chunk"]["document_id"],
                "source": r["chunk"]["source"],
                "title": r["chunk"]["title"],
                "section_path": r["chunk"]["section_path"],
                "score": round(r["score"], 4),
                "preview": r["chunk"]["content"][:300],
            }
            for r in results
        ],
    }


@app.get("/api/knowledge/status")
async def knowledge_status():
    return kb.get_status()


async def fetch_gateway_models() -> list[dict]:
    """Return the models currently available on the configured AI Gateway or Ollama."""
    import httpx

    headers = {}
    api_key = os.getenv("OPENAI_API_KEY") or ""
    if api_key:
        headers["Authorization"] = f"Bearer {api_key}"

    try:
        async with httpx.AsyncClient(timeout=8.0) as client:
            response = await client.get(f"{GATEWAY_BASE_URL}/models", headers=headers)
            response.raise_for_status()
    except httpx.HTTPError as exc:
        raise HTTPException(503, f"AI Gateway is unavailable: {exc}") from exc

    data = response.json()
    raw_models = data.get("data") if isinstance(data, dict) and "data" in data else data.get("models", [])
    if not isinstance(raw_models, list):
        raw_models = []
    formatted = []
    for m in raw_models:
        if isinstance(m, dict):
            model_id = m.get("id") or m.get("name") or m.get("model")
            if isinstance(model_id, str):
                formatted.append({
                    "name": model_id,
                    "id": model_id,
                    "created": m.get("created"),
                    "owned_by": m.get("owned_by", "gateway"),
                    "capabilities": m.get("capabilities", []),
                })
    return sorted(formatted, key=lambda model: model["name"].lower())


fetch_ollama_models = fetch_gateway_models  # backward compatibility alias


def is_chat_model(model: dict) -> bool:
    """Filter out known non-chat models like embedding models."""
    caps = model.get("capabilities") or []
    if "embedding" in caps and "completion" not in caps and "chat" not in caps:
        return False
    name = (model.get("name") or model.get("id") or "").lower()
    return name not in {"embed", "embed:latest", "text-embedding-ada-002", "text-embedding-3-small"}


@app.get("/api/models")
async def get_ollama_models():
    models = await fetch_ollama_models()
    return {
        "models": models,
        "selected_model": llm_client.model,
        "gateway_url": GATEWAY_BASE_URL,
        "ollama_url": GATEWAY_BASE_URL,
    }


@app.put("/api/settings/model")
async def select_ollama_model(request: ModelSelectionRequest):
    model_name = request.model.strip()
    if not model_name:
        raise HTTPException(422, "Model name cannot be empty")

    available_models = await fetch_ollama_models()
    selected_model = next(
        (model for model in available_models if model["name"] == model_name), None
    )
    if selected_model is None:
        raise HTTPException(
            400, "The selected model is not installed on this AI Gateway"
        )
    if not is_chat_model(selected_model):
        raise HTTPException(400, "The selected model does not support chat")

    try:
        persist_selected_model(model_name)
    except OSError as exc:
        raise HTTPException(500, "Could not save the selected model") from exc

    llm_client.model = model_name
    return {"status": "ok", "selected_model": model_name}


@app.get("/api/health")
async def health():
    import httpx

    gateway_ok = False
    headers = {}
    api_key = os.getenv("OPENAI_API_KEY") or ""
    if api_key:
        headers["Authorization"] = f"Bearer {api_key}"

    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            r = await client.get(f"{GATEWAY_BASE_URL}/models", headers=headers)
            gateway_ok = r.status_code == 200
    except Exception:
        pass

    return {
        "status": "ok" if gateway_ok and kb.state == "ready" else "degraded",
        "version": __version__,
        "gateway_connected": gateway_ok,
        "ollama_connected": gateway_ok,
        "gateway_url": GATEWAY_BASE_URL,
        "ollama_url": GATEWAY_BASE_URL,
        "model": llm_client.model,
        "knowledge_chunks": len(kb.chunks),
        "rag": kb.get_status(),
    }


@app.get("/api/report/{session_id}")
async def get_session_report(session_id: str):
    import datetime

    session = sessions.get_or_create(session_id)
    summary = session.get("summary", "No session summary available.")
    mood_log = session.get("mood_log", [])
    thought_records = session.get("thought_records", [])

    report_lines = []
    report_lines.append("CLINICAL DISCHARGE SUMMARY")
    report_lines.append("=" * 40)
    report_lines.append(
        f"Discharge Date: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M')}"
    )
    report_lines.append(f"Session ID: {session_id}")
    report_lines.append("")
    report_lines.append("--- THERAPY SUMMARY (LONG-TERM MEMORY) ---")
    report_lines.append(summary if summary else "Summary not generated yet.")
    report_lines.append("")

    report_lines.append("--- RECENT MOOD RATINGS ---")
    if not mood_log:
        report_lines.append("No data.")
    for m in mood_log[-10:]:
        report_lines.append(
            f"{m.get('timestamp')[:19]}: {m.get('score')}/10 - {m.get('note', '')}"
        )
    report_lines.append("")

    report_lines.append("--- THOUGHT DIARY (RECENT ENTRIES) ---")
    if not thought_records:
        report_lines.append("No data.")
    for tr in thought_records[-5:]:
        report_lines.append(f"[{tr.get('timestamp')[:19]}]")
        report_lines.append(f"Situation: {tr.get('situation', '')}")
        report_lines.append(f"Thought: {tr.get('thought', '')}")
        report_lines.append(
            f"Emotion: {tr.get('emotion', '')} ({tr.get('intensity', '')}/10)"
        )
        report_lines.append(f"Distortion: {tr.get('distortion', '')}")
        report_lines.append(f"Rational Response: {tr.get('rational_response', '')}")
        report_lines.append("-" * 20)

    # Also grab recent psychological tests
    tests = sessions.get_tests(session_id)
    report_lines.append("")
    report_lines.append("--- PSYCHOLOGICAL ASSESSMENTS ---")
    if not tests:
        report_lines.append("No data.")
    for t in tests[:5]:
        report_lines.append(
            f"[{t.get('iso_date')[:10]}] {t.get('test_name')}: {t.get('score')} points ({t.get('level')})"
        )

    report_content = "\n".join(report_lines)

    return PlainTextResponse(
        report_content,
        headers={
            "Content-Disposition": f"attachment; filename=cbt_report_{session_id}.txt"
        },
    )


# ─── WebSocket ───────────────────────────────────────────────────


@app.websocket("/ws/chat/{session_id}")
async def websocket_chat(websocket: WebSocket, session_id: str):
    await websocket.accept()

    try:
        while True:
            data = await websocket.receive_json()

            if data.get("type") == "message":
                user_msg = data["content"]

                try:
                    messages, context_used, rag_trace = await prepare_chat_messages(
                        user_msg, session_id, data.get("language", "en")
                    )
                except Exception as exc:
                    await websocket.send_json(
                        {"type": "error", "content": f"RAG retrieval failed: {exc}"}
                    )
                    continue

                await websocket.send_json(
                    {
                        "type": "context",
                        "context_used": context_used,
                        "rag_trace": rag_trace["trace_id"],
                    }
                )

                if rag_trace["must_abstain"]:
                    content = grounded_abstention(data.get("language", "en"))
                    sessions.add_message(session_id, "user", user_msg)
                    sessions.add_message(session_id, "assistant", content)
                    await summarizer.maybe_summarize(session_id)
                    await websocket.send_json(
                        {
                            "type": "done",
                            "content": content,
                            "context_used": [],
                            "rag_trace": rag_trace["trace_id"],
                            "status": "abstained",
                        }
                    )
                    continue

                full_response = ""
                try:
                    async for chunk in llm_client.chat_stream(
                        messages, options=LLM_OPTIONS
                    ):
                        token = chunk.get("message", {}).get("content", "")
                        if token:
                            full_response += token
                            await websocket.send_json(
                                {"type": "token", "content": token}
                            )
                        if chunk.get("done"):
                            clean = ContentCleaner.strip_think_tags(full_response)
                            cited = ensure_rag_citations(
                                clean, context_used, data.get("language", "en")
                            )
                            citation_suffix = cited[len(clean) :]
                            if citation_suffix:
                                await websocket.send_json(
                                    {"type": "token", "content": citation_suffix}
                                )
                            sessions.add_message(session_id, "user", user_msg)
                            sessions.add_message(session_id, "assistant", cited)
                            await summarizer.maybe_summarize(session_id)
                            await websocket.send_json(
                                {
                                    "type": "done",
                                    "content": cited,
                                    "context_used": context_used,
                                    "rag_trace": rag_trace["trace_id"],
                                }
                            )
                except Exception as e:
                    await websocket.send_json({"type": "error", "content": str(e)})

            elif data.get("type") == "mood":
                sessions.add_mood(session_id, data["score"], data.get("note", ""))
                await websocket.send_json(
                    {
                        "type": "mood_logged",
                        "mood_log": sessions.get_or_create(session_id)["mood_log"],
                    }
                )
    except WebSocketDisconnect:
        sessions.save_session(session_id)


# Serve static frontend at the very end to catch all non-API paths
if FRONTEND_DIR.exists():
    app.mount("/", StaticFiles(directory=str(FRONTEND_DIR), html=True), name="frontend")


if __name__ == "__main__":
    import uvicorn
    import socket

    host = os.getenv("HOST", os.getenv("CBT_HOST", "0.0.0.0"))
    port = int(os.getenv("PORT", os.getenv("CBT_PORT", "8000")))

    local_ip = "127.0.0.1"
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 1))
        local_ip = s.getsockname()[0]
        s.close()
    except Exception:
        pass

    print(f"\n=======================================================")
    print(f"  CBT Assistant is running:")
    print(f"  - Local:   http://localhost:{port}")
    print(f"  - Network: http://{local_ip}:{port}")
    print(f"=======================================================\n")

    uvicorn.run(app, host=host, port=port)
