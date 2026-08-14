import { defineField, defineType } from 'sanity';

export const newsletterCampaign = defineType({
  name: 'newsletterCampaign',
  title: 'Newsletter campaign',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (rule) => rule.required() }),
    defineField({ name: 'subject', type: 'string', validation: (rule) => rule.required().max(120) }),
    defineField({ name: 'preheader', type: 'string', validation: (rule) => rule.max(160) }),
    defineField({ name: 'body', title: 'Email body', type: 'portableText', validation: (rule) => rule.required() }),
    defineField({
      name: 'audience',
      type: 'string',
      initialValue: 'activeSubscribers',
      options: { layout: 'radio', list: [{ title: 'Active subscribers', value: 'activeSubscribers' }] },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'status',
      type: 'string',
      initialValue: 'draft',
      options: {
        layout: 'radio',
        list: [
          { title: 'Draft', value: 'draft' },
          { title: 'Ready to send', value: 'ready' },
          { title: 'Sent', value: 'sent' },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({ name: 'scheduledAt', type: 'datetime' }),
    defineField({ name: 'sentAt', type: 'datetime', readOnly: true }),
    defineField({ name: 'sentCount', type: 'number', readOnly: true }),
    defineField({ name: 'lastSendError', type: 'text', rows: 3, readOnly: true }),
    defineField({ name: 'seo', title: 'Archive SEO', type: 'seo' }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'status' },
  },
});
