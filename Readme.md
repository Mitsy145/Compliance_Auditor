#  Compliance Auditor — AI-Powered Room Compliance Checker

A full-stack web application that lets users upload a photo of any room or space, select a compliance standard, and instantly receive an AI-generated compliance audit — including a score out of 100, detected gaps, a step-by-step action plan, a voice-based mock interview, and a historical dashboard. Built as a take-home assessment for Jaimini Group, this project demonstrates end-to-end AI integration using the Gemini API for multimodal image analysis, text generation, and answer scoring.

---

##  Live Demo

| Service | URL |
|---|---|
| Frontend | _Coming soon (Vercel)_ |
| Backend API | _Coming soon (Render)_ |
| API Docs (Swagger) | `<backend-url>/docs` |

---

##  Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Backend | FastAPI | Async, fast, auto Swagger docs — perfect for AI-heavy routes |
| Database | SQLite + SQLAlchemy | Zero config, file-based, sufficient for this scale |
| AI | Google Gemini 1.5 Flash | Free tier, multimodal (image + text), fast inference |
| Frontend | React + Vite | Fast HMR, component-based, ideal for dynamic UI |
| Styling | Tailwind CSS | Utility-first, no bloat, rapid UI building |
| Voice (STT) | Web Speech API | Browser-native, no cost, no external dependency |
| Voice (TTS) | SpeechSynthesis API | Browser-native text-to-speech for reading questions aloud |
| HTTP Client | Axios | Clean API calls with interceptor support |
| Routing | React Router DOM | Client-side SPA navigation |
| Deployment | Render + Vercel | Free tier, easy CI/CD, no DevOps overhead |

---

##  How to Run Locally

> **Assumes you have:** Node.js (v18+) and Python (v3.10+) installed.

### 1. Clone the Repository

```bash
git clone https://github.com/Mitsy145/compliance-auditor.git
cd compliance-auditor
```

### 2. Backend Setup

```bash
cd backend

# Create and activate virtual environment
python -m venv venv

# Windows
venv\Scripts\activate
# Mac/Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

Create a `.env` file inside `/backend`:

```env
GEMINI_API_KEY=your_gemini_api_key_here
DATABASE_URL=sqlite:///./compliance.db
UPLOAD_DIR=uploads
```

> Get a free Gemini API key at: https://aistudio.google.com/app/apikey

Start the backend server:

```bash
uvicorn app.main:app --reload
```

Backend runs at: `http://127.0.0.1:8000`
Swagger docs at: `http://127.0.0.1:8000/docs`

---

### 3. Frontend Setup

Open a new terminal:

```bash
cd frontend

# Install dependencies
npm install

# Install Tailwind PostCSS plugin (required for Tailwind v4)
npm install @tailwindcss/postcss
```

Create a `.env` file inside `/frontend`:

```env
VITE_API_URL=http://127.0.0.1:8000
```

Start the frontend:

```bash
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

##  API Documentation

### Base URL
`http://127.0.0.1:8000`

---

### 1. Analyze Room
Uploads a room image and returns a compliance score, gaps, and action plan.

**POST** `/audit/analyze`

**Request** (multipart/form-data):
| Field | Type | Description |
|---|---|---|
| `file` | File | Room image (JPG, PNG, WEBP) |
| `standard` | string | Compliance standard to check against |

**Response:**
```json
{
  "id": 1,
  "standard": "Kitchen Hygiene (FSSAI)",
  "score": 62.0,
  "gaps": [
    "No visible handwashing station near food prep area",
    "Uncovered food items on counter"
  ],
  "action_plan": [
    "Install a hand wash sink with soap dispenser near the cooking area",
    "Use food-grade covered containers for all ingredients"
  ],
  "created_at": "2026-06-28T10:30:00"
}
```

---

### 2. Generate Interview Questions
Generates 5 AI-powered interview questions based on the audit.

**GET** `/interview/generate/{audit_id}`

**Response:**
```json
{
  "id": 1,
  "audit_id": 1,
  "questions": [
    {
      "question": "What are the key FSSAI requirements for food storage?",
      "context": "Focus on temperature, labelling, and separation of raw/cooked food"
    }
  ]
}
```

---

### 3. Submit Interview Answers
Submits spoken answers and returns AI-scored results.

**POST** `/interview/submit`

**Request Body:**
```json
{
  "interview_id": 1,
  "answers": [
    "Food should be stored below 5 degrees Celsius...",
    "Cross contamination can be avoided by..."
  ]
}
```

**Response:**
```json
{
  "total_score": 74.0,
  "results": [
    {
      "question": "What are the key FSSAI requirements for food storage?",
      "answer": "Food should be stored below 5 degrees Celsius...",
      "score": 8,
      "feedback": "Good answer. You correctly identified temperature control as critical."
    }
  ]
}
```

---

### 4. Get Dashboard History
Returns all past audits for the dashboard.

**GET** `/dashboard/history`

**Response:**
```json
{
  "history": [
    {
      "id": 1,
      "standard": "Kitchen Hygiene (FSSAI)",
      "score": 62.0,
      "gaps_count": 3,
      "created_at": "2026-06-28T10:30:00"
    }
  ]
}
```

---

### 5. Get Single Audit Record
Fetches full details of a specific audit.

**GET** `/dashboard/record/{audit_id}`

**Response:**
```json
{
  "id": 1,
  "standard": "Kitchen Hygiene (FSSAI)",
  "score": 62.0,
  "gaps": ["No visible handwashing station near food prep area"],
  "action_plan": ["Install a hand wash sink with soap dispenser"],
  "created_at": "2026-06-28T10:30:00"
}
```

---

### 6. Health Check

**GET** `/health`

**Response:**
```json
{ "status": "ok" }
```

---

##  Project Structure

compliance-auditor/
├── .gitignore                          # Git ignore rules for entire project
├── Readme.md                           # Project documentation
│
├── backend/                            # FastAPI Python backend
│   ├── app/
│   │   ├── __init__.py                 # Python package marker
│   │   ├── main.py                     # App entry point, CORS, router registration
│   │   ├── database.py                 # SQLAlchemy engine and session setup
│   │   ├── models.py                   # AuditRecord and InterviewRecord DB models
│   │   ├── schemas.py                  # Pydantic request/response schemas
│   │   ├── routers/
│   │   │   ├── __init__.py             # Package marker
│   │   │   ├── audit.py                # POST /audit/analyze — image upload + Gemini
│   │   │   ├── dashboard.py            # GET /dashboard/history and /record
│   │   │   └── interview.py            # GET /interview/generate, POST /submit
│   │   └── services/
│   │       ├── __init__.py             # Package marker
│   │       ├── audio_service.py        # Transcript cleanup utility
│   │       └── gemini_service.py       # All Gemini API calls (analyze, questions, scoring)
│   ├── uploads/                        # Uploaded room images (auto-created, git ignored)
│   ├── venv/                           # Python virtual environment (git ignored)
│   ├── .env                            # API keys and config (git ignored)
│   ├── compliance.db                   # SQLite database (auto-created on first run)
│   └── requirements.txt                # Python dependencies
│
└── frontend/                           # React + Vite frontend
    ├── node_modules/                   # Node dependencies (git ignored)
    ├── src/
    │   ├── components/
    │   │   ├── ActionPlan.jsx          # Numbered AI-generated action steps
    │   │   ├── Dashboard.jsx           # Bar chart + audit history table
    │   │   ├── ResultCard.jsx          # Score circle + gaps list
    │   │   ├── UploadForm.jsx          # Reserved upload form component
    │   │   └── VoiceInterview.jsx      # Reserved reusable voice UI component
    │   ├── pages/
    │   │   ├── DashboardPage.jsx       # Score history + stats page
    │   │   ├── Home.jsx                # Upload form + standard selection
    │   │   ├── Interview.jsx           # Full voice interview with STT + TTS
    │   │   └── Results.jsx             # Score, gaps, action plan display
    │   ├── services/
    │   │   └── api.js                  # Axios API calls to backend
    │   ├── App.css                     # Global app styles
    │   ├── App.jsx                     # Router setup + navbar
    │   ├── index.css                   # Tailwind base imports
    │   └── main.jsx                    # React DOM entry point
    ├── .gitignore                      # Frontend specific ignores
    ├── .oxlintrc.json                  # Oxlint config (fast JS linter)
    ├── index.html                      # HTML entry point for Vite
    ├── package-lock.json               # Locked dependency versions
    ├── package.json                    # Node dependencies and scripts
    ├── postcss.config.js               # PostCSS config for Tailwind
    ├── README.md                       # Project documentation
    ├── tailwind.config.js              # Tailwind CSS configuration
    └── vite.config.js                  # Vite bundler configuration

##  Next Steps

### What I intentionally skipped (due to 48-hour constraint):

- **User Authentication** — No login/signup. All audits are stored globally. Would add JWT-based auth with per-user audit history.
- **Visual Polish** — Focused 80% effort on AI integration per the brief. Would add animations, better mobile layout, and a proper design system.
- **PDF Export** — Would add a "Download Report" button that generates a formatted PDF of the audit.
- **Real-time Streaming** — Gemini responses currently wait for full completion. Would stream tokens for faster perceived performance.
- **PostgreSQL** — Switched to SQLite for speed. Production deployment would use PostgreSQL with connection pooling.
- **Mobile Voice Support** — Web Speech API has inconsistent behaviour on mobile browsers. Would handle fallbacks gracefully.

### What I'd build next with more time:

- **Multi-room audit sessions** — Audit an entire building floor by floor, aggregate scores into a single report.
- **Custom checklist builder** — Let users define their own compliance criteria beyond the preset standards.
- **Trend analytics** — Show improvement over time per standard with charts and regression insights.
- **Webhook notifications** — Alert stakeholders via email/Slack when a space falls below a compliance threshold.
- **Offline support** — PWA with cached questions so inspectors can work in low-connectivity environments (critical for NQAS hospital use case).

---

##  Author

**Meenakshi Joshi **
- GitHub: [github.com/Mitsy145](https://github.com/Mitsy145)
- LinkedIn: [linkedin.com/in/meenakshi-joshi-422070311](https://linkedin.com/in/meenakshi-joshi-422070311)

---

*Built as a take-home assessment for Jaimini Group — NQAS.ai*
