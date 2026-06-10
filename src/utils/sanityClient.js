// src/utils/sanityClient.js
import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

export const client = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
  token: import.meta.env.VITE_SANITY_TOKEN,
})

// Write client for admin mutations — CDN must be disabled for writes
export const writeClient = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: import.meta.env.VITE_SANITY_TOKEN,
})

const builder = imageUrlBuilder(client)
export const urlFor = (source) => builder.image(source)