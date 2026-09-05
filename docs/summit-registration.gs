/**
 * SWK Ghana Agribusiness Summit 2026 — registration endpoint.
 *
 * Receives submissions from the form on https://swkghana.org/summit and
 * appends one row per registration to the Google Sheet below.
 *
 * ─── SETUP (about 5 minutes, done once) ─────────────────────────────────────
 *
 *  1. Open the Sheet:
 *     https://docs.google.com/spreadsheets/d/1KvonhREA6cHcs2Roj2jd0mm49UWatykomSbJq6ObzzE/edit
 *
 *  2. Extensions → Apps Script. Delete whatever is in the editor and paste
 *     this entire file in. Save.
 *
 *  3. Deploy → New deployment → gear icon → Web app.
 *       Description:  Summit registration
 *       Execute as:   Me
 *       Who has access: ANYONE            <-- must be "Anyone", not
 *                                             "Anyone with Google account",
 *                                             or the form gets a login page
 *     Deploy. Approve the permissions prompt (it is your own script writing
 *     to your own Sheet).
 *
 *  4. Copy the Web app URL. It looks like:
 *       https://script.google.com/macros/s/AKfycb..../exec
 *
 *  5. Paste that URL into public/summit-2026.html, replacing the empty string
 *     in:   const ENDPOINT = ''
 *     Then commit and push.
 *
 *  6. Test: visit the URL in a browser. You should see {"ok":true,...}.
 *
 * ─── IF YOU EVER EDIT THIS SCRIPT ───────────────────────────────────────────
 * Deploy → Manage deployments → pencil → Version: New version → Deploy.
 * Editing alone does nothing until you publish a new version. The URL stays
 * the same, so the website needs no change.
 *
 * ─── NOTE ON COLUMN ORDER ───────────────────────────────────────────────────
 * ROW_FIELDS below must stay in the same order as the Sheet's header row.
 * Add new questions at the END of both, never in the middle, or historic rows
 * will no longer line up with their headers.
 */

var SHEET_ID = '1KvonhREA6cHcs2Roj2jd0mm49UWatykomSbJq6ObzzE';

// Order must match the Sheet header row (after the Timestamp column).
var ROW_FIELDS = [
  'fullName',
  'age',
  'gender',
  'phone',
  'email',
  'location',
  'education',
  'status',
  'study',
  'inAgri',
  'agriDetails',
  'interest',
  'why',
  'gain',
  'hasVenture',
  'ventureDetails',
  'needs',
  'heard',
  'consentContact',
  'consentPhotos',
  'consentNewsletter',
  'source',
];

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/** Visiting the deployment URL in a browser hits this — a quick health check. */
function doGet() {
  return json({ ok: true, status: 'ready', service: 'SWK Summit 2026 registration' });
}

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return json({ ok: false, error: 'empty request' });
    }

    var data = JSON.parse(e.postData.contents);

    // Honeypot: the form ships a hidden field no human ever fills in. Bots do.
    // Answer 200 so the bot believes it succeeded and does not retry.
    if (data.company) return json({ ok: true });

    var sheet = SpreadsheetApp.openById(SHEET_ID).getSheets()[0];

    var row = [new Date()];
    for (var i = 0; i < ROW_FIELDS.length; i++) {
      var v = data[ROW_FIELDS[i]];
      if (Array.isArray(v)) v = v.join('; ');       // checkbox groups
      // Leading ' keeps Sheets from mangling "+233..." into a formula/number.
      if (typeof v === 'string' && v.charAt(0) === '+') v = "'" + v;
      row.push(v === undefined || v === null ? '' : v);
    }

    // Serialise concurrent submissions so two people registering at the same
    // moment cannot write to the same row.
    var lock = LockService.getScriptLock();
    lock.waitLock(20000);
    try {
      sheet.appendRow(row);
    } finally {
      lock.releaseLock();
    }

    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}
