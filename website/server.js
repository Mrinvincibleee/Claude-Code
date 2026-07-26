/**
 * FitForge AI website backend.
 *
 * Serves the static frontend from public/, vendors client libraries straight
 * out of node_modules (no CDN — the site works fully offline), and exposes a
 * small JSON API backed by flat files in data/.
 */
const express = require('express');
const fs = require('fs/promises');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const DATA_DIR = path.join(__dirname, 'data');
const SUBSCRIBERS_FILE = path.join(DATA_DIR, 'subscribers.json');
const MESSAGES_FILE = path.join(DATA_DIR, 'messages.json');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Only these packages are reachable under /vendor — never the whole node_modules.
const VENDORED = ['three', 'gsap', 'lenis'];

app.use(express.json({ limit: '32kb' }));
app.use(express.static(path.join(__dirname, 'public')));
for (const pkg of VENDORED) {
  app.use(`/vendor/${pkg}`, express.static(path.join(__dirname, 'node_modules', pkg)));
}

async function readJson(file) {
  try {
    return JSON.parse(await fs.readFile(file, 'utf8'));
  } catch {
    return [];
  }
}

async function writeJson(file, value) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(file, JSON.stringify(value, null, 2));
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, uptime: process.uptime() });
});

app.get('/api/stats', async (_req, res) => {
  const subscribers = await readJson(SUBSCRIBERS_FILE);
  // Deterministic growth from a fixed epoch so the counters feel live without
  // needing a real database yet.
  const daysLive = (Date.now() - Date.UTC(2026, 0, 1)) / 86_400_000;
  res.json({
    members: Math.floor(48_200 + daysLive * 231),
    workoutsLogged: Math.floor(1_240_000 + daysLive * 8_123),
    caloriesBurned: Math.floor(389_000_000 + daysLive * 2_450_000),
    aiSessions: Math.floor(96_400 + daysLive * 1_180),
    subscribers: subscribers.length,
  });
});

app.post('/api/newsletter', async (req, res) => {
  const email = String(req.body?.email ?? '').trim().toLowerCase();
  if (!EMAIL_RE.test(email) || email.length > 254) {
    return res.status(400).json({ error: 'Enter a valid email address.' });
  }
  const subscribers = await readJson(SUBSCRIBERS_FILE);
  if (subscribers.some((s) => s.email === email)) {
    return res.status(409).json({ error: "You're already on the list." });
  }
  subscribers.push({ email, at: new Date().toISOString() });
  await writeJson(SUBSCRIBERS_FILE, subscribers);
  res.status(201).json({ ok: true, subscribers: subscribers.length });
});

app.post('/api/contact', async (req, res) => {
  const name = String(req.body?.name ?? '').trim();
  const email = String(req.body?.email ?? '').trim().toLowerCase();
  const message = String(req.body?.message ?? '').trim();
  if (!name || name.length > 120) {
    return res.status(400).json({ error: 'Tell us your name.' });
  }
  if (!EMAIL_RE.test(email) || email.length > 254) {
    return res.status(400).json({ error: 'Enter a valid email address.' });
  }
  if (!message || message.length > 5000) {
    return res.status(400).json({ error: 'Write a message (max 5000 characters).' });
  }
  const messages = await readJson(MESSAGES_FILE);
  messages.push({ name, email, message, at: new Date().toISOString() });
  await writeJson(MESSAGES_FILE, messages);
  res.status(201).json({ ok: true });
});

app.use('/api', (_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.listen(PORT, () => {
  console.log(`FitForge AI website running at http://localhost:${PORT}`);
});
