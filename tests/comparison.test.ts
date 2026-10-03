import test from 'node:test';
import assert from 'node:assert/strict';
import { wars } from '../lib/history.ts';
import { getComparison, resolvePair } from '../lib/comparison.ts';
test('all pairs work in either order and link to existing events', () => {
  for (const left of wars)
    for (const right of wars) {
      if (left.id === right.id) continue;
      const c = getComparison(left, right);
      assert.ok(left.cause && right.cause && left.ending && right.ending);
      if (!c) continue;
      for (const kind of ['common', 'different'] as const) {
        assert.equal(c[kind].length, 3);
        for (const item of c[kind])
          for (const w of [left, right])
            assert.ok(w.events.some((e) => e.id === item.events[w.id]));
      }
    }
});
test('same and unknown pair inputs resolve to distinct valid wars', () => {
  for (const pair of [
    ['ww1', 'ww1'],
    ['bad', 'bad'],
    ['korea', 'korea'],
  ]) {
    const [l, r] = resolvePair(pair[0], pair[1]);
    assert.notEqual(l.id, r.id);
  }
});
