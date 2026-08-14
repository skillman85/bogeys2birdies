import { defineArrayMember, defineField, defineType } from 'sanity';

export const homepageSettings = defineType({
  name: 'homepageSettings', title: 'Homepage settings', type: 'document', fields: [
    defineField({ name: 'heroEyebrow', type: 'string' }), defineField({ name: 'heroTitleLineOne', type: 'string' }), defineField({ name: 'heroTitleLineTwo', type: 'string' }),
    defineField({ name: 'heroDescription', type: 'text' }), defineField({ name: 'heroImage', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'currentHandicap', type: 'string' }), defineField({ name: 'targetHandicap', type: 'string' }), defineField({ name: 'progressPercent', type: 'number', validation: (rule) => rule.min(0).max(100) }),
    defineField({ name: 'stats', type: 'array', of: [defineArrayMember({ type: 'stat' })], validation: (rule) => rule.max(4) }),
    defineField({ name: 'roadEyebrow', title: 'Road section label', type: 'string' }), defineField({ name: 'roadHeading', title: 'Road section heading', type: 'string' }), defineField({ name: 'roadDescription', title: 'Road section description', type: 'text' }),
    defineField({ name: 'experimentsEyebrow', title: 'Experiments section label', type: 'string' }), defineField({ name: 'experimentsHeading', title: 'Experiments section heading', type: 'string' }), defineField({ name: 'experimentsDescription', title: 'Experiments section description', type: 'text' }),
    defineField({ name: 'featuredExperiments', title: 'Featured experiments', type: 'array', of: [defineArrayMember({ type: 'reference', to: [{ type: 'experiment' }] })], validation: (rule) => rule.max(3) }),
    defineField({ name: 'featuredArticles', title: 'Featured articles', type: 'array', of: [defineArrayMember({ type: 'reference', to: [{ type: 'article' }] })], validation: (rule) => rule.max(3) }),
    defineField({ name: 'journalEyebrow', title: 'Journal section label', type: 'string' }), defineField({ name: 'journalHeading', title: 'Journal section heading', type: 'string' }),
    defineField({ name: 'manifestoHeading', type: 'string' }), defineField({ name: 'manifestoEmphasis', type: 'string' }), defineField({ name: 'manifestoDescription', type: 'text' }),
    defineField({ name: 'newsletterHeadingLineOne', type: 'string' }), defineField({ name: 'newsletterHeadingLineTwo', type: 'string' }), defineField({ name: 'newsletterDescription', type: 'text' }),
    defineField({ name: 'seo', type: 'seo' }),
  ], preview: { prepare: () => ({ title: 'Homepage settings' }) },
});
