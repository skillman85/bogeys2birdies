import { defineField, defineType } from 'sanity';
import { editorialFields } from './shared';

export const article = defineType({
  name: 'article', title: 'Articles', type: 'document', fields: [
    ...editorialFields,
    defineField({ name: 'categoryRef', title: 'Category', type: 'reference', to: [{ type: 'category' }], description: 'Choose a category or use “Create new” to add one.', validation: (rule) => rule.required() }),
    defineField({ name: 'category', title: 'Legacy category', type: 'string', hidden: true }),
    defineField({ name: 'readingTime', title: 'Reading time (minutes)', type: 'number', validation: (rule) => rule.positive().integer() }),
  ],
  orderings: [{ title: 'Publication date, newest', name: 'publishedAtDesc', by: [{ field: 'publishedAt', direction: 'desc' }] }],
  preview: { select: { title: 'title', category: 'categoryRef.title', legacyCategory: 'category', date: 'publishedAt', media: 'coverImage' }, prepare: ({ title, category, legacyCategory, date, media }) => ({ title, subtitle: [category || legacyCategory, date && new Date(date).toLocaleDateString('en-GB')].filter(Boolean).join(' · '), media }) },
});
