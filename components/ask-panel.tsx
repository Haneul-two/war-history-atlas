'use client';
import { useEffect, useRef, useState } from 'react';
import Link from '@/components/site-link';
import {
  ArrowRight,
  BookOpen,
  LoaderCircle,
  MessageCircle,
  ArrowUpRight,
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import {
  CONFIG,
  eventHref,
  getSource,
  type War,
  type WarEvent,
} from '@/lib/history';
type Answer = {
  answer: string;
  facts: string[];
  interpretation: string;
  sourceIds: string[];
  relatedEventIds: string[];
  insufficient: boolean;
};
export function AskPanel({
  war,
  event,
  open,
  available,
  onOpenChange,
}: {
  war: War;
  event: WarEvent;
  open: boolean;
  available: boolean | null;
  onOpenChange: (v: boolean) => void;
}) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<Answer | null>(null);
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'error' | 'unavailable' | 'done'
  >('idle');
  const [error, setError] = useState('');
  const requestRef = useRef<AbortController | null>(null);
  const serial = useRef(0);
  useEffect(() => {
    serial.current++;
    requestRef.current?.abort();
    setAnswer(null);
    setStatus('idle');
    setError('');
    setQuestion('');
    return () => {
      serial.current++;
      requestRef.current?.abort();
    };
  }, [war.id, event.id, open]);
  const suggested = [
    `「${event.title}」은 왜 중요해?`,
    '배경지식 없이도 이해할 수 있게 설명해줘.',
    event.id.includes('armistice')
      ? '휴전·정전과 평화조약은 어떻게 달라?'
      : '이 사건과 앞뒤 사건은 어떻게 이어져?',
    '이 설명에 다른 역사적 해석도 있어?',
  ];
  async function ask(value = question) {
    const q = value.trim();
    if (!q || q.length > CONFIG.maxQuestion || status === 'loading') return;
    setQuestion(q);
    setStatus('loading');
    setAnswer(null);
    setError('');
    const controller = new AbortController();
    requestRef.current = controller;
    const requestId = ++serial.current;
    const timeout = setTimeout(() => controller.abort(), CONFIG.timeoutMs);
    try {
      const response = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ warId: war.id, eventId: event.id, question: q }),
        signal: controller.signal,
      });
      const data = (await response.json()) as Answer & { error?: string };
      if (requestId !== serial.current) return;
      if (!response.ok) {
        setStatus(response.status === 503 ? 'unavailable' : 'error');
        setError(
          data.error || '답변을 가져오지 못했습니다. 다시 시도해 주세요.',
        );
        return;
      }
      setAnswer(data);
      setStatus('done');
    } catch {
      if (requestId !== serial.current) return;
      setStatus('error');
      setError(
        controller.signal.aborted
          ? '응답 시간이 길어졌습니다. 다시 시도해 주세요.'
          : '연결을 확인한 뒤 다시 시도해 주세요.',
      );
    } finally {
      clearTimeout(timeout);
    }
  }
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="ask-sheet">
        <SheetHeader>
          <SheetTitle className="ask-title">
            <MessageCircle size={22} /> 질문과 출처
          </SheetTitle>
          <SheetDescription>
            현재 사건에 대한 질문과 참고 자료입니다. 답변은 AI가 작성합니다.
          </SheetDescription>
        </SheetHeader>
        <div className="ask-body">
          <div className="ask-context">
            <span>{war.title}</span>
            <strong>{event.title}</strong>
            <small>{event.dateLabel}</small>
          </div>
          {available === false && status !== 'unavailable' && (
            <div className="notice" role="status">
              <strong>AI 연결 준비 중</strong>
              <p>
                AI 답변은 아직 제공되지 않습니다. 아래 참고 자료는 바로 읽을 수
                있습니다.
              </p>
            </div>
          )}
          <p className="small-heading">질문 예시</p>
          <div className="suggested-questions">
            {suggested.map((q) => (
              <button
                key={q}
                disabled={status === 'loading'}
                onClick={() => void ask(q)}
              >
                {q}
              </button>
            ))}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void ask();
            }}
          >
            <label htmlFor="history-question">궁금한 점</label>
            <textarea
              id="history-question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              maxLength={CONFIG.maxQuestion}
              rows={3}
              placeholder="현재 사건에 대해 질문해 보세요."
              disabled={status === 'loading'}
            />
            <div className="ask-submit">
              <small>
                {question.length} / {CONFIG.maxQuestion}
              </small>
              <button
                className="btn primary"
                type="submit"
                disabled={!question.trim() || status === 'loading'}
              >
                {status === 'loading' ? (
                  <>
                    <LoaderCircle className="spin" size={16} /> 답변 작성 중
                  </>
                ) : (
                  <>질문하기 </>
                )}
              </button>
            </div>
          </form>
          <div aria-live="polite">
            {error && (
              <div className="notice">
                <strong>
                  {status === 'unavailable'
                    ? 'AI 연결 준비 중'
                    : '답변을 불러오지 못했습니다'}
                </strong>
                <p>{error}</p>
                {status === 'unavailable' ? (
                  <p>아래에서 원문 자료를 읽을 수 있습니다.</p>
                ) : (
                  <button className="btn" onClick={() => void ask()}>
                    다시 시도
                  </button>
                )}
              </div>
            )}
            {answer && (
              <article className="ai-answer">
                <p className="eyebrow">
                  {answer.insufficient
                    ? '자료에서 확인되지 않는 내용'
                    : '자료를 바탕으로 한 AI 답변'}
                </p>
                <p>{answer.answer}</p>
                {answer.facts.length > 0 && (
                  <>
                    <h3>자료에서 확인되는 사실</h3>
                    <ul>
                      {answer.facts.map((f, i) => (
                        <li key={i}>{f}</li>
                      ))}
                    </ul>
                  </>
                )}
                {answer.interpretation && (
                  <>
                    <h3>해석과 맥락</h3>
                    <p>{answer.interpretation}</p>
                  </>
                )}
                <h3>근거 자료</h3>
                <div className="source-links">
                  {answer.sourceIds.map((id) => {
                    const s = getSource(id);
                    return s ? (
                      <a key={id} href={s.url} target="_blank" rel="noreferrer">
                        {s.name}
                      </a>
                    ) : null;
                  })}
                </div>
                {answer.relatedEventIds.map((id) => {
                  const e = war.events.find((e) => e.id === id);
                  return e ? (
                    <Link
                      prefetch={false}
                      onClick={() => onOpenChange(false)}
                      className="related-event"
                      href={eventHref(war, id)}
                      key={id}
                    >
                      {e.title}
                    </Link>
                  ) : null;
                })}
                <small className="muted">
                  AI 답변은 틀릴 수 있습니다. 원문 자료로 확인하세요.
                </small>
              </article>
            )}
          </div>
          <div className="ask-originals">
            <p className="small-heading">
              <BookOpen size={15} /> 이 장면의 원문 자료
            </p>
            {event.sources.map((id) => {
              const s = getSource(id);
              return s ? (
                <a key={id} href={s.url} target="_blank" rel="noreferrer">
                  {s.name}
                </a>
              ) : null;
            })}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
