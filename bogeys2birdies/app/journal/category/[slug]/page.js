import { notFound } from 'next/navigation';
import { Page } from '../../../../components/SiteChrome';
import { ArticleCard, Eyebrow } from '../../../../components/UI';
import { defaultPageSettings, defaultSiteSettings, formatArticleMeta } from '../../../../content/defaults';
import { getArticlesByCategory, getPageSettings, getSiteSettings } from '../../../../sanity/lib/content';
import { imageUrl } from '../../../../sanity/lib/image';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const { category } = await getArticlesByCategory(slug);
  if (!category) return {};
  return {
    title: `${category.title} Articles | Bogeys2Birdies`,
    description: category.description || `Read Bogeys2Birdies articles in the ${category.title} category.`,
  };
}

export default async function JournalCategory({ params }) {
  const { slug } = await params;
  const [{ category, articles }, site, page] = await Promise.all([
    getArticlesByCategory(slug),
    getSiteSettings(defaultSiteSettings),
    getPageSettings('journal', defaultPageSettings.journal),
  ]);

  if (!category) notFound();

  return <Page siteSettings={site || defaultSiteSettings}><main className="inner-page">
    <section className="page-hero"><Eyebrow>{page.eyebrow}</Eyebrow><h1>{category.title}</h1><p>{category.description || `All Bogeys2Birdies articles filed under ${category.title}.`}</p></section>
    <section className="section-shell">
      {articles.length ? <div className="article-grid">{articles.map((item) => <ArticleCard key={item._id || item.slug} category={item.category} categorySlug={item.categorySlug} title={item.title} meta={formatArticleMeta(item)} image={imageUrl(item.coverImage)} href={`/journal/${item.slug}`} />)}</div> : <p className="empty-state">No articles in this category yet.</p>}
    </section>
  </main></Page>;
}
