/**
 * SWK Ghana Agribusiness Summit 2026 — mentorship requests endpoint.
 *
 * Receives requests from https://swkghana.org/mentorship (mentorship from a
 * named Summit speaker or facilitator, or general mentorship SWK Ghana will
 * match) and appends one row per request to the Google Sheet below.
 *
 * ─── SETUP (about 5 minutes, done once) ─────────────────────────────────────
 *
 *  1. Open the Sheet (created 12 November 2026 in frankkoomson26's Drive):
 *     https://docs.google.com/spreadsheets/d/1BJiIyaFRB60sDLy5g89FjrYWfQ6FEQ-o_zKXloOGVhw/edit
 *     Either do every step below signed in as frankkoomson26 (the owner), or
 *     first share the Sheet with sustainabilitywithkoomson@gmail.com as an
 *     editor. The script runs as whoever deploys it, and that account must be
 *     able to edit the Sheet, or every request fails.
 *
 *  2. Extensions → Apps Script. Delete whatever is in the editor and paste
 *     this entire file in (the private copy with the key, from the founder's
 *     computer). Save.
 *
 *  3. Deploy → New deployment → gear icon → Web app.
 *       Description:    Summit mentorship
 *       Execute as:     Me
 *       Who has access: ANYONE           <-- must be "Anyone", not
 *                                            "Anyone with Google account",
 *                                            or the form gets a login page
 *     Deploy. Approve the permissions prompt (Advanced → Go to … → Allow).
 *
 *  4. Copy the Web app URL (https://script.google.com/macros/s/AKfycb..../exec)
 *     and send it to be pasted into public/summit-mentorship.html
 *     (var ENDPOINT = '').
 *
 *  5. Test: visit the URL in a browser. You should see {"ok":true,...}.
 *
 * ─── DASHBOARD TOTALS ───────────────────────────────────────────────────────
 * The staff dashboard reads totals through doGet with a private key. The copy
 * of this file in the public repo leaves STATS_KEY blank.
 *
 * ─── IF YOU EVER EDIT THIS SCRIPT ───────────────────────────────────────────
 * Deploy → Manage deployments → pencil → Version: New version → Deploy.
 * The URL stays the same, so the website needs no change.
 *
 * ─── NOTE ON COLUMN ORDER ───────────────────────────────────────────────────
 * ROW_FIELDS below must stay in the same order as the Sheet's header row.
 * Add new questions at the END of both, never in the middle.
 */

var SHEET_ID = '1BJiIyaFRB60sDLy5g89FjrYWfQ6FEQ-o_zKXloOGVhw';

// Order must match the Sheet header row (after the Timestamp column).
var ROW_FIELDS = [
  'fullName',
  'phone',
  'email',
  'gender',
  'age',
  'location',
  'status',
  'attended',
  'mentorType',
  'mentors',
  'mentorReason',
  'kinds',
  'areas',
  'areaOther',
  'stage',
  'ventureName',
  'ventureDetails',
  'goal',
  'why',
  'challenge',
  'format',
  'mode',
  'frequency',
  'consentShare',
  'consentContact',
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
  return json({ ok: true, status: 'ready', service: 'SWK Summit 2026 mentorship' });
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
      // Leading ' keeps Sheets from mangling "+233..." into a formula/number.
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

// ─── Dashboard totals ─────────────────────────────────────────────────────────
// Read-only: this never changes the Sheet. It returns counts for the staff
// dashboard and never a person's answers. Only the questions in STATS_FIELDS
// are counted, and a group smaller than STATS_MIN_GROUP is folded into
// "Other". Email is used only to count repeat entries.
// STATS_KEY stays blank in the public copy of this file, which turns this off.

var STATS_KEY = '';
var STATS_MIN_GROUP = 3;
var STATS_TOP_GROUPS = 12;
var STATS_DAY_MS = 24 * 60 * 60 * 1000;
var STATS_FIELDS = {
  mentorType: {},
  mentors: {},
  kinds: {},
  areas: {},
  stage: {},
  attended: {},
};

function statsValues(raw) {
  var text = String(raw === undefined || raw === null ? '' : raw).trim();
  if (!text) return ['Not stated'];
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
      statsValues(row[column]).forEach(function (value) {
        counts[field][value] = (counts[field][value] || 0) + 1;
      });
    });

    var email = String(row[emailColumn] || '').trim().toLowerCase();
    if (email && seen[email]) result.duplicates++;
    if (email) seen[email] = true;
  });

  result.daily = daily;
  result.groups = {};
  fields.forEach(function (field) { result.groups[field] = statsGroups(counts[field]); });
  return result;
}
