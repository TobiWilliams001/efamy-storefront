import type {StructureResolver} from 'sanity/structure'
import {PackageIcon} from '@sanity/icons/Package'
import {BookIcon} from '@sanity/icons/Book'
import {TagIcon} from '@sanity/icons/Tag'
import {BasketIcon} from '@sanity/icons/Basket'
import {WarningOutlineIcon} from '@sanity/icons/WarningOutline'

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
        .id('products')
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
        .id('all-products')
        .title('All products')
        .icon(PackageIcon)
        .child(S.documentTypeList('product').title('All products')),

      S.divider(),

      /*
       * Stock, as three questions rather than one list: what has run out, what
       * is nearly out, and everything. The first two are what someone opens the
       * Studio to check, so they do not have to hunt through the range to find
       * them.
       *
       * A product appears in "Sold out" only when every size is at zero, and in
       * "Running low" when any size is down to five or fewer. Sizes with no
       * number are not counted and never appear.
       */
      S.listItem()
        .id('stock')
        .title('Stock')
        .icon(BasketIcon)
        .child(
          S.list()
            .title('Stock')
            .items([
              S.listItem()
                .id('sold-out')
                .title('Sold out')
                .icon(WarningOutlineIcon)
                .child(
                  S.documentList()
                    .title('Sold out')
                    .filter(
                      '_type == "product" && count(variants[defined(stock)]) > 0 && count(variants[defined(stock) && stock > 0]) == 0',
                    )
                    .apiVersion('2026-05-15'),
                ),
              S.listItem()
                .id('running-low')
                .title('Running low')
                .icon(WarningOutlineIcon)
                .child(
                  S.documentList()
                    .title('Running low, five or fewer')
                    .filter(
                      '_type == "product" && count(variants[defined(stock) && stock > 0 && stock <= 5]) > 0',
                    )
                    .apiVersion('2026-05-15'),
                ),
              S.divider(),
              S.listItem()
                .id('every-product')
                .title('Every product')
                .icon(PackageIcon)
                .child(S.documentTypeList('product').title('Every product')),
            ]),
        ),

      S.divider(),

      S.listItem()
        .id('recipes')
        .title('Recipes')
        .icon(BookIcon)
        .child(S.documentTypeList('recipe').title('Recipes')),

      S.divider(),

      // Rarely touched: three categories that map to the shop's filters.
      S.listItem()
        .id('categories')
        .title('Categories')
        .icon(TagIcon)
        .child(S.documentTypeList('productCategory').title('Categories')),
    ])
