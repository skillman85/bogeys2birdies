'use client';
import Link from 'next/link';
import { useState } from 'react';

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <div className="nav-shell">
        <Link className="brand" href="/" aria-label="Bogeys2Birdies home">
          <span>BOGEYS</span><strong>2</strong><span>BIRDIES</span>
        </Link>
        <nav className={open ? 'nav-links open' : 'nav-links'}>
          <Link href="/project">Project</Link>
          <Link href="/experiments">Experiments</Link>
          <Link href="/journal">Journal</Link>
          <Link href="/gear">Gear</Link>
          <Link href="/data">Data</Link>
        </nav>
        <button className="menu-btn" aria-label="Toggle menu" onClick={() => setOpen(!open)}>{open ? 'Close' : 'Menu'}</button>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div>
        <div className="brand footer-brand"><span>BOGEYS</span><strong>2</strong><span>BIRDIES</span></div>
        <p>Real golf. Real progress.</p>
      </div>
      <div className="footer-links">
        <Link href="/project">The Project</Link><Link href="/experiments">Experiments</Link><Link href="/data">The Numbers</Link>
      </div>
      <p className="copyright">© 2026 Bogeys2Birdies</p>
    </footer>
  );
}

export function Page({ children }) {
  return <><Header />{children}<Footer /></>;
}
