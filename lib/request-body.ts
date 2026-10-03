export class BodyTooLarge extends Error {}
export async function readBoundedBody(request: Request, maxBytes: number) {
  const declared = request.headers.get('content-length');
  if (!request.body) return '';
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > maxBytes) {
        // Stop consuming here. Canceling the incoming stream can abort the
        // Worker response before the caller can send its 413 error.
        throw new BodyTooLarge();
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  if (declared && Number(declared) > maxBytes) throw new BodyTooLarge();
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
}
