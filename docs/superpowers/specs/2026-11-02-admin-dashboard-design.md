# Admin dashboard, release 1: accounts, overview, donations and receipts

Approved by the founder on 2026-11-02. Parts 3-5 (registrations, website
analytics, quality control) follow in their own specs on the same shell.

## Goal

Replace the single-password blog editor at `/admin` with a staff dashboard:
personal logins with roles, a decision overview, and shared donation receipts.
Fundraising closes 6 November 2026 and the Summit is on 7 November.

## Constraints

- The GitHub repo is public and the Sanity dataset is publicly readable. The
  signature, staff records and donor records must never be in the repo or in
  ordinary Sanity documents.
- Sanity documents with a dot in `_id` are private: tested 2026-11-02, an
  anonymous client could not read one by query, by type or by id, a token could,
  and a second `create` on the same id returned 409.
- `VITE_` values ship to the browser. Nothing here uses one.
- All writes go through the server function. The browser never holds a token.

## Roles

| Role | Access |
|---|---|
| owner | Everything: staff, signature, campaign, earlier receipts |
| finance | Issue, correct and cancel receipts; read donations |
| content | Posts and marketplace |
| viewer | Overview aggregates only |

The server enforces every role check. Each request re-reads the account, so a
removed or changed person loses access at once.

## Data (private Sanity documents)

- `admin.user.<uuid>` `adminUser`: name, email (lowercase), role, active,
  passwordHash (scrypt with per-user salt), mustChangePassword, failedLogins,
  lockedUntil, sessionVersion.
- `receipts.SWK-YYYY-NNNN` `donationReceipt`: no, issued, name, amount, date,
  method, txn, purpose, note, status (issued/cancelled), issuedBy, issuedAt,
  updatedBy, updatedAt, cancelledBy, cancelledAt, cancelReason.
- `receipts.signature` `receiptSignature`: dataUri (PNG/JPEG, 300 KB maximum).
- `admin.campaign` `adminCampaign`: name, purpose, target 26000, seatPrice 260,
  seats 100, deadline 2026-11-06.

## Server (`api/admin.js`, helpers in `api/_lib/`)

- `setup`: only while no account exists; needs `ADMIN_PASSWORD`, creates the
  owner. Once any account exists `ADMIN_PASSWORD` is refused.
- `login` by email and password. Unknown email and wrong password return the
  same error after the same hashing work. Five failures lock the account for
  15 minutes. Sessions are HMAC-signed with user id and sessionVersion, 8 hours.
- `users.*` (owner): list, create with a temporary password, set role, reset
  password, deactivate. Owner cannot deactivate or demote the last owner.
- `password.change`: any signed-in user; required when mustChangePassword.
- `receipts.issue` (finance, owner): the server picks highest number + 1 for the
  year and uses `create`; on 409 it retries up to five times.
- `receipts.record` (owner): the same with a chosen number, for earlier receipts.
- `receipts.update` (finance, owner): name, amount, date, method, txn, purpose,
  note; keeps the number; records who.
- `receipts.cancel` (finance, owner): needs a reason. No delete action exists.
- `receipts.list`, `signature.get` (finance, owner). `signature.set` (owner).
- `overview` (all roles): aggregates only, no donor details.
- `campaign.set` (owner).
- Existing `create`, `patch`, `delete` become content/owner only, and reject any
  `_id` containing a dot, so they cannot reach accounts or receipts.

Input is validated on the server: amount above 0 and below 1,000,000, name up
to 120 characters, date in ISO format, status never client-set.

## Interface

`/admin` keeps its route. Screens: Overview, Donations and receipts, Posts,
Marketplace, Team (owner). The sidebar shows only what the role allows.
Receipts render from one `receiptHtml(data)` function that escapes all input,
shown in an iframe and printed from it, so the site's styles cannot affect
the A5 PDF. The layout matches the approved local receipt tool.

Overview: raised against target, seats funded (raised / seatPrice, rounded
down), days left, receipts issued, marketplace products awaiting review.
Cancelled receipts are excluded from totals.

## Errors

Expired sessions return to login with a message. A failed issue shows the error
and never prints. Printing happens only after the server returns a number.

## Testing

Server: `node --test` against an in-memory fake of Sanity, covering role denials,
dotted-id rejection, lockout, last-owner protection, number races and setup
closing. Interface: built site in headless Chrome with a stubbed `/api/admin`,
checking each role's menu, an issued receipt and one A5 page. No real data is
used; the first real login is done by the founder after deployment.

## Migration

The local tool stays until the founder has entered the existing receipts
(starting with SWK-2026-0002) through `receipts.record`, and uploaded
the signature.

## Out of scope

Emailing receipts, self-service password reset, two-step codes.
