# RadarLens 🛰️

> **NASA Space Apps Challenge · NISAR: The satellite that sees through clouds**
> RadarLens is an interactive Earth observation web platform that visualizes surface change (floods, glacier motion, wetland loss) using Synthetic Aperture Radar (SAR) and optical satellite comparisons.

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended; tested on Node v24)
- npm

### 1. Installation
Install the required dependencies (`express` and `nodemon`):
```bash
npm install
```

### 2. Run the Server
Start the local server:
```bash
npm start
```
The server will start on `http://localhost:3000`. If port 3000 is occupied, it automatically increments to the next free port and displays the active URL in your terminal.

For development with hot reloading:
```bash
npm run dev
```

### 3. Open in Browser
- **Home Page**: [http://localhost:3000/index.html](http://localhost:3000/index.html)
- **Event Viewer**: [http://localhost:3000/viewer.html](http://localhost:3000/viewer.html)
  - Flood: [http://localhost:3000/viewer.html#flood](http://localhost:3000/viewer.html#flood)
  - Glacier: [http://localhost:3000/viewer.html#glacier](http://localhost:3000/viewer.html#glacier)
  - Wetland: [http://localhost:3000/viewer.html#wetland](http://localhost:3000/viewer.html#wetland)
- **How SAR Works**: [http://localhost:3000/how-sar.html](http://localhost:3000/how-sar.html)
- **Data Sources & Credits**: [http://localhost:3000/data.html](http://localhost:3000/data.html)

---

## 📡 API Endpoints

All endpoints return standard JSON responses with appropriate HTTP status codes (200, 201, 400, 404, 429, 500):

- `GET /api/events` — Returns summary list of events (`flood`, `glacier`, `wetland`) with thumbnails and descriptions.
- `GET /api/events/:id` — Detailed event dataset including before/after images, dates, sample metric values, gap days, bounding box (`[south, west, north, east]`), and full attribution metadata. Returns 404 if event is unknown.
- `GET /api/sources` — Rows for the Data Sources and Datasets table.
- `GET /api/team` — 6 NASA Space Apps team members with roles and names.
- `GET /api/steps` — The 4 sequential steps explaining Synthetic Aperture Radar.
- `POST /api/feedback` — Accepts `{ name, message }`. Validates input, trims whitespace, limits length (name ≤ 100, message ≤ 1000), applies IP rate limiting (max 5 submissions per minute), and appends entries to `data/feedback.json`.

---

## 📊 Features & Architecture

- **Vanilla Frontend**: Pure vanilla HTML5, CSS3, and JavaScript — no heavyweight frontend framework.
- **Before/After Split Slider**: Compare two satellite passes with draggable handle, range slider input, touch support, and full keyboard navigation (arrow keys, Home, End).
- **Change Area Highlight**: Toggleable tinted overlay highlighting surface change on the After image.
- **Interactive Global Map**: Leaflet map integrated with **NASA Global Imagery Browse Services (GIBS)** MODIS Terra true-color WMTS layer and OpenStreetMap, rendering a bounding-box polygon around the study site.
- **Dark/Light Theming & Accessibility**: Respects `prefers-color-scheme`, `prefers-reduced-motion`, visible focus rings, ARIA roles (`role="status"`, `aria-pressed`, `aria-label`).
- **Optimized Media**: Original 22.3 MB GIF converted to 4.2 MB WebP and 955 KB MP4. All satellite imagery scaled to max 1600px wide.

---

## ⚖️ Honesty Rules & Scientific Attribution

In accordance with scientific integrity guidelines:
- **Sample Data**: Actual NISAR orbital data will be available once the satellite is commissioned in orbit. In this prototype, metric values (percentages, estimated rates, gap days) are illustrative **Sample data** and are explicitly marked as such across the UI.
- **Satellite Labelling**: No proxy image is falsely labelled as NISAR. All satellite imagery is credited with its true origin:
  - **River flood**: Copernicus Sentinel-1 C-band SAR & Copernicus Sentinel-2 MSI (ESA / European Union).
  - **Glacier movement**: Copernicus Sentinel-1 C-SAR & Sentinel-2 (ESA / European Union) over Jakobshavn Glacier / Ilulissat Icefjord, Greenland.
  - **Wetland change**: Copernicus Sentinel-2 (Fuente de Piedra, Spain) and NASA/JPL UAVSAR & ALOS PALSAR L-band SAR (Pacaya-Samiria, Amazon Basin).

### To Replace with Real Data (Once NISAR Launches)
When operational NISAR data products are released on NASA Earthdata / ASF DAAC:
1. `before.value` and `after.value`: Replace illustrative percentages with NISAR L-band backscatter intensity (dB), interferometric coherence ($\gamma$), or surface water extent ($km^2$).
2. `before.image` and `after.image`: Replace with calibrated geocoded NISAR GCOV (Geocoded Polarimetric Covariance) or GSV (Geocoded Surface Velocity) rasters.
3. `before.date` and `after.date`: Replace with exact 12-day NISAR repeat orbit acquisition dates.
4. `gapDays`: Replace with actual orbital revisit difference (typically 12 or 24 days).
