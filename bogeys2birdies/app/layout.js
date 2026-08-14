import './globals.css';
import { defaultSiteSettings } from '../content/defaults';
import { getSiteSettings } from '../sanity/lib/content';

export async function generateMetadata() {
  const settings = await getSiteSettings(defaultSiteSettings);
  return {
    title: settings.defaultSeo?.metaTitle || settings.siteTitle,
    description: settings.defaultSeo?.metaDescription || settings.siteDescription,
  };
}

export default function RootLayout({ children }) {
  return (
    <html lang="en-GB">
      <body>{children}</body>
    </html>
  );
}
