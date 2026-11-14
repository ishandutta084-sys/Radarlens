# RadarLens Frontend (React + Vite + Vanilla CSS)

React frontend for the **RadarLens** NASA Space Apps NISAR Challenge Earth observation web application.

---

## 🚀 Quick Start

### 1. Requirements
- Node.js (v18+)
- npm

### 2. Installation
```bash
npm install
```

### 3. Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Default configuration connects to the local FastAPI backend on port 8000:
```env
VITE_API_BASE_URL=http://localhost:8000
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 5. Production Build
```bash
npm run build
npm run preview
```

---

## 🎨 Features & Visual Fidelity
- **Identical Visual Design**: Preserves all typography, spacing, colors, buttons, cards, and responsiveness.
- **Dual-Theme Support**: Persistent Bright (Light) and Dark themes with zero-flash rendering.
- **Interactive Before/After Slider**: Real-time slider with `--pos` property and change highlighting.
- **Interactive NASA GIBS Map**: Powered by Leaflet with true-color satellite imagery and monitored event bounding boxes.
- **Educational Explainer & SAR Steps**: Dynamic explainer and 4-step radar walkthrough with sticky satellite panel.
- **Feedback Form**: Validated feedback form with direct API submission.
