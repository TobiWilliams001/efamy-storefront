import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
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

  plugins: [structureTool({structure}), ...(isDev ? [visionTool()] : [])],

  schema: {
    types: schemaTypes,
  },
})
