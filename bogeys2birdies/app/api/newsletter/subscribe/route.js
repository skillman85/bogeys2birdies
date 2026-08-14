import { createHash, createHmac } from 'node:crypto';
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

function escapeHtml(value) {
  return String(value || '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[char]);
}

function escapeAttribute(value) {
  return escapeHtml(value);
}

function subscriberId(email) {
  return `newsletterSubscriber-${createHash('sha256').update(email).digest('hex').slice(0, 32)}`;
}

function siteUrl() {
  const rawUrl = process.env.NEWSLETTER_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL || 'https://www.bogeys2birdies.co.uk';
  const withProtocol = /^https?:\/\//i.test(rawUrl) ? rawUrl : `https://${rawUrl}`;
  return withProtocol.replace(/\/+$/, '');
}

function unsubscribeSecret() {
  return process.env.NEWSLETTER_UNSUBSCRIBE_SECRET || process.env.NEWSLETTER_SEND_TOKEN || getWriteToken() || 'bogeys2birdies-newsletter';
}

function unsubscribeToken(email) {
  return createHmac('sha256', unsubscribeSecret()).update(email).digest('hex').slice(0, 32);
}

function unsubscribeUrl(email) {
  const params = new URLSearchParams({ email, token: unsubscribeToken(email) });
  return `${siteUrl()}/api/newsletter/unsubscribe?${params.toString()}`;
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

function welcomeEmailHtml({ email, unsubscribeLink }) {
  const baseUrl = siteUrl();
  const logoUrl = `${baseUrl}/bogeys2birdies-logo.png`;
  const journalUrl = `${baseUrl}/journal`;
  const privacyUrl = `${baseUrl}/privacy-policy`;
  return [
    '<!doctype html>',
    '<html>',
    '<body style="margin:0;background:#f4f1e6;color:#111713;font-family:Arial,Helvetica,sans-serif;line-height:1.55;">',
    '<div style="display:none;max-height:0;overflow:hidden;color:transparent;">Welcome to Bogeys2Birdies. Your first B2B Dispatch is confirmed.</div>',
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f1e6;margin:0;padding:28px 14px;">',
    '<tr><td align="center">',
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:660px;background:#fffdf6;border:1px solid #ded8c8;">',
    '<tr><td style="padding:28px 28px 18px;border-bottom:1px solid #e3ddcf;">',
    '<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 20px;"><tr>',
    `<td style="vertical-align:middle;padding:0 14px 0 0;"><img src="${escapeAttribute(logoUrl)}" width="132" height="132" alt="Bogeys2Birdies logo" style="display:block;width:132px;height:132px;object-fit:contain;border:0;outline:none;text-decoration:none;"></td>`,
    '<td style="vertical-align:middle;"><p style="margin:0;font-size:22px;line-height:1.05;font-weight:800;letter-spacing:-.6px;color:#111713;">Bogeys2Birdies</p><p style="margin:6px 0 0;font-size:12px;letter-spacing:2.2px;text-transform:uppercase;color:#31683c;font-weight:700;">B2B Dispatch</p></td>',
    '</tr></table>',
    '<h1 style="margin:0;font-size:40px;line-height:1.02;letter-spacing:-1.5px;color:#111713;">You are on the list.</h1>',
    '</td></tr>',
    '<tr><td style="padding:30px 28px 10px;">',
    '<p style="margin:0 0 18px;font-size:18px;color:#1b241d;">Thanks for joining Bogeys2Birdies. I will send useful golf lessons, testing notes and progress updates when there is something worth sharing.</p>',
    '<p style="margin:0 0 24px;font-size:16px;color:#49524b;">No tour gossip. No miracle swing tips. Just honest findings from the project, written for golfers trying to get a little better without making the game feel like homework.</p>',
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#d7eb45;margin:24px 0;">',
    '<tr><td style="padding:22px 24px;">',
    '<p style="margin:0 0 6px;font-size:12px;letter-spacing:1.8px;text-transform:uppercase;font-weight:700;color:#111713;">What to expect</p>',
    '<p style="margin:0;font-size:17px;color:#111713;">One useful golf lesson, experiment or review. Free. Unsubscribe whenever you like.</p>',
    '</td></tr>',
    '</table>',
    '<p style="margin:0 0 22px;font-size:16px;color:#49524b;">You signed up using this email address:</p>',
    `<p style="margin:0 0 26px;font-size:15px;color:#111713;font-weight:700;">${escapeHtml(email)}</p>`,
    `<a href="${escapeAttribute(journalUrl)}" target="_blank" rel="noopener noreferrer" style="display:inline-block;background:#111713;color:#ffffff;text-decoration:none;padding:14px 18px;font-weight:700;font-size:14px;">Read the latest articles</a>`,
    '</td></tr>',
    '<tr><td style="padding:26px 28px 30px;border-top:1px solid #e3ddcf;background:#fbfaf6;">',
    '<p style="margin:0 0 12px;font-size:12px;color:#66736a;">You are receiving this because you subscribed to the Bogeys2Birdies newsletter. We use your email address only to send the newsletter and related Bogeys2Birdies updates. You can withdraw consent at any time.</p>',
    `<p style="margin:0 0 12px;font-size:12px;color:#66736a;"><a href="${escapeAttribute(unsubscribeLink)}" target="_blank" rel="noopener noreferrer" style="color:#31683c;text-decoration:underline;">Unsubscribe from Bogeys2Birdies emails</a> or reply to this email for help. Read the <a href="${escapeAttribute(privacyUrl)}" target="_blank" rel="noopener noreferrer" style="color:#31683c;text-decoration:underline;">privacy policy</a>.</p>`,
    `<p style="margin:0 0 12px;font-size:11px;color:#66736a;word-break:break-all;">If a button or link does not open, copy and paste this unsubscribe URL into your browser:<br>${escapeHtml(unsubscribeLink)}</p>`,
    '<p style="margin:0;font-size:12px;color:#66736a;">Bogeys2Birdies, United Kingdom. Contact: <a href="mailto:hello@bogeys2birdies.co.uk" style="color:#31683c;text-decoration:underline;">hello@bogeys2birdies.co.uk</a></p>',
    '</td></tr>',
    '</table>',
    '</td></tr>',
    '</table>',
    '</body>',
    '</html>',
  ].join('');
}

function welcomeEmailText({ email, unsubscribeLink }) {
  const baseUrl = siteUrl();
  return [
    'Welcome to Bogeys2Birdies.',
    '',
    'You are on the list. I will send useful golf lessons, testing notes and progress updates when there is something worth sharing.',
    '',
    'No tour gossip. No miracle swing tips. Just honest findings from the project.',
    '',
    `Subscribed email: ${email}`,
    '',
    `Read the latest articles: ${baseUrl}/journal`,
    '',
    'You are receiving this because you subscribed to the Bogeys2Birdies newsletter. We use your email address only to send the newsletter and related Bogeys2Birdies updates. You can withdraw consent at any time.',
    '',
    `Unsubscribe: ${unsubscribeLink}`,
    `Privacy policy: ${baseUrl}/privacy-policy`,
    'Contact: hello@bogeys2birdies.co.uk',
    'Bogeys2Birdies, United Kingdom.',
  ].join('\n');
}

async function sendWelcomeEmail({ email, settings }) {
  if (!process.env.RESEND_API_KEY) return { sent: false, reason: 'missing_resend_api_key' };

  const fromEmail = process.env.NEWSLETTER_FROM_EMAIL || settings?.fromEmail;
  const replyToEmail = process.env.NEWSLETTER_REPLY_TO_EMAIL || settings?.replyToEmail || fromEmail;
  const fromName = settings?.fromName || 'Bogeys2Birdies';
  if (!fromEmail) return { sent: false, reason: 'missing_from_email' };
  const unsubscribeLink = unsubscribeUrl(email);

  let response;
  try {
    response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: senderFrom(fromName, fromEmail),
        to: [email],
        reply_to: emailAddress(replyToEmail) || undefined,
        headers: {
          'List-Unsubscribe': `<${unsubscribeLink}>`,
          'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
        },
        subject: 'You are on the Bogeys2Birdies list',
        html: welcomeEmailHtml({ email, unsubscribeLink }),
        text: welcomeEmailText({ email, unsubscribeLink }),
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
