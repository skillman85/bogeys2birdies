import { useState } from 'react';

const TOKEN_STORAGE_KEY = 'bogeys2birdies.newsletterSendToken';

function campaignId(props) {
  return props.draft?._id || props.published?._id || props.id;
}

function hasBody(document) {
  return Array.isArray(document?.body) && document.body.length > 0;
}

async function sendNewsletter({ id, token, testOnly, testRecipient }) {
  const response = await fetch('/api/newsletter/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ campaignId: id, testOnly, testRecipient }),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || `Newsletter send failed with status ${response.status}.`);
  return payload;
}

function getSendToken() {
  const existing = window.localStorage.getItem(TOKEN_STORAGE_KEY) || '';
  const token = window.prompt('Newsletter send token', existing);
  if (!token) return null;
  window.localStorage.setItem(TOKEN_STORAGE_KEY, token.trim());
  return token.trim();
}

export function createNewsletterTestSendAction() {
  return function NewsletterTestSendAction(props) {
    const [working, setWorking] = useState(false);
    const document = props.draft || props.published;
    const ready = Boolean(document?.subject && hasBody(document));
    return {
      label: working ? 'Sending test...' : 'Send newsletter test',
      title: ready ? 'Send this campaign to one test email address' : 'Add a subject and email body first',
      disabled: working || !ready,
      onHandle: async () => {
        const testRecipient = window.prompt('Send test to which email address?');
        if (!testRecipient) return;
        const token = getSendToken();
        if (!token) return;
        setWorking(true);
        try {
          const result = await sendNewsletter({ id: campaignId(props), token, testOnly: true, testRecipient });
          window.alert(`Test sent to ${testRecipient}.`);
          props.onComplete();
          return result;
        } catch (error) {
          window.alert(`Could not send test: ${error.message}`);
        } finally {
          setWorking(false);
        }
      },
    };
  };
}

export function createNewsletterSendAction() {
  return function NewsletterSendAction(props) {
    const [working, setWorking] = useState(false);
    const document = props.draft || props.published;
    const isReady = document?.status === 'ready';
    const ready = Boolean(document?.subject && hasBody(document) && isReady);
    return {
      label: working ? 'Sending newsletter...' : 'Send to subscribers',
      title: isReady ? 'Send this campaign to all active subscribers' : 'Set status to Ready to send first',
      tone: 'critical',
      disabled: working || !ready,
      onHandle: async () => {
        const confirmed = window.confirm('Send this campaign to all active subscribers now? This cannot be undone.');
        if (!confirmed) return;
        const token = getSendToken();
        if (!token) return;
        setWorking(true);
        try {
          const result = await sendNewsletter({ id: campaignId(props), token, testOnly: false });
          window.alert(`Newsletter sent to ${result.sentCount} subscriber${result.sentCount === 1 ? '' : 's'}.`);
          props.onComplete();
          return result;
        } catch (error) {
          window.alert(`Could not send newsletter: ${error.message}`);
        } finally {
          setWorking(false);
        }
      },
    };
  };
}
