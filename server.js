const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require('express');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');

const store = require('./server/store');
const auth = require('./server/auth');
const content = require('./server/content');
const ai = require('./server/ai');
const secrets = require('./server/secrets');

store.ensureAdminSeeded();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

// No-cache ABOVE express.static — prevents browser/Hostinger caching index.html
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts. Try again in 15 minutes.' },
});

const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many messages. Please slow down.' },
});

// ── Admin auth ──────────────────────────────────────────────
app.post('/site-api/admin/login', loginLimiter, (req, res) => {
  const { password } = req.body || {};
  if (!auth.verifyPassword(password)) return res.status(401).json({ error: 'Incorrect password' });
  const token = auth.createSession();
  auth.setSessionCookie(res, token);
  res.json({ ok: true });
});

app.post('/site-api/admin/logout', (req, res) => {
  auth.destroySession(req.cookies?.[auth.SESSION_COOKIE]);
  auth.clearSessionCookie(res);
  res.json({ ok: true });
});

app.get('/site-api/admin/session', (req, res) => {
  res.json({ loggedIn: auth.isValidSession(req.cookies?.[auth.SESSION_COOKIE]) });
});

app.post('/site-api/admin/change-password', auth.requireAuth, (req, res) => {
  const { currentPassword, newPassword } = req.body || {};
  if (!auth.verifyPassword(currentPassword)) return res.status(401).json({ error: 'Current password is incorrect' });
  if (!newPassword || String(newPassword).length < 6) {
    return res.status(400).json({ error: 'New password must be at least 6 characters' });
  }
  auth.setPassword(newPassword);
  res.json({ ok: true });
});

// ── Content (site data) ─────────────────────────────────────
app.get('/site-api/content', (req, res) => {
  const data = content.readLocal();
  if (!data) return res.status(404).json({ error: 'No content found' });
  res.json(data);
});

app.post('/site-api/content', auth.requireAuth, async (req, res) => {
  const { section, sectionData } = req.body || {};
  if (!section || typeof sectionData === 'undefined') {
    return res.status(400).json({ error: 'Missing section or sectionData' });
  }
  const current = content.readLocal() || {};
  current[section] = sectionData;
  content.writeLocal(current);

  const githubResult = await content.pushToGitHub(current);
  res.json({ ok: true, github: githubResult });
});

app.get('/site-api/admin/config-status', auth.requireAuth, (req, res) => {
  res.json({
    githubConfigured: content.isGitHubConfigured(),
    aiConfigured: ai.isConfigured(),
  });
});

// ── Rotatable secrets (GitHub token / Anthropic key) ────────
// Validated against the real API before being stored, then kept
// server-side only — the browser never sees the value again, just a
// configured/not-configured status.
app.post('/site-api/admin/github-token', auth.requireAuth, async (req, res) => {
  const { token } = req.body || {};
  if (!token || typeof token !== 'string') return res.status(400).json({ error: 'Token required' });
  try {
    const check = await fetch('https://api.github.com/repos/parekhankit26/asproite-website', {
      headers: { Authorization: `token ${token}`, Accept: 'application/vnd.github.v3+json' },
    });
    if (!check.ok) {
      const err = await check.json().catch(() => ({}));
      return res.status(400).json({ error: err.message || 'Invalid token' });
    }
    const info = await check.json();
    if (!info.permissions?.push) return res.status(400).json({ error: 'Token is valid but lacks push access to this repo' });
  } catch (e) {
    return res.status(502).json({ error: 'Could not reach GitHub to validate the token' });
  }
  secrets.setGitHubToken(token);
  res.json({ ok: true });
});

app.post('/site-api/admin/github-token/clear', auth.requireAuth, (req, res) => {
  secrets.clearGitHubToken();
  res.json({ ok: true });
});

app.post('/site-api/admin/anthropic-key', auth.requireAuth, async (req, res) => {
  const { key } = req.body || {};
  if (!key || typeof key !== 'string') return res.status(400).json({ error: 'Key required' });
  try {
    const check = await fetch('https://api.anthropic.com/v1/models', {
      headers: { 'x-api-key': key, 'anthropic-version': '2023-06-01' },
    });
    if (!check.ok) return res.status(400).json({ error: 'Invalid API key' });
  } catch (e) {
    return res.status(502).json({ error: 'Could not reach Anthropic to validate the key' });
  }
  secrets.setAnthropicKey(key);
  res.json({ ok: true });
});

app.post('/site-api/admin/anthropic-key/clear', auth.requireAuth, (req, res) => {
  secrets.clearAnthropicKey();
  res.json({ ok: true });
});

// ── AI chat proxy ───────────────────────────────────────────
app.get('/site-api/ai-chat/status', (req, res) => {
  res.json({ configured: ai.isConfigured() });
});

app.post('/site-api/ai-chat', chatLimiter, async (req, res) => {
  try {
    const reply = await ai.chat(req.body?.messages);
    res.json({ reply });
  } catch (e) {
    if (e.code === 'not_configured') return res.status(503).json({ error: 'not_configured' });
    if (e.code === 'bad_request') return res.status(400).json({ error: e.message });
    res.status(502).json({ error: 'AI service is temporarily unavailable' });
  }
});

// ── Static site ──────────────────────────────────────────────
app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => console.log('Asproite running on port ' + PORT));
