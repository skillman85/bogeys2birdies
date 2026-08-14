import { defaultPageSettings } from '../content/defaults.js';
import { client } from './content/lib.mjs';

for (const [pageKey, settings] of Object.entries(defaultPageSettings)) {
  const document = {
    _id: `pageSettings-${pageKey}`, _type: 'pageSettings', ...settings,
    stats: settings.stats?.map((stat, index) => ({ _key: `stat-${index + 1}`, _type: 'stat', ...stat })),
  };
  const result = await client.createIfNotExists(document);
  console.log(`${result._id}: ready`);
}
