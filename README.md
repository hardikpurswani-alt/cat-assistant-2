# CBT Assistant — AI Mental Health & Cognitive Behavioral Therapy Platform

An intelligent, privacy-first cognitive behavioral therapy (CBT) assistant: structured thought records, mood and sleep tracking, clinical self-assessments (PHQ-9, GAD-7, Rosenberg), and guided SOS exercises — plus an AI chat assistant grounded in evidence-based clinical protocols via RAG.

Powered by FastAPI, AI Gateway integration (`qwen-7b`), semantic vector retrieval, and SQLite session memory.

<p align="center">
  <img src="assets/CBT3.gif" alt="CBT Assistant opening SOS breathing support, reframing an anxious thought, and saving it to the Thought Diary" width="900">
</p>

<a id="installation"></a>

## Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/harshchhabra2612-glitch/cbt_assisant-ai.git
cd cbt_assisant-ai
```

### 2. Set Up Python Environment
```bash
python3 -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env` and set your AI Gateway configuration:
```bash
cp .env.example .env
```
Example `.env`:
```env
LLM_PROVIDER=gateway
OPENAI_BASE_URL=http://103.73.181.90:4000/v1
OPENAI_API_KEY=your_api_key_here
LLM_MODEL=qwen-7b
EMBEDDING_MODEL=embed
RAG_SCORE_THRESHOLD=0.48
```

### 4. Run the Application
```bash
python backend/server.py
```
Open your browser at **http://localhost:8000** (or your local LAN IP displayed in the terminal).

---

## Testing & Quality Assurance
Run the complete automated test suite (62 test cases):
```bash
pytest tests/
```

---

> [!IMPORTANT]
> CBT Assistant is a self-help and journaling tool — not a therapist, medical device, or crisis service. Its knowledge base follows evidence-based CBT protocols, but AI responses and self-assessments can still be wrong. If you may be in immediate danger or at risk of harming yourself or someone else, contact local emergency services or a crisis line now.

## CBT Journal, Mood Tracker, Self-Assessments, and SOS Exercises

- **Thought Diary** — situations, automatic thoughts, emotions and intensities, cognitive distortions, rational responses.
- **Mood & Sleep Logs** — daily scores and notes, sleep duration, interruptions, quality.
- **Self-Assessments** — PHQ-9, GAD-7, Rosenberg Self-Esteem, and Burnout, with score interpretation.
- **Dashboard & Calendar** — mood and sleep trends over time, and a month view unifying every daily entry.
- **SOS Portals** — fullscreen paced breathing, 5-4-3-2-1 grounding, progressive muscle relaxation, and STOP, with scenes, sound, and countdowns.
- **Reports** — text summaries and styled PDF export, generated directly in the browser.
- **New Chat** — instant session restart and message history clearing at any time.

## Private AI Assistant with Grounded Clinical RAG

- **Empathetic Dialogue:** High-reasoning CBT dialogue with `qwen-7b` via OpenAI-compatible AI Gateway.
- **Strict Evidence Retrieval:** Clinical guidance is retrieved from the bundled English CBT library via vector embeddings and cited as `[KB:chunk_id]`.
- **Automated Logging:** The assistant can record thought records, sleep logs, or schedule activities directly from the conversation.
- **Durable Memory:** User profile, recent thought summaries, and context persist in SQLite (`data/cbt_sessions.db`).
- **Voice Mode:** Speech recognition and neural text-to-speech in English.

## Architecture

<p align="center">
  <img src="assets/architecture.svg" alt="CBT Assistant architecture" width="100%">
</p>

At startup the Markdown CBT library is split by heading hierarchy and embedded locally. Messages, structured records, and profile memory live in SQLite (`data/cbt_sessions.db`). Frontend UI assets (Inter font, Lucide icons, and Chart.js for dashboard and PDF reports) are bundled locally for responsive offline use.

```text
GET    /api/health
POST   /api/chat
POST   /api/chat/stream
GET    /api/knowledge/search?q=sleep&top_k=3
GET    /api/session/{session_id}
POST   /api/session/{session_id}/clear
GET    /api/report/{session_id}
```

### Data Sovereignty & Storage

- **Database location:** `data/cbt_sessions.db` (single-file SQLite database, excluded from git).
- **Backups:** Copy `data/cbt_sessions.db` to back up all diary entries, tests, and conversation memory.
- **Data deletion:** Click **New Chat** to reset transcript or delete `data/cbt_sessions.db` and click **Reset all data** in Settings.

## Limitations & Safety

- **Crisis safety** — CBT Assistant is designed for self-help and mild-to-moderate distress; it does **not** include automated real-time crisis dispatch. If you are experiencing acute distress, self-harm impulses, or suicidal thoughts, please contact local emergency services or a crisis line (e.g., 988 in the US/Canada, 112 in the EU).
- **Security** — Binds to `0.0.0.0:8000` for local and LAN access. Keep it off untrusted public networks.
- **Performance** — Chat streaming SSE delivers real-time response tokens.

<br>

<p align="center">
  <img src="assets/cbt-assistant-art-flow.gif" alt="CBT Assistant Art Flow" width="34%">&nbsp;&nbsp;
  <img src="assets/cbt-assistant-art-mind.png" alt="CBT Assistant Art Mind" width="64%">
</p>

<br>

<p align="center">
  <a href="https://www.python.org/"><img alt="Python 3.10+" src="https://img.shields.io/badge/Python-3.10%2B-3776AB.svg?logo=python&amp;logoColor=white" height="28"></a>
  <a href="LICENSE"><img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-blue.svg" height="28"></a>
</p>
