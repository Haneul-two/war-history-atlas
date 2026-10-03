import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import http from 'node:http';
const origin = process.argv[2] || 'http://localhost:8787';
let checks = 0;
for (const path of ['/', '/records', '/themes/peace', '/api/ask']) {
  const r = await fetch(origin + path);
  assert.equal(r.status, 200);
  assert.equal(r.headers.get('x-content-type-options'), 'nosniff');
  assert.equal(
    r.headers.get('referrer-policy'),
    'strict-origin-when-cross-origin',
  );
  assert.match(
    r.headers.get('content-security-policy') || '',
    /object-src 'none'/,
  );
  await r.text();
  checks++;
}
const input = { warId: 'ww1', eventId: 'sarajevo', question: 'why?' };
for (const [headers, body, status] of [
  [{ 'content-type': 'text/plain' }, '{}', 415],
  [
    { 'content-type': 'application/json', origin: 'https://foreign.test' },
    JSON.stringify(input),
    403,
  ],
  [
    { 'content-type': 'application/json', 'sec-fetch-site': 'cross-site' },
    JSON.stringify(input),
    403,
  ],
  [
    { 'content-type': 'application/json' },
    JSON.stringify({ question: 'x'.repeat(5000) }),
    413,
  ],
  [{ 'content-type': 'application/json' }, '{', 400],
  [{ 'content-type': 'application/json' }, JSON.stringify(input), 503],
]) {
  const r = await new Promise((resolve, reject) => {
    const req = http.request(
      origin + '/api/ask',
      {
        method: 'POST',
        agent: false,
        headers: {
          ...headers,
          'content-length': String(Buffer.byteLength(body)),
        },
      },
      (response) => {
        let text = '';
        response.on('data', (chunk) => {
          text += chunk;
        });
        response.on('end', () =>
          resolve({
            status: response.statusCode,
            headers: response.headers,
            text,
          }),
        );
        response.on('error', reject);
      },
    );
    req.on('error', reject);
    req.end(body);
  });
  assert.equal(r.status, status, r.text);
  assert.equal(r.headers['cache-control'], 'no-store');
  checks++;
}
const b = await chromium.launch({ channel: 'msedge', headless: true });
const p = await b.newPage();
const errors = [];
p.on('pageerror', (e) => errors.push(e.message));
p.on('console', (m) => {
  if (
    m.type() === 'error' &&
    /Content Security Policy|Refused to/.test(m.text())
  )
    errors.push(m.text());
});
try {
  const payload = '<img src=x onerror="window.__securityProbe=1">';
  await p.goto(origin + '/?q=' + encodeURIComponent(payload), {
    waitUntil: 'networkidle',
  });
  assert.equal(await p.evaluate(() => window.__securityProbe), undefined);
  assert.equal(await p.locator('img[src="x"]').count(), 0);
  checks++;
  const browserStatuses = await p.evaluate(async () => {
    const result = [];
    for (const body of [
      '{',
      JSON.stringify({ question: 'x'.repeat(5000) }),
      JSON.stringify({ warId: 'ww1', eventId: 'sarajevo', question: 'why?' }),
    ]) {
      const response = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body,
      });
      await response.json();
      result.push(response.status);
    }
    return result;
  });
  assert.deepEqual(browserStatuses, [400, 413, 503]);
  checks++;
  for (const path of [
    '/records?type=image',
    '/themes/peace?step=3',
    '/wars/ww1?event=sarajevo',
  ])
    await p.goto(origin + path, { waitUntil: 'networkidle' });
  assert.deepEqual(errors, []);
  checks++;
  fs.writeFileSync(
    'outputs/qa/security-browser.json',
    JSON.stringify({ checks, errors, browser: 'headless Edge' }, null, 2),
  );
  console.log(checks + ' security HTTP/browser checks passed');
} finally {
  await b.close();
}
