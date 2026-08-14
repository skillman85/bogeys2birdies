import { Page } from '../../components/SiteChrome';
import { Eyebrow } from '../../components/UI';
import { defaultSiteSettings } from '../../content/defaults';
import { getSiteSettings } from '../../sanity/lib/content';

export const metadata = {
  title: 'Disclaimer | Bogeys2Birdies',
  description: 'Important disclaimers for Bogeys2Birdies content, golf advice, reviews and links.',
};

export default async function Disclaimer() {
  const site = await getSiteSettings(defaultSiteSettings);
  return (
    <Page siteSettings={site}>
      <main className="inner-page legal-page">
        <section className="page-hero">
          <Eyebrow>Legal</Eyebrow>
          <h1>Disclaimer</h1>
          <p>Last updated: 14 August 2026</p>
        </section>
        <section className="section-shell legal-copy">
          <h2>General Information</h2>
          <p>Bogeys2Birdies shares personal golf experiments, opinions, stats and reviews. It is not professional coaching, medical, financial or legal advice.</p>
          <h2>Golf Practice and Fitness</h2>
          <p>Use your judgement before changing your practice, swing, fitness routine or equipment. Stop if something causes pain or feels unsafe, and seek professional advice where needed.</p>
          <h2>Reviews and Commercial Links</h2>
          <p>Reviews are based on real-world use and opinion. If affiliate links, gifted products or sponsored placements are used, we will aim to disclose that clearly near the relevant content.</p>
          <h2>Accuracy</h2>
          <p>We try to keep stats and recommendations accurate at the time of publication, but golf data, products, prices and services can change.</p>
        </section>
      </main>
    </Page>
  );
}
