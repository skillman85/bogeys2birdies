import { getCliClient } from 'sanity/cli';
import {
  defaultArticles,
  defaultExperiments,
  defaultGearReviews,
  defaultHomepageSettings,
  defaultSiteSettings,
} from '../content/defaults.js';

const client = getCliClient({ apiVersion: '2026-08-14' });
const imageCache = new Map();

async function uploadImage(url, filename) {
  if (imageCache.has(url)) return imageCache.get(url);
  let response = await fetch(url);
  if (!response.ok) {
    console.warn(`Image returned ${response.status}; using the existing hero image for ${filename}.`);
    response = await fetch(defaultHomepageSettings.heroImage);
  }
  if (!response.ok) throw new Error(`Could not download fallback image: ${response.status}`);
  const asset = await client.assets.upload('image', Buffer.from(await response.arrayBuffer()), { filename });
  const image = { _type: 'image', asset: { _type: 'reference', _ref: asset._id } };
  imageCache.set(url, image);
  return image;
}

async function createIfMissing(document, imageUrl, imageField = 'coverImage') {
  const exists = await client.fetch('*[_id == $id][0]._id', { id: document._id });
  if (exists) {
    console.log(`Skipped existing document: ${document._id}`);
    return;
  }
  const image = imageUrl ? await uploadImage(imageUrl, `${document._id}.jpg`) : undefined;
  await client.createIfNotExists({ ...document, ...(image && { [imageField]: image }) });
  console.log(`Created: ${document._id}`);
}

await createIfMissing({
  _id: 'siteSettings', _type: 'siteSettings', ...defaultSiteSettings,
  defaultSeo: { _type: 'seo', metaTitle: defaultSiteSettings.siteTitle, metaDescription: defaultSiteSettings.siteDescription },
});

const { heroImage, stats, ...homepage } = defaultHomepageSettings;
await createIfMissing({
  _id: 'homepageSettings', _type: 'homepageSettings', ...homepage,
  stats: stats.map((item, index) => ({ _key: `stat-${index + 1}`, _type: 'stat', ...item })),
}, heroImage, 'heroImage');

for (const [index, item] of defaultArticles.entries()) {
  await createIfMissing({
    _id: `article-${item.slug}`, _type: 'article', title: item.title,
    slug: { _type: 'slug', current: item.slug }, summary: item.summary || item.title,
    publishedAt: item.publishedAt, featured: index === 0, category: item.category,
    readingTime: item.readingTime, seo: { _type: 'seo', metaTitle: item.title, metaDescription: item.summary || item.title },
  }, item.coverImage);
}

for (const [index, item] of defaultExperiments.entries()) {
  await createIfMissing({
    _id: `experiment-${item.slug}`, _type: 'experiment', title: item.title,
    slug: { _type: 'slug', current: item.slug }, summary: item.summary,
    publishedAt: new Date(Date.UTC(2026, 7, 10 - index)).toISOString(), featured: index < 3,
    number: item.number, tag: item.tag, result: item.result,
    seo: { _type: 'seo', metaTitle: item.title, metaDescription: item.summary },
  }, item.coverImage);
}

for (const [index, item] of defaultGearReviews.entries()) {
  await createIfMissing({
    _id: `gear-${item.slug}`, _type: 'gearReview', title: item.title,
    slug: { _type: 'slug', current: item.slug }, summary: item.title,
    publishedAt: new Date(Date.UTC(2026, 6, 25 - index)).toISOString(), featured: index === 0,
    category: item.category, testDetails: item.testDetails,
    seo: { _type: 'seo', metaTitle: item.title, metaDescription: item.title },
  }, item.coverImage);
}

console.log('Sanity seed complete. Existing documents were left unchanged.');
