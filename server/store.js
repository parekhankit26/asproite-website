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
  console.log('[DEBUG] AUTH_FILE path:', AUTH_FILE);
  console.log('[DEBUG] existing file found:', !!existing, 'has hash:', !!(existing && existing.passwordHash));
  console.log('[DEBUG] ADMIN_PASSWORD env set:', !!process.env.ADMIN_PASSWORD, 'length:', (process.env.ADMIN_PASSWORD || '').length);
  if (existing && existing.passwordHash) return;

  let initial = process.env.ADMIN_PASSWORD;
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
  writeAuthFile({ passwordHash: hash, updatedAt: new Date().toISOString() });
}

module.exports = { ensureAdminSeeded, getPasswordHash, setPasswordHash };
