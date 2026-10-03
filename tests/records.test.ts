import test from 'node:test';
import assert from 'node:assert/strict';
import { documents, archiveRecords, filterRecords } from '../lib/records.ts';
import { themes, parseStep } from '../lib/themes.ts';
import { getWar } from '../lib/history.ts';
void test('fifteen contextual documents distinguish original access from catalogue', () => {
  assert.equal(documents.length, 15);
  assert.equal(archiveRecords.filter((r) => r.kind === 'image').length, 9);
  assert.equal(new Set(documents.map((r) => r.warId)).size, 15);
  assert.equal(documents.filter((r) => r.access === 'catalogue').length, 1);
  for (const r of archiveRecords) {
    assert.ok(getWar(r.warId));
    assert.equal(new URL(r.url).protocol, 'https:');
    assert.ok(
      r.date && r.creator && r.holder && r.summary && r.question && r.caution,
    );
    if (r.image) {
      assert.ok(r.image.rights && r.image.width > 0 && r.image.height > 0);
    }
  }
  assert.equal(
    new Set(archiveRecords.map((r) => r.id)).size,
    archiveRecords.length,
  );
});
void test('six courses have four valid sourced events and questions', () => {
  assert.equal(themes.length, 6);
  for (const t of themes) {
    assert.equal(t.stops.length, 4);
    assert.equal(new Set(t.stops.map((s) => s.warId)).size, 4);
    for (const s of t.stops) {
      const war = getWar(s.warId);
      assert.ok(war?.events.some((e) => e.id === s.eventId));
      assert.ok(
        s.question &&
          s.note &&
          war?.events.find((e) => e.id === s.eventId)?.sources.length,
      );
    }
  }
});
void test('invalid steps normalize to the first step', () => {
  for (const value of [null, '', '0', '-1', '1.5', 'bad', '5'])
    assert.equal(parseStep(value), 0);
  assert.equal(parseStep('4'), 3);
});
void test('record type and war filters intersect and support empty states', () => {
  assert.equal(filterRecords('document', 'imjin').length, 1);
  assert.equal(filterRecords('image', 'mongol').length, 0);
  assert.equal(filterRecords('all', 'all').length, archiveRecords.length);
});
