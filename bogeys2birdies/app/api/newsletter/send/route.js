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

function escapeHtml(value) {
  return String(value || '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[char]);
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

async function sendEmail({ from, replyTo, to, subject, preheader, html, text }) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: replyTo || undefined,
      subject,
      html: [
        '<!doctype html><html><body style="margin:0;background:#fbfaf6;color:#111713;font-family:Arial,sans-serif;line-height:1.55;">',
        '<div style="display:none;max-height:0;overflow:hidden;">',
        escapeHtml(preheader),
        '</div>',
        '<main style="max-width:640px;margin:0 auto;padding:32px 20px;">',
        '<h1 style="font-size:34px;line-height:1.05;margin:0 0 24px;">Bogeys2Birdies</h1>',
        html,
        '<hr style="border:0;border-top:1px solid #ddd8c8;margin:32px 0;">',
        '<p style="font-size:12px;color:#66736a;">You are receiving this because you subscribed to Bogeys2Birdies. Reply to this email to manage your subscription.</p>',
        '</main></body></html>',
      ].join(''),
      text: [preheader, text, 'You are receiving this because you subscribed to Bogeys2Birdies. Reply to this email to manage your subscription.'].filter(Boolean).join('\n\n'),
    }),
  });
  if (!response.ok) throw new Error(`Resend failed with status ${response.status}.`);
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
        from: `${fromName} <${fromEmail}>`,
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
