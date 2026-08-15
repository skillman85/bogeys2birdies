'use client';
import Link from 'next/link';
import { useState } from 'react';
import { cmsResponsiveStyle } from './cmsTextStyle';

function InstagramIcon() {
  return (
    <svg className="instagram-icon" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1.2" />
    </svg>
  );
}

export function Header({ settings = {} }) {
  const [open, setOpen] = useState(false);
  const instagramUrl = settings.instagramUrl || 'https://www.instagram.com/bogeys2birdie/';
  const navStyle = cmsResponsiveStyle(settings.navStyle);
  return (
    <header className="site-header">
      <div className="nav-shell">
        <Link className="brand cms-text" href="/" aria-label="Bogeys2Birdies home" style={cmsResponsiveStyle(settings.brandStyle)}>
          <img className="brand-logo" src="/bogeys2birdies-logo.png" alt="Bogeys2Birdies" />
        </Link>
        <nav className={open ? 'nav-links open' : 'nav-links'} style={navStyle}>
          <Link href="/project">Project</Link>
          <Link href="/experiments">Experiments</Link>
          <Link href="/journal">Journal</Link>
          <Link href="/gear">Gear</Link>
          <Link href="/data">Data</Link>
          <a className="instagram-nav-link" href={instagramUrl} target="_blank" rel="noreferrer noopener" aria-label="Follow me on Instagram">
            <InstagramIcon />
          </a>
        </nav>
        <button className="menu-btn" aria-label="Toggle menu" onClick={() => setOpen(!open)}>{open ? 'Close' : 'Menu'}</button>
      </div>
    </header>
  );
}

export function Footer({ settings = {} }) {
  const instagramUrl = settings.instagramUrl || 'https://www.instagram.com/bogeys2birdie/';
  const footerTextStyle = cmsResponsiveStyle(settings.footerTextStyle);
  return (
    <footer className="footer">
      <div>
        <div className="brand footer-brand cms-text" style={cmsResponsiveStyle(settings.brandStyle)}><img className="brand-logo" src="/bogeys2birdies-logo.png" alt="Bogeys2Birdies" /></div>
        <p className="cms-text" style={footerTextStyle}>{settings.footerTagline || 'Real golf. Real progress.'}</p>
        <a className="instagram-footer-link footer-social-link cms-text" href={instagramUrl} target="_blank" rel="noreferrer noopener" style={footerTextStyle}><InstagramIcon /> Follow me on Instagram</a>
      </div>
      <div className="footer-links cms-text" style={footerTextStyle}>
        <Link href="/project">The Project</Link><Link href="/experiments">Experiments</Link><Link href="/data">The Numbers</Link><Link href="/privacy-policy">Privacy</Link><Link href="/cookie-policy">Cookies</Link><Link href="/terms-and-conditions">Terms</Link><Link href="/disclaimer">Disclaimer</Link>
      </div>
      <p className="copyright cms-text" style={footerTextStyle}>{settings.copyright || '© 2026 Bogeys2Birdies'}</p>
    </footer>
  );
}

export function Page({ children, siteSettings }) {
  return <><Header settings={siteSettings} />{children}<Footer settings={siteSettings} /></>;
}
