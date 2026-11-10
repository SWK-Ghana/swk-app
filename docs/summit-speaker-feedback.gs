/**
 * SWK Ghana Agribusiness Summit 2026 — speaker feedback endpoint.
 *
 * Receives answers from https://swkghana.org/speaker-feedback (speakers,
 * panellists, workshop leads, demonstrators and pitch judges) and appends one
 * row per response to the Google Sheet below.
 *
 * ─── SETUP (about 5 minutes, done once) ─────────────────────────────────────
 *
 *  1. Open the Sheet (created 10 November 2026 in frankkoomson26's Drive):
 *     https://docs.google.com/spreadsheets/d/1f5tsUf43L8N7HD1TETuC-NUDJHb9wUvblv0vlAjcmQs/edit
 *
 *  2. Extensions → Apps Script. Delete whatever is in the editor and paste
 *     this entire file in. Save.
 *
 *  3. Deploy → New deployment → gear icon → Web app.
 *       Description:    Summit speaker feedback
 *       Execute as:     Me
 *       Who has access: ANYONE           <-- must be "Anyone", not
 *                                            "Anyone with Google account",
 *                                            or the form gets a login page
 *     Deploy. Approve the permissions prompt.
 *
 *  4. Copy the Web app URL (https://script.google.com/macros/s/AKfycb..../exec)
 *     and send it to be pasted into public/summit-speaker-feedback.html
 *     (var ENDPOINT = '').
 *
 *  5. Test: visit the URL in a browser. You should see {"ok":true,...}.
 *
 * ─── IF YOU EVER EDIT THIS SCRIPT ───────────────────────────────────────────
 * Deploy → Manage deployments → pencil → Version: New version → Deploy.
 * The URL stays the same, so the website needs no change.
 *
 * ─── NOTE ON COLUMN ORDER ───────────────────────────────────────────────────
 * ROW_FIELDS below must stay in the same order as the Sheet's header row.
 */

var SHEET_ID = '1f5tsUf43L8N7HD1TETuC-NUDJHb9wUvblv0vlAjcmQs';

// Order must match the Sheet header row (after the Timestamp column).
var ROW_FIELDS = [
  'fullName',
  'role',
  'organisation',
  'briefing',
  'logistics',
  'engagement',
  'overall',
  'workedWell',
  'change',
  'readiness',
  'timeAllotted',
  'speakAgain',
  'otherSupport',
  'suggestedSpeakers',
  'consentQuote',
  'contact',
  'source',
];

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/** Visiting the deployment URL in a browser hits this — a quick health check. */
function doGet() {
  return json({ ok: true, status: 'ready', service: 'SWK Summit 2026 speaker feedback' });
}

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return json({ ok: false, error: 'empty request' });
    }

    var data = JSON.parse(e.postData.contents);

    // Honeypot: the form ships a hidden field no human ever fills in. Bots do.
    if (data.company) return json({ ok: true });

    var sheet = SpreadsheetApp.openById(SHEET_ID).getSheets()[0];

    var row = [new Date()];
    for (var i = 0; i < ROW_FIELDS.length; i++) {
      var v = data[ROW_FIELDS[i]];
      if (Array.isArray(v)) v = v.join('; ');       // checkbox groups
      if (typeof v === 'string' && v.charAt(0) === '+') v = "'" + v;
      row.push(v === undefined || v === null ? '' : v);
    }

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
