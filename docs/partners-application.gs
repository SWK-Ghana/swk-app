/**
 * SWK Ghana Agribusiness Summit 2026 — Call for Partners endpoint.
 *
 * Receives submissions from the form on https://swkghana.org/partners and
 * appends one row per application to the Google Sheet below.
 *
 * This is a SEPARATE deployment from the summit registration, pitch workshop,
 * and volunteers scripts. Same pattern, different script project, different
 * Sheet. Do not paste this over any of the others.
 *
 * ─── SETUP (about 5 minutes, done once) ─────────────────────────────────────
 *
 *  0. Sign in to Google as sustainabilitywithkoomson@gmail.com FIRST, and do
 *     every step below while signed in as that account. "Execute as: Me" in
 *     step 3 binds to whoever is signed in, so getting this wrong ties the
 *     endpoint to the wrong person.
 *
 *  1. Open the Sheet (already created and shared with that account as an
 *     editor — it will appear under "Shared with me" since it was created on
 *     frankkoomson26@gmail.com, the same arrangement as the other forms):
 *     https://docs.google.com/spreadsheets/d/1tvTvkSh4ObBWnRMsmrRQc0gigmXg9ClUAjCt9fpW9RA/edit
 *
 *  2. Extensions → Apps Script. Select EVERYTHING in the editor (Ctrl+A),
 *     delete it so the editor is completely empty, then paste this whole
 *     file in. Save (Ctrl+S).
 *
 *     Line 1 must be the /** that starts this comment. If "function
 *     myFunction() {" is still at the top, the paste landed inside it and
 *     doPost will not be found.
 *
 *     Check: the toolbar dropdown should list json, doGet, doPost.
 *
 *  3. Deploy → New deployment → gear icon → Web app.
 *       Description:  Partner applications
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
 *  5. Send that URL over and it gets pasted into
 *     public/summit-call-for-partners.html, replacing the empty string on
 *     the ENDPOINT line. The Sheet gets its header row automatically the
 *     first time a real submission comes in — nothing to type by hand.
 *
 *  6. Test: visit the Web app URL in a browser. You should see
 *     {"ok":true,"status":"ready",...}.
 *
 * ─── IF YOU EVER EDIT THIS SCRIPT ───────────────────────────────────────────
 * Deploy → Manage deployments → pencil → Version: New version → Deploy.
 * Editing alone does nothing until you publish a new version. The URL stays
 * the same, so the website needs no change.
 *
 * ─── NOTE ON COLUMN ORDER ───────────────────────────────────────────────────
 * ROW_FIELDS below must stay in the same order as HEADER_ROW, and both must
 * match the `name` attributes in public/summit-call-for-partners.html. Add
 * new questions at the END of both, never in the middle, or historic rows
 * will no longer line up with their headers.
 */

var SHEET_ID = '1tvTvkSh4ObBWnRMsmrRQc0gigmXg9ClUAjCt9fpW9RA';

// Order must match HEADER_ROW below and the form's field names.
var ROW_FIELDS = [
  'fullName',
  'country',
  'region',
  'partyType',
  'orgName',
  'contactPerson',
  'email',
  'phone',
  'website',
  'orgType',
  'orgTypeOther',
  'howSupport',
  'howSupportOther',
  'finLevel',
  'inKindDetails',
  'contributeTowards',
  'contributeTowardsOther',
  'achieve',
  'longerTerm',
  'anythingElse',
  'consent',
  'source',
];

var HEADER_ROW = [
  'Timestamp',
  'Full name',
  'Country of residence',
  'Region of residence',
  'Organization / Business / Individual',
  'Organisation or business name',
  'Contact person',
  'Email',
  'Phone/WhatsApp',
  'Website or LinkedIn',
  'Type of organisation',
  'Type of organisation (Other)',
  'How would you like to support',
  'How support (Other)',
  'Financial support level',
  'In-kind support details',
  'Contribute towards',
  'Contribute towards (Other)',
  'What hope to achieve',
  'Interested in longer-term partnership?',
  'Anything else?',
  'Consent to data processing',
  'Source URL',
];

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// Puts the header row back whenever it is missing — including when it was
// deleted by accident with responses already in the sheet. In that case a
// blank row is inserted ABOVE the existing responses and the headers are
// written there. No response row is ever moved onto or overwritten.
function ensureHeader(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADER_ROW);
    return;
  }
  if (String(sheet.getRange(1, 1).getValue()) === HEADER_ROW[0]) return;
  sheet.insertRowBefore(1);
  sheet.getRange(1, 1, 1, HEADER_ROW.length).setValues([HEADER_ROW]);
}

// Run this once by hand to restore the header immediately: pick
// "restoreHeaderRow" in the toolbar dropdown, then click Run.
function restoreHeaderRow() {
  ensureHeader(SpreadsheetApp.openById(SHEET_ID).getSheets()[0]);
}

function doGet() {
  return json({ ok: true, status: 'ready', service: 'SWK Call for Partners — Summit 2026' });
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
    // real applications silently.
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

    // Serialise concurrent submissions so two people applying at the same
    // moment cannot write to the same row (or both try to add the header).
    var lock = LockService.getScriptLock();
    lock.waitLock(20000);
    try {
      ensureHeader(sheet);
      sheet.appendRow(row);
    } finally {
      lock.releaseLock();
    }

    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}
