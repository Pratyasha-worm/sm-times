// Triggers the "Refresh Edition" GitHub Actions workflow on demand.
// Called by the site's Refresh button when it finds no newer edition
// already published. Holds the GitHub dispatch token server-side (a
// Netlify environment variable) — a token capable of kicking off a
// workflow run must never sit in client-side JS, where any visitor
// could read it from the page and spam runs on your quota/minutes.
//
// Required Netlify env var: GITHUB_DISPATCH_TOKEN — a GitHub personal
// access token scoped to ONLY this repo, with just the "Actions: write"
// permission (fine-grained PAT). Do not reuse a broad classic token
// here; this endpoint is reachable by anyone who can load the site.

const OWNER = "Pratyasha-worm";
const REPO = "sm-times";
const WORKFLOW_FILE = "refresh.yml";
const MIN_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

// In-memory only — resets on cold start. This is a soft guard against
// accidental double-clicks and casual abuse, not a real defense; the
// actual backstop against runaway cost is the workflow's own 15-minute
// timeout and GitHub Actions' generous free-tier minutes for a repo
// this size.
let lastTriggeredAt = 0;

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method Not Allowed" }) };
  }

  const token = process.env.GITHUB_DISPATCH_TOKEN;
  if (!token) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server not configured: GITHUB_DISPATCH_TOKEN is not set." }),
    };
  }

  const now = Date.now();
  const elapsed = now - lastTriggeredAt;
  if (elapsed < MIN_INTERVAL_MS) {
    const waitSec = Math.ceil((MIN_INTERVAL_MS - elapsed) / 1000);
    return {
      statusCode: 429,
      body: JSON.stringify({ error: `A refresh was triggered recently. Try again in ~${waitSec}s.` }),
    };
  }

  try {
    const res = await fetch(
      `https://api.github.com/repos/${OWNER}/${REPO}/actions/workflows/${WORKFLOW_FILE}/dispatches`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ref: "main" }),
      }
    );

    // GitHub returns 204 No Content on a successful dispatch.
    if (res.status === 204) {
      lastTriggeredAt = now;
      return {
        statusCode: 200,
        body: JSON.stringify({
          ok: true,
          message: "Refresh started. This takes a few minutes to fetch, enrich, and publish — check back shortly.",
        }),
      };
    }

    const detail = await res.text();
    return {
      statusCode: res.status,
      body: JSON.stringify({ error: `GitHub API error ${res.status}: ${detail}` }),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: String(err) }) };
  }
};
