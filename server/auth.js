const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const store = require('./store');

const SESSION_COOKIE = 'asproite_session';
const SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours

// Sessions are stateless, signed tokens rather than a server-side store —
// this host restarts the app far more often than expected, runs more than
// one instance of the process, and doesn't reliably share local disk state
// between them. An in-memory or file-backed session store would drop
// sessions on restart, or fail whenever a request lands on a different
// instance than the one that issued the token.
//
// Signing with a key derived from ADMIN_PASSWORD itself (not the locally
// bcrypt-hashed copy, which is salted differently per instance) means every
// instance derives the identical key, so a token verifies the same way no
// matter which instance handles the request or how many times any of them
// have restarted. Falls back to the local password hash only when no env
// var is set — safe on a single instance, best-effort on multiple.
function signingKey() {
  const envPassword = (process.env.ADMIN_PASSWORD || '').trim();
  const material = envPassword || store.getPasswordHash() || 'fallback-key-no-password-set';
  return crypto.createHash('sha256').update(material).digest();
}

function createSession() {
  const payload = JSON.stringify({ exp: Date.now() + SESSION_TTL_MS });
  const payloadB64 = Buffer.from(payload, 'utf8').toString('base64url');
  const sig = crypto.createHmac('sha256', signingKey()).update(payloadB64).digest('base64url');
  return `${payloadB64}.${sig}`;
}

function destroySession() {
  // Stateless tokens can't be revoked server-side; clearing the cookie
  // (done by the caller) is sufficient for a single-admin panel.
}

function isValidSession(token) {
  if (!token || typeof token !== 'string') return false;
  const [payloadB64, sig] = token.split('.');
  if (!payloadB64 || !sig) return false;

  const expectedSig = crypto.createHmac('sha256', signingKey()).update(payloadB64).digest('base64url');
  const sigBuf = Buffer.from(sig);
  const expectedBuf = Buffer.from(expectedSig);
  if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) return false;

  try {
    const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'));
    return typeof payload.exp === 'number' && payload.exp > Date.now();
  } catch (e) {
    return false;
  }
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
  const attempt = String(password || '');

  const hash = store.getPasswordHash();
  if (hash && bcrypt.compareSync(attempt, hash)) return true;

  // Fallback: also accept ADMIN_PASSWORD directly from the environment.
  // Some hosts don't reliably persist the local password-hash file across
  // restarts/redeploys, which would otherwise lock the admin out even
  // though they set a perfectly good env var.
  const envPassword = (process.env.ADMIN_PASSWORD || '').trim();
  if (envPassword && attempt === envPassword) return true;

  return false;
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
