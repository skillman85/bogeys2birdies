import { notFound } from 'next/navigation';
import { Page } from '../../components/SiteChrome';
import { Eyebrow, Stat } from '../../components/UI';
import { defaultSiteSettings } from '../../content/defaults';
import { getCustomPage, getSiteSettings } from '../../sanity/lib/content';
import { metadataFrom } from '../../sanity/lib/metadata';
import { RichText } from '../../components/RichText';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const page = await getCustomPage(slug);
  return page ? metadataFrom(page, { title: page.title, description: page.description }) : {};
}

export default async function CustomPage({ params }) {
  const { slug } = await params;
  const [page, site] = await Promise.all([getCustomPage(slug), getSiteSettings(defaultSiteSettings)]);
  if (!page) notFound();
  return <Page siteSettings={site || defaultSiteSettings}><main className="inner-page">
    <section className="page-hero">{page.eyebrow && <Eyebrow>{page.eyebrow}</Eyebrow>}<h1>{page.title}</h1><p>{page.description}</p></section>
    <section className="section-shell content-block custom-page-content">
      {!!page.stats?.length && <div className="stats-grid">{page.stats.map((stat) => <Stat key={stat._key || stat.label} {...stat} />)}</div>}
      <RichText value={page.body} />
    </section>
  </main></Page>;
}
