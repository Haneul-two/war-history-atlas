import handler from 'vinext/server/fetch-handler';
import { SECURITY_HEADERS } from './lib/security-headers';
import { GET, POST } from './app/api/ask/route';

const worker = {
  async fetch(
    request: Request,
    env: Record<string, unknown>,
    ctx: ExecutionContext,
  ) {
    // Keep bounded request streams out of the framework's request cloning.
    const isAsk = new URL(request.url).pathname === '/api/ask';
    const response = isAsk
      ? request.method === 'POST'
        ? await POST(request)
        : request.method === 'GET' || request.method === 'HEAD'
          ? GET()
          : new Response(null, {
              status: 405,
              headers: { Allow: 'GET, HEAD, POST' },
            })
      : await handler.fetch(request, env, ctx);
    const headers = new Headers(response.headers);
    for (const [name, value] of Object.entries(SECURITY_HEADERS))
      headers.set(name, value);
    return new Response(request.method === 'HEAD' ? null : response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  },
};
export default worker;
