import { defineCliConfig } from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'u8s8h6tm',
    dataset: 'production',
  },
  deployment: {
    appId: 'xhds4g6xo0gn41pzgocvfot3', // <-- Add this line
  },
})