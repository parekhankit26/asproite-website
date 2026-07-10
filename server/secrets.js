const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const SECRETS_FILE = path.join(DATA_DIR, 'admin-secrets.json');

// Rotatable, non-password secrets (GitHub token, Anthropic key) that the
// admin panel can update without touching the host's environment config.
// A value set here overrides the env var of the same purpose; if nothing
// has been set here, the env var is used. Stored server-side only —
// never returned to the browser, only a boolean "configured" status.

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function readAll() {
  try {
    return JSON.parse(fs.readFileSync(SECRETS_FILE, 'utf8'));
  } catch (e) {
    return {};
  }
}

function writeAll(obj) {
  ensureDataDir();
  fs.writeFileSync(SECRETS_FILE, JSON.stringify(obj, null, 2));
}

function getGitHubToken() {
  return readAll().githubToken || process.env.GITHUB_TOKEN || '';
}

function setGitHubToken(token) {
  const all = readAll();
  all.githubToken = token;
  writeAll(all);
}

function clearGitHubToken() {
  const all = readAll();
  delete all.githubToken;
  writeAll(all);
}

function getAnthropicKey() {
  return readAll().anthropicKey || process.env.ANTHROPIC_API_KEY || '';
}

function setAnthropicKey(key) {
  const all = readAll();
  all.anthropicKey = key;
  writeAll(all);
}

function clearAnthropicKey() {
  const all = readAll();
  delete all.anthropicKey;
  writeAll(all);
}

module.exports = {
  getGitHubToken, setGitHubToken, clearGitHubToken,
  getAnthropicKey, setAnthropicKey, clearAnthropicKey,
};
