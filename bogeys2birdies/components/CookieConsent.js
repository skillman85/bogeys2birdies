'use client';

import { useEffect, useState } from 'react';

const storageKey = 'b2b-cookie-consent-v1';

function saveConsent(preferences) {
  localStorage.setItem(storageKey, JSON.stringify({ ...preferences, savedAt: new Date().toISOString() }));
  window.dispatchEvent(new CustomEvent('b2b-cookie-consent', { detail: preferences }));
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [manageOpen, setManageOpen] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    setVisible(!localStorage.getItem(storageKey));
  }, []);

  if (!visible) return null;

  function acceptAll() {
    saveConsent({ essential: true, analytics: true, marketing: true });
    setVisible(false);
  }

  function rejectOptional() {
    saveConsent({ essential: true, analytics: false, marketing: false });
    setVisible(false);
  }

  function saveChoices() {
    saveConsent({ essential: true, analytics, marketing });
    setVisible(false);
  }

  return (
    <section className="cookie-banner" aria-label="Cookie choices">
      <div>
        <strong>Cookie choices</strong>
        <p>We use essential storage to keep the site working. With your permission, we may also use analytics or marketing cookies to understand what readers enjoy and improve Bogeys2Birdies.</p>
        {manageOpen && (
          <div className="cookie-options">
            <label><input type="checkbox" checked readOnly /> Essential cookies</label>
            <label><input type="checkbox" checked={analytics} onChange={(event) => setAnalytics(event.target.checked)} /> Analytics cookies</label>
            <label><input type="checkbox" checked={marketing} onChange={(event) => setMarketing(event.target.checked)} /> Marketing cookies</label>
          </div>
        )}
      </div>
      <div className="cookie-actions">
        <button type="button" onClick={acceptAll}>Accept all</button>
        <button type="button" onClick={rejectOptional}>Reject non-essential</button>
        {manageOpen ? <button type="button" onClick={saveChoices}>Save choices</button> : <button type="button" onClick={() => setManageOpen(true)}>Manage choices</button>}
      </div>
    </section>
  );
}
