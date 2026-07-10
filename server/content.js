const fs = require('fs');
const path = require('path');

const SITEDATA_PATH = path.join(__dirname, '..', 'public', 'sitedata.json');

const GITHUB_OWNER = 'parekhankit26';
const GITHUB_REPO = 'asproite-website';
const GITHUB_FILE = 'public/sitedata.json';
const GITHUB_BRANCH = 'main';
const GITHUB_API_URL = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${GITHUB_FILE}`;

function readLocal() {
  try {
    return JSON.parse(fs.readFileSync(SITEDATA_PATH, 'utf8'));
  } catch (e) {
    return null;
  }
}

function writeLocal(data) {
  fs.writeFileSync(SITEDATA_PATH, JSON.stringify(data, null, 2));
}

// Pushes the updated file to GitHub using a server-side token. Returns
// { ok: true } on success, or { ok: false, error } — never throws, so a
// GitHub outage doesn't take down the local save.
async function pushToGitHub(data) {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return { ok: false, error: 'github_not_configured' };

  const headers = {
    Authorization: `token ${token}`,
    'Content-Type': 'application/json',
    Accept: 'application/vnd.github.v3+json',
  };
  const content = Buffer.from(JSON.stringify(data, null, 2), 'utf8').toString('base64');

  let sha = null;
  try {
    const info = await fetch(GITHUB_API_URL, { headers });
    if (info.ok) sha = (await info.json()).sha;
  } catch (e) { /* fall through — will attempt a create instead of update */ }

  try {
    const res = await fetch(GITHUB_API_URL, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        message: `Admin update — ${new Date().toISOString()}`,
        content,
        branch: GITHUB_BRANCH,
        ...(sha ? { sha } : {}),
      }),
    });
    if (res.ok) return { ok: true };
    const err = await res.json().catch(() => ({}));
    return { ok: false, error: err.message || `GitHub API error (${res.status})` };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

module.exports = { readLocal, writeLocal, pushToGitHub, isGitHubConfigured: () => !!process.env.GITHUB_TOKEN };
