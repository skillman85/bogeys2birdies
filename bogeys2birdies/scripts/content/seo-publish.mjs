import { client, slugify } from './lib.mjs';

const apply = process.argv.includes('--apply');
const publish = process.argv.includes('--publish');
const types = ['article', 'experiment', 'gearReview', 'pageSettings', 'homepageSettings', 'siteSettings'];
const documents = await client.fetch('*[_type in $types]{...}', { types });

function trim(value, max) {
  if (!value || value.length <= max) return value;
  const clipped = value.slice(0, max + 1);
  return `${clipped.slice(0, clipped.lastIndexOf(' ')).replace(/[.,;:!?-]+$/, '')}`.slice(0, max);
}

const pageSeo = {
  project: ['Road to a 5 Handicap | Bogeys2Birdies', 'Follow an ordinary club golfer’s measured journey towards a 5 handicap through real rounds, practice, decisions and honest progress.'],
  data: ['Golf Handicap & Performance Data | Bogeys2Birdies', 'Explore the scoring, greens, fairways, putting and handicap data behind the Bogeys2Birdies Road to 5 project.'],
  journal: ['Club Golf Journal | Bogeys2Birdies', 'Read honest club golf round reports, practice lessons, mistakes and breakthroughs from the Bogeys2Birdies Road to 5 journey.'],
  experiments: ['Golf Experiments & Tests | Bogeys2Birdies', 'Discover real-world golf experiments that test course strategy, putting practice and common advice over genuine club rounds.'],
  gear: ['Golf Gear Reviews & Tests | Bogeys2Birdies', 'Read independent golf gear reviews based on launch-monitor results, structured testing and real rounds from a club golfer.'],
};

function seoFor(document) {
  if (document._type === 'pageSettings') return pageSeo[document.pageKey];
  if (document._type === 'homepageSettings') return ['Bogeys2Birdies | Real Golf. Real Progress.', 'Real golf experiments, honest gear tests and performance data from one club golfer’s measured journey towards a 5 handicap.'];
  if (document._type === 'siteSettings') return [document.siteTitle || 'Bogeys2Birdies | Real Golf. Real Progress.', document.siteDescription];
  const suffix = document._type === 'article' ? ' | Bogeys2Birdies' : document._type === 'experiment' ? ' | Golf Experiment' : ' | Golf Gear Review';
  const fullTitle = `${document.title}${suffix}`;
  const metaTitle = fullTitle.length <= 60 ? fullTitle : `${trim(document.title, 54)} | B2B`;
  const cleanTitle = document.title.replace(/[.?!]+$/, '');
  const category = document.category === 'Balls' ? 'golf ball' : String(document.category || 'golf gear').toLowerCase();
  const description = document._type === 'article'
    ? `${cleanTitle}. Read honest ${String(document.category || 'club golf').toLowerCase()} insights, practical lessons and real-round progress from Bogeys2Birdies.`
    : document._type === 'experiment'
      ? `See how ${document.title.toLowerCase()} performed in a real club-golf test, including the method, result and practical lessons for ordinary golfers.`
      : `${cleanTitle}. An independent ${category} review based on ${String(document.testDetails || 'structured testing').toLowerCase()} and real club-golf use.`;
  return [metaTitle, trim(description, 160)];
}

const plans = [];
for (const document of documents) {
  const [metaTitle, metaDescription] = seoFor(document) || [];
  const patch = {};
  const seoField = document._type === 'siteSettings' ? 'defaultSeo' : 'seo';
  const currentSeo = document[seoField];
  const nextSeo = { _type: 'seo', metaTitle: trim(metaTitle, 60), metaDescription: trim(metaDescription, 160) };
  if (currentSeo?.metaTitle !== nextSeo.metaTitle || currentSeo?.metaDescription !== nextSeo.metaDescription) {
    patch[seoField] = nextSeo;
  }
  if (['article', 'experiment', 'gearReview'].includes(document._type) && !document.slug?.current && document.title) patch.slug = { _type: 'slug', current: slugify(document.title) };
  if (Object.keys(patch).length) plans.push({ id: document._id, type: document._type, patch });
}

console.log(JSON.stringify({ mode: apply ? 'apply' : 'dry-run', documents: documents.length, updates: plans }, null, 2));

if (apply) {
  for (const plan of plans) {
    await client.patch(plan.id).set(plan.patch).commit();
  }
}

if (apply && publish) {
  const drafts = await client.fetch('*[_id in path("drafts.**") && _type in $types]{...}', { types });
  for (const draft of drafts) {
    const publishedId = draft._id.replace(/^drafts\./, '');
    const { _rev, _createdAt, _updatedAt, ...clean } = draft;
    await client.transaction().createOrReplace({ ...clean, _id: publishedId }).delete(draft._id).commit();
    console.log(`Published ${publishedId}`);
  }
  console.log(`Published ${drafts.length} draft(s).`);
}
