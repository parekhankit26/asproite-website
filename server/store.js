const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const DATA_DIR = path.join(__dirname, '..', 'data');
const AUTH_FILE = path.join(DATA_DIR, 'admin-auth.json');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function readAuthFile() {
  try {
    return JSON.parse(fs.readFileSync(AUTH_FILE, 'utf8'));
  } catch (e) {
    return null;
  }
}

function writeAuthFile(obj) {
  ensureDataDir();
  fs.writeFileSync(AUTH_FILE, JSON.stringify(obj, null, 2));
}

// Seeds the admin password on first boot. Prefers ADMIN_PASSWORD from the
// environment; otherwise generates a random one-time password and prints it
// once so the operator can log in and change it.
function ensureAdminSeeded() {
  const existing = readAuthFile();
  if (existing && existing.passwordHash) return;

  // Trimmed because some hosting platforms' env var storage silently adds
  // a trailing newline/whitespace to values, which would otherwise bake
  // an unguessable character into the seeded hash.
  let initial = (process.env.ADMIN_PASSWORD || '').trim() || undefined;
  let generated = false;
  if (!initial) {
    initial = crypto.randomBytes(9).toString('base64url');
    generated = true;
  }
  const passwordHash = bcrypt.hashSync(initial, 12);
  writeAuthFile({ passwordHash, updatedAt: new Date().toISOString() });

  if (generated) {
    console.log('\n================================================================');
    console.log(' No ADMIN_PASSWORD set — generated a one-time admin password:');
    console.log(' ' + initial);
    console.log(' Log in with it, then change it immediately from Admin → Security.');
    console.log(' This will not be shown again. Set ADMIN_PASSWORD in your env to');
    console.log(' control it directly instead.');
    console.log('================================================================\n');
  }
}

function getPasswordHash() {
  const auth = readAuthFile();
  return auth ? auth.passwordHash : null;
}

function setPasswordHash(hash) {
  const existing = readAuthFile() || {};
  writeAuthFile({
    ...existing,
    passwordHash: hash,
    passwordChangedAt: Date.now(),
    updatedAt: new Date().toISOString(),
  });
}

// Timestamp of the last password change, embedded into new session tokens
// and checked against on every request — a session issued before this
// timestamp is stale and gets rejected. Best-effort: like the password hash
// itself, this lives in a local file that isn't reliably shared across
// instances on this host, so cross-instance invalidation may lag. The
// reliable, instant, all-instances way to kill every session is still
// rotating the ADMIN_PASSWORD env var, which changes the token signing key
// itself.
function getPasswordChangedAt() {
  const auth = readAuthFile();
  return (auth && auth.passwordChangedAt) || 0;
}

// Active secret — the one actually enforced at login. Only ever set via
// confirm2FASetup() succeeding, never at generation time (see pending
// secret below), so simply viewing a QR code can't turn 2FA on by itself.
function get2FASecret() {
  const auth = readAuthFile();
  return (auth && auth.totpSecret) || null;
}

function set2FASecret(secret) {
  const existing = readAuthFile() || {};
  writeAuthFile({ ...existing, totpSecret: secret, updatedAt: new Date().toISOString() });
}

function clear2FASecret() {
  const existing = readAuthFile() || {};
  delete existing.totpSecret;
  writeAuthFile({ ...existing, updatedAt: new Date().toISOString() });
}

// Pending secret — generated during enrollment, held here until the admin
// proves they actually captured it by entering a valid code. Never
// enforced at login on its own.
function getPending2FASecret() {
  const auth = readAuthFile();
  return (auth && auth.pendingTotpSecret) || null;
}

function setPending2FASecret(secret) {
  const existing = readAuthFile() || {};
  writeAuthFile({ ...existing, pendingTotpSecret: secret, updatedAt: new Date().toISOString() });
}

function clearPending2FASecret() {
  const existing = readAuthFile() || {};
  delete existing.pendingTotpSecret;
  writeAuthFile({ ...existing, updatedAt: new Date().toISOString() });
}

module.exports = {
  ensureAdminSeeded,
  getPasswordHash,
  setPasswordHash,
  getPasswordChangedAt,
  get2FASecret,
  set2FASecret,
  clear2FASecret,
  getPending2FASecret,
  setPending2FASecret,
  clearPending2FASecret,
};
