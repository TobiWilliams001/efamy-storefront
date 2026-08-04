import {PackageIcon} from '@sanity/icons/Package'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const product = defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  icon: PackageIcon,
  groups: [
    {name: 'details', title: 'Details', default: true},
    {name: 'label', title: 'Label information'},
    {name: 'merchandising', title: 'Merchandising'},
  ],
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      group: 'details',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      group: 'details',
      description: 'Used in the web address. Changing this breaks existing links.',
      options: {source: 'name', maxLength: 96},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'summary',
      type: 'string',
      group: 'details',
      description: 'One line shown on product cards. Keep it under 80 characters.',
      validation: (rule) => rule.required().max(90),
    }),
    defineField({
      name: 'description',
      type: 'text',
      rows: 5,
      group: 'details',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'price',
      title: 'Price (pence)',
      type: 'number',
      group: 'details',
      description: 'In pence, so £7.50 is 750. Money is never stored as a decimal.',
      validation: (rule) => rule.required().integer().positive(),
    }),
    defineField({
      name: 'compareAtPrice',
      title: 'Was price (pence)',
      type: 'number',
      group: 'details',
      description: 'Only set this when the product is on offer. Leave empty otherwise.',
      validation: (rule) =>
        rule
          .integer()
          .positive()
          .custom((value, context) => {
            const price = (context.document as {price?: number} | undefined)?.price
            if (value === undefined || price === undefined) return true
            return value > price || 'The was price must be higher than the current price'
          }),
    }),
    defineField({
      name: 'size',
      title: 'Net weight or volume',
      type: 'string',
      group: 'details',
      description:
        'Exactly as printed on the jar, for example "250g". Shoppers ask this before they buy.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'category',
      type: 'reference',
      group: 'details',
      to: [{type: 'productCategory'}],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'heat',
      type: 'string',
      group: 'details',
      description: 'Leave empty for products that are not labelled mild or hot.',
      options: {
        list: [
          {title: 'Mild', value: 'mild'},
          {title: 'Hot', value: 'hot'},
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'image',
      title: 'Main image',
      type: 'image',
      group: 'details',
      description: 'Packshot on a white background.',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
          description: 'Describe the product for screen readers and search engines.',
          validation: (rule) => rule.required(),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'images',
      title: 'Additional images',
      type: 'array',
      group: 'details',
      of: [
        defineArrayMember({
          type: 'image',
          options: {hotspot: true},
          fields: [
            defineField({
              name: 'alt',
              type: 'string',
              title: 'Alternative text',
              validation: (rule) => rule.required(),
            }),
          ],
        }),
      ],
    }),

    defineField({
      name: 'ingredients',
      type: 'array',
      group: 'label',
      description:
        'Copy exactly from the jar, one ingredient per entry. Never guess: this is a legal and safety requirement.',
      of: [defineArrayMember({type: 'string'})],
    }),
    defineField({
      name: 'allergens',
      type: 'array',
      group: 'label',
      description: 'For example "Fish" or "Wheat (gluten)". Leave empty only if there are none.',
      of: [defineArrayMember({type: 'string'})],
    }),
    defineField({
      name: 'dietary',
      title: 'Dietary claims',
      type: 'array',
      group: 'label',
      description: 'Claims printed on the packaging, such as "Suitable for vegans".',
      of: [defineArrayMember({type: 'string'})],
    }),

    defineField({
      name: 'storage',
      title: 'Storage guidance',
      type: 'text',
      rows: 2,
      group: 'label',
      description:
        'Copy from the jar, for example "Refrigerate after opening and use within 4 weeks."',
    }),
    defineField({
      name: 'nutrition',
      title: 'Nutrition (per 100g)',
      type: 'array',
      group: 'label',
      description: 'Optional. Copy the values from the label exactly.',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'label', type: 'string', validation: (rule) => rule.required()}),
            defineField({name: 'value', type: 'string', validation: (rule) => rule.required()}),
          ],
          preview: {select: {title: 'label', subtitle: 'value'}},
        }),
      ],
    }),
    defineField({
      name: 'servingSuggestions',
      title: 'Best paired with',
      type: 'array',
      group: 'details',
      description: 'Dishes and ideas, one per entry. This is what helps people picture a meal.',
      of: [defineArrayMember({type: 'string'})],
    }),

    defineField({
      name: 'availability',
      type: 'string',
      group: 'merchandising',
      initialValue: 'inStock',
      options: {
        list: [
          {title: 'In stock', value: 'inStock'},
          {title: 'Out of stock', value: 'outOfStock'},
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'isNew',
      title: 'Show "New" badge',
      type: 'boolean',
      group: 'merchandising',
      initialValue: false,
    }),
    defineField({
      name: 'featured',
      title: 'Show in Featured on the homepage',
      type: 'boolean',
      group: 'merchandising',
      initialValue: false,
    }),
    defineField({
      name: 'bestSeller',
      title: 'Show in Best sellers on the homepage',
      type: 'boolean',
      group: 'merchandising',
      initialValue: false,
    }),
    defineField({
      name: 'order',
      title: 'Sort order',
      type: 'number',
      group: 'merchandising',
      description: 'Lower numbers appear first. Products without a number come last.',
    }),
  ],
  orderings: [
    {
      name: 'manual',
      title: 'Sort order',
      by: [
        {field: 'order', direction: 'asc'},
        {field: 'name', direction: 'asc'},
      ],
    },
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'summary',
      media: 'image',
      availability: 'availability',
    },
    prepare({title, subtitle, media, availability}) {
      return {
        title,
        subtitle: availability === 'outOfStock' ? `Out of stock — ${subtitle}` : subtitle,
        media,
      }
    },
  },
})
