import { useMemo, useState } from 'react';
import { Button, Card, Flex, Stack, Text, TextInput } from '@sanity/ui';
import { useFormValue } from 'sanity';

const TOKEN_STORAGE_KEY = 'bogeys2birdies.newsletterSendToken';

function currentDocumentId(document) {
  return String(document?._id || '');
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

export function NewsletterSendPanel() {
  const document = useFormValue([]);
  const [token, setToken] = useState(() => (typeof window === 'undefined' ? '' : window.localStorage.getItem(TOKEN_STORAGE_KEY) || ''));
  const [testRecipient, setTestRecipient] = useState('');
  const [working, setWorking] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const id = currentDocumentId(document);
  const alreadySent = document?.status === 'sent';
  const canSend = useMemo(() => Boolean(id && document?.subject && document?.heading && hasBody(document) && !alreadySent), [alreadySent, document, id]);

  function rememberToken(nextToken) {
    setToken(nextToken);
    if (typeof window !== 'undefined') window.localStorage.setItem(TOKEN_STORAGE_KEY, nextToken);
  }

  async function handleSend(testOnly) {
    setMessage('');
    setError('');
    if (!token.trim()) {
      setError('Add your newsletter send token first.');
      return;
    }
    if (testOnly && !testRecipient.trim()) {
      setError('Add a test email address first.');
      return;
    }
    if (!testOnly && !window.confirm('Send this newsletter to all active subscribers now?')) return;

    setWorking(true);
    try {
      const result = await sendNewsletter({
        id,
        token: token.trim(),
        testOnly,
        testRecipient: testRecipient.trim(),
      });
      setMessage(testOnly ? `Test sent to ${testRecipient.trim()}.` : `Newsletter sent to ${result.sentCount} subscriber${result.sentCount === 1 ? '' : 's'}.`);
    } catch (sendError) {
      setError(sendError.message);
    } finally {
      setWorking(false);
    }
  }

  return (
    <Card padding={4} radius={3} border tone="primary">
      <Stack space={4}>
        <Stack space={2}>
          <Text weight="semibold">Send newsletter</Text>
          <Text size={1} muted>
            Fill in the email subject, header, sub heading and body, then send a test or send to all active subscribers.
          </Text>
        </Stack>

        <Stack space={2}>
          <Text size={1} weight="medium">Newsletter send token</Text>
          <TextInput
            type="password"
            placeholder="Paste NEWSLETTER_SEND_TOKEN"
            value={token}
            onChange={(event) => rememberToken(event.currentTarget.value)}
          />
        </Stack>

        <Stack space={2}>
          <Text size={1} weight="medium">Test recipient</Text>
          <Flex gap={2}>
            <TextInput
              type="email"
              placeholder="you@example.com"
              value={testRecipient}
              onChange={(event) => setTestRecipient(event.currentTarget.value)}
            />
            <Button text="Send test" tone="primary" mode="ghost" disabled={working || !canSend} onClick={() => handleSend(true)} />
          </Flex>
        </Stack>

        <Button text={working ? 'Sending...' : 'Send to all subscribers'} tone="critical" disabled={working || !canSend} onClick={() => handleSend(false)} />

        {!canSend && (
          <Text size={1} muted>
            {alreadySent ? 'This campaign has already been sent.' : 'Add an email subject, header and body before sending. Save the campaign if you have just created it.'}
          </Text>
        )}
        {message && <Text size={1} style={{ color: '#0b6b3a' }}>{message}</Text>}
        {error && <Text size={1} style={{ color: '#b42318' }}>{error}</Text>}
      </Stack>
    </Card>
  );
}
