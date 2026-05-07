// Vercel serverless function — uploads a cropped headshot to Vercel Blob.
// Receives a base64 JPEG data URL, returns a public CDN URL.
//
// Setup: In Vercel Dashboard → Storage → Create Blob Store → link to this project.
// This auto-sets the BLOB_READ_WRITE_TOKEN environment variable.
//
// Env vars required:
//   BLOB_READ_WRITE_TOKEN — auto-configured when Vercel Blob is connected

export const config = { runtime: 'edge' };

const MAX_BYTES = 2 * 1024 * 1024; // 2 MB limit

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    // Blob not yet configured — return a signal so the client falls back to base64
    return new Response(JSON.stringify({ error: 'blob_not_configured' }), {
      status: 503, headers: { 'Content-Type': 'application/json' },
    });
  }

  let dataUrl;
  try {
    ({ dataUrl } = await req.json());
  } catch {
    return new Response('Bad Request', { status: 400 });
  }

  if (!dataUrl || !dataUrl.startsWith('data:image/')) {
    return new Response(JSON.stringify({ error: 'Invalid image data' }), {
      status: 400, headers: { 'Content-Type': 'application/json' },
    });
  }

  // Convert base64 data URL → binary Uint8Array
  const base64 = dataUrl.split(',')[1];
  const binary = atob(base64);
  if (binary.length > MAX_BYTES) {
    return new Response(JSON.stringify({ error: 'Image too large (max 2 MB)' }), {
      status: 413, headers: { 'Content-Type': 'application/json' },
    });
  }
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  const pathname = `headshots/${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`;

  const blobRes = await fetch(`https://blob.vercel-storage.com/${pathname}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'image/jpeg',
      'x-api-version': '7',
      'cache-control': 'public, max-age=31536000, immutable',
    },
    body: bytes,
  });

  if (!blobRes.ok) {
    const text = await blobRes.text();
    console.error('Vercel Blob error:', blobRes.status, text);
    return new Response(JSON.stringify({ error: 'Upload failed' }), {
      status: 502, headers: { 'Content-Type': 'application/json' },
    });
  }

  const { url } = await blobRes.json();
  return new Response(JSON.stringify({ url }), {
    status: 200, headers: { 'Content-Type': 'application/json' },
  });
}
