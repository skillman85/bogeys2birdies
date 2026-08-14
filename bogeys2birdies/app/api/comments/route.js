import { createClient } from '@sanity/client';

const allowedTypes = new Set(['article', 'experiment', 'gearReview']);
const allowedHosts = new Set(['bogeys2birdies.co.uk', 'www.bogeys2birdies.co.uk', 'localhost']);
const windowMs = 10 * 60 * 1000;
const maxSubmissions = 3;
const rateLimits = globalThis.__b2bCommentRateLimits || new Map();
globalThis.__b2bCommentRateLimits = rateLimits;

function clean(value, maxLength) { return String(value || '').replace(/[\u0000-\u001F\u007F]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, maxLength); }
function json(body, status) { return Response.json(body, { status, headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'same-origin' } }); }

async function sendModerationNotification(comment) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn('Comment saved, but RESEND_API_KEY is not configured.');
    return;
  }

  const recipient = process.env.COMMENT_NOTIFICATION_EMAIL || 'hello@bogeys2birdies.co.uk';
  const sender = process.env.COMMENT_NOTIFICATION_FROM || 'Bogeys2Birdies <comments@bogeys2birdies.co.uk>';
  const studioUrl = process.env.SANITY_STUDIO_URL || 'https://bogeys2birdies.sanity.studio/structure/comment';
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: sender,
      to: [recipient],
      subject: `Comment awaiting approval: ${comment.contentTitle}`,
      text: [
        'A new comment is awaiting approval on Bogeys2Birdies.',
        '',
        `Page: ${comment.contentTitle}`,
        `Name: ${comment.author}`,
        `Comment: ${comment.message}`,
        '',
        `Review it in Sanity Studio: ${studioUrl}`,
      ].join('\n'),
    }),
  });

  if (!response.ok) throw new Error(`Resend notification failed with status ${response.status}.`);
}

export async function POST(request) {
  const origin = request.headers.get('origin');
  try { if (!origin || !allowedHosts.has(new URL(origin).hostname)) return json({ error: 'Invalid request origin.' }, 403); } catch { return json({ error: 'Invalid request origin.' }, 403); }
  if (!request.headers.get('content-type')?.startsWith('application/json')) return json({ error: 'Invalid content type.' }, 415);
  if (!process.env.SANITY_WRITE_TOKEN) return json({ error: 'Comments are temporarily unavailable.' }, 503);

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  const now = Date.now(); const recent = (rateLimits.get(ip) || []).filter((time) => now - time < windowMs);
  if (recent.length >= maxSubmissions) return json({ error: 'Too many comments. Please try again later.' }, 429);

  let body; try { body = await request.json(); } catch { return json({ error: 'Invalid request body.' }, 400); }
  if (body.website) return json({ ok: true }, 202);
  const author = clean(body.author, 60); const message = clean(body.message, 1500); const contentId = clean(body.contentId, 120); const contentType = clean(body.contentType, 30);
  if (author.length < 2 || message.length < 3 || !/^[a-zA-Z0-9._-]+$/.test(contentId) || !allowedTypes.has(contentType)) return json({ error: 'Please provide a valid name and comment.' }, 400);

  const client = createClient({ projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'kfysb6ye', dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production', apiVersion: '2026-08-14', useCdn: false, token: process.env.SANITY_WRITE_TOKEN });
  const content = await client.fetch('*[_id == $contentId && _type == $contentType][0]{_id,title}', { contentId, contentType });
  if (!content) return json({ error: 'The content could not be found.' }, 404);
  recent.push(now); rateLimits.set(ip, recent);
  const comment = { _type: 'comment', author, message, contentId, contentType, contentTitle: clean(content.title, 160), createdAt: new Date().toISOString(), status: 'pending' };
  await client.create(comment);
  try { await sendModerationNotification(comment); } catch (error) { console.error('Comment notification email failed:', error); }
  return json({ ok: true }, 202);
}
