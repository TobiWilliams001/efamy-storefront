import {BookIcon} from '@sanity/icons/Book'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const recipe = defineType({
  name: 'recipe',
  title: 'Recipe',
  type: 'document',
  icon: BookIcon,
  groups: [
    {name: 'details', title: 'Details', default: true},
    {name: 'method', title: 'Ingredients & method'},
  ],
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      group: 'details',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      group: 'details',
      description: 'Used in the web address. Changing this breaks existing links.',
      options: {source: 'title', maxLength: 96},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'summary',
      type: 'string',
      group: 'details',
      description: 'One line shown on recipe cards. Keep it under 80 characters.',
      validation: (rule) => rule.required().max(90),
    }),
    /*
     * A reference, not a copied name: the product is shared taxonomy, and this
     * keeps the recipe pointing at the right jar when a product is renamed.
     */
    defineField({
      name: 'product',
      title: 'Made with',
      type: 'reference',
      to: [{type: 'product'}],
      group: 'details',
      description: 'The Efamy jar this dish is built around.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Photograph',
      type: 'image',
      group: 'details',
      options: {hotspot: true},
      description: 'Square works best. The finished dish, cropped tight on the plate.',
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alt text',
          description: 'Describe the dish for anyone who cannot see the photograph.',
        }),
      ],
    }),
    defineField({
      name: 'serves',
      type: 'number',
      group: 'details',
      validation: (rule) => rule.required().integer().min(1).max(50),
    }),
    defineField({
      name: 'prepMinutes',
      title: 'Preparation time (minutes)',
      type: 'number',
      group: 'details',
      validation: (rule) => rule.required().integer().min(0).max(600),
    }),
    defineField({
      name: 'cookMinutes',
      title: 'Cooking time (minutes)',
      type: 'number',
      group: 'details',
      validation: (rule) => rule.required().integer().min(0).max(600),
    }),
    defineField({
      name: 'ingredients',
      type: 'array',
      group: 'method',
      description:
        'One line per ingredient, with the quantity. For example "2 tbsp Efamy Beef Chilli Sauce".',
      of: [defineArrayMember({type: 'string'})],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'method',
      title: 'Method',
      type: 'array',
      group: 'method',
      description: 'One step per line, in order. Numbering is added automatically.',
      of: [defineArrayMember({type: 'text', rows: 3})],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'summary', media: 'image'},
  },
})
