import { defineField, defineType } from 'sanity';

export const newsletterSubscriber = defineType({
  name: 'newsletterSubscriber',
  title: 'Newsletter subscriber',
  type: 'document',
  fields: [
    defineField({ name: 'email', type: 'string', validation: (rule) => rule.required().email() }),
    defineField({
      name: 'status',
      type: 'string',
      initialValue: 'active',
      options: {
        layout: 'radio',
        list: [
          { title: 'Active', value: 'active' },
          { title: 'Unsubscribed', value: 'unsubscribed' },
          { title: 'Bounced', value: 'bounced' },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({ name: 'source', type: 'string', initialValue: 'website' }),
    defineField({ name: 'consentText', title: 'Consent wording shown', type: 'text', rows: 2 }),
    defineField({ name: 'consentedAt', type: 'datetime' }),
    defineField({ name: 'unsubscribedAt', type: 'datetime' }),
    defineField({ name: 'lastSentAt', type: 'datetime' }),
    defineField({ name: 'createdAt', type: 'datetime' }),
    defineField({ name: 'updatedAt', type: 'datetime' }),
    defineField({ name: 'notes', type: 'text', rows: 3 }),
  ],
  preview: {
    select: { title: 'email', subtitle: 'status' },
  },
});
