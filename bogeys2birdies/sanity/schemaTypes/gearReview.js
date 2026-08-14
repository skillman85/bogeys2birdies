import { defineField, defineType } from 'sanity';
import { editorialFields } from './shared';

export const gearReview = defineType({
  name: 'gearReview', title: 'Gear reviews', type: 'document', fields: [
    ...editorialFields,
    defineField({ name: 'categoryRef', title: 'Category', type: 'reference', to: [{ type: 'category' }], description: 'Choose a category or use “Create new” to add one.', validation: (rule) => rule.required() }),
    defineField({ name: 'category', title: 'Legacy category', type: 'string', hidden: true }),
    defineField({ name: 'testDetails', type: 'string', validation: (rule) => rule.required() }),
    defineField({ name: 'verdict', type: 'text' }),
    defineField({ name: 'rating', type: 'number', validation: (rule) => rule.min(0).max(10) }),
  ],
  orderings: [{ title: 'Publication date, newest', name: 'publishedAtDesc', by: [{ field: 'publishedAt', direction: 'desc' }] }],
  preview: { select: { title: 'title', details: 'testDetails', date: 'publishedAt', media: 'coverImage' }, prepare: ({ title, details, date, media }) => ({ title, subtitle: [details, date && new Date(date).toLocaleDateString('en-GB')].filter(Boolean).join(' · '), media }) },
});
