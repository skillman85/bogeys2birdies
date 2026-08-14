import { Page } from '../../components/SiteChrome';
import { Eyebrow } from '../../components/UI';
import { defaultSiteSettings } from '../../content/defaults';
import { getSiteSettings } from '../../sanity/lib/content';

export const metadata = {
  title: 'Privacy Policy | Bogeys2Birdies',
  description: 'How Bogeys2Birdies collects, uses and protects reader data.',
};

export default async function PrivacyPolicy() {
  const site = await getSiteSettings(defaultSiteSettings);
  return (
    <Page siteSettings={site}>
      <main className="inner-page legal-page">
        <section className="page-hero">
          <Eyebrow>Legal</Eyebrow>
          <h1>Privacy Policy</h1>
          <p>Last updated: 14 August 2026</p>
        </section>
        <section className="section-shell legal-copy">
          <p>Bogeys2Birdies is a golf content website. This policy explains what personal information we collect, why we use it, how long we keep it and the choices you have.</p>
          <h2>Who We Are</h2>
          <p>The data controller for this website is Bogeys2Birdies. You can contact us at <a href="mailto:hello@bogeys2birdies.co.uk">hello@bogeys2birdies.co.uk</a>.</p>
          <h2>What We Collect</h2>
          <p>We may collect your email address when you sign up to the newsletter, your name and comment text when you leave a comment, technical information such as IP address and browser details for security, and cookie preference information.</p>
          <h2>Why We Use It</h2>
          <p>We use newsletter details to send updates you asked for. We use comments to publish and moderate reader discussion. We use technical information to keep the website secure, diagnose faults and prevent spam or abuse.</p>
          <h2>Our Lawful Bases</h2>
          <p>For newsletter emails and non-essential cookies, we rely on consent. For site security, moderation and basic administration, we rely on legitimate interests. You can withdraw consent at any time.</p>
          <h2>Who We Share Data With</h2>
          <p>We use trusted service providers to run the site, including hosting, CMS and email delivery providers such as Vercel, Sanity and Resend where configured. They process data only as needed to provide those services.</p>
          <h2>How Long We Keep Data</h2>
          <p>Newsletter records are kept until you unsubscribe or ask us to delete them. Comments may remain while the article remains published unless you ask us to remove your personal data. Security logs are kept only for as long as needed for protection and troubleshooting.</p>
          <h2>Your Rights</h2>
          <p>Under UK data protection law, you may have rights to access, correct, delete, restrict or object to how we use your personal data. You can also withdraw consent where processing is based on consent.</p>
          <h2>Complaints</h2>
          <p>Please contact us first if you have a concern. You also have the right to complain to the Information Commissioner’s Office at <a href="https://ico.org.uk/" target="_blank" rel="noreferrer noopener">ico.org.uk</a>.</p>
          <h2>Changes</h2>
          <p>We may update this policy when the website, newsletter or legal requirements change. The date at the top shows the latest version.</p>
        </section>
      </main>
    </Page>
  );
}
