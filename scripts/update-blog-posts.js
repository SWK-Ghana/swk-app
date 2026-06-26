// Patches existing Sanity posts with updated content + cover images
// Usage: node scripts/update-blog-posts.js

import { createClient } from '@sanity/client'
import { readFileSync } from 'fs'
import { posts } from './blog-posts-data.js'

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

console.log(`\nUpdating ${posts.length} posts in Sanity project ${projectId}...\n`)

let updated = 0
let created = 0
let failed = 0

for (const post of posts) {
  try {
    const existingId = await client.fetch(
      `*[_type == "post" && slug.current == $slug][0]._id`,
      { slug: post.slug.current }
    )

    if (existingId) {
      await client.patch(existingId).set({
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        coverImageUrl: post.coverImageUrl || '',
        category: post.category,
      }).commit()
      console.log(`✓  Updated: ${post.title}`)
      updated++
    } else {
      const doc = await client.create(post)
      console.log(`+  Created: ${doc.title}`)
      created++
    }
  } catch (err) {
    const detail = err?.response?.body?.error?.description || err?.message || String(err)
    if (detail.toLowerCase().includes('permission')) {
      console.error('\n Permission error — check that the token has Editor role.\n')
      process.exit(1)
    }
    console.error(`✗  Failed: ${post.title}`)
    console.error(`   ${detail}`)
    failed++
  }
}

console.log(`\nDone — ${updated} updated, ${created} created, ${failed} failed.`)
