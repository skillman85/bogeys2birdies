import { createHash } from 'node:crypto';
import { createClient } from '@sanity/client';

const allowedHosts = new Set(['bogeys2birdies.co.uk', 'www.bogeys2birdies.co.uk', 'localhost', '127.0.0.1']);
const windowMs = 10 * 60 * 1000;
const maxSubmissions = 5;
const rateLimits = globalThis.__b2bNewsletterRateLimits || new Map();
globalThis.__b2bNewsletterRateLimits = rateLimits;

function json(body, status) {
  return Response.json(body, {
    status,
    headers: {
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'same-origin',
    },
  });
}

function clean(value, maxLength) {
  return String(value || '').replace(/[\u0000-\u001F\u007F]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, maxLength);
}

function subscriberId(email) {
  return `newsletterSubscriber-${createHash('sha256').update(email).digest('hex').slice(0, 32)}`;
}

function getWriteToken() {
  return process.env.SANITY_WRITE_TOKEN || process.env.SANITY_API_WRITE_TOKEN;
}

function getClient() {
  return createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'kfysb6ye',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2026-08-14',
    useCdn: false,
    token: getWriteToken(),
  });
}

function emailAddress(value) {
  const match = String(value || '').match(/<([^>]+)>/);
  return clean(match?.[1] || value, 254);
}

function senderFrom(name, email) {
  const address = emailAddress(email);
  return name && !String(email || '').includes('<') ? `${name} <${address}>` : `${name || 'Bogeys2Birdies'} <${address}>`;
}

async function sendWelcomeEmail({ email, settings }) {
  if (!process.env.RESEND_API_KEY) return { sent: false, reason: 'missing_resend_api_key' };

  const fromEmail = process.env.NEWSLETTER_FROM_EMAIL || settings?.fromEmail;
  const replyToEmail = process.env.NEWSLETTER_REPLY_TO_EMAIL || settings?.replyToEmail || fromEmail;
  const fromName = settings?.fromName || 'Bogeys2Birdies';
  if (!fromEmail) return { sent: false, reason: 'missing_from_email' };

  let response;
  try {
    response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: senderFrom(fromName, fromEmail),
        to: [email],
        reply_to: emailAddress(replyToEmail) || undefined,
        subject: 'You are on the Bogeys2Birdies list',
        html: [
          '<!doctype html><html><body style="margin:0;background:#fbfaf6;color:#111713;font-family:Arial,sans-serif;line-height:1.55;">',
          '<main style="max-width:620px;margin:0 auto;padding:32px 20px;">',
          '<h1 style="font-size:32px;line-height:1.05;margin:0 0 20px;">Welcome to Bogeys2Birdies</h1>',
          '<p>You are on the list. I will send useful golf lessons, experiments and progress notes when there is something worth sharing.</p>',
          '<p>No spam. No miracle swing tips. You can unsubscribe whenever you like.</p>',
          '<p>Thanks for following the project.</p>',
          '</main></body></html>',
        ].join(''),
        text: [
          'Welcome to Bogeys2Birdies.',
          '',
          'You are on the list. I will send useful golf lessons, experiments and progress notes when there is something worth sharing.',
          '',
          'No spam. No miracle swing tips. You can unsubscribe whenever you like.',
          '',
          'Thanks for following the project.',
        ].join('\n'),
      }),
    });
  } catch (error) {
    return { sent: false, reason: 'resend_request_failed', detail: error.message };
  }

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    return { sent: false, reason: 'resend_rejected', status: response.status, detail: errorText };
  }
  return { sent: true };
}

export async function POST(request) {
  const origin = request.headers.get('origin');
  try {
    if (!origin || !allowedHosts.has(new URL(origin).hostname)) return json({ error: 'Invalid request origin.' }, 403);
  } catch {
    return json({ error: 'Invalid request origin.' }, 403);
  }

  if (!request.headers.get('content-type')?.startsWith('application/json')) return json({ error: 'Invalid content type.' }, 415);
  if (!getWriteToken()) return json({ error: 'Newsletter signup is temporarily unavailable.' }, 503);

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  const now = Date.now();
  const recent = (rateLimits.get(ip) || []).filter((time) => now - time < windowMs);
  if (recent.length >= maxSubmissions) return json({ error: 'Too many signup attempts. Please try again later.' }, 429);

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid request body.' }, 400);
  }

  if (body.website) return json({ ok: true }, 202);

  const email = clean(body.email, 254).toLowerCase();
  const consentText = clean(body.consentText, 500);
  const source = clean(body.source || 'website', 80);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ error: 'Please enter a valid email address.' }, 400);
  if (body.consent !== true) return json({ error: 'Please confirm you are happy to receive the newsletter.' }, 400);

  recent.push(now);
  rateLimits.set(ip, recent);

  const timestamp = new Date().toISOString();
  const client = getClient();
  await client.createOrReplace({
    _id: subscriberId(email),
    _type: 'newsletterSubscriber',
    email,
    status: 'active',
    source,
    consentText,
    consentedAt: timestamp,
    unsubscribedAt: null,
    updatedAt: timestamp,
    createdAt: timestamp,
  });

  let welcomeEmail = { sent: false, reason: 'not_attempted' };
  try {
    const settings = await client.fetch('*[_id == "newsletterSettings"][0]{fromName,fromEmail,replyToEmail}');
    welcomeEmail = await sendWelcomeEmail({ email, settings });
  } catch (error) {
    welcomeEmail = { sent: false, reason: 'welcome_email_error', detail: error.message };
  }

  if (!welcomeEmail.sent) {
    console.error('Newsletter welcome email was not sent.', {
      reason: welcomeEmail.reason,
      status: welcomeEmail.status,
      detail: welcomeEmail.detail,
    });
  }

  return json({ ok: true, welcomeEmailSent: welcomeEmail.sent, welcomeEmailStatus: welcomeEmail.reason }, 202);
}
