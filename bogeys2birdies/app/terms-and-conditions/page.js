import { Page } from '../../components/SiteChrome';
import { Eyebrow } from '../../components/UI';
import { defaultSiteSettings } from '../../content/defaults';
import { getSiteSettings } from '../../sanity/lib/content';

export const metadata = {
  title: 'Terms and Conditions | Bogeys2Birdies',
  description: 'The terms for using the Bogeys2Birdies website.',
};

export default async function TermsAndConditions() {
  const site = await getSiteSettings(defaultSiteSettings);
  return (
    <Page siteSettings={site}>
      <main className="inner-page legal-page">
        <section className="page-hero">
          <Eyebrow>Legal</Eyebrow>
          <h1>Terms and Conditions</h1>
          <p>Last updated: 14 August 2026</p>
        </section>
        <section className="section-shell legal-copy">
          <h2>Using This Website</h2>
          <p>By using Bogeys2Birdies, you agree to use the website lawfully and respectfully. You must not attempt to interfere with the site, misuse forms or submit harmful content.</p>
          <h2>Content</h2>
          <p>Articles, experiments, reviews and data are provided for general information and entertainment. Golf results vary by player, course, equipment and conditions.</p>
          <h2>Comments</h2>
          <p>We may moderate, edit or remove comments that are abusive, spammy, unlawful, misleading or off-topic. We do not have to publish every submitted comment.</p>
          <h2>Intellectual Property</h2>
          <p>Unless stated otherwise, the site content, branding, writing, images and layout belong to Bogeys2Birdies or are used under licence. You may link to our content, but you must not republish substantial parts without permission.</p>
          <h2>External Links</h2>
          <p>We may link to third-party websites or social media accounts. We are not responsible for their content, security, privacy practices or availability.</p>
          <h2>Liability</h2>
          <p>We work to keep the site accurate and available, but we do not guarantee that it will always be error-free, uninterrupted or suitable for your particular purpose. Nothing in these terms excludes liability that cannot be excluded under applicable law.</p>
          <h2>Changes</h2>
          <p>We may update these terms from time to time. The date at the top shows the latest version.</p>
        </section>
      </main>
    </Page>
  );
}
