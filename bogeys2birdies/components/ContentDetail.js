import { Page } from './SiteChrome';
import { Eyebrow } from './UI';
import { imageUrl } from '../sanity/lib/image';
import { getComments } from '../sanity/lib/content';
import { Comments } from './Comments';
import { RichText } from './RichText';

export async function ContentDetail({ item, site, eyebrow, meta, children }) {
  const comments = await getComments(item._id);
  return <Page siteSettings={site}><main className="inner-page content-detail">
    <section className="page-hero"><Eyebrow>{eyebrow}</Eyebrow><h1>{item.title}</h1><p>{item.summary}</p>{meta && <div className="content-detail-meta">{meta}</div>}</section>
    <section className="section-shell content-block">
      {item.coverImage && <img className="content-detail-cover" src={imageUrl(item.coverImage)} alt={item.coverImage.alt || item.title} />}
      {children}
      <RichText value={item.body} />
      <Comments contentId={item._id} contentType={item._type} contentTitle={item.title} initialComments={comments || []} />
    </section>
  </main></Page>;
}
