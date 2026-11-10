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

