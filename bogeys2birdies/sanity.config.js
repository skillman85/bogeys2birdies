import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { dataset, projectId } from './sanity/env';
import { schemaTypes } from './sanity/schemaTypes';
import { structure } from './sanity/structure';

const singletonTypes = new Set(['homepageSettings', 'siteSettings', 'pageSettings']);

export default defineConfig({
  name: 'default', title: 'Bogeys2Birdies CMS', basePath: '/studio', projectId, dataset,
  plugins: [structureTool({ structure }), visionTool()],
  schema: {
    types: schemaTypes,
    templates: (templates) => templates.filter(({ schemaType }) => !singletonTypes.has(schemaType)),
  },
  document: {
    actions: (actions, context) => singletonTypes.has(context.schemaType)
      ? actions.filter(({ action }) => !['delete', 'duplicate'].includes(action))
      : actions,
  },
});
