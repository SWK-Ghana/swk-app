// Runs the real Apps Script files against a pretend Sheet.
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import vm from 'node:vm'

const KEY = 'test-key'
const DAY_MS = 24 * 60 * 60 * 1000
const FILES = ['summit-registration', 'pitch-registration', 'volunteers-application', 'partners-application']

// Loads a script with the key filled in. `sheet` records any attempt to change it.
const load = (file, rows, key = KEY) => {
  const sheet = {
    writes: 0,
    getDataRange: () => ({ getValues: () => rows }),
    appendRow() { this.writes += 1 },
    insertRowBefore() { this.writes += 1 },
    getLastRow: () => rows.length,
  }
  const context = {
    SpreadsheetApp: { openById: () => ({ getSheets: () => [sheet] }) },
    ContentService: {
      MimeType: { JSON: 'json' },
      createTextOutput: (text) => ({ setMimeType: () => JSON.parse(text) }),
    },
  }
  const source = readFileSync(new URL(`../docs/${file}.gs`, import.meta.url), 'utf8')
  assert.match(source, /var STATS_KEY = '';/, `${file} must keep the key blank in the public repo`)
  vm.runInNewContext(source.replace("var STATS_KEY = '';", `var STATS_KEY = ${JSON.stringify(key)};`), context)
  return { get: (parameter) => context.doGet({ parameter }), bare: () => context.doGet(), sheet }
}

const person = (fields, answers) => fields.map((field) => answers[field] ?? '')

const summitRows = () => {
  const ROW_FIELDS = ['fullName', 'age', 'gender', 'phone', 'email', 'location', 'education', 'status', 'study', 'inAgri', 'agriDetails', 'interest', 'why', 'gain', 'hasVenture', 'ventureDetails', 'needs', 'heard', 'consentContact', 'consentPhotos', 'consentNewsletter', 'source']
  const row = (i, daysAgo, extra) => [
    new Date(Date.now() - daysAgo * DAY_MS),
    ...person(ROW_FIELDS, {
      fullName: `Secret Person ${i}`, age: 22, gender: 'Female', phone: `+23350000000${i}`,
      email: `person${i}@secret.example`, location: 'Accra, greater accra', status: 'Student',
      why: `My private reason ${i}`, heard: 'Friend', ...extra,
    }),
  ]
  return [
    ['Timestamp', ...ROW_FIELDS],
    row(1, 1),
    row(2, 2),
    row(3, 3),
    row(4, 8, { gender: 'Male', location: 'Kumasi, Ashanti', age: 40 }),
    row(5, 9, { email: 'PERSON1@secret.example' }),
    ['', ...ROW_FIELDS.map(() => '')],
  ]
}

test('every script still answers its health check without a key', () => {
  for (const file of FILES) assert.equal(load(file, []).bare().status, 'ready')
})

test('totals are refused with the wrong key, and when no key is set', () => {
  for (const file of FILES) {
    assert.equal(load(file, []).get({ stats: 'wrong' }).ok, false)
    assert.equal(load(file, summitRows(), '').get({ stats: KEY }).ok, false)
  }
})

test('totals count the rows and nothing leaves but counts', () => {
  const { get, sheet } = load('summit-registration', summitRows())
  const result = get({ stats: KEY })
  assert.equal(result.total, 5)
  assert.equal(result.last7, 3)
  assert.equal(result.previous7, 2)
  assert.equal(result.duplicates, 1)
  assert.equal(Object.values(result.daily).reduce((a, b) => a + b, 0), 5)
  assert.equal(sheet.writes, 0)
  assert.doesNotMatch(JSON.stringify(result), /Secret|secret\.example|\+2335|private reason/)
})

test('small groups are folded so nobody can be picked out', () => {
  const { groups } = load('summit-registration', summitRows()).get({ stats: KEY })
  const names = (field) => groups[field].map((g) => g.name)
  assert.deepEqual(names('gender'), ['Female', 'Other'])
  assert.equal(groups.gender.find((g) => g.name === 'Other').count, 1)
  assert.deepEqual(names('location'), ['Greater Accra', 'Other'])
  assert.deepEqual(names('age'), ['18 to 24', 'Other'])
})

test('the free-text questions are not on any script list', () => {
  for (const file of FILES) {
    const source = readFileSync(new URL(`../docs/${file}.gs`, import.meta.url), 'utf8')
    const list = source.match(/var STATS_FIELDS = \{([\s\S]*?)\n\};/)[1]
    assert.doesNotMatch(list, /\b(fullName|name|email|phone|whatsapp|why|gain|anythingElse|achieve|orgName|contactPerson)\b:/)
  }
})
