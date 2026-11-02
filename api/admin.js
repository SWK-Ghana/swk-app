// Vercel serverless function: the staff dashboard's only door to the database.
//
// The Sanity write token lives here on the server and never reaches the browser.
// Staff sign in with their own accounts; every action checks their role.
//
// Required environment variables (Vercel → Project → Settings → Env):
//   SANITY_TOKEN          Sanity Editor token (server secret)
//   ADMIN_SESSION_SECRET  Random string used to sign session tokens
//   ADMIN_PASSWORD        Used once, to create the first Owner account
//   SANITY_PROJECT_ID     Optional, defaults to 'qaen86pl'
//   SANITY_DATASET        Optional, defaults to 'production'

import { createHandler } from './_lib/handler.js'
import { sanityStore } from './_lib/store.js'

export default createHandler(() => sanityStore(process.env.SANITY_TOKEN))
