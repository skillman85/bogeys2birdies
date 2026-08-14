import { defineField, defineType } from 'sanity';

export const category = defineType({
  name: 'category', title: 'Category', type: 'document', fields: [
    defineField({ name: 'title', title: 'Category name', type: 'string', validation: (rule) => rule.required() }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'title', maxLength: 80 }, validation: (rule) => rule.required() }),
    defineField({ name: 'description', type: 'text', rows: 3, description: 'Optional internal description of what belongs in this category.' }),
  ],
  orderings: [{ title: 'Name', name: 'titleAsc', by: [{ field: 'title', direction: 'asc' }] }],
  preview: { select: { title: 'title', subtitle: 'description' } },
});
