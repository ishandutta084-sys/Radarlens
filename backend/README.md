# RadarLens Backend (FastAPI + Supabase PostgreSQL)

FastAPI REST backend for the **RadarLens** NASA Space Apps NISAR Challenge Earth observation web application.

---

## 🚀 Quick Start

### 1. Requirements
- Python 3.10+ (tested on Python 3.12)
- pip

### 2. Installation
```bash
pip install -r requirements.txt
```

### 3. Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Fill in your Supabase connection parameters (or leave empty to use the local fallback data store):
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_DB_URL=postgresql://postgres:password@db.your-project.supabase.co:5432/postgres
PORT=8000
HOST=0.0.0.0
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

### 4. Run the Server
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
Or with python:
```bash
python -m uvicorn app.main:app --port 8000 --reload
```

---

## 📖 API Documentation & Endpoints

- **Interactive Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc Documentation**: [http://localhost:8000/redoc](http://localhost:8000/redoc)
- **Health Check**: `GET /health`
- **Events List**: `GET /api/events`
- **Event Detail**: `GET /api/events/{event_id}` (`flood`, `glacier`, `wetland`)
- **Data Sources**: `GET /api/sources`
- **Team**: `GET /api/team`
- **How SAR Works Steps**: `GET /api/steps`
- **Submit Feedback**: `POST /api/feedback` (Rate-limited: 5 submissions/minute)

---

## 🗄️ Database Setup (Supabase PostgreSQL)

Execute the schema located at `app/database/schema.sql` in your Supabase SQL Editor:
- Creates `events`, `sources`, `steps`, `team_members`, and `feedback` tables.
- Establishes Row Level Security (RLS) policies for anonymous read access and protected feedback insertion.
- Automatically seeds all NASA NISAR challenge radar datasets, satellite citations, and research metrics.

---

## 🧪 Running Tests
```bash
pytest tests/test_api.py -v
```
