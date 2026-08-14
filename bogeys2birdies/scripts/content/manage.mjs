import { createDraft, deleteContent, publishDraft, readJson, supportedTypes, unpublishContent, updateDraft, updatePageSettings, updateSettings } from './lib.mjs';

const [command, ...args] = process.argv.slice(2);

const typeFor = {
  'create-article': 'article', 'update-article': 'article',
  'create-experiment': 'experiment', 'update-experiment': 'experiment',
  'create-gear-review': 'gearReview', 'update-gear-review': 'gearReview',
};

let result;
if (command?.startsWith('create-')) {
  result = await createDraft(typeFor[command], await readJson(args[0]));
} else if (command?.startsWith('update-') && command !== 'update-settings') {
  result = await updateDraft(typeFor[command], args[0], await readJson(args[1]));
} else if (command === 'update-settings') {
  result = await updateSettings(await readJson(args[0]));
} else if (command === 'update-page') {
  result = await updatePageSettings(args[0], await readJson(args[1]));
} else if (command === 'publish' || command === 'unpublish' || command === 'delete') {
  const [type, slug] = args;
  if (!supportedTypes.has(type)) throw new Error('Type must be article, experiment, or gearReview.');
  if (!slug) throw new Error('A slug is required.');
  if (command === 'publish') result = await publishDraft(type, slug);
  if (command === 'unpublish') result = await unpublishContent(type, slug);
  if (command === 'delete') result = await deleteContent(type, slug, args.includes('--confirm'));
} else {
  throw new Error('Unknown content command. See CONTENT_WORKFLOW.md.');
}

console.log(JSON.stringify(result, null, 2));
