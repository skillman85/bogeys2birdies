import { PortableText } from 'next-sanity';
import { notFound } from 'next/navigation';
import { Page } from '../../components/SiteChrome';
import { Eyebrow, Stat } from '../../components/UI';
import { defaultSiteSettings } from '../../content/defaults';
import { getCustomPage, getSiteSettings } from '../../sanity/lib/content';
import { imageUrl } from '../../sanity/lib/image';
import { metadataFrom } from '../../sanity/lib/metadata';

const portableTextComponents = {
  types: { image: ({ value }) => <img className="custom-page-image" src={imageUrl(value)} alt={value.alt || ''} /> },
};

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
      {!!page.body?.length && <div className="custom-page-body"><PortableText value={page.body} components={portableTextComponents} /></div>}
    </section>
  </main></Page>;
}
