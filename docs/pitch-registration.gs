/**
 * SWK Ghana Elevator Pitch Workshop (17 Sept 2026) — registration endpoint.
 *
 * Receives submissions from the form on https://swkghana.org/pitch and
 * appends one row per registration to the Google Sheet below.
 *
 * This is a SEPARATE deployment from the summit one. Same pattern, different
 * script project, different Sheet. Do not paste this over the summit script.
 *
 * ─── SETUP (about 5 minutes, done once) ─────────────────────────────────────
 *
 *  0. Sign in to Google as sustainabilitywithkoomson@gmail.com FIRST, and do
 *     every step below while signed in as that account. "Execute as: Me" in
 *     step 3 binds to whoever is signed in, so getting this wrong ties the
 *     endpoint to the wrong person.
 *
 *  1. Open the Sheet (already shared with that account as an editor):
 *     https://docs.google.com/spreadsheets/d/1B7evL0kf_ASpdyTLVINFXuqzuRepcNv6XIsHCvVu4uk/edit
 *
 *  2. Go to script.google.com → New project. Select EVERYTHING in the editor
 *     (Ctrl+A), delete it so the editor is completely empty, then paste this
 *     whole file in. Save (Ctrl+S).
 *
 *     Line 1 must be the /** that starts this comment. If "function
 *     myFunction() {" is still at the top, the paste landed inside it and
 *     doPost will not be found.
 *
 *     Check: the toolbar dropdown should list json, doGet, doPost.
 *
 *  3. Deploy → New deployment → gear icon → Web app.
 *       Description:  Pitch workshop registration
 *       Execute as:   Me   <-- must read sustainabilitywithkoomson@gmail.com
 *       Who has access: ANYONE   <-- must be "Anyone", not "Anyone with
 *                                    Google account", or the form hits a
 *                                    login page
 *     Deploy, then approve the permissions prompt. Google will warn that the
 *     app is unverified; that is normal for any personal Apps Script.
 *
 *  4. Copy the Web app URL. It looks like:
 *       https://script.google.com/macros/s/AKfycb..../exec
 *
 *  5. Send that URL over and it gets pasted into public/pitch-workshop-2026.html,
 *     replacing the empty string on the ENDPOINT line.
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

var SHEET_ID = '1B7evL0kf_ASpdyTLVINFXuqzuRepcNv6XIsHCvVu4uk';

// Order must match the Sheet header row (after the Timestamp column).
var ROW_FIELDS = [
  'name',
  'email',
  'whatsapp',
  'country',
  'ageGroup',
  'gender',
  'occupation',
  'heard',
  'joinCommunity',
  'source',
];

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  return json({ ok: true, status: 'ready', service: 'SWK Pitch Workshop 2026 registration' });
}

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return json({ ok: false, error: 'empty request' });
    }

    var data = JSON.parse(e.postData.contents);

    // Honeypot: the form ships a hidden field no human ever fills in. Bots do.
    // Answer 200 so the bot believes it succeeded and does not retry.
    // NB: the field is deliberately not named "company" or "organization" —
    // browsers autofill those even with autocomplete="off", which would bin
    // real registrations silently.
    if (data.company) return json({ ok: true });

    var sheet = SpreadsheetApp.openById(SHEET_ID).getSheets()[0];

    var row = [new Date()];
    for (var i = 0; i < ROW_FIELDS.length; i++) {
      var v = data[ROW_FIELDS[i]];
      if (Array.isArray(v)) v = v.join('; ');
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
