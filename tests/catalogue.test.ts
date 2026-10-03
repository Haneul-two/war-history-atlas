import test from 'node:test';
import assert from 'node:assert/strict';
import {
  catalogue,
  defaults,
  parseQuery,
  queryURL,
  ordinal,
  calendar,
  formatYear,
  era,
  theaters,
} from '../lib/catalogue.ts';
import { wars } from '../lib/history.ts';
test('calendar crosses BCE to CE without year zero', () => {
  assert.equal(calendar(ordinal(-1) + 1), 1);
  for (const y of [-499, -1, 1, 499, 2021])
    assert.equal(calendar(ordinal(y)), y);
  assert.match(formatYear(-499), /기원전/);
});
test('search, region, era, bookmark and year filters intersect', () => {
  assert.equal(catalogue(defaults).length, 60);
  assert.equal(catalogue({ ...defaults, q: '임진' }).length, 1);
  assert.ok(
    catalogue({ ...defaults, region: '아프리카' }).some(
      (w) => w.id === 'angolan',
    ),
  );
  assert.ok(
    catalogue({ ...defaults, region: '아시아' }).some((w) => w.id === 'imjin'),
  );
  assert.equal(catalogue({ ...defaults, year: 1000 }).length, 0);
  assert.deepEqual(
    catalogue({ ...defaults, saved: true }, ['imjin']).map((w) => w.id),
    ['imjin'],
  );
  assert.equal(
    catalogue({ ...defaults, q: '임진', region: '아메리카' }).length,
    0,
  );
});
test('all eras cover catalogue and dates order numerically', () => {
  assert.equal(era(wars.find((w) => w.id === 'persian')!), 'ancient');
  assert.equal(era(wars.find((w) => w.id === 'iraq')!), 'modern');
  assert.ok(
    wars.every((w) =>
      theaters(w).every((r) =>
        ['유럽', '아시아', '아프리카', '아메리카'].includes(r),
      ),
    ),
  );
  assert.equal(catalogue({ ...defaults, sort: 'newest' })[0].id, 'iraq');
});
test('URL restores complete state and rejects invalid query values', () => {
  const q = {
    ...defaults,
    q: '한국',
    era: '20c',
    region: '아시아',
    year: 1950,
    saved: true,
    sort: 'newest',
    page: 2,
    war: 'korea',
  };
  assert.deepEqual(
    parseQuery(new URL(queryURL(q), 'https://atlas.test').searchParams),
    q,
  );
  const bad = parseQuery(
    new URLSearchParams('era=bad&region=bad&year=0&page=1.5&war=bad'),
  );
  assert.equal(bad.year, null);
  assert.equal(bad.page, 1);
  assert.equal(bad.era, 'all');
});
