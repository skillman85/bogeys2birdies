import { Page } from '../../components/SiteChrome';
import { Eyebrow } from '../../components/UI';
import { defaultSiteSettings } from '../../content/defaults';
import { getSiteSettings } from '../../sanity/lib/content';

export const metadata = {
  title: 'Cookie Policy | Bogeys2Birdies',
  description: 'How Bogeys2Birdies uses cookies and similar technologies.',
};

export default async function CookiePolicy() {
  const site = await getSiteSettings(defaultSiteSettings);
  return (
    <Page siteSettings={site}>
      <main className="inner-page legal-page">
        <section className="page-hero">
          <Eyebrow>Legal</Eyebrow>
          <h1>Cookie Policy</h1>
          <p>Last updated: 14 August 2026</p>
        </section>
        <section className="section-shell legal-copy">
          <p>This policy explains how Bogeys2Birdies uses cookies, local storage and similar technologies.</p>
          <h2>Essential Storage</h2>
          <p>We use essential storage to remember your cookie choices and keep the website working. These are necessary for the service you request and do not require consent.</p>
          <h2>Analytics Cookies</h2>
          <p>If analytics tools are added, they will only run after you choose to allow analytics cookies. These help us understand which articles are useful and how the site is performing.</p>
          <h2>Marketing Cookies</h2>
          <p>If marketing or advertising tools are added, they will only run after you choose to allow marketing cookies.</p>
          <h2>Your Choices</h2>
          <p>You can accept all cookies, reject non-essential cookies, or manage individual choices in the cookie banner. You can change your choice by clearing this site’s local storage in your browser and revisiting the website.</p>
          <h2>Third Parties</h2>
          <p>Some future features may use third-party services. Where those services set non-essential cookies or access information on your device, they should only do so after you consent.</p>
          <h2>Contact</h2>
          <p>Questions about cookies can be sent to <a href="mailto:hello@bogeys2birdies.co.uk">hello@bogeys2birdies.co.uk</a>.</p>
        </section>
      </main>
    </Page>
  );
}
