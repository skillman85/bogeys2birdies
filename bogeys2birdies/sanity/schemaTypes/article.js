import { defineField, defineType } from 'sanity';
import { editorialFields } from './shared';

export const article = defineType({
  name: 'article', title: 'Articles', type: 'document', fields: [
    ...editorialFields,
    defineField({ name: 'category', type: 'string', validation: (rule) => rule.required() }),
    defineField({ name: 'readingTime', title: 'Reading time (minutes)', type: 'number', validation: (rule) => rule.positive().integer() }),
  ],
  orderings: [{ title: 'Publication date, newest', name: 'publishedAtDesc', by: [{ field: 'publishedAt', direction: 'desc' }] }],
  preview: { select: { title: 'title', category: 'category', date: 'publishedAt', media: 'coverImage' }, prepare: ({ title, category, date, media }) => ({ title, subtitle: [category, date && new Date(date).toLocaleDateString('en-GB')].filter(Boolean).join(' · '), media }) },
});
