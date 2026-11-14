# RadarLens 🛰️

> **NASA Space Apps Challenge · NISAR: The satellite that sees through clouds**  
> RadarLens is an interactive Earth observation web platform that visualizes surface change (floods, glacier motion, wetland loss) using Synthetic Aperture Radar (SAR) and optical satellite comparisons.

---

## 🏛️ Migrated Technology Architecture

The application has been migrated to a modern, decoupled production architecture while preserving 100% of the original visual design, interactions, responsive behavior, and NASA scientific features:

| Layer | Original Technology | Migrated Target Technology |
| :--- | :--- | :--- |
| **Frontend** | Vanilla HTML5 / JS / CSS | **React 18 + Vite + Vanilla CSS** (React Router DOM) |
| **Backend** | Node.js + Express.js | **Python 3.12 + FastAPI + Pydantic v2 + Uvicorn** |
| **API Docs** | None / Manual | **OpenAPI Swagger (`/docs`) & ReDoc (`/redoc`)** |
| **Database** | Flat JSON files | **Supabase PostgreSQL** (with SQL schema & RLS policies) |
| **Styling** | Custom Vanilla CSS & CSS Variables | **Preserved Custom Vanilla CSS** (Zero framework bloat) |
| **Theme System** | Dual Bright/Dark with localStorage | **Preserved Dual Bright/Dark Theme System** |

---

## 📂 Project Structure

```
SAR/
├── frontend/                     # React + Vite Frontend
│   ├── public/                   # Static assets & satellite imagery
│   │   └── images/
│   ├── src/
│   │   ├── components/           # Modular components (Header, Footer, ThemeToggle, etc.)
│   │   ├── pages/                # Page components (HomePage, ViewerPage, HowSarPage, DataPage)
│   │   ├── services/             # API communication layer (Fetch / REST)
│   │   ├── styles/               # Preserved exact CSS and design tokens
│   │   ├── App.jsx               # Route definitions
│   │   └── main.jsx              # React DOM root
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── .env.example
├── backend/                      # Python FastAPI REST Backend
│   ├── app/
│   │   ├── api/routes.py         # REST endpoints (/api/events, /api/sources, /api/feedback, etc.)
│   │   ├── core/config.py        # Environment & CORS configuration
│   │   ├── database/             # Supabase client & PostgreSQL SQL schema
│   │   │   ├── schema.sql        # Supabase PostgreSQL schema with RLS & seed data
│   │   │   └── supabase_client.py# Supabase Python integration with local fallback
│   │   ├── models/schemas.py     # Pydantic schemas & response validation
│   │   ├── services/data_service.py # Business logic & data persistence
│   │   └── main.py               # FastAPI entry point, CORS, and health endpoints
│   ├── tests/                    # Automated Pytest suite
│   │   └── test_api.py
│   ├── data/                     # Seed datasets (events, sources, steps, team, feedback)
│   ├── requirements.txt          # Python dependencies
│   ├── .env.example
│   └── README.md
├── public/                       # Original static files (retained for backward compatibility)
├── data/                         # Original seed files (retained)
├── server.js                     # Original Express server (retained)
└── README.md
```

---

## 🚀 Running the Migrated Application

### 1. Start the FastAPI Backend
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
- API root: [http://localhost:8000](http://localhost:8000)
- Swagger Documentation: [http://localhost:8000/docs](http://localhost:8000/docs)
- ReDoc Documentation: [http://localhost:8000/redoc](http://localhost:8000/redoc)
- Health Check: [http://localhost:8000/health](http://localhost:8000/health)

### 2. Start the React Frontend
```bash
cd frontend
npm install
npm run dev
```
- Web Application: [http://localhost:5173](http://localhost:5173)

---

## 🗄️ Supabase PostgreSQL Setup

1. Create a project in [Supabase](https://supabase.com).
2. Open the **SQL Editor** in your Supabase dashboard and run `backend/app/database/schema.sql`.
   - Creates the `events`, `sources`, `steps`, `team_members`, and `feedback` tables.
   - Enables Row Level Security (RLS) policies allowing public reads and secured feedback submissions.
   - Populates seed records.
3. Add your Supabase credentials to `backend/.env`:
   ```env
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   SUPABASE_ANON_KEY=your-anon-key
   ```
*(Note: If no Supabase credentials are configured, the backend automatically uses its robust local fallback store, ensuring zero downtime).*

---

## 🧪 Testing and Verification

To execute the backend automated test suite:
```bash
cd backend
python -m pytest tests/test_api.py -v
```

To build the React production bundle:
```bash
cd frontend
npm run build
```
