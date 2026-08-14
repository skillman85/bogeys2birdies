import { createClient } from '@sanity/client';
import { revalidatePath } from 'next/cache';
import { importSeasonData } from '../../../../sanity/lib/seasonImport';
import { verifyFirebaseIdToken } from '../../../../sanity/lib/firebaseIdToken';

export const runtime = 'nodejs';
const maxBytes = 2 * 1024 * 1024;
function response(body, status) { return Response.json(body, { status, headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' } }); }
async function authorised(request) {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const allowedUids = new Set((process.env.PRECISION_GOLF_SYNC_ALLOWED_UID || '').split(',').map((uid) => uid.trim()).filter(Boolean));
  const token = request.headers.get('authorization')?.match(/^Bearer\s+(.+)$/i)?.[1] || '';
  if (!projectId || allowedUids.size === 0 || !token) return false;
  try {
    const claims = await verifyFirebaseIdToken(token, projectId);
    return allowedUids.has(claims.sub);
  } catch (error) {
    console.warn('PrecisionGolf Firebase authentication failed:', error instanceof Error ? error.message : error);
    return false;
  }
}
export async function POST(request) {
  if (!(await authorised(request))) return response({ error: 'Unauthorised.' }, 401);
  if (!request.headers.get('content-type')?.startsWith('application/json')) return response({ error: 'Content-Type must be application/json.' }, 415);
  if (Number(request.headers.get('content-length') || 0) > maxBytes) return response({ error: 'Payload is too large.' }, 413);
  if (!process.env.SANITY_WRITE_TOKEN) return response({ error: 'Season sync is not configured.' }, 503);
  let data;
  try { const raw = await request.text(); if (Buffer.byteLength(raw) > maxBytes) return response({ error: 'Payload is too large.' }, 413); data = JSON.parse(raw); }
  catch { return response({ error: 'Invalid JSON.' }, 400); }
  try {
    const client = createClient({ projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'kfysb6ye', dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production', apiVersion: '2026-08-14', useCdn: false, token: process.env.SANITY_WRITE_TOKEN });
    const result = await importSeasonData(client, data);
    revalidatePath('/'); revalidatePath('/data');
    return response({ ok: true, ...result, syncedAt: new Date().toISOString() }, 200);
  } catch (error) {
    console.error('PrecisionGolf sync failed:', error);
    return response({ error: error instanceof Error ? error.message : 'Season sync failed.' }, 400);
  }
}
