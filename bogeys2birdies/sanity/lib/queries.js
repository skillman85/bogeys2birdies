import { defineQuery } from 'next-sanity';

const imageFields = `{"asset": asset->{_id, url, metadata{dimensions}}, crop, hotspot, alt}`;

export const HOME_QUERY = defineQuery(`{
  "settings": *[_type == "homepageSettings"][0]{..., heroImage ${imageFields}, featuredExperiments[]->{..., "slug": slug.current, coverImage ${imageFields}}, featuredArticles[]->{..., "slug": slug.current, coverImage ${imageFields}}},
  "site": *[_type == "siteSettings"][0],
  "experiments": *[_type == "experiment"] | order(featured desc, publishedAt desc)[0...3]{..., "slug": slug.current, coverImage ${imageFields}},
  "articles": *[_type == "article"] | order(featured desc, publishedAt desc)[0...3]{..., "slug": slug.current, coverImage ${imageFields}}
}`);

export const ARTICLES_QUERY = defineQuery(`*[_type == "article"] | order(publishedAt desc){..., "slug": slug.current, coverImage ${imageFields}}`);
export const EXPERIMENTS_QUERY = defineQuery(`*[_type == "experiment"] | order(publishedAt desc){..., "slug": slug.current, coverImage ${imageFields}}`);
export const GEAR_REVIEWS_QUERY = defineQuery(`*[_type == "gearReview"] | order(publishedAt desc){..., "slug": slug.current, coverImage ${imageFields}}`);
export const SITE_SETTINGS_QUERY = defineQuery(`*[_type == "siteSettings"][0]`);
export const PAGE_SETTINGS_QUERY = defineQuery(`*[_type == "pageSettings" && pageKey == $pageKey][0]`);
