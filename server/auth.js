const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const store = require('./store');

const SESSION_COOKIE = 'asproite_session';
const SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours

// Sessions are stateless, signed tokens rather than a server-side store —
// this host restarts the app far more often than expected (health checks,
// idle cycling), and an in-memory or file-backed session store would drop
// everyone on every restart, mid-edit. Signing with a key derived from the
// persisted password hash means a token stays valid across restarts as
// long as the password hasn't changed, with no extra state to lose.
function signingKey() {
  const hash = store.getPasswordHash() || 'fallback-key-no-password-set';
  return crypto.createHash('sha256').update(hash).digest();
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
