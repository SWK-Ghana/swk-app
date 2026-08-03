// Seed script: publishes the program & initiative blog posts to Sanity.
// Usage: node scripts/seed-program-posts.js
// Requires an Editor-role write token in .env (SANITY_TOKEN or VITE_SANITY_TOKEN).

import { createClient } from '@sanity/client'
import { readFileSync } from 'fs'
import { posts } from './program-blog-posts-data.js'

// Parse .env manually (works on any Node >= 18 without --env-file flag)
const envPath = new URL('../.env', import.meta.url)
let env = {}
try {
  env = Object.fromEntries(
    readFileSync(envPath, 'utf8')
      .split('\n')
      .filter((line) => line.includes('=') && !line.startsWith('#'))
      .map((line) => {
        const idx = line.indexOf('=')
        return [line.slice(0, idx).trim(), line.slice(idx + 1).trim()]
      })
  )
} catch {
  // fall back to process.env
}

const projectId = env.VITE_SANITY_PROJECT_ID || process.env.VITE_SANITY_PROJECT_ID || 'qaen86pl'
const token = env.SANITY_TOKEN || env.VITE_SANITY_TOKEN || process.env.SANITY_TOKEN || process.env.VITE_SANITY_TOKEN

if (!token) {
  console.error('Missing write token. Set SANITY_TOKEN (or VITE_SANITY_TOKEN) in .env')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token,
})

console.log(`\nSeeding ${posts.length} program posts to Sanity project ${projectId}...\n`)

let created = 0
let failed = 0

for (const post of posts) {
  try {
    // Idempotent: use a deterministic _id from the slug so re-running updates
    // rather than duplicating.
    const _id = `program-${post.slug.current}`
    const doc = await client.createOrReplace({ _id, ...post })
    console.log(`✓  ${doc.title}`)
    created++
  } catch (err) {
    const detail = err?.response?.body?.error?.description || err?.message || String(err)
    if (detail.toLowerCase().includes('permission')) {
      console.error('\n⚠️  PERMISSION ERROR: the token is read-only or invalid.')
      console.error('   Go to sanity.io/manage → project qaen86pl → API → Tokens,')
      console.error('   create an "Editor" token, and set it as SANITY_TOKEN in .env, then re-run.\n')
      process.exit(1)
    }
    console.error(`✗  FAILED: ${post.title}`)
    console.error(`   ${detail}`)
    failed++
  }
}

console.log(`\nDone: ${created} created/updated, ${failed} failed.`)
if (created > 0) {
  console.log('Posts appear on swkghana.org/blog immediately (bypasses CDN).')
}
