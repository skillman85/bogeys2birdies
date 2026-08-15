import { defineField, defineType } from 'sanity';

export const siteSettings = defineType({
  name: 'siteSettings', title: 'Site settings', type: 'document', fields: [
    defineField({ name: 'siteTitle', type: 'string', validation: (rule) => rule.required() }),
    defineField({ name: 'siteDescription', type: 'text', validation: (rule) => rule.required() }),
    defineField({ name: 'footerTagline', type: 'string' }),
    defineField({ name: 'brandStyle', title: 'Header/footer brand style', type: 'textStyle', options: { collapsible: true, collapsed: true } }),
    defineField({ name: 'navStyle', title: 'Navigation link style', type: 'textStyle', options: { collapsible: true, collapsed: true } }),
    defineField({ name: 'footerTextStyle', title: 'Footer text style', type: 'textStyle', options: { collapsible: true, collapsed: true } }),
    defineField({ name: 'copyright', type: 'string' }),
    defineField({ name: 'instagramHandle', title: 'Instagram handle', type: 'string', initialValue: '@bogeys2birdie' }),
    defineField({ name: 'instagramUrl', title: 'Instagram URL', type: 'url', initialValue: 'https://www.instagram.com/bogeys2birdie/' }),
    defineField({ name: 'defaultSeo', type: 'seo' }),
  ], preview: { prepare: () => ({ title: 'Site settings' }) },
});
