const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { generateSecret, generateURI, verifySync } = require('otplib');
const QRCode = require('qrcode');
const store = require('./store');

const SESSION_COOKIE = 'asproite_session';
const IDLE_TTL_MS = 15 * 60 * 1000; // sliding: renewed on every activity
const ABSOLUTE_TTL_MS = 8 * 60 * 60 * 1000; // hard cap regardless of activity

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

function sign(payloadB64) {
  return crypto.createHmac('sha256', signingKey()).update(payloadB64).digest('base64url');
}

function encodeToken(payload) {
  const payloadB64 = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
  return `${payloadB64}.${sign(payloadB64)}`;
}

// Verifies signature only, and returns the parsed payload (or null). Does
// not check expiry/absolute-cap/ip/password-epoch — callers do that, since
// some callers (renewSession) need the raw payload even for an expired-but-
// still-authentic token.
function decodeAndVerifySignature(token) {
  if (!token || typeof token !== 'string') return null;
  const [payloadB64, sig] = token.split('.');
  if (!payloadB64 || !sig) return null;

  const expectedSig = sign(payloadB64);
  const sigBuf = Buffer.from(sig);
  const expectedBuf = Buffer.from(expectedSig);
  if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) return null;

  try {
    return JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'));
  } catch (e) {
    return null;
  }
}

function createSession() {
  const now = Date.now();
  const payload = {
    iat: now, // fixed for the life of the session; enforces the absolute cap
    exp: now + IDLE_TTL_MS, // sliding; extended by renewSession on activity
    pwdAt: store.getPasswordChangedAt(), // password change invalidates older tokens
  };
  return encodeToken(payload);
}

function destroySession() {
  // Stateless tokens can't be revoked server-side; clearing the cookie
  // (done by the caller) is sufficient for a single-admin panel.
}

// Full validation: signature, sliding expiry, absolute cap, and
// password-epoch all have to pass.
//
// IP binding was tried and removed: Hostinger's proxy path doesn't report
// a stable client IP for the same browser session (observed both an
// IPv4/IPv6 loopback representation mismatch locally, and real 401s in
// production within the same page load), so it was locking the admin out
// of their own panel rather than blocking anyone. The 15-minute idle
// timeout and 8-hour absolute cap are the actual backstop here.
function isValidSession(token) {
  const payload = decodeAndVerifySignature(token);
  if (!payload) return false;
  if (typeof payload.exp !== 'number' || payload.exp <= Date.now()) return false;
  if (typeof payload.iat !== 'number' || Date.now() - payload.iat > ABSOLUTE_TTL_MS) return false;
  if (payload.pwdAt !== store.getPasswordChangedAt()) return false;
  return true;
}

// Issues a fresh token with a renewed sliding expiry, called on real admin
// activity (either an authenticated API call or an explicit heartbeat ping).
// Preserves the original iat so the absolute cap still applies, and refuses
// to renew past it — that forces re-login every 8 hours no matter how
// active the admin is.
function renewSession(token) {
  const payload = decodeAndVerifySignature(token);
  if (!payload) return null;
  if (typeof payload.iat !== 'number' || Date.now() - payload.iat > ABSOLUTE_TTL_MS) return null;
  if (payload.pwdAt !== store.getPasswordChangedAt()) return null;

  return encodeToken({
    iat: payload.iat,
    exp: Date.now() + IDLE_TTL_MS,
    pwdAt: payload.pwdAt,
  });
}

function setSessionCookie(res, token) {
  res.cookie(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: ABSOLUTE_TTL_MS,
    path: '/',
  });
}

function clearSessionCookie(res) {
  res.clearCookie(SESSION_COOKIE, { path: '/' });
}

// Validates the current request's session and, on success, transparently
// slides the expiry forward and re-sets the cookie — so normal admin usage
// (saving content, etc.) alone is enough to stay logged in without a
// separate heartbeat call. The client still pings a dedicated heartbeat
// endpoint for activity that doesn't hit the API (e.g. typing).
function requireAuth(req, res, next) {
  const token = req.cookies ? req.cookies[SESSION_COOKIE] : null;
  if (!isValidSession(token)) return res.status(401).json({ error: 'Not authenticated' });
  const renewed = renewSession(token);
  if (renewed) setSessionCookie(res, renewed);
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

// ── Two-factor authentication (TOTP) ────────────────────────
// The secret prefers ADMIN_2FA_SECRET from the environment for the same
// reason session signing prefers ADMIN_PASSWORD from the environment: it's
// identical across every instance on this host, so verification doesn't
// depend on which instance handles the request. The locally-stored secret
// (set during enrollment) is a same-instance-only fallback until the admin
// copies it into an env var and redeploys.
function get2FASecret() {
  const envSecret = (process.env.ADMIN_2FA_SECRET || '').trim();
  return envSecret || store.get2FASecret() || null;
}

function is2FAEnabled() {
  return !!get2FASecret();
}

function verifyTOTP(code) {
  const secret = get2FASecret();
  if (!secret) return false;
  const attempt = String(code || '').trim().replace(/\s+/g, '');
  if (!/^\d{6}$/.test(attempt)) return false;
  try {
    return !!verifySync({ secret, token: attempt }).valid;
  } catch (e) {
    return false;
  }
}

// Generates a new secret for enrollment and stores it as *pending* only —
// 2FA isn't enforced at login until confirm2FASetup() verifies the admin
// actually captured it in an authenticator app. Otherwise merely opening
// the setup screen and clicking away would silently require a code the
// admin never saved, locking them out on the next login.
async function generate2FASetup() {
  const secret = generateSecret();
  store.setPending2FASecret(secret);
  const otpauth = generateURI({ secret, issuer: 'Asproite Admin', label: 'admin' });
  const qrDataUrl = await QRCode.toDataURL(otpauth);
  return { secret, otpauth, qrDataUrl };
}

function confirm2FASetup(code) {
  const secret = store.getPending2FASecret();
  if (!secret) return false;
  const attempt = String(code || '').trim().replace(/\s+/g, '');
  if (!/^\d{6}$/.test(attempt)) return false;
  let valid = false;
  try {
    valid = !!verifySync({ secret, token: attempt }).valid;
  } catch (e) {
    valid = false;
  }
  if (!valid) return false;
  store.set2FASecret(secret);
  store.clearPending2FASecret();
  return true;
}

function disable2FA() {
  store.clear2FASecret();
  store.clearPending2FASecret();
}

module.exports = {
  SESSION_COOKIE,
  IDLE_TTL_MS,
  ABSOLUTE_TTL_MS,
  createSession,
  renewSession,
  destroySession,
  isValidSession,
  setSessionCookie,
  clearSessionCookie,
  requireAuth,
  verifyPassword,
  setPassword,
  is2FAEnabled,
  verifyTOTP,
  generate2FASetup,
  confirm2FASetup,
  disable2FA,
};
