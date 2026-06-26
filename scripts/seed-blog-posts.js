// Seed script: publishes all 15 blog posts to Sanity
// Usage: node scripts/seed-blog-posts.js
// Requires an Editor-role VITE_SANITY_TOKEN in .env

import { createClient } from '@sanity/client'
import { readFileSync } from 'fs'
import { posts } from './blog-posts-data.js'

// Parse .env manually — works on any Node >= 18 without --env-file flag
const envPath = new URL('../.env', import.meta.url)
const env = Object.fromEntries(
  readFileSync(envPath, 'utf8')
    .split('\n')
    .filter((line) => line.includes('=') && !line.startsWith('#'))
    .map((line) => {
      const idx = line.indexOf('=')
      return [line.slice(0, idx).trim(), line.slice(idx + 1).trim()]
    })
)

const projectId = env.VITE_SANITY_PROJECT_ID
const token = env.VITE_SANITY_TOKEN

if (!projectId || !token) {
  console.error('Missing VITE_SANITY_PROJECT_ID or VITE_SANITY_TOKEN in .env')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token,
})

console.log(`\nSeeding ${posts.length} posts to Sanity project ${projectId}...\n`)

let created = 0
let failed = 0

for (const post of posts) {
  try {
    const doc = await client.create(post)
    console.log(`✓  ${doc.title}`)
    created++
  } catch (err) {
    const detail = err?.response?.body?.error?.description || err?.message || String(err)
    if (detail.toLowerCase().includes('insufficient permissions') || detail.toLowerCase().includes('permission')) {
      console.error('\n⚠️  PERMISSION ERROR — the token is read-only.')
      console.error('   Go to sanity.io/manage → project qaen86pl → API → Tokens')
      console.error('   Create a new token with the "Editor" role, then update VITE_SANITY_TOKEN in .env\n')
      process.exit(1)
    }
    console.error(`✗  FAILED: ${post.title}`)
    console.error(`   ${detail}`)
    failed++
  }
}

console.log(`\nDone — ${created} created, ${failed} failed.`)
if (created > 0) {
  console.log('Posts will appear on swkghana.org/blog immediately (bypasses CDN).')
}
