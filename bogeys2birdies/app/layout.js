import './globals.css';
import './custom-pages.css';
import { defaultSiteSettings } from '../content/defaults';
import { getSiteSettings } from '../sanity/lib/content';
import { CookieConsent } from '../components/CookieConsent';

export async function generateMetadata() {
  const settings = await getSiteSettings(defaultSiteSettings);
  return {
    metadataBase: new URL('https://bogeys2birdies.co.uk'),
    title: settings.defaultSeo?.metaTitle || settings.siteTitle,
    description: settings.defaultSeo?.metaDescription || settings.siteDescription,
    icons: { icon: '/bogeys2birdies-logo.png', apple: '/bogeys2birdies-logo.png' },
    openGraph: { images: ['/bogeys2birdies-logo.png'] },
  };
}

export default function RootLayout({ children }) {
  return (
    <html lang="en-GB">
      <body>{children}<CookieConsent /></body>
    </html>
  );
}
