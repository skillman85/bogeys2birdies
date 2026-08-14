import { Page } from './SiteChrome';
import { ArticleCard, CategoryEyebrow, Eyebrow } from './UI';
import { imageUrl } from '../sanity/lib/image';
import { getComments } from '../sanity/lib/content';
import { Comments } from './Comments';
import { RichText } from './RichText';
import { formatArticleMeta } from '../content/defaults';

export async function ContentDetail({ item, site, eyebrow, eyebrowSlug, meta, relatedItems = [], children }) {
  const comments = await getComments(item._id);
  return <Page siteSettings={site}><main className="inner-page content-detail">
    <section className="page-hero">{eyebrowSlug ? <CategoryEyebrow category={eyebrow} categorySlug={eyebrowSlug} /> : <Eyebrow>{eyebrow}</Eyebrow>}<h1>{item.title}</h1><p>{item.summary}</p>{meta && <div className="content-detail-meta">{meta}</div>}</section>
    <section className="section-shell content-block">
      {item.coverImage && <img className="content-detail-cover" src={imageUrl(item.coverImage)} alt={item.coverImage.alt || item.title} />}
      {children}
      <RichText value={item.body} />
      {!!relatedItems.length && <section className="related-articles">
        <div className="section-heading split"><div><Eyebrow>Might Be Interested In</Eyebrow><h2>More from the journal.</h2></div></div>
        <div className="article-grid">{relatedItems.map((related) => <ArticleCard key={related._id || related.slug} category={related.category} categorySlug={related.categorySlug} title={related.title} meta={formatArticleMeta(related)} image={imageUrl(related.coverImage)} href={`/journal/${related.slug}`} />)}</div>
      </section>}
      <Comments contentId={item._id} contentType={item._type} contentTitle={item.title} initialComments={comments || []} />
    </section>
  </main></Page>;
}
