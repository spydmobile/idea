import { CONFIG } from '../config';

const BASE = 'https://api.github.com';
const REPO = `${BASE}/repos/${CONFIG.owner}/${CONFIG.repo}`;

function headers(token) {
  const h = {
    'Accept': 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
  if (token) h['Authorization'] = `Bearer ${token}`;
  return h;
}

// ── Read ──────────────────────────────────────────────────────────────

export async function fetchIdeas({ label = CONFIG.ideaLabel, page = 1, perPage = 20, search = '' } = {}) {
  const q = search
    ? `${search}+repo:${CONFIG.owner}/${CONFIG.repo}+is:issue+label:${label}`
    : null;

  const url = q
    ? `${BASE}/search/issues?q=${encodeURIComponent(q)}&per_page=${perPage}&page=${page}`
    : `${REPO}/issues?labels=${label}&state=open&per_page=${perPage}&page=${page}&sort=created&direction=desc`;

  const res = await fetch(url, { headers: headers() });
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
  const data = await res.json();
  return q ? data.items : data;
}

export async function fetchIdea(number) {
  const [issue, comments] = await Promise.all([
    fetch(`${REPO}/issues/${number}`, { headers: headers() }).then(r => r.json()),
    fetch(`${REPO}/issues/${number}/comments`, { headers: headers() }).then(r => r.json()),
  ]);
  return { issue, comments };
}

export async function fetchLabels() {
  const res = await fetch(`${REPO}/labels?per_page=100`, { headers: headers() });
  return res.json();
}

export async function fetchReactions(issueNumber, token) {
  const res = await fetch(`${REPO}/issues/${issueNumber}/reactions`, {
    headers: { ...headers(token), 'Accept': 'application/vnd.github.squirrel-girl-preview+json' },
  });
  return res.json();
}

// ── Write (require token) ─────────────────────────────────────────────

export async function submitIdea({ title, summary, problem, tags, token }) {
  const body = `## Summary\n${summary}\n\n## Problem it solves\n${problem}\n\n## Tags\n${tags.map(t => `\`${t}\``).join(', ')}\n\n---\n${CONFIG.licenseText}`;

  const res = await fetch(`${REPO}/issues`, {
    method: 'POST',
    headers: headers(token),
    body: JSON.stringify({
      title: `[IDEA] ${title}`,
      body,
      labels: [CONFIG.ideaLabel, ...tags],
    }),
  });
  if (!res.ok) throw new Error(`Submit failed: ${res.status}`);
  return res.json();
}

export async function postComment({ issueNumber, body, token }) {
  const res = await fetch(`${REPO}/issues/${issueNumber}/comments`, {
    method: 'POST',
    headers: headers(token),
    body: JSON.stringify({ body }),
  });
  if (!res.ok) throw new Error(`Comment failed: ${res.status}`);
  return res.json();
}

export async function addReaction({ issueNumber, content, token }) {
  const res = await fetch(`${REPO}/issues/${issueNumber}/reactions`, {
    method: 'POST',
    headers: { ...headers(token), 'Accept': 'application/vnd.github.squirrel-girl-preview+json' },
    body: JSON.stringify({ content }),
  });
  if (!res.ok) throw new Error(`Reaction failed: ${res.status}`);
  return res.json();
}
