import { env } from 'cloudflare:workers';
import { handleAsk } from '@/lib/ai';
import { SECURITY_HEADERS } from '@/lib/security-headers';
export async function POST(request: Request) {
  const bindings = env as Record<string, unknown>;
  const key =
    typeof bindings.OPENAI_API_KEY === 'string'
      ? bindings.OPENAI_API_KEY
      : process.env.OPENAI_API_KEY;
  const model =
    typeof bindings.OPENAI_MODEL === 'string'
      ? bindings.OPENAI_MODEL
      : process.env.OPENAI_MODEL;
  return handleAsk(request, { key, model });
}

export function GET() {
  const bindings = env as Record<string, unknown>;
  const key =
    typeof bindings.OPENAI_API_KEY === 'string'
      ? bindings.OPENAI_API_KEY
      : process.env.OPENAI_API_KEY;
  return Response.json(
    { available: Boolean(key?.trim()) },
    { headers: { ...SECURITY_HEADERS, 'Cache-Control': 'no-store' } },
  );
}
