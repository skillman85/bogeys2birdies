import { defineArrayMember, defineField, defineType } from 'sanity';

const reservedSlugs = ['admin', 'data', 'experiments', 'gear', 'journal', 'project', 'studio'];

export const customPage = defineType({
  name: 'customPage', title: 'Custom page', type: 'document', fields: [
    defineField({ name: 'title', type: 'string', validation: (rule) => rule.required() }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'title', maxLength: 96 }, validation: (rule) => rule.required().custom((value) => reservedSlugs.includes(value?.current) ? 'This URL is reserved by an existing site page.' : true) }),
    defineField({ name: 'eyebrow', title: 'Page label', type: 'string' }),
    defineField({ name: 'description', type: 'text', rows: 3, validation: (rule) => rule.required() }),
    defineField({ name: 'stats', type: 'array', of: [defineArrayMember({ type: 'stat' })], validation: (rule) => rule.max(4) }),
    defineField({ name: 'body', type: 'portableText' }),
    defineField({ name: 'seo', type: 'seo' }),
  ], preview: { select: { title: 'title', subtitle: 'slug.current' } },
});
