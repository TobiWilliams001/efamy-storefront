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
      name: 'variants',
      title: 'Sizes and prices',
      type: 'array',
      group: 'details',
      description:
        'One entry per jar on sale. A sauce made mild and hot has an entry for each size at each strength.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'variant',
          fields: [
            defineField({
              name: 'heat',
              title: 'Strength',
              type: 'string',
              description: 'Leave empty for products sold in one strength, such as the seasonings.',
              options: {
                list: [
                  {title: 'Mild', value: 'mild'},
                  {title: 'Hot', value: 'hot'},
                  {title: 'Extra hot', value: 'extra-hot'},
                ],
                layout: 'radio',
              },
            }),
            defineField({
              name: 'size',
              title: 'Net weight',
              type: 'string',
              description: 'Exactly as printed on the jar, for example "250g".',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'price',
              title: 'Price (pence)',
              type: 'number',
              description: 'In pence, so £4.75 is 475. Money is never a decimal.',
              validation: (rule) => rule.required().integer().positive(),
            }),
            defineField({
              name: 'compareAtPrice',
              title: 'Was price (pence)',
              type: 'number',
              description: 'Only when this size is on offer.',
              validation: (rule) => rule.integer().positive(),
            }),
            defineField({
              name: 'inStock',
              title: 'Available to buy',
              type: 'boolean',
              description:
                'Turn off to take this size off the shop by hand. Leave on and let the number below do it for you.',
              initialValue: true,
            }),
            defineField({
              name: 'stock',
              title: 'Number in stock',
              type: 'number',
              description:
                'How many of this size you have. It counts down as orders come in, and the size comes off the shop by itself at zero. Leave empty if you would rather not count this one.',
              validation: (rule) => rule.integer().min(0),
            }),
            defineField({
              name: 'image',
              title: 'Photograph for this strength',
              type: 'image',
              options: {hotspot: true},
              description:
                'Only where mild and hot look different on the shelf. Left empty, the product photograph is used.',
              fields: [
                defineField({
                  name: 'alt',
                  type: 'string',
                  title: 'Alternative text',
                }),
              ],
            }),
          ],
          preview: {
            select: {title: 'size', price: 'price', inStock: 'inStock'},
            prepare({title, price, inStock}) {
              const pounds = typeof price === 'number' ? (price / 100).toFixed(2) : '?'
              return {
                title: `${title} — £${pounds}`,
                subtitle: inStock === false ? 'Out of stock' : 'In stock',
              }
            },
          },
        }),
      ],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'category',
      type: 'reference',
      group: 'details',
      to: [{type: 'productCategory'}],
      validation: (rule) => rule.required(),
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
      name: 'shelfLife',
      title: 'Shelf life',
      type: 'string',
      group: 'label',
      description: 'As printed, for example "12 months unopened".',
    }),
    defineField({
      name: 'certifications',
      type: 'array',
      group: 'label',
      description:
        'Scheme names only, such as SALSA or BRC. Only add a scheme the business actually holds.',
      of: [defineArrayMember({type: 'string'})],
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
      name: 'bundleItems',
      title: 'Included in this set',
      type: 'array',
      group: 'details',
      description:
        'Only for multipacks and gift sets. List the products inside; leave empty for a single jar.',
      of: [defineArrayMember({type: 'reference', to: [{type: 'product'}]})],
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
    },
  },
})
