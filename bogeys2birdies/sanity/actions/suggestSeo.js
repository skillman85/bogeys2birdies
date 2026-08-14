import { useState } from 'react';

const suffix = ' | Bogeys2Birdies';

function slugify(value) {
  return value.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 96);
}

function metaTitle(title) {
  const available = 60 - suffix.length;
  const shortened = title.length > available ? `${title.slice(0, available - 1).trim()}…` : title;
  return `${shortened}${suffix}`;
}

function suggestedDescription(title) {
  return `Read ${title} for honest golf insights, practical lessons and real-world testing from Bogeys2Birdies.`.slice(0, 160);
}

export function createSeoSuggestionAction(context) {
  const client = context.getClient({ apiVersion: '2026-08-14' });
  return function SuggestSeoAction(props) {
    const [working, setWorking] = useState(false);
    const document = props.draft || props.published;
    const title = document?.title?.trim();
    return {
      label: working ? 'Generating suggestions…' : 'Suggest slug & SEO',
      title: title ? 'Fill blank slug, summary and SEO fields from the title' : 'Enter a title first',
      disabled: !title || working,
      onHandle: async () => {
        setWorking(true);
        try {
          const description = document.summary?.trim() || suggestedDescription(title);
          const publishedId = props.id.replace(/^drafts\./, '');
          const draftId = `drafts.${publishedId}`;
          if (!props.draft) await client.createIfNotExists({ ...(props.published || {}), _id: draftId, _type: props.type });
          await client.patch(draftId).setIfMissing({
            slug: { _type: 'slug', current: slugify(title) },
            summary: description,
            seo: { _type: 'seo' },
          }).setIfMissing({ 'seo.metaTitle': metaTitle(title), 'seo.metaDescription': description }).commit();
          props.onComplete();
        } catch (error) {
          window.alert(`Could not generate SEO suggestions: ${error.message}`);
        } finally {
          setWorking(false);
        }
      },
    };
  };
}
