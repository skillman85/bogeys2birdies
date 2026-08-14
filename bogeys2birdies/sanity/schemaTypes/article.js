import { defineField, defineType } from 'sanity';
import { CategorySelectInput } from '../components/CategorySelectInput';
import { editorialFields } from './shared';

export const article = defineType({
  name: 'article', title: 'Articles', type: 'document', fields: [
    ...editorialFields,
    defineField({
      name: 'categoryRef',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'category' }],
      options: { disableNew: true },
      components: { input: CategorySelectInput },
      description: 'Choose one of the categories already created in the Categories section.',
      validation: (rule) => rule.required(),
    }),
    defineField({ name: 'category', title: 'Legacy category', type: 'string', hidden: true }),
    defineField({ name: 'readingTime', title: 'Reading time (minutes)', type: 'number', validation: (rule) => rule.positive().integer() }),
  ],
  orderings: [{ title: 'Publication date, newest', name: 'publishedAtDesc', by: [{ field: 'publishedAt', direction: 'desc' }] }],
  preview: { select: { title: 'title', category: 'categoryRef.title', legacyCategory: 'category', date: 'publishedAt', media: 'coverImage' }, prepare: ({ title, category, legacyCategory, date, media }) => ({ title, subtitle: [category || legacyCategory, date && new Date(date).toLocaleDateString('en-GB')].filter(Boolean).join(' · '), media }) },
});
