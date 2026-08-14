import { client } from './client';
import { ARTICLES_QUERY, CATEGORY_ARTICLES_QUERY, COMMENTS_QUERY, CONTENT_DETAIL_QUERY, CUSTOM_PAGE_QUERY, EXPERIMENTS_QUERY, GEAR_REVIEWS_QUERY, HOMEPAGE_SETTINGS_QUERY, HOME_QUERY, PAGE_SETTINGS_QUERY, RELATED_ARTICLES_QUERY, SEASON_DATA_QUERY, SITE_SETTINGS_QUERY } from './queries';

const options = { next: { revalidate: 60 } };

async function fetchContent(query, fallback) {
  if (!client) return fallback;
  try {
    const data = await client.fetch(query, {}, options);
    return data ?? fallback;
  } catch (error) {
    console.error('Sanity content fetch failed; using fallback content.', error);
    return fallback;
  }
}

export const getHomeContent = (fallback) => fetchContent(HOME_QUERY, fallback);
export const getArticles = (fallback) => fetchContent(ARTICLES_QUERY, fallback);
export const getArticlesByCategory = (slug, fallback = { category: null, articles: [] }) => client ? client.fetch(CATEGORY_ARTICLES_QUERY, { slug }, options).catch((error) => { console.error(`Sanity category fetch failed for ${slug}; using fallback content.`, error); return fallback; }) : fallback;
export async function getRelatedArticles(slug, categorySlug, fallback = []) {
  if (!client) return fallback;
  try {
    const related = await client.fetch(RELATED_ARTICLES_QUERY, { slug, categorySlug }, options);
    const byId = new Map();
    for (const item of [...(related?.sameCategory || []), ...(related?.latest || [])]) {
      if (byId.size >= 3) break;
      byId.set(item._id || item.slug, item);
    }
    return [...byId.values()];
  } catch (error) {
    console.error(`Sanity related articles fetch failed for ${slug}; using fallback content.`, error);
    return fallback;
  }
}
export const getExperiments = (fallback) => fetchContent(EXPERIMENTS_QUERY, fallback);
export const getGearReviews = (fallback) => fetchContent(GEAR_REVIEWS_QUERY, fallback);
export const getSiteSettings = (fallback) => fetchContent(SITE_SETTINGS_QUERY, fallback);
export const getHomepageSettings = (fallback) => fetchContent(HOMEPAGE_SETTINGS_QUERY, fallback);
export const getSeasonData = (fallback = null) => fetchContent(SEASON_DATA_QUERY, fallback);
export const getCustomPage = (slug) => client ? client.fetch(CUSTOM_PAGE_QUERY, { slug }, options) : null;
export const getContentDetail = (type, slug) => client ? client.fetch(CONTENT_DETAIL_QUERY, { type, slug }, options) : null;
export const getComments = (contentId) => client ? client.fetch(COMMENTS_QUERY, { contentId }, options) : [];
export async function getPageSettings(pageKey, fallback) {
  if (!client) return fallback;
  try {
    return await client.fetch(PAGE_SETTINGS_QUERY, { pageKey }, options) || fallback;
  } catch (error) {
    console.error(`Sanity page fetch failed for ${pageKey}; using fallback content.`, error);
    return fallback;
  }
}
