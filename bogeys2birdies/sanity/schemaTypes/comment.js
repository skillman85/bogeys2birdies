import { defineField, defineType } from 'sanity';

export const comment = defineType({
  name: 'comment', title: 'Comments', type: 'document', fields: [
    defineField({ name: 'author', type: 'string', readOnly: true, validation: (rule) => rule.required() }),
    defineField({ name: 'message', type: 'text', rows: 5, readOnly: true, validation: (rule) => rule.required() }),
    defineField({ name: 'contentTitle', title: 'Content title', type: 'string', readOnly: true }),
    defineField({ name: 'contentId', title: 'Content ID', type: 'string', readOnly: true, validation: (rule) => rule.required() }),
    defineField({ name: 'contentType', title: 'Content type', type: 'string', readOnly: true }),
    defineField({ name: 'createdAt', type: 'datetime', readOnly: true }),
    defineField({ name: 'status', type: 'string', initialValue: 'pending', options: { layout: 'radio', list: [
      { title: 'Pending', value: 'pending' }, { title: 'Approved', value: 'approved' }, { title: 'Rejected', value: 'rejected' },
    ] }, validation: (rule) => rule.required() }),
  ],
  orderings: [{ title: 'Newest first', name: 'createdAtDesc', by: [{ field: 'createdAt', direction: 'desc' }] }],
  preview: { select: { title: 'author', message: 'message', status: 'status', contentTitle: 'contentTitle' }, prepare: ({ title, message, status, contentTitle }) => ({ title: `${title} · ${status || 'pending'}`, subtitle: `${contentTitle || 'Content'} — ${message || ''}` }) },
});
