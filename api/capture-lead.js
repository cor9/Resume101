// Vercel serverless function — captures lead from email gate.
// Writes to MailerLite subscriber list and Airtable base.
// Environment variables required (set in Vercel project settings):
//   MAILERLITE_API_KEY   — MailerLite API v2 key
//   MAILERLITE_GROUP_ID  — MailerLite group ID for Resume101 leads
//   AIRTABLE_API_KEY     — Airtable Personal Access Token
//   AIRTABLE_BASE_ID     — Airtable base ID (starts with "app...")
//   AIRTABLE_TABLE_NAME  — Table name, e.g. "Leads" (defaults to "Leads")

export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response('Bad Request', { status: 400 });
  }

  const { parentName, email, actorName, ageRange, market } = body;

  if (!email || !parentName || !actorName || !ageRange) {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), {
      status: 400, headers: { 'Content-Type': 'application/json' },
    });
  }

  const results = await Promise.allSettled([
    addToMailerLite({ parentName, email, actorName, ageRange, market }),
    addToAirtable({ parentName, email, actorName, ageRange, market }),
  ]);

  const errors = results
    .filter(r => r.status === 'rejected')
    .map(r => r.reason?.message || 'unknown');

  if (errors.length === 2) {
    // Both failed — log but still return success so the user gets their PDF
    console.error('capture-lead: both integrations failed', errors);
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200, headers: { 'Content-Type': 'application/json' },
  });
}

async function addToMailerLite({ parentName, email, actorName, ageRange, market }) {
  const key = process.env.MAILERLITE_API_KEY;
  const groupId = process.env.MAILERLITE_GROUP_ID;
  if (!key) throw new Error('MAILERLITE_API_KEY not set');

  const payload = {
    email,
    fields: {
      name: parentName,
      last_name: '',
      actor_name: actorName,
      age_range: ageRange,
      market: market || '',
    },
    groups: groupId ? [groupId] : [],
    status: 'active',
  };

  const res = await fetch('https://connect.mailerlite.com/api/subscribers', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`MailerLite error ${res.status}: ${text}`);
  }
}

async function addToAirtable({ parentName, email, actorName, ageRange, market }) {
  const key = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;
  const table = process.env.AIRTABLE_TABLE_NAME || 'Leads';
  if (!key || !baseId) throw new Error('Airtable env vars not set');

  const res = await fetch(`https://api.airtable.com/v0/${baseId}/${encodeURIComponent(table)}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      records: [{
        fields: {
          'Parent Name': parentName,
          'Email': email,
          'Actor Name': actorName,
          'Age Range': ageRange,
          'Market': market || '',
          'Source': 'Resume101',
          'Submitted At': new Date().toISOString(),
        },
      }],
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Airtable error ${res.status}: ${text}`);
  }
}
