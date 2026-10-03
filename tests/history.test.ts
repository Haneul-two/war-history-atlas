import test from 'node:test';
import assert from 'node:assert/strict';
import {
  wars,
  sources,
  warsAtYear,
  parseSaved,
  validateQuestion,
} from '../lib/history.ts';
test('sixty wars contain chronological sourced geographical events', () => {
  assert.equal(wars.length, 60);
  assert.equal(new Set(wars.map((w) => w.id)).size, 60);
  assert.equal(
    wars.reduce((n, w) => n + w.events.length, 0),
    189,
  );
  for (const w of wars) {
    assert.ok(w.events.length >= 3 && w.events.length <= 8);
    assert.equal(new Set(w.events.map((e) => e.id)).size, w.events.length);
    assert.deepEqual(
      w.events.map((e) => e.year ?? Number(e.date.slice(0, 4))),
      w.events
        .map((e) => e.year ?? Number(e.date.slice(0, 4)))
        .sort((a, b) => a - b),
    );
    for (const e of w.events) {
      assert.ok(Math.abs(e.lon) <= 180 && Math.abs(e.lat) <= 90);
      assert.ok(e.what && e.why && e.change);
      assert.ok(e.sources.length);
      for (const id of e.sources)
        assert.ok(
          sources.some(
            (s) => s.id === id && new URL(s.url).protocol === 'https:',
          ),
        );
    }
  }
});
test('timeline boundaries and empty years', () => {
  assert.deepEqual(
    warsAtYear(1918).map((w) => w.id),
    ['russian-civil', 'ww1'],
  );
  assert.equal(warsAtYear(1000).length, 0);
  assert.deepEqual(
    warsAtYear(1953).map((w) => w.id),
    ['arab-israeli', 'korea'],
  );
  assert.equal(warsAtYear(null).length, 60);
});
test('saved state tolerates corrupted, stale, and hostile storage', () => {
  assert.deepEqual(parseSaved('{broken'), { bookmarks: [], positions: {} });
  assert.deepEqual(parseSaved('null'), { bookmarks: [], positions: {} });
  assert.deepEqual(
    parseSaved(
      JSON.stringify({
        bookmarks: ['ww1', 'unknown', 42],
        positions: { ww1: 'sarajevo', ww2: 'sarajevo', unknown: 'x' },
      }),
    ),
    { bookmarks: ['ww1'], positions: { ww1: 'sarajevo' } },
  );
});
test('AI input rejects blank, long, unknown and cross-war contexts', () => {
  for (const body of [
    null,
    {},
    { warId: 'ww1', eventId: 'poland', question: 'why' },
    { warId: 'ww1', eventId: 'sarajevo', question: ' ' },
    { warId: 'ww1', eventId: 'sarajevo', question: 'a'.repeat(501) },
  ])
    assert.equal(validateQuestion(body), null);
  assert.equal(
    validateQuestion({ warId: 'ww1', eventId: 'sarajevo', question: ' 왜? ' })
      ?.question,
    '왜?',
  );
});
