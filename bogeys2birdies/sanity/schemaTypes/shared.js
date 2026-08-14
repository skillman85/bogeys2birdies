import { defineArrayMember, defineField, defineType } from 'sanity';

export const seo = defineType({
  name: 'seo', title: 'SEO', type: 'object', fields: [
    defineField({ name: 'metaTitle', title: 'Meta title', type: 'string', validation: (rule) => rule.max(60) }),
    defineField({ name: 'metaDescription', title: 'Meta description', type: 'text', rows: 3, validation: (rule) => rule.max(160) }),
  ],
});

export const portableText = defineType({
  name: 'portableText', title: 'Article body', type: 'array', description: 'Build the article with formatted text, headings, lists, links and images.', of: [
    defineArrayMember({
      type: 'block',
      styles: [
        { title: 'Paragraph', value: 'normal' }, { title: 'Lead paragraph', value: 'lead' }, { title: 'Small paragraph', value: 'small' },
        { title: 'Heading 2', value: 'h2' }, { title: 'Heading 3', value: 'h3' }, { title: 'Heading 4', value: 'h4' }, { title: 'Quote', value: 'blockquote' },
      ],
      lists: [{ title: 'Bullet list', value: 'bullet' }, { title: 'Numbered list', value: 'number' }],
      marks: {
        decorators: [{ title: 'Bold', value: 'strong' }, { title: 'Italic', value: 'em' }, { title: 'Underline', value: 'underline' }, { title: 'Code', value: 'code' }],
        annotations: [defineArrayMember({ name: 'link', title: 'Link', type: 'object', fields: [
          defineField({ name: 'href', title: 'URL', type: 'url', validation: (rule) => rule.required().uri({ allowRelative: true, scheme: ['http', 'https', 'mailto', 'tel'] }) }),
          defineField({ name: 'openInNewTab', title: 'Open in a new tab', type: 'boolean', initialValue: false }),
        ] })],
      },
    }),
    defineArrayMember({ type: 'image', title: 'Body image', options: { hotspot: true }, fields: [
      defineField({ name: 'alt', type: 'string', title: 'Alternative text', description: 'Describe the image for accessibility and search engines.', validation: (rule) => rule.required().warning('Add alternative text before publishing.') }),
      defineField({ name: 'caption', type: 'string', title: 'Caption' }),
      defineField({ name: 'display', title: 'Image width', type: 'string', initialValue: 'standard', options: { layout: 'radio', list: [{ title: 'Standard', value: 'standard' }, { title: 'Wide', value: 'wide' }, { title: 'Full width', value: 'full' }] } }),
    ] }),
  ],
});

export const stat = defineType({
  name: 'stat', title: 'Statistic', type: 'object', fields: [
    defineField({ name: 'value', type: 'string', validation: (rule) => rule.required() }),
    defineField({ name: 'label', type: 'string', validation: (rule) => rule.required() }),
    defineField({ name: 'detail', type: 'string' }),
  ], preview: { select: { title: 'value', subtitle: 'label' } },
});

export const handicapMilestone = defineType({
  name: 'handicapMilestone', title: 'Handicap milestone', type: 'object', fields: [
    defineField({ name: 'label', title: 'Date or label', type: 'string', validation: (rule) => rule.required() }),
    defineField({ name: 'handicap', type: 'number', validation: (rule) => rule.required().min(0).max(54) }),
  ], preview: { select: { title: 'label', handicap: 'handicap' }, prepare: ({ title, handicap }) => ({ title, subtitle: handicap == null ? '' : `Handicap ${handicap}` }) },
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
