const express = require('express');
const fs = require('fs');
const path = require('path');
const http = require('http');

const app = express();
const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files
app.use(express.static(path.join(__dirname, 'public')));

// Helpers to read JSON data
function readDataFile(filename) {
  const filepath = path.join(__dirname, 'data', filename);
  try {
    const raw = fs.readFileSync(filepath, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error reading ${filename}:`, err);
    return null;
  }
}

function writeDataFile(filename, data) {
  const filepath = path.join(__dirname, 'data', filename);
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf8');
}

// -------------------------------------------------------------
// Rate-limiting for POST /api/feedback
// -------------------------------------------------------------
const feedbackIpMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 5;

function isRateLimited(ip) {
  const now = Date.now();
  const timestamps = feedbackIpMap.get(ip) || [];
  const recent = timestamps.filter(t => now - t < RATE_LIMIT_WINDOW_MS);
  if (recent.length >= MAX_REQUESTS_PER_WINDOW) {
    feedbackIpMap.set(ip, recent);
    return true;
  }
  recent.push(now);
  feedbackIpMap.set(ip, recent);
  return false;
}

// -------------------------------------------------------------
// API Routes
// -------------------------------------------------------------

// GET /api/events -> list of {id, title, type, thumb, summary}
app.get('/api/events', (req, res) => {
  const events = readDataFile('events.json');
  if (!events) {
    return res.status(500).json({ error: 'Failed to load events data' });
  }
  const summaryList = events.map(e => ({
    id: e.id,
    title: e.title,
    type: e.type,
    thumb: e.thumb,
    summary: e.summary
  }));
  res.json(summaryList);
});

// GET /api/events/:id -> detailed event data
app.get('/api/events/:id', (req, res) => {
  const events = readDataFile('events.json');
  if (!events) {
    return res.status(500).json({ error: 'Failed to load events data' });
  }
  const targetId = req.params.id.toLowerCase();
  const event = events.find(e => e.id.toLowerCase() === targetId);
  if (!event) {
    return res.status(404).json({ error: `Event '${req.params.id}' not found` });
  }
  res.json(event);
});

// GET /api/sources -> rows for the Data sources table
app.get('/api/sources', (req, res) => {
  const sources = readDataFile('sources.json');
  if (!sources) {
    return res.status(500).json({ error: 'Failed to load sources data' });
  }
  res.json(sources);
});

// GET /api/team -> 6 team members {role, name}
app.get('/api/team', (req, res) => {
  const team = readDataFile('team.json');
  if (!team) {
    return res.status(500).json({ error: 'Failed to load team data' });
  }
  res.json(team);
});

// GET /api/steps -> the 4 "How SAR works" steps
app.get('/api/steps', (req, res) => {
  const steps = readDataFile('steps.json');
  if (!steps) {
    return res.status(500).json({ error: 'Failed to load steps data' });
  }
  res.json(steps);
});

// POST /api/feedback -> validate, trim, length-limit, rate-limit, append to data/feedback.json
app.post('/api/feedback', (req, res) => {
  const clientIp = req.ip || req.connection?.remoteAddress || 'unknown';
  if (isRateLimited(clientIp)) {
    return res.status(429).json({ error: 'Too many submissions. Please wait a minute and try again.' });
  }

  const { name, message } = req.body || {};
  if (typeof name !== 'string' || typeof message !== 'string') {
    return res.status(400).json({ error: 'Invalid payload: name and message must be strings.' });
  }

  const trimmedName = name.trim();
  const trimmedMessage = message.trim();

  if (!trimmedName || !trimmedMessage) {
    return res.status(400).json({ error: 'Name and message cannot be empty.' });
  }

  if (trimmedName.length > 100) {
    return res.status(400).json({ error: 'Name must be 100 characters or fewer.' });
  }

  if (trimmedMessage.length > 1000) {
    return res.status(400).json({ error: 'Message must be 1000 characters or fewer.' });
  }

  let feedbackList = readDataFile('feedback.json') || [];
  const entry = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
    name: trimmedName,
    message: trimmedMessage,
    createdAt: new Date().toISOString()
  };
  feedbackList.push(entry);
  writeDataFile('feedback.json', feedbackList);

  res.status(201).json({ success: true, message: 'Thank you! Your feedback has been received.' });
});

// -------------------------------------------------------------
// POST /api/advisor -> NISAR Applications Advisor
// Grounded in NASA Science Societal Benefits & NISAR Data User Guide
// -------------------------------------------------------------
const ADVISOR_SYSTEM_PROMPT = `
You are a NISAR applications advisor. Help users understand how data from the NASA-ISRO NISAR mission can benefit society, and match their problem to the right application area. Base your answers on NASA Science's "NISAR Societal Benefits" page (https://science.nasa.gov/mission/nisar/societal-benefits/), which hosts two-page application white papers. These came out of the 2014 and 2015 NISAR Applications Workshops and later topic-specific workshops.

BACKGROUND
- NISAR is a joint NASA/ISRO dual-band radar mission (L-band about 24 cm, S-band about 10 cm). It images through clouds and at night.
- Design goals stated in the white papers: coverage of nearly all land and ice, repeated 4-6 times per month at about 5-10 m resolution. High-resolution coverage of over 90% of land, and flood mapping twice every 12 days. Products 1-2 days after observation, and within hours in disaster response.
- The papers describe these as design goals written before launch, so treat them as goals, not guarantees.

APPLICATION AREAS COVERED BY THE WHITE PAPERS
1. Natural hazards: earthquakes (location and impact), volcanic hazards, landslides, floods, flood forecasting, damage mapping, sinkholes and cavern collapse, induced seismicity, subsidence, fire management, marine hazards, hazards in Texas, hazards in Florida.
2. Water resources: soil moisture and water resources, drought and groundwater withdrawal, mountain glaciers and snow hydrology, levees and dams, oil/gas/water underground reservoirs.
3. Ice, ocean and coast: ice sheets/glaciers/oceans, sea ice, permafrost change, coastal land loss, oil spills.
4. Land and agriculture: food security, forest resources, timber and forest disturbance.

WHAT THE WHITE PAPERS SAY (use only these details; do not add to them)
- Floods: radar maps flooding through cloud cover and can detect flooding beneath forest canopy, as well as open water. This helps responders such as FEMA, NOAA and USGS, and helps wetland managers track seasonal inundation (important for habitat and ecosystem health).
- Damage mapping: radar images from before and after a disaster can be compared automatically to produce "damage proxy maps" showing areas of likely damage. In the 2011 Christchurch earthquake example, a radar-based map made 3 days after the quake closely matched government ground-survey maps released 4 months and 8 months later. The Amatrice (Italy, 2016) example showed how wider radar coverage helps.
- For all other topics, tell the user the topic is covered by a NASA white paper, give the topic name and say they can read the PDF on the Societal Benefits page. Do not invent its contents.

LINKING APPLICATIONS TO ACTUAL NISAR DATA (from the NISAR Data User Guide, https://nisar-docs.asf.alaska.edu)
- Ground displacement (earthquakes, volcanoes, subsidence, landslides): GUNW/RUNW interferogram products.
- Inundation, biomass, crop mapping, disturbance: GCOV backscatter product.
- Soil moisture (reservoir management, drought warning, irrigation scheduling, crop yield forecasting): Level 3 SME2 product. Its VALIDATED version is not yet available.
- Disasters: "Urgent Response" flags acquisitions already in the plan for priority downlink and processing. NISAR does not acquire extra data for events.
- Data maturity: BETA (Jan-Feb 2026), PROVISIONAL (June 17 to part of Oct 23, 2026), VALIDATED (Level 0-2, acquisitions from Oct 21, 2026 onward, released Nov 6, 2026).
- Access: Earthdata Login (free) with ASF Vertex, Earthdata Search, asf_search or earthaccess.

HOW TO BEHAVE
1. Ask what problem the user is trying to solve (for example flood response, drought monitoring, infrastructure safety or research) and who they are (responder, researcher, student, policymaker).
2. Match their problem to the closest application area above, explain the societal benefit in plain language, and name the relevant NISAR product.
3. Keep a clear line between what the white papers claim (pre-launch goals and past examples using other satellites such as ALOS and COSMO-SkyMed) and what the current Data User Guide says is available. If they conflict, trust the Data User Guide.
4. Be honest about limits: SAR products need expertise for some uses. Radar-derived damage and flood maps are indicators, not ground-verified facts.
5. If a question is outside this material or you are unsure, say so. Do not invent statistics, dates, case studies or capabilities.
6. Point to the Societal Benefits page for the full papers, the NISAR Data User Guide for data access, and ASF User Services (uso@asf.alaska.edu) or earthdata-support@nasa.gov for help.
`;

app.post('/api/advisor', async (req, res) => {
  const { message, role } = req.body || {};
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message is required.' });
  }

  // If GEMINI_API_KEY is available in environment, use generative AI
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: ADVISOR_SYSTEM_PROMPT }] },
          contents: [{
            role: 'user',
            parts: [{ text: `User role: ${role || 'general'}\nUser query: ${message}` }]
          }]
        })
      });

      if (response.ok) {
        const data = await response.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          return res.json({ response: text, source: 'gemini' });
        }
      }
    } catch (err) {
      console.warn('Gemini API call failed, falling back to deterministic engine:', err.message);
    }
  }

  // Deterministic engine will be handled gracefully by client-side fallback
  res.json({ fallback: true });
});

// -------------------------------------------------------------
// Start server on free port
// -------------------------------------------------------------
function startServer(port) {
  const server = http.createServer(app);

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`Port ${port} is in use, trying port ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error('Server error:', err);
    }
  });

  server.listen(port, () => {
    console.log(`RadarLens server running at http://localhost:${port}`);
    console.log(`Explore pages:`);
    console.log(`  - Home:        http://localhost:${port}/index.html`);
    console.log(`  - Viewer:      http://localhost:${port}/viewer.html`);
    console.log(`  - How SAR:     http://localhost:${port}/how-sar.html`);
    console.log(`  - Data:        http://localhost:${port}/data.html`);
  });
}

startServer(DEFAULT_PORT);

