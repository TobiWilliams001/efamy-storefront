import {TagIcon} from '@sanity/icons/Tag'
import {defineField, defineType} from 'sanity'

export const productCategory = defineType({
  name: 'productCategory',
  title: 'Category',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      description: 'Used in the web address. Changing this breaks existing links.',
      options: {source: 'name', maxLength: 96},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      type: 'text',
      rows: 3,
      description: 'One or two sentences, shown under the category heading.',
      validation: (rule) => rule.required().max(200),
    }),
    defineField({
      name: 'image',
      type: 'image',
      description: 'A product shot on a white background represents the category best.',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
          description: 'Describe the image for screen readers and search engines.',
          validation: (rule) => rule.required(),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {title: 'name', subtitle: 'description', media: 'image'},
  },
})
