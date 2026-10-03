import { wars } from '../lib/history.ts';
import { themes } from '../lib/themes.ts';
import { imageRecords } from '../lib/records.ts';
import assert from 'node:assert/strict';
const origin = process.argv[2] || 'http://localhost:3000';
const pages = [
  '/',
  '/about',
  '/themes',
  '/records',
  '/records?type=image&war=ww1',
  ...themes.flatMap((t) =>
    t.stops.map((_, i) => '/themes/' + t.id + '?step=' + (i + 1)),
  ),
  ...wars.map((w) => '/wars/' + w.id + '?mode=full'),
  '/wars/ww1?event=sarajevo&mode=short',
  '/wars/ww2?event=surrender-1945&mode=full',
  '/wars/korea?event=armistice-1953',
  '/compare?left=ww1&right=ww2',
  '/compare?left=korea&right=ww1',
  '/compare?left=ww2&right=korea',
];
for (const path of pages) {
  const response = await fetch(origin + path);
  assert.equal(response.status, 200, path);
  console.log(`200 ${path}`);
}
const missing = await fetch(origin + '/wars/unknown');
assert.equal(missing.status, 404);
console.log('404 unknown war');
assert.equal((await fetch(origin + '/themes/unknown')).status, 404);
for (const step of ['0', '-1', '1.5', 'bad', '5']) {
  const r = await fetch(origin + '/themes/peace?step=' + step);
  assert.equal(r.status, 200);
  assert.ok(r.url.endsWith('?step=1'));
}
console.log('theme 404 and invalid step redirects verified');
for (const r of imageRecords) {
  assert.equal((await fetch(origin + r.image.src)).status, 200);
}
console.log('nine archival images load');
const wrong = await fetch(origin + '/wars/ww1?event=poland');
assert.equal(wrong.status, 200);
assert.ok(wrong.url.includes('event=sarajevo'));
console.log('invalid event redirected to valid WWI event');
const ai = await fetch(origin + '/api/ask', {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({
    warId: 'ww1',
    eventId: 'sarajevo',
    question: '왜 중요해?',
  }),
});
assert.equal(ai.status, 503);
assert.match(JSON.stringify(await ai.json()), /연결되지/);
console.log('503 honest AI unavailable state');
for (const file of [
  'archive-world-map.jpg',
  'ww1-bread-line-1914.jpg',
  'ww2-london-shelter.jpg',
  'korea-girl-1951.jpg',
]) {
  const response = await fetch(origin + '/images/' + file);
  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-type') || '', /image/);
  console.log('image OK ' + file);
}
