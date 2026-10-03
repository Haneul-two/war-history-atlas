'use client';
import { useEffect, useState, useCallback, useRef } from 'react';
import { flushSync } from 'react-dom';
import {
  CONFIG,
  wars,
  parseSaved,
  getWar,
  type SavedState,
} from '@/lib/history';
type Registry = {
  registerTool: (
    tool: {
      name: string;
      description: string;
      inputSchema: object;
      annotations?: { readOnlyHint: boolean };
      execute: (input: unknown) => unknown;
    },
    options: { signal: AbortSignal },
  ) => void | Promise<void>;
};
export function useReading() {
  const [saved, setSaved] = useState<SavedState>({
    bookmarks: [],
    positions: {},
  });
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(false);
  const stateRef = useRef(saved);
  useEffect(() => {
    try {
      const restored = parseSaved(localStorage.getItem(CONFIG.storageKey));
      stateRef.current = restored;
      setSaved(restored);
    } catch {
      setError(true);
    }
    setReady(true);
  }, []);
  const update = useCallback((fn: (s: SavedState) => SavedState) => {
    const next = fn(stateRef.current);
    if (next === stateRef.current) return;
    stateRef.current = next;
    setSaved(next);
    try {
      localStorage.setItem(CONFIG.storageKey, JSON.stringify(next));
    } catch {
      setError(true);
    }
  }, []);
  const bookmark = useCallback(
    (id: string) =>
      update((s) => ({
        ...s,
        bookmarks: s.bookmarks.includes(id)
          ? s.bookmarks.filter((x) => x !== id)
          : [...s.bookmarks, id],
      })),
    [update],
  );
  const remember = useCallback(
    (id: string, event: string) =>
      update((s) =>
        s.positions[id] === event
          ? s
          : { ...s, positions: { ...s.positions, [id]: event } },
      ),
    [update],
  );
  useEffect(() => {
    if (!ready) return;
    const registry = (document as Document & { modelContext?: Registry })
      .modelContext;
    if (!registry?.registerTool) return;
    const lifecycle = new AbortController();
    try {
      void Promise.resolve(
        registry.registerTool(
          {
            name: 'set_history_bookmarks',
            description:
              'Replace bookmarked wars in this browser and update the visible reading list. Use IDs from the war catalogue.',
            inputSchema: {
              type: 'object',
              properties: {
                warIds: {
                  type: 'array',
                  items: { type: 'string', enum: wars.map((w) => w.id) },
                  maxItems: wars.length,
                  uniqueItems: true,
                },
              },
              required: ['warIds'],
              additionalProperties: false,
            },
            annotations: { readOnlyHint: false },
            execute(input) {
              if (
                !input ||
                typeof input !== 'object' ||
                !Array.isArray((input as { warIds?: unknown }).warIds)
              )
                throw new Error('warIds must be an array.');
              const ids = (input as { warIds: unknown[] }).warIds;
              if (
                ids.length > wars.length ||
                ids.some((id) => typeof id !== 'string' || !getWar(id))
              )
                throw new Error('Unknown war ID.');
              const bookmarks = Array.from(new Set(ids as string[]));
              flushSync(() => update((s) => ({ ...s, bookmarks })));
              return { bookmarks };
            },
          },
          { signal: lifecycle.signal },
        ),
      ).catch(() => {});
    } catch {}
    return () => lifecycle.abort();
  }, [ready, update]);
  return { saved, ready, error, bookmark, remember };
}
