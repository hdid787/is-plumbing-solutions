import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './sanity/schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'Is Plumbing Solution',

  // Hardcode the project ID and dataset (they never change)
  projectId: 'u8s8h6tm',
  dataset: 'production',

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
})