/**
 * SWK Ghana Agribusiness Summit 2026 — registration endpoint.
 *
 * Receives submissions from the form on https://swkghana.org/summit and
 * appends one row per registration to the Google Sheet below.
 *
 * ─── SETUP (about 5 minutes, done once) ─────────────────────────────────────
 *
 *  0. Sign in to Google as sustainabilitywithkoomson@gmail.com FIRST, and do
 *     every step below while signed in as that account. Apps Script needs a
 *     Google account; info@swkghana.org is free Zoho, so it cannot host this.
 *     "Execute as: Me" in step 3 binds to whoever is signed in, so getting
 *     this wrong ties the endpoint to the wrong person.
 *
 *  1. Open the Sheet (already shared with that account as an editor):
 *     https://docs.google.com/spreadsheets/d/1KvonhREA6cHcs2Roj2jd0mm49UWatykomSbJq6ObzzE/edit
 *
 *     Optional but recommended: have frankkoomson26@gmail.com transfer
 *     ownership to sustainabilitywithkoomson@gmail.com, so registrant data
 *     lives on the organisation account rather than a personal one.
 *     Share → click the account → Transfer ownership.
 *
 *  2. Extensions → Apps Script. Delete whatever is in the editor and paste
 *     this entire file in. Save.
 *
 *  3. Deploy → New deployment → gear icon → Web app.
 *       Description:  Summit registration
 *       Execute as:   Me                  <-- must read
 *                                             sustainabilitywithkoomson@gmail.com
 *       Who has access: ANYONE            <-- must be "Anyone", not
 *                                             "Anyone with Google account",
 *                                             or the form gets a login page
 *     Deploy. Approve the permissions prompt (it is your own script writing
 *     to a Sheet you can edit).
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
 * ─── DASHBOARD TOTALS ───────────────────────────────────────────────────────
 * The staff dashboard reads totals through doGet with a private key. The copy
 * of this file in the public repo leaves STATS_KEY blank. Paste the private copy
 * from the founder's computer, then publish a new version as described below.
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
function doGet(e) {
  if (e && e.parameter && e.parameter.stats) return json(stats(e.parameter.stats));
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

// ─── Dashboard totals ─────────────────────────────────────────────────────────
// Read-only: this never changes the Sheet. It returns counts for the staff
// dashboard and never a person's answers. Only the questions in STATS_FIELDS are
// counted, and a group smaller than STATS_MIN_GROUP is folded into "Other", so
// nobody can be picked out. Email is used only to count repeat entries.
// STATS_KEY stays blank in the public copy of this file, which turns this off.

var STATS_KEY = '';
var STATS_MIN_GROUP = 3;
var STATS_TOP_GROUPS = 8;
var STATS_DAY_MS = 24 * 60 * 60 * 1000;
var STATS_FIELDS = {
  gender: {},
  age: { bands: true },
  location: { lastPart: true },
  status: {},
  education: {},
  interest: {},
  heard: {},
};

function statsAgeBand(text) {
  var age = parseInt(text, 10);
  if (!age) return 'Not stated';
  if (age < 18) return 'Under 18';
  if (age <= 24) return '18 to 24';
  if (age <= 35) return '25 to 35';
  return '36 and over';
}

function statsValues(raw, rule) {
  var text = String(raw === undefined || raw === null ? '' : raw).trim();
  if (rule.bands) return [statsAgeBand(text)];
  if (!text) return ['Not stated'];
  if (rule.lastPart) {
    var place = text.split(',').pop().trim().toLowerCase();
    return [place.replace(/(^|\s)\S/g, function (c) { return c.toUpperCase(); })];
  }
  return text.split(';').map(function (v) { return v.trim(); }).filter(Boolean);
}

function statsGroups(counts) {
  var names = Object.keys(counts).sort(function (a, b) { return counts[b] - counts[a]; });
  var groups = [];
  var other = 0;
  names.forEach(function (name) {
    if (name === 'Other' || counts[name] < STATS_MIN_GROUP || groups.length >= STATS_TOP_GROUPS) {
      other += counts[name];
    } else {
      groups.push({ name: name.slice(0, 60), count: counts[name] });
    }
  });
  if (other) groups.push({ name: 'Other', count: other });
  return groups;
}

function stats(key) {
  if (!STATS_KEY || key !== STATS_KEY) return { ok: false, error: 'not allowed' };

  var rows = SpreadsheetApp.openById(SHEET_ID).getSheets()[0].getDataRange().getValues();
  var fields = Object.keys(STATS_FIELDS);
  var emailColumn = ROW_FIELDS.indexOf('email') + 1;
  var now = Date.now();
  var counts = {};
  var daily = {};
  var seen = {};
  var result = { ok: true, total: 0, last7: 0, previous7: 0, duplicates: 0, latest: '' };
  fields.forEach(function (field) { counts[field] = {}; });

  rows.forEach(function (row) {
    var when = new Date(row[0]);
    if (isNaN(when.getTime())) return; // the header row, or a blank one

    result.total++;
    var daysAgo = (now - when.getTime()) / STATS_DAY_MS;
    var day = when.toISOString().slice(0, 10);
    if (daysAgo < 7) result.last7++;
    else if (daysAgo < 14) result.previous7++;
    if (daysAgo < 30) daily[day] = (daily[day] || 0) + 1;
    if (day > result.latest) result.latest = day;

    fields.forEach(function (field) {
      var column = ROW_FIELDS.indexOf(field) + 1;
      statsValues(row[column], STATS_FIELDS[field]).forEach(function (value) {
        counts[field][value] = (counts[field][value] || 0) + 1;
      });
    });

    var email = String(row[emailColumn] || '').trim().toLowerCase();
    if (email && seen[email]) result.duplicates++;
    seen[email] = true;
  });

  result.daily = daily;
  result.groups = {};
  fields.forEach(function (field) { result.groups[field] = statsGroups(counts[field]); });
  return result;
}
