import { defineField, defineType } from 'sanity';

export const newsletterSettings = defineType({
  name: 'newsletterSettings',
  title: 'Newsletter settings',
  type: 'document',
  fields: [
    defineField({ name: 'headingLineOne', title: 'Heading line one', type: 'string', initialValue: 'One useful golf lesson.' }),
    defineField({ name: 'headingLineTwo', title: 'Heading line two', type: 'string', initialValue: 'Every Friday.' }),
    defineField({ name: 'eyebrowStyle', title: 'Signup section label style', type: 'textStyle', options: { collapsible: true, collapsed: true } }),
    defineField({ name: 'headingStyle', title: 'Signup heading style', type: 'textStyle', options: { collapsible: true, collapsed: true } }),
    defineField({
      name: 'description',
      type: 'text',
      rows: 3,
      initialValue: 'No tour gossip. No miracle swing tips. Just what we tested, what changed and what might help your game.',
    }),
    defineField({ name: 'descriptionStyle', title: 'Signup description style', type: 'textStyle', options: { collapsible: true, collapsed: true } }),
    defineField({ name: 'consentStyle', title: 'Signup consent text style', type: 'textStyle', options: { collapsible: true, collapsed: true } }),
    defineField({ name: 'noteStyle', title: 'Signup note/status style', type: 'textStyle', options: { collapsible: true, collapsed: true } }),
    defineField({
      name: 'consentText',
      title: 'Signup consent text',
      type: 'text',
      rows: 2,
      initialValue: 'I agree to receive the Bogeys2Birdies newsletter and understand I can unsubscribe at any time.',
    }),
    defineField({ name: 'successMessage', type: 'string', initialValue: 'You are on the list. I will email you when the next dispatch goes out.' }),
    defineField({ name: 'fromName', title: 'Sender name', type: 'string', initialValue: 'Bogeys2Birdies' }),
    defineField({ name: 'fromEmail', title: 'Sender email', type: 'string', description: 'Must match a verified sender/domain in your email provider.' }),
    defineField({ name: 'replyToEmail', title: 'Reply-to email', type: 'string' }),
    defineField({ name: 'defaultSubjectPrefix', title: 'Default subject prefix', type: 'string', initialValue: 'Bogeys2Birdies' }),
    defineField({ name: 'footerText', title: 'Email footer text', type: 'text', rows: 3 }),
  ],
  preview: { prepare: () => ({ title: 'Newsletter settings' }) },
});
