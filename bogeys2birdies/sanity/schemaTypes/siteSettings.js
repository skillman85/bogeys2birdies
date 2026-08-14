import { defineField, defineType } from 'sanity';

export const siteSettings = defineType({
  name: 'siteSettings', title: 'Site settings', type: 'document', fields: [
    defineField({ name: 'siteTitle', type: 'string', validation: (rule) => rule.required() }),
    defineField({ name: 'siteDescription', type: 'text', validation: (rule) => rule.required() }),
    defineField({ name: 'footerTagline', type: 'string' }),
    defineField({ name: 'copyright', type: 'string' }),
    defineField({ name: 'defaultSeo', type: 'seo' }),
  ], preview: { prepare: () => ({ title: 'Site settings' }) },
});
