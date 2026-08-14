import { defineArrayMember, defineField, defineType } from 'sanity';

export const seo = defineType({
  name: 'seo', title: 'SEO', type: 'object', fields: [
    defineField({ name: 'metaTitle', title: 'Meta title', type: 'string', validation: (rule) => rule.max(60) }),
    defineField({ name: 'metaDescription', title: 'Meta description', type: 'text', rows: 3, validation: (rule) => rule.max(160) }),
  ],
});

export const portableText = defineType({
  name: 'portableText', title: 'Body', type: 'array', of: [
    defineArrayMember({ type: 'block' }),
    defineArrayMember({ type: 'image', options: { hotspot: true }, fields: [defineField({ name: 'alt', type: 'string', title: 'Alternative text' })] }),
  ],
});

export const stat = defineType({
  name: 'stat', title: 'Statistic', type: 'object', fields: [
    defineField({ name: 'value', type: 'string', validation: (rule) => rule.required() }),
    defineField({ name: 'label', type: 'string', validation: (rule) => rule.required() }),
    defineField({ name: 'detail', type: 'string' }),
  ], preview: { select: { title: 'value', subtitle: 'label' } },
});

export const editorialFields = [
  defineField({ name: 'title', type: 'string', validation: (rule) => rule.required() }),
  defineField({ name: 'slug', type: 'slug', options: { source: 'title', maxLength: 96 }, validation: (rule) => rule.required() }),
  defineField({ name: 'summary', type: 'text', rows: 3, validation: (rule) => rule.required() }),
  defineField({ name: 'coverImage', type: 'image', options: { hotspot: true }, fields: [defineField({ name: 'alt', type: 'string', title: 'Alternative text' })], validation: (rule) => rule.required() }),
  defineField({ name: 'publishedAt', type: 'datetime', validation: (rule) => rule.required() }),
  defineField({ name: 'featured', type: 'boolean', initialValue: false }),
  defineField({ name: 'body', type: 'portableText' }),
  defineField({ name: 'seo', type: 'seo' }),
];
