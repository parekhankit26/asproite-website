const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const store = require('./store');

const SESSION_COOKIE = 'asproite_session';
const SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours

// In-memory session store. Restarting the server logs everyone out — fine
// for a small admin panel with no external session persistence needs.
const sessions = new Map();

function pruneExpired() {
  const now = Date.now();
  for (const [token, expires] of sessions) {
    if (expires <= now) sessions.delete(token);
  }
}

function createSession() {
  pruneExpired();
  const token = crypto.randomBytes(32).toString('hex');
  sessions.set(token, Date.now() + SESSION_TTL_MS);
  return token;
}

function destroySession(token) {
  if (token) sessions.delete(token);
}

function isValidSession(token) {
  if (!token) return false;
  const expires = sessions.get(token);
  if (!expires) return false;
  if (expires <= Date.now()) { sessions.delete(token); return false; }
  return true;
}

function setSessionCookie(res, token) {
  res.cookie(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: SESSION_TTL_MS,
    path: '/',
  });
}

function clearSessionCookie(res) {
  res.clearCookie(SESSION_COOKIE, { path: '/' });
}

function requireAuth(req, res, next) {
  const token = req.cookies ? req.cookies[SESSION_COOKIE] : null;
  if (!isValidSession(token)) return res.status(401).json({ error: 'Not authenticated' });
  next();
}

function verifyPassword(password) {
  const hash = store.getPasswordHash();
  if (!hash) return false;
  return bcrypt.compareSync(String(password || ''), hash);
}

function setPassword(newPassword) {
  const hash = bcrypt.hashSync(String(newPassword), 12);
  store.setPasswordHash(hash);
}

module.exports = {
  SESSION_COOKIE,
  createSession,
  destroySession,
  isValidSession,
  setSessionCookie,
  clearSessionCookie,
  requireAuth,
  verifyPassword,
  setPassword,
};
