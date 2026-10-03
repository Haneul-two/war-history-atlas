import test from 'node:test';
import assert from 'node:assert/strict';
import { handleAsk, sanitizeAnswer } from '../lib/ai.ts';
import { wars } from '../lib/history.ts';
const valid = { warId: 'ww1', eventId: 'sarajevo', question: '왜 중요해?' };
const req = (body: unknown, origin?: string) =>
  new Request('https://atlas.test/api/ask', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      ...(origin ? { origin } : {}),
    },
    body: JSON.stringify(body),
  });
const fixture = {
  answer: '사라예보 사건은 국제적 위기의 계기였습니다.',
  facts: ['1914년 6월 28일 황태자가 암살됐습니다.'],
  interpretation: '원인과 계기를 구분해서 읽어야 합니다.',
  sourceIds: ['loc-ww1'],
  relatedEventIds: ['july-crisis'],
  insufficient: false,
};
test('unconnected API returns explicit 503 and never calls provider', async () => {
  let calls = 0;
  const result = await handleAsk(req(valid), {
    fetcher: async () => {
      calls++;
      throw Error();
    },
  });
  assert.equal(result.status, 503);
  assert.equal(calls, 0);
  assert.match(JSON.stringify(await result.json()), /연결되지/);
});
test('invalid contexts and foreign origins reject before provider', async () => {
  assert.equal(
    (await handleAsk(req({ ...valid, eventId: 'poland' }), { key: 'test' }))
      .status,
    400,
  );
  assert.equal(
    (await handleAsk(req(valid, 'https://foreign.test'), { key: 'test' }))
      .status,
    403,
  );
});
test('response allowlist rejects unsourced assertions and cross-war links', () => {
  assert.equal(
    sanitizeAnswer(
      { ...fixture, sourceIds: ['made-up'] },
      wars.find((w) => w.id === 'ww1')!,
    ),
    null,
  );
  const parsed = sanitizeAnswer(
    {
      ...fixture,
      sourceIds: ['loc-ww1', 'fake', 'loc-ww1'],
      relatedEventIds: ['poland', 'july-crisis', 'fake'],
    },
    wars.find((w) => w.id === 'ww1')!,
  );
  assert.deepEqual(parsed?.sourceIds, ['loc-ww1']);
  assert.deepEqual(parsed?.relatedEventIds, ['july-crisis']);
});
test('provider fixture verifies context separation and structured output', async () => {
  const result = await handleAsk(req(valid), {
    key: 'test-only',
    fetcher: async (_url, init) => {
      const payload = JSON.parse(String(init?.body));
      assert.equal(payload.store, false);
      assert.equal(payload.text.format.strict, true);
      assert.equal(payload.input[1].role, 'user');
      assert.equal(payload.input[1].content, valid.question);
      assert.match(payload.input[0].content, /sarajevo/);
      return Response.json({
        status: 'completed',
        output: [
          {
            type: 'message',
            content: [{ type: 'output_text', text: JSON.stringify(fixture) }],
          },
        ],
      });
    },
  });
  assert.equal(result.status, 200);
  assert.deepEqual(await result.json(), fixture);
});
test('insufficient evidence can return without fabricated citation', async () => {
  const result = await handleAsk(req(valid), {
    key: 'test-only',
    fetcher: async () =>
      Response.json({
        status: 'completed',
        output: [
          {
            content: [
              {
                type: 'output_text',
                text: JSON.stringify({
                  ...fixture,
                  answer: '수록 자료에서 확인할 수 없습니다.',
                  facts: [],
                  interpretation: '',
                  sourceIds: [],
                  relatedEventIds: [],
                  insufficient: true,
                }),
              },
            ],
          },
        ],
      }),
  });
  assert.equal(result.status, 200);
  assert.equal(
    ((await result.json()) as { insufficient: boolean }).insufficient,
    true,
  );
});
test('provider failures expose friendly error without secrets', async () => {
  const result = await handleAsk(req(valid), {
    key: 'test-secret',
    fetcher: async () =>
      new Response('test-secret upstream error', { status: 401 }),
  });
  assert.equal(result.status, 502);
  assert.ok(!JSON.stringify(await result.json()).includes('test-secret'));
});
