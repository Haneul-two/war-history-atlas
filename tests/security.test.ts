import test from 'node:test';
import assert from 'node:assert/strict';
import { handleAsk } from '../lib/ai.ts';
const make = (
  body: BodyInit,
  headers: HeadersInit = { 'content-type': 'application/json' },
) =>
  new Request('https://atlas.test/api/ask', {
    method: 'POST',
    headers,
    body,
    duplex: 'half',
  } as RequestInit);
void test('oversized stream without Content-Length is stopped before provider', async () => {
  let canceled = false,
    pulls = 0,
    calls = 0;
  const stream = new ReadableStream<Uint8Array>({
    pull(c) {
      pulls++;
      c.enqueue(new Uint8Array(5000));
    },
    cancel() {
      canceled = true;
    },
  });
  const r = await handleAsk(make(stream), {
    key: 'test',
    fetcher: async () => {
      calls++;
      throw Error();
    },
  });
  assert.equal(r.status, 413);
  assert.equal(calls, 0);
  assert.equal(canceled, false);
  assert.ok(pulls <= 2);
});
void test('body limit counts UTF-8 bytes, not characters', async () => {
  const r = await handleAsk(
    make(JSON.stringify({ question: '가'.repeat(1400) })),
  );
  assert.equal(r.status, 413);
});
void test('declared oversized body is rejected even if actual body is shorter', async () => {
  const r = await handleAsk(
    make('{}', {
      'content-type': 'application/json',
      'content-length': '5000',
    }),
  );
  assert.equal(r.status, 413);
});
void test('unsupported types and cross-site browser requests are rejected', async () => {
  assert.equal(
    (await handleAsk(make('{}', { 'content-type': 'text/plain' }))).status,
    415,
  );
  assert.equal(
    (
      await handleAsk(
        make('{}', {
          'content-type': 'application/json',
          'sec-fetch-site': 'cross-site',
        }),
      )
    ).status,
    403,
  );
});
void test('malformed JSON and malformed UTF-8 yield controlled errors', async () => {
  for (const body of ['{', new Uint8Array([255])])
    assert.equal((await handleAsk(make(body))).status, 400);
});
