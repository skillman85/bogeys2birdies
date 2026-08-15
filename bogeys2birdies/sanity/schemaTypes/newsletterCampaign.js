import { defineField, defineType } from 'sanity';
import { NewsletterSendPanel } from '../components/NewsletterSendPanel.jsx';

export const newsletterCampaign = defineType({
  name: 'newsletterCampaign',
  title: 'Newsletter campaign',
  type: 'document',
  fields: [
    defineField({ name: 'sendControls', title: 'Send this newsletter', type: 'string', readOnly: true, components: { input: NewsletterSendPanel } }),
    defineField({ name: 'title', title: 'Internal campaign name', type: 'string', hidden: true }),
    defineField({ name: 'subject', title: 'Email subject line', type: 'string', validation: (rule) => rule.required().max(120) }),
    defineField({ name: 'heading', title: 'Header', type: 'string', validation: (rule) => rule.required().max(120) }),
    defineField({ name: 'subheading', title: 'Sub heading', type: 'text', rows: 2, validation: (rule) => rule.max(240) }),
    defineField({ name: 'body', title: 'Email body', type: 'portableText', validation: (rule) => rule.required() }),
    defineField({ name: 'preheader', title: 'Inbox preview text', type: 'string', hidden: true, validation: (rule) => rule.max(160) }),
    defineField({
      name: 'audience',
      type: 'string',
      initialValue: 'activeSubscribers',
      hidden: true,
      options: { layout: 'radio', list: [{ title: 'Active subscribers', value: 'activeSubscribers' }] },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'status',
      type: 'string',
      initialValue: 'draft',
      readOnly: true,
      hidden: true,
      options: {
        layout: 'radio',
        list: [
          { title: 'Draft', value: 'draft' },
          { title: 'Sent', value: 'sent' },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({ name: 'sentAt', type: 'datetime', readOnly: true, hidden: true }),
    defineField({ name: 'sentCount', type: 'number', readOnly: true, hidden: true }),
    defineField({ name: 'lastSendError', type: 'text', rows: 3, readOnly: true, hidden: ({ document }) => !document?.lastSendError }),
    defineField({ name: 'seo', title: 'Archive SEO', type: 'seo', hidden: true }),
  ],
  preview: {
    select: { title: 'heading', subject: 'subject', status: 'status' },
    prepare: ({ title, subject, status }) => ({ title: title || subject || 'New newsletter', subtitle: status || 'draft' }),
  },
});
