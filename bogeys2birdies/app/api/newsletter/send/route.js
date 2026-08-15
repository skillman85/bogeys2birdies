import { createHmac } from 'node:crypto';
import { createClient } from '@sanity/client';

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

function escapeHtml(value) {
  return String(value || '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[char]);
}

function escapeAttribute(value) {
  return escapeHtml(value);
}

function emailAddress(value) {
  const match = String(value || '').match(/<([^>]+)>/);
  return clean(match?.[1] || value, 254);
}

function senderFrom(name, email) {
  return `${name || 'Bogeys2Birdies'} <${emailAddress(email)}>`;
}

function blockText(block) {
  return (block.children || []).map((child) => child.text || '').join('');
}

function portableTextToHtml(blocks = []) {
  return blocks.map((block) => {
    if (block._type !== 'block') return '';
    const text = escapeHtml(blockText(block));
    if (!text) return '';
    if (block.style === 'h2') return `<h2>${text}</h2>`;
    if (block.style === 'h3') return `<h3>${text}</h3>`;
    if (block.style === 'blockquote') return `<blockquote>${text}</blockquote>`;
    return `<p>${text}</p>`;
  }).filter(Boolean).join('\n');
}

function portableTextToText(blocks = []) {
  return blocks.map((block) => (block._type === 'block' ? blockText(block) : '')).filter(Boolean).join('\n\n');
}

function emailShell({ preheader, html, unsubscribeLink }) {
  const baseUrl = siteUrl();
  const logoUrl = `${baseUrl}/bogeys2birdies-logo.png`;
  const privacyUrl = `${baseUrl}/privacy-policy`;
  return [
    '<!doctype html><html><body style="margin:0;background:#f4f1e6;color:#111713;font-family:Arial,Helvetica,sans-serif;line-height:1.55;">',
    '<div style="display:none;max-height:0;overflow:hidden;color:transparent;">',
    escapeHtml(preheader),
    '</div>',
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f1e6;margin:0;padding:28px 14px;">',
    '<tr><td align="center">',
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:680px;background:#fffdf6;border:1px solid #ded8c8;">',
    '<tr><td style="padding:26px 28px;border-bottom:1px solid #e3ddcf;">',
    '<table role="presentation" cellpadding="0" cellspacing="0"><tr>',
    `<td style="vertical-align:middle;padding:0 14px 0 0;"><img src="${escapeAttribute(logoUrl)}" width="112" height="112" alt="Bogeys2Birdies logo" style="display:block;width:112px;height:112px;object-fit:contain;border:0;outline:none;text-decoration:none;"></td>`,
    '<td style="vertical-align:middle;"><p style="margin:0;font-size:21px;line-height:1.05;font-weight:800;letter-spacing:-.6px;color:#111713;">Bogeys2Birdies</p><p style="margin:6px 0 0;font-size:12px;letter-spacing:2.2px;text-transform:uppercase;color:#31683c;font-weight:700;">B2B Dispatch</p></td>',
    '</tr></table>',
    '</td></tr>',
    '<tr><td style="padding:30px 28px;color:#111713;">',
    html,
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
    '</body></html>',
  ].join('');
}

async function sendEmail({ from, replyTo, to, subject, preheader, html, text }) {
  const unsubscribeLink = unsubscribeUrl(to);
  const privacyLink = `${siteUrl()}/privacy-policy`;
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: emailAddress(replyTo) || undefined,
      headers: {
        'List-Unsubscribe': `<${unsubscribeLink}>`,
        'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
      },
      subject,
      html: emailShell({ preheader, html, unsubscribeLink }),
      text: [preheader, text, 'You are receiving this because you subscribed to Bogeys2Birdies. Reply to this email to manage your subscription.', `Unsubscribe: ${unsubscribeLink}`, `Privacy policy: ${privacyLink}`, 'Contact: hello@bogeys2birdies.co.uk', 'Bogeys2Birdies, United Kingdom.'].filter(Boolean).join('\n\n'),
    }),
  });
  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    throw new Error(`Resend failed with status ${response.status}${detail ? `: ${detail}` : ''}`);
  }
}

export async function POST(request) {
  const configuredToken = process.env.NEWSLETTER_SEND_TOKEN;
  const requestToken = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '') || request.headers.get('x-newsletter-send-token');
  if (!configuredToken || requestToken !== configuredToken) return json({ error: 'Unauthorized.' }, 401);
  if (!getWriteToken()) return json({ error: 'Sanity write token is not configured.' }, 503);
  if (!process.env.RESEND_API_KEY) return json({ error: 'RESEND_API_KEY is not configured.' }, 503);

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid request body.' }, 400);
  }

  const campaignId = clean(body.campaignId, 160);
  const testRecipient = clean(body.testRecipient, 254);
  const testOnly = body.testOnly === true;
  if (!campaignId) return json({ error: 'campaignId is required.' }, 400);
  if (testOnly && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(testRecipient)) return json({ error: 'A valid testRecipient is required for test sends.' }, 400);

  const client = getClient();
  const campaign = await client.fetch('*[_id == $campaignId && _type == "newsletterCampaign"][0]{_id,title,subject,preheader,body,status}', { campaignId });
  if (!campaign) return json({ error: 'Campaign not found.' }, 404);
  if (!testOnly && campaign.status !== 'ready') return json({ error: 'Campaign must be marked Ready to send before sending.' }, 409);

  const settings = await client.fetch('*[_id == "newsletterSettings"][0]{fromName,fromEmail,replyToEmail}');
  const fromEmail = process.env.NEWSLETTER_FROM_EMAIL || settings?.fromEmail;
  const replyToEmail = process.env.NEWSLETTER_REPLY_TO_EMAIL || settings?.replyToEmail || fromEmail;
  const fromName = settings?.fromName || 'Bogeys2Birdies';
  if (!fromEmail) return json({ error: 'NEWSLETTER_FROM_EMAIL or Newsletter settings sender email is required.' }, 503);

  const html = portableTextToHtml(campaign.body);
  const text = portableTextToText(campaign.body);
  const recipients = testOnly
    ? [{ _id: 'test', email: testRecipient }]
    : await client.fetch('*[_type == "newsletterSubscriber" && status == "active"]{_id,email}');

  if (!recipients.length) return json({ error: 'No recipients found.' }, 409);

  let sentCount = 0;
  try {
    for (const recipient of recipients) {
      await sendEmail({
        from: senderFrom(fromName, fromEmail),
        replyTo: replyToEmail,
        to: recipient.email,
        subject: campaign.subject,
        preheader: campaign.preheader,
        html,
        text,
      });
      sentCount += 1;
    }
  } catch (error) {
    if (!testOnly) await client.patch(campaign._id).set({ lastSendError: error.message }).commit();
    return json({ error: error.message, sentCount }, 502);
  }

  if (!testOnly) {
    const sentAt = new Date().toISOString();
    await client.patch(campaign._id).set({ status: 'sent', sentAt, sentCount, lastSendError: null }).commit();
    const transaction = client.transaction();
    for (const recipient of recipients) transaction.patch(recipient._id, (patch) => patch.set({ lastSentAt: sentAt }));
    await transaction.commit();
  }

  return json({ ok: true, sentCount, testOnly }, 202);
}
