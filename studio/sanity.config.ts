import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {BasketIcon} from '@sanity/icons/Basket'
import {StockTool} from './tools/StockTool'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {structure} from './structure'

/*
 * Vision is a raw GROQ query console. It is genuinely useful when building
 * queries and completely baffling to the person who runs the shop, so it loads
 * in `sanity dev` and is absent from the studio Efamy signs into.
 */
const isDev = process.env.NODE_ENV === 'development'

export default defineConfig({
  name: 'default',
  title: 'Efamy',

  projectId: 'vlmwys9m',
  dataset: 'production',

  plugins: [
    /* "Structure" is what Sanity calls its own machinery. The person using this
       is looking for products, so the tab says Products and the address does
       too. */
    structureTool({structure, name: 'products', title: 'Products'}),
    ...(isDev ? [visionTool()] : []),
  ],

  /* Every size and its number on one page, rather than buried inside each
     product. A stock take is one pass down a list, not twenty documents. */
  tools: (prev) => [
    {name: 'stock', title: 'Stock', icon: BasketIcon, component: StockTool},
    ...prev,
  ],

  schema: {
    types: schemaTypes,
  },

  /* Releases stage content for publishing on a date. Efamy edits a price and
     wants it live, so the tab is only something to explain away. */
  releases: {
    enabled: false,
  },
})
