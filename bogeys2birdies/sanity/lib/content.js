import { client } from './client';
import { ARTICLES_QUERY, EXPERIMENTS_QUERY, GEAR_REVIEWS_QUERY, HOME_QUERY, PAGE_SETTINGS_QUERY, SITE_SETTINGS_QUERY } from './queries';

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
export const getExperiments = (fallback) => fetchContent(EXPERIMENTS_QUERY, fallback);
export const getGearReviews = (fallback) => fetchContent(GEAR_REVIEWS_QUERY, fallback);
export const getSiteSettings = (fallback) => fetchContent(SITE_SETTINGS_QUERY, fallback);
export async function getPageSettings(pageKey, fallback) {
  if (!client) return fallback;
  try {
    return await client.fetch(PAGE_SETTINGS_QUERY, { pageKey }, options) || fallback;
  } catch (error) {
    console.error(`Sanity page fetch failed for ${pageKey}; using fallback content.`, error);
    return fallback;
  }
}
