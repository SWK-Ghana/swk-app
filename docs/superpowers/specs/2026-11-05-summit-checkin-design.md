# Summit check-in: registrations, the door, walk-ins and the attendance report

Built 2026-11-05 for the Agribusiness Summit on 7 November 2026, on the staff
dashboard's server and shell. The founder asked for the registration sheet to be
cleaned of repeats, a check-in and entrance-registration site that cannot
glitch, and a report.

## Data

Attendees are private Sanity documents, `summit.attendee.<id>`, with every
answer from the registration form, `source` (`online` or `walk-in`),
`registeredAt`, `submissions`, and `checkedInAt`/`checkedInBy` once they arrive.
`summit.event` holds the event's name, date and venue, the hashed door code and
its version. Nothing personal is in the repo or the public dataset.

The registration sheet is never written to. The Owner downloads it as CSV and
uploads it on the Summit screen; the import keeps one person per phone or
email, with their latest answers and first registration time, and adds only
people not already on the list, so it can be repeated as registrations come in.

## The door

`swkghana.org/checkin` is a standalone page for volunteers. They sign in with a
door code the Owner sets, not an account; the code gives a 16-hour `door`
session that can only list, check in, undo and register walk-ins. Changing the
code signs every door out. The door's list carries names, towns, the last four
phone digits and any dietary or accessibility needs, never emails or full
numbers.

The page keeps the list and its own actions in the browser's storage. A check-in
shows at once and is sent in the background; if the internet drops, actions
wait and are sent in order when it returns, keeping the time they happened. A
reload while offline still works from the saved list. The server treats a
repeated check-in as already done, and a walk-in whose phone or email is known
checks the existing person in instead of adding a second record.

## The dashboard

The Summit screen (every role) shows counts, the Owner's set-up steps (import,
door code, event details), the attendee table with search and filters,
check-in and undo, corrections (owner and finance), walk-in registration, a CSV
export and the attendance report, rendered in a frame and printed to PDF like
receipts. The Overview's Summit tile switches to check-ins once the list exists.

## Report

Totals (registered, online, entrance, attended, attendance rate, first and last
arrival, needs, consents), arrivals by half hour, attendees by gender, age,
status, interest, education, place, how they heard, agribusiness involvement and
hopes; the same for everyone registered; who checked people in; and lists of
needs, entrance registrations and online no-shows.

## Testing

Server tests cover the import's repeat removal, door sign-in and code changes,
role limits, idempotent check-in, undo, walk-in matching and the report. The
built site runs in headless Chrome with a pretend server: the door page at
phone width, search by name and phone digits, check-in, undo, walk-in, an
internet drop with a reload while offline and the catch-up afterwards, a code
change mid-event, and the dashboard's import, code, table and report.
