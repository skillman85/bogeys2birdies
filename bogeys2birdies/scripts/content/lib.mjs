import { readFile } from 'node:fs/promises';
import { createClient } from '@sanity/client';

const projectId = process.env.SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET;
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !dataset || !token) {
  throw new Error('Missing SANITY_PROJECT_ID, SANITY_DATASET, or SANITY_API_WRITE_TOKEN. Load them from .env.local; never pass the token as a command argument.');
}

export const client = createClient({ projectId, dataset, token, apiVersion: '2026-08-14', useCdn: false, perspective: 'raw' });
export const supportedTypes = new Set(['article', 'experiment', 'gearReview']);

const fields = {
  article: ['title', 'summary', 'publishedAt', 'featured', 'category', 'readingTime', 'body', 'seo'],
  experiment: ['title', 'summary', 'publishedAt', 'featured', 'number', 'tag', 'result', 'claim', 'method', 'body', 'seo'],
  gearReview: ['title', 'summary', 'publishedAt', 'featured', 'category', 'testDetails', 'verdict', 'rating', 'body', 'seo'],
};

const required = {
  article: ['title', 'summary', 'category'],
  experiment: ['title', 'summary', 'number', 'tag', 'result'],
  gearReview: ['title', 'summary', 'category', 'testDetails'],
};

export function slugify(value) {
  return value.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 96);
}

export async function readJson(path) {
  if (!path) throw new Error('A JSON request file path is required.');
  return JSON.parse(await readFile(path, 'utf8'));
}

export function ids(type, slug) {
  const publishedId = `${type}-${slug}`;
  return { publishedId, draftId: `drafts.${publishedId}` };
}

function stripSystem(document, id) {
  const { _rev, _createdAt, _updatedAt, ...clean } = document;
  return { ...clean, _id: id };
}

function contentFields(type, input, { creating = false } = {}) {
  if (!supportedTypes.has(type)) throw new Error(`Unsupported content type: ${type}`);
  if (creating) {
    for (const field of required[type]) if (!input[field]) throw new Error(`Missing required field: ${field}`);
  }
  const output = Object.fromEntries(fields[type].filter((key) => input[key] !== undefined).map((key) => [key, input[key]]));
  if (input.coverImageAssetId) output.coverImage = { _type: 'image', asset: { _type: 'reference', _ref: input.coverImageAssetId } };
  return output;
}

async function applyCategory(type, input, output) {
  if (!['article', 'gearReview'].includes(type) || input.category === undefined) return output;
  const title = String(input.category).trim();
  const categorySlug = slugify(title);
  if (!categorySlug) throw new Error('Category must contain letters or numbers.');
  const existing = await client.fetch(
    '*[_type == "category" && (slug.current == $slug || title == $title)][0]{_id}',
    { slug: categorySlug, title },
  );
  const categoryId = existing?._id || `category-${categorySlug}`;
  if (!existing) await client.createIfNotExists({ _id: categoryId, _type: 'category', title, slug: { _type: 'slug', current: categorySlug } });
  return { ...output, category: title, categoryRef: { _type: 'reference', _ref: categoryId } };
}

export async function createDraft(type, input) {
  const slug = slugify(input.slug || input.title || '');
  if (!slug) throw new Error('A title or slug is required.');
  const { draftId, publishedId } = ids(type, slug);
  if (await client.getDocument(draftId) || await client.getDocument(publishedId)) throw new Error(`Content already exists for slug: ${slug}`);
  const document = {
    _id: draftId, _type: type, ...await applyCategory(type, input, contentFields(type, input, { creating: true })),
    slug: { _type: 'slug', current: slug }, publishedAt: input.publishedAt || new Date().toISOString(), featured: input.featured ?? false,
  };
  const result = await client.create(document);
  return { status: 'draft-created', id: result._id, slug };
}

export async function ensureDraft(type, slug) {
  const normalized = slugify(slug);
  const { draftId, publishedId } = ids(type, normalized);
  const draft = await client.getDocument(draftId);
  if (draft) return { draft, draftId, publishedId };
  const published = await client.getDocument(publishedId);
  if (!published) throw new Error(`No ${type} found for slug: ${normalized}`);
  const created = await client.createIfNotExists(stripSystem(published, draftId));
  return { draft: created, draftId, publishedId };
}

export async function updateDraft(type, slug, input) {
  const { draftId } = await ensureDraft(type, slug);
  const patch = await applyCategory(type, input, contentFields(type, input));
  if (!Object.keys(patch).length) throw new Error('No supported fields were provided.');
  const result = await client.patch(draftId).set(patch).commit();
  return { status: 'draft-updated', id: result._id, slug: result.slug?.current };
}

export async function publishDraft(type, slug) {
  const normalized = slugify(slug);
  const { draftId, publishedId } = ids(type, normalized);
  const draft = await client.getDocument(draftId);
  if (!draft) throw new Error(`No draft found for ${type}: ${normalized}`);
  for (const field of [...required[type], 'coverImage']) {
    if (!draft[field]) throw new Error(`Cannot publish: required field is missing: ${field}`);
  }
  const published = stripSystem(draft, publishedId);
  await client.transaction().createOrReplace(published).delete(draftId).commit();
  return { status: 'published', id: publishedId, slug: normalized };
}

export async function unpublishContent(type, slug) {
  const normalized = slugify(slug);
  const { draftId, publishedId } = ids(type, normalized);
  const published = await client.getDocument(publishedId);
  if (!published) throw new Error(`No published ${type} found for slug: ${normalized}`);
  await client.createIfNotExists(stripSystem(published, draftId));
  await client.delete(publishedId);
  return { status: 'unpublished', draftId, slug: normalized };
}

export async function deleteContent(type, slug, confirmed) {
  if (!confirmed) throw new Error('Deletion requires --confirm. This removes both draft and published versions.');
  const normalized = slugify(slug);
  const { draftId, publishedId } = ids(type, normalized);
  const existing = (await Promise.all([client.getDocument(draftId), client.getDocument(publishedId)])).filter(Boolean);
  if (!existing.length) throw new Error(`No ${type} found for slug: ${normalized}`);
  const transaction = client.transaction();
  for (const document of existing) transaction.delete(document._id);
  await transaction.commit();
  return { status: 'deleted', ids: existing.map(({ _id }) => _id), slug: normalized };
}

async function references(type, slugs) {
  if (!Array.isArray(slugs)) throw new Error('Featured slugs must be an array.');
  const refs = [];
  for (const value of slugs.slice(0, 3)) {
    const slug = slugify(value);
    const { publishedId } = ids(type, slug);
    if (!await client.getDocument(publishedId)) throw new Error(`Featured ${type} must be published first: ${slug}`);
    refs.push({ _key: `${type}-${slug}`, _type: 'reference', _ref: publishedId });
  }
  return refs;
}

export async function updateSettings(input) {
  const homepageAllowed = ['startingHandicap', 'currentHandicap', 'targetHandicap', 'progressPercent'];
  const siteAllowed = ['siteTitle', 'siteDescription', 'footerTagline', 'copyright', 'defaultSeo'];
  const homepagePatch = Object.fromEntries(homepageAllowed.filter((key) => input[key] !== undefined).map((key) => [key, input[key]]));
  const sitePatch = Object.fromEntries(siteAllowed.filter((key) => input[key] !== undefined).map((key) => [key, input[key]]));
  if (input.featuredArticleSlugs !== undefined) homepagePatch.featuredArticles = await references('article', input.featuredArticleSlugs);
  if (input.featuredExperimentSlugs !== undefined) homepagePatch.featuredExperiments = await references('experiment', input.featuredExperimentSlugs);
  if (!Object.keys(homepagePatch).length && !Object.keys(sitePatch).length) throw new Error('No supported settings fields were provided.');
  if (Object.keys(homepagePatch).length) await client.patch('homepageSettings').set(homepagePatch).commit();
  if (Object.keys(sitePatch).length) await client.patch('siteSettings').set(sitePatch).commit();
  return { status: 'settings-updated', homepageFields: Object.keys(homepagePatch), siteFields: Object.keys(sitePatch) };
}

export async function updatePageSettings(pageKey, input) {
  const allowedPages = new Set(['project', 'data', 'journal', 'experiments', 'gear']);
  if (!allowedPages.has(pageKey)) throw new Error('Page must be project, data, journal, experiments, or gear.');
  const allowed = ['eyebrow', 'title', 'description', 'stats', 'secondaryHeading', 'paragraphs', 'chartEyebrow', 'chartHeading', 'chartValue', 'seo'];
  const patch = Object.fromEntries(allowed.filter((key) => input[key] !== undefined).map((key) => [key, input[key]]));
  if (patch.stats) patch.stats = patch.stats.map((stat, index) => ({ _key: stat._key || `stat-${index + 1}`, _type: 'stat', ...stat }));
  if (!Object.keys(patch).length) throw new Error('No supported page fields were provided.');
  const result = await client.patch(`pageSettings-${pageKey}`).set(patch).commit();
  return { status: 'page-updated', id: result._id, pageKey, fields: Object.keys(patch) };
}
