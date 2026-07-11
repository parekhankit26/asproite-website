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
let bootInfo = { existedAtBoot: null, envLen: null, generated: null };
function getBootInfo() { return bootInfo; }

function ensureAdminSeeded() {
  const existing = readAuthFile();
  bootInfo.existedAtBoot = !!(existing && existing.passwordHash);
  bootInfo.envLen = (process.env.ADMIN_PASSWORD || '').length;
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
  bootInfo.generated = generated;

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
  writeAuthFile({ passwordHash: hash, updatedAt: new Date().toISOString() });
}

module.exports = { ensureAdminSeeded, getPasswordHash, setPasswordHash, getBootInfo, AUTH_FILE };
