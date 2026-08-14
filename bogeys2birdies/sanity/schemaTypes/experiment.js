import { defineField, defineType } from 'sanity';
import { editorialFields } from './shared';

export const experiment = defineType({
  name: 'experiment', title: 'Experiments', type: 'document', fields: [
    ...editorialFields,
    defineField({ name: 'number', type: 'string', validation: (rule) => rule.required() }),
    defineField({ name: 'tag', type: 'string', validation: (rule) => rule.required() }),
    defineField({ name: 'result', type: 'string', validation: (rule) => rule.required() }),
    defineField({ name: 'claim', type: 'text' }),
    defineField({ name: 'method', type: 'text' }),
  ],
  orderings: [{ title: 'Publication date, newest', name: 'publishedAtDesc', by: [{ field: 'publishedAt', direction: 'desc' }] }],
  preview: { select: { title: 'title', result: 'result', date: 'publishedAt', media: 'coverImage' }, prepare: ({ title, result, date, media }) => ({ title, subtitle: [result, date && new Date(date).toLocaleDateString('en-GB')].filter(Boolean).join(' · '), media }) },
});
