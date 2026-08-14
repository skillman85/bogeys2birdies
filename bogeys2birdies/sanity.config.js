import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { dataset, projectId } from './sanity/env';
import { schemaTypes } from './sanity/schemaTypes';
import { structure } from './sanity/structure';
import { createSeoSuggestionAction } from './sanity/actions/suggestSeo';
import { BrandIcon } from './sanity/components/BrandIcon.jsx';
import { SeasonImportTool } from './sanity/components/SeasonImportTool.jsx';

const singletonTypes = new Set(['homepageSettings', 'siteSettings', 'newsletterSettings', 'pageSettings', 'seasonData']);
const editorialTypes = new Set(['article', 'experiment', 'gearReview']);

export default defineConfig({
  name: 'default', title: 'Bogeys2Birdies CMS', icon: BrandIcon, basePath: '/studio', projectId, dataset,
  tools: (previousTools) => [...previousTools, { name: 'precision-golf-import', title: 'Import golf data', component: SeasonImportTool }],
  plugins: [structureTool({ structure }), visionTool()],
  schema: {
    types: schemaTypes,
    templates: (templates) => templates.filter(({ schemaType }) => !singletonTypes.has(schemaType)),
  },
  document: {
    actions: (actions, context) => {
      const availableActions = singletonTypes.has(context.schemaType)
        ? actions.filter(({ action }) => !['delete', 'duplicate'].includes(action))
        : actions;
      return editorialTypes.has(context.schemaType)
        ? [...availableActions, createSeoSuggestionAction(context)]
        : availableActions;
    },
  },
});
