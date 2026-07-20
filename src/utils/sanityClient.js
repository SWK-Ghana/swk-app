// src/utils/sanityClient.js
import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID
const dataset = import.meta.env.VITE_SANITY_DATASET || 'production'

// Public, READ-ONLY client. The `production` dataset is publicly readable, so
// NO token is shipped to the browser. All writes go through the server-side
// serverless function at /api/admin (see src/utils/adminApi.js), which holds
// the Sanity write token as a server-only secret. Never add a token here — a
// token in the client bundle is downloadable by anyone.
export const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  useCdn: true,
})

const builder = imageUrlBuilder(client)
export const urlFor = (source) => builder.image(source)
