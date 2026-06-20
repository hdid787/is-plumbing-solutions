import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './sanity/schemaTypes'   // <-- Changed from 'schema' to 'schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'Is Plumbing Solution',

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,   // <-- Changed from 'schema' to 'schemaTypes'
  },
})