import type {StructureResolver} from 'sanity/structure'
import {PackageIcon} from '@sanity/icons/Package'
import {BookIcon} from '@sanity/icons/Book'
import {TagIcon} from '@sanity/icons/Tag'

/**
 * What Efamy sees when they sign in.
 *
 * The default Studio lists every document type raw, in schema order, which
 * reads as a database browser rather than a place to run a shop. This puts the
 * two things that change often at the top and tucks the one that almost never
 * changes underneath.
 *
 * Products are grouped by category because that is how the shop is organised
 * and how someone thinks when they go looking for a jar.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Efamy')
    .items([
      S.listItem()
        .title('Products')
        .icon(PackageIcon)
        .child(
          S.documentTypeList('productCategory')
            .title('Products by category')
            .child((categoryId) =>
              S.documentList()
                .title('Products')
                .filter('_type == "product" && category._ref == $categoryId')
                .params({categoryId})
                .apiVersion('2026-05-15'),
            ),
        ),

      S.listItem()
        .title('All products')
        .icon(PackageIcon)
        .child(S.documentTypeList('product').title('All products')),

      S.divider(),

      S.listItem()
        .title('Recipes')
        .icon(BookIcon)
        .child(S.documentTypeList('recipe').title('Recipes')),

      S.divider(),

      // Rarely touched: three categories that map to the shop's filters.
      S.listItem()
        .title('Categories')
        .icon(TagIcon)
        .child(S.documentTypeList('productCategory').title('Categories')),
    ])
