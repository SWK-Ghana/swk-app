# Admin dashboard, release 2: registrations, website visitors, quality checks

Follows `2026-11-02-admin-dashboard-design.md`, on the same server and shell. The
founder asked on 2026-11-03 for everything left to be built. Same constraints: the
repo and the Sanity dataset are public, so nothing personal goes in either.

## Registrations

The four form scripts (`docs/*.gs`) gain a read-only `stats()` reached through
`doGet`. It needs `STATS_KEY`, which is blank in the public repo, so the feature
is off there. The private copies the founder pastes carry the key, and Vercel
holds the same value as `REGISTRATION_STATS_KEY`.

A response holds counts only: total, last 7 days, the 7 days before, per-day
counts for 30 days, the latest date, repeat emails, and groups for the closed
questions in `STATS_FIELDS`. A group under 3 people folds into "Other". Free-text
answers are never read. The script never writes to the Sheet.

`registrations` (every role) asks all four and gives each a state: `ok`,
`not-connected`, `needs-update`, `refused` or `unreachable`. One slow form cannot
hold up the rest.

## Website visitors

This replaces the plan to wait for a Google Analytics ID: reading GA back into the
dashboard would also need a Google Cloud service account, and GA needs consent.

`public/visit.js` reports the page, and on the first page of a visit the referring
site, to `POST /api/visit`. It sets no cookies; a `sessionStorage` flag marks the
visit as already counted. The server adds device type (from the user agent) and
country (from Vercel's header), then increments private daily totals in
`analytics.YYYY-MM-DD`. IP addresses are held briefly in memory for rate limiting
and never stored.

Reports are dropped unless they come from swkghana.org, are not from a known bot,
and name a valid page. `/admin` and `/api` are never counted. One address can save
120 reports a minute per server instance, which protects the Sanity quota.

`visitors` (every role) returns today, 7 days, the week before, 30 days, 30 daily
counts, and top pages, sources, devices, countries and actions.

Counting starts at deployment, so there is no earlier history.

## Quality checks

`quality` runs grouped checks and returns pass, warn or fail with a link to the
screen that fixes each one. A group that errors reports that and the others carry
on. Results use receipt numbers, never donor names.

| Group | Who sees it | Checks |
|---|---|---|
| Website | Everyone | Key pages load, HTTPS is enforced |
| Registration forms | Everyone | Connected, answering, repeat entries |
| Visit counter | Everyone | Something recorded in two days |
| Donations and receipts | Owner, finance | Signature, numbering gaps, repeated transaction IDs, missing transaction ID or payment date, campaign closed |
| Website content | Owner, content | Cover images, summaries, drafts, blog freshness, marketplace reviews and incomplete listings |
| Team | Owner | More than one Owner, temporary passwords |

The Overview shows the worst five problems, Summit registrations beside seats
funded, weekly visits, and the daily amount needed to reach the target. Its slower
sources load separately, so they never hold up the page.

## Testing

Server tests use the fake store and a pretend internet. The real `.gs` files run
in a sandbox against a pretend Sheet, proving that no name, email, phone number or
free text comes out and that nothing is written. The interface is tested in
headless Chrome, including the built site served under the real address so the
counter's behaviour is checked without touching the live site. The Sanity mutation
was validated with `dryRun=true`.

## Founder steps

Paste the four private scripts and publish a new version of each, then add
`REGISTRATION_STATS_KEY` in Vercel and redeploy. Until then each form shows why it
has no numbers. Visitors and quality checks need nothing.
