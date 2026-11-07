/**
 * SWK Ghana Agribusiness Summit 2026 — feedback survey endpoint.
 *
 * Receives answers from https://swkghana.org/feedback and appends one row per
 * response to the Google Sheet below.
 *
 * ─── SETUP (about 5 minutes, done once) ─────────────────────────────────────
 *
 *  1. Open the Sheet (created 7 November 2026 in frankkoomson26's Drive):
 *     https://docs.google.com/spreadsheets/d/1NABqTBjKKA7OJ77EJZt4A99sbECqKeXUHk4DquzckMU/edit
 *     Do every step below signed in as the account that owns or can edit it.
 *     To keep this on the organisation account instead, first share the Sheet
 *     with sustainabilitywithkoomson@gmail.com as an editor and sign in there.
 *
 *  2. Extensions → Apps Script. Delete whatever is in the editor and paste
 *     this entire file in. Save.
 *
 *  3. Deploy → New deployment → gear icon → Web app.
 *       Description:    Summit feedback
 *       Execute as:     Me
 *       Who has access: ANYONE           <-- must be "Anyone", not
 *                                            "Anyone with Google account",
 *                                            or the survey gets a login page
 *     Deploy. Approve the permissions prompt (it is your own script writing
 *     to a Sheet you can edit).
 *
 *  4. Copy the Web app URL. It looks like:
 *       https://script.google.com/macros/s/AKfycb..../exec
 *
 *  5. Paste that URL into public/summit-feedback.html, replacing the empty
 *     string in:   var ENDPOINT = ''
 *     Then commit and push.
 *
 *  6. Test: visit the URL in a browser. You should see {"ok":true,...}.
 *
 * ─── DASHBOARD TOTALS ───────────────────────────────────────────────────────
 * The staff dashboard reads totals through doGet with a private key. The copy
 * of this file in the public repo leaves STATS_KEY blank. Paste the private
 * copy from the founder's computer, then publish a new version as below.
 *
 * ─── IF YOU EVER EDIT THIS SCRIPT ───────────────────────────────────────────
 * Deploy → Manage deployments → pencil → Version: New version → Deploy.
 * Editing alone does nothing until you publish a new version. The URL stays
 * the same, so the website needs no change.
 *
 * ─── NOTE ON COLUMN ORDER ───────────────────────────────────────────────────
 * ROW_FIELDS below must stay in the same order as the Sheet's header row.
 * Add new questions at the END of both, never in the middle.
 */

var SHEET_ID = '1NABqTBjKKA7OJ77EJZt4A99sbECqKeXUHk4DquzckMU';

// Order must match the Sheet header row (after the Timestamp column).
var ROW_FIELDS = [
  'fullName',
  'contact',
  'overall',
  'attended',
  'mostValuable',
  'speakers',
  'organisation',
  'venue',
  'confidence',
  'canvas',
  'nextStep',
  'improve',
  'support',
  'recommend',
  'consentQuote',
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
  return json({ ok: true, status: 'ready', service: 'SWK Summit 2026 feedback' });
}

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return json({ ok: false, error: 'empty request' });
    }

    var data = JSON.parse(e.postData.contents);

    // Honeypot: the survey ships a hidden field no human ever fills in. Bots do.
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
// "Other". Contact is used only to count repeat entries.
// STATS_KEY stays blank in the public copy of this file, which turns this off.

var STATS_KEY = '';
var STATS_MIN_GROUP = 3;
var STATS_TOP_GROUPS = 8;
var STATS_DAY_MS = 24 * 60 * 60 * 1000;
var STATS_FIELDS = {
  overall: { label: 'out of 5' },
  mostValuable: {},
  confidence: {},
  canvas: {},
  recommend: {},
  support: {},
};

function statsValues(raw, rule) {
  var text = String(raw === undefined || raw === null ? '' : raw).trim();
  if (!text) return ['Not stated'];
  if (rule.label) return [text + ' ' + rule.label];
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
  var contactColumn = ROW_FIELDS.indexOf('contact') + 1;
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

    var contact = String(row[contactColumn] || '').trim().toLowerCase();
    if (contact && seen[contact]) result.duplicates++;
    if (contact) seen[contact] = true;
  });

  result.daily = daily;
  result.groups = {};
  fields.forEach(function (field) { result.groups[field] = statsGroups(counts[field]); });
  return result;
}
