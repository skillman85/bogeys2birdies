import { createHash, createHmac } from 'node:crypto';
import { createClient } from '@sanity/client';

function html(body, status = 200) {
  return new Response(body, {
    status,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
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

function unsubscribeSecret() {
  return process.env.NEWSLETTER_UNSUBSCRIBE_SECRET || process.env.NEWSLETTER_SEND_TOKEN || getWriteToken() || 'bogeys2birdies-newsletter';
}

function unsubscribeToken(email) {
  return createHmac('sha256', unsubscribeSecret()).update(email).digest('hex').slice(0, 32);
}

function page({ title, message }) {
  return [
    '<!doctype html>',
    '<html lang="en">',
    '<head>',
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width,initial-scale=1">',
    `<title>${title} | Bogeys2Birdies</title>`,
    '</head>',
    '<body style="margin:0;background:#f4f1e6;color:#111713;font-family:Arial,Helvetica,sans-serif;line-height:1.55;">',
    '<main style="max-width:680px;margin:0 auto;padding:64px 22px;">',
    '<img src="/bogeys2birdies-logo.png" alt="Bogeys2Birdies" width="96" height="96" style="display:block;width:96px;height:96px;object-fit:contain;margin:0 0 26px;">',
    `<h1 style="font-size:46px;line-height:1;margin:0 0 18px;letter-spacing:-1.5px;">${title}</h1>`,
    `<p style="font-size:18px;margin:0 0 28px;color:#49524b;">${message}</p>`,
    '<a href="/" style="display:inline-block;background:#111713;color:#fff;text-decoration:none;padding:14px 18px;font-weight:700;">Back to Bogeys2Birdies</a>',
    '</main>',
    '</body>',
    '</html>',
  ].join('');
}

async function unsubscribe(request) {
  if (!getWriteToken()) return html(page({ title: 'Could not unsubscribe', message: 'Newsletter management is temporarily unavailable. Please email hello@bogeys2birdies.co.uk and I will remove you manually.' }), 503);

  const url = new URL(request.url);
  const email = clean(url.searchParams.get('email'), 254).toLowerCase();
  const token = clean(url.searchParams.get('token'), 80);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || token !== unsubscribeToken(email)) {
    return html(page({ title: 'Invalid unsubscribe link', message: 'This unsubscribe link is invalid or has expired. Please email hello@bogeys2birdies.co.uk and I will help.' }), 400);
  }

  const timestamp = new Date().toISOString();
  await getClient().patch(subscriberId(email)).set({
    status: 'unsubscribed',
    unsubscribedAt: timestamp,
    updatedAt: timestamp,
  }).commit({ autoGenerateArrayKeys: true });

  return html(page({ title: 'You are unsubscribed', message: 'You have been removed from Bogeys2Birdies newsletter emails. You can still read everything on the website whenever you like.' }));
}

export async function GET(request) {
  return unsubscribe(request);
}

export async function POST(request) {
  return unsubscribe(request);
}
