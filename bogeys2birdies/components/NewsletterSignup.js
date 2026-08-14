'use client';

import { useState } from 'react';

export function NewsletterSignup({ settings = {} }) {
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState('');
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const consentText = settings.consentText || 'I agree to receive the Bogeys2Birdies newsletter and understand I can unsubscribe at any time.';

  async function onSubmit(event) {
    event.preventDefault();
    setStatus('submitting');
    setMessage('');
    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, consent, consentText, source: 'website-newsletter', website }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'Newsletter signup failed.');
      setEmail('');
      setConsent(false);
      setStatus('success');
      setMessage(settings.successMessage || 'You are on the list. Check your inbox for the next dispatch.');
    } catch (error) {
      setStatus('error');
      setMessage(error.message || 'Something went wrong. Please try again.');
    }
  }

  return (
    <form className="newsletter-form" onSubmit={onSubmit}>
      <label className="sr-only" htmlFor="newsletter-email">Email address</label>
      <div className="newsletter-row">
        <input id="newsletter-email" type="email" placeholder="Your email address" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
        <button type="submit" disabled={status === 'submitting'}>{status === 'submitting' ? 'Joining...' : 'Join the project'}</button>
      </div>
      <label className="newsletter-consent">
        <input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} required />
        <span>{consentText}</span>
      </label>
      <label className="newsletter-honeypot" aria-hidden="true">Website<input tabIndex="-1" autoComplete="off" value={website} onChange={(event) => setWebsite(event.target.value)} /></label>
      <small>Free. Unsubscribe whenever you like.</small>
      {message && <p className={`newsletter-status ${status}`}>{message}</p>}
    </form>
  );
}
