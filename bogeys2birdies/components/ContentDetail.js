import { PortableText } from 'next-sanity';
import { Page } from './SiteChrome';
import { Eyebrow } from './UI';
import { imageUrl } from '../sanity/lib/image';

const components = {
  types: { image: ({ value }) => <img className="custom-page-image" src={imageUrl(value)} alt={value.alt || ''} /> },
};

export function ContentDetail({ item, site, eyebrow, meta, children }) {
  return <Page siteSettings={site}><main className="inner-page content-detail">
    <section className="page-hero"><Eyebrow>{eyebrow}</Eyebrow><h1>{item.title}</h1><p>{item.summary}</p>{meta && <div className="content-detail-meta">{meta}</div>}</section>
    <section className="section-shell content-block">
      {item.coverImage && <img className="content-detail-cover" src={imageUrl(item.coverImage)} alt={item.coverImage.alt || item.title} />}
      {children}
      {!!item.body?.length && <div className="custom-page-body"><PortableText value={item.body} components={components} /></div>}
    </section>
  </main></Page>;
}
