import { defineArrayMember, defineField, defineType } from 'sanity';

export const pageSettings = defineType({
  name: 'pageSettings', title: 'Page settings', type: 'document',
  fields: [
    defineField({ name: 'pageKey', title: 'Page', type: 'string', readOnly: true, options: { list: [
      { title: 'Project', value: 'project' }, { title: 'Data', value: 'data' }, { title: 'Journal', value: 'journal' },
      { title: 'Experiments', value: 'experiments' }, { title: 'Gear', value: 'gear' },
    ] }, validation: (rule) => rule.required() }),
    defineField({ name: 'eyebrow', type: 'string', validation: (rule) => rule.required() }),
    defineField({ name: 'title', type: 'string', validation: (rule) => rule.required() }),
    defineField({ name: 'description', type: 'text', rows: 3, validation: (rule) => rule.required() }),
    defineField({ name: 'stats', type: 'array', of: [defineArrayMember({ type: 'stat' })], validation: (rule) => rule.max(4) }),
    defineField({ name: 'secondaryHeading', type: 'string' }),
    defineField({ name: 'paragraphs', type: 'array', of: [defineArrayMember({ type: 'text', rows: 3 })] }),
    defineField({ name: 'chartEyebrow', type: 'string' }),
    defineField({ name: 'chartHeading', type: 'string' }),
    defineField({ name: 'chartValue', type: 'string' }),
    defineField({ name: 'seo', type: 'seo' }),
  ],
  preview: { select: { title: 'title', subtitle: 'pageKey' } },
});
