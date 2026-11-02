# Admin dashboard, release 1: implementation plan

Spec: `docs/superpowers/specs/2026-11-02-admin-dashboard-design.md`.

**Goal:** personal logins with roles, an overview, and shared receipts on `/admin`.

**Architecture:** one Vercel function, `api/admin.js`, built from
`createHandler(makeStore, env)` in `api/_lib/handler.js`. All GROQ lives in
`api/_lib/store.js`, so tests swap in an in-memory store of the same interface.
The front end is `src/components/Admin.jsx` (gate and shell) with screens in
`src/components/admin/`.

**Tech:** Node crypto (scrypt, HMAC), Sanity HTTP API, React 19, Tailwind 3, `node --test`.

## Global constraints

- No signature, staff or donor data in the repo. Private documents have dotted ids.
- No new `VITE_` values. The browser only ever holds a session token.
- Commit by pathspec only; other chats share this tree.

## Tasks

1. **Server core:** `api/_lib/security.js`, `store.js`, `handler.js`, `accounts.js`,
   `receipts.js`, `api/admin.js`, `tests/admin-api.test.mjs`, `tests/fake-store.mjs`.
   Tests first: setup closes after the first account; login lockout; generic login
   error; role denials for every action; deactivated users lose access at once;
   mustChangePassword blocks other actions; last owner protected; dotted ids and
   `_type` writes rejected; numbers increase and survive a 409 race; cancelled
   receipts stay listed and leave totals; the overview holds no donor names.
2. **Client API and receipt template:** `src/utils/adminApi.js`,
   `src/components/admin/receiptTemplate.js`, `public/brand/swk-logo.svg`.
3. **Shell:** `src/components/Admin.jsx`, `admin/AdminLogin.jsx`,
   `admin/ContentAdmin.jsx` (moved from the old Admin.jsx); RootLayout hides the
   public header on `/admin`.
4. **Screens:** `admin/Overview.jsx`, `admin/Receipts.jsx`, `admin/Team.jsx`.
5. **Verify:** lint, build, a headless run against a stubbed `/api/admin` for each
   role, and an A5 one-page PDF check. Commit and push.
