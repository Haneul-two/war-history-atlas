'use client';
import { useEffect, useRef, useState } from 'react';
import Link from '@/components/site-link';
import { useRouter } from 'next/navigation';
import {
  Bookmark,
  Clock,
  MapPin,
  MessageCircle,
  Check,
  BookOpen,
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Header, Footer } from '@/components/shell';
import { AtlasMap } from '@/components/atlas-map';
import { AskPanel } from '@/components/ask-panel';
import { useReading } from '@/hooks/use-reading';
import { getSource, eventHref, wars, type War } from '@/lib/history';
import { formatPeriod } from '@/lib/catalogue';
import { CONFIG } from '@/lib/history';
import { WarRecords } from '@/components/war-records';
export function SourceLinks({ ids }: { ids: string[] }) {
  return (
    <div className="source-links">
      {Array.from(new Set(ids)).map((id) => {
        const s = getSource(id);
        return s ? (
          <a key={id} href={s.url} target="_blank" rel="noreferrer">
            {s.name}
          </a>
        ) : null;
      })}
    </div>
  );
}
export default function WarExperience({
  war,
  initialEvent,
  mode,
}: {
  war: War;
  initialEvent?: string;
  mode: 'short' | 'full';
}) {
  const router = useRouter();
  const event = war.events.find((e) => e.id === initialEvent) || war.events[0];
  const index = war.events.indexOf(event);
  const full = mode === 'full';
  const [party, setParty] = useState(0);
  const [askOpen, setAskOpen] = useState(false);
  const [aiAvailable, setAiAvailable] = useState<boolean | null>(null);
  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/ask', { signal: controller.signal })
      .then((r) => r.json())
      .then((data) =>
        setAiAvailable((data as { available?: unknown }).available === true),
      )
      .catch(() => {});
    return () => controller.abort();
  }, []);
  const [resume, setResume] = useState<string | null>(null);
  const captured = useRef(false);
  const selectedByUser = useRef(false);
  const { saved, ready, error, bookmark, remember } = useReading();
  useEffect(() => {
    if (!ready) return;
    if (!captured.current) {
      captured.current = true;
      if (
        !initialEvent &&
        saved.positions[war.id] &&
        saved.positions[war.id] !== event.id
      ) {
        setResume(saved.positions[war.id]);
        return;
      }
    }
    if (resume && !initialEvent) return;
    if (resume && initialEvent) setResume(null);
    remember(war.id, event.id);
  }, [
    ready,
    war.id,
    event.id,
    initialEvent,
    remember,
    saved.positions,
    resume,
  ]);
  useEffect(() => {
    if (selectedByUser.current) {
      document
        .getElementById('event')
        ?.scrollIntoView({ behavior: 'instant', block: 'start' });
      selectedByUser.current = false;
    }
  }, [event.id]);
  const [playing, setPlaying] = useState(false);
  const restarting = useRef(false);
  useEffect(() => {
    if (!playing) return;
    if (index === war.events.length - 1) {
      if (!restarting.current) setPlaying(false);
      return;
    }
    restarting.current = false;
    const timer = setTimeout(
      () =>
        router.replace(eventHref(war, war.events[index + 1].id, mode), {
          scroll: false,
        }),
      CONFIG.playbackMs,
    );
    return () => clearTimeout(timer);
  }, [playing, index, war, mode, router]);
  useEffect(() => {
    const stop = () => {
      if (document.hidden) setPlaying(false);
    };
    document.addEventListener('visibilitychange', stop);
    return () => document.removeEventListener('visibilitychange', stop);
  }, []);
  useEffect(() => setPlaying(false), [mode]);
  function select(id: string) {
    restarting.current = false;
    setPlaying(false);
    selectedByUser.current = true;
    router.push(eventHref(war, id, mode), { scroll: false });
  }
  return (
    <>
      <Header />
      <main id="main" className="page story-page">
        <Link prefetch={false} href="/" className="back-link">
          {' '}
          지도로 돌아가기
        </Link>
        <div className="story-heading">
          <div>
            <p className="eyebrow">
              {war.region} <span> / {formatPeriod(war)}</span>
            </p>
            <h1>{war.title}</h1>
            <p className="muted">{war.tagline}</p>
          </div>
          <div className="story-actions">
            <span>
              <Clock size={14} /> {full ? '약 5~10분' : '약 3분'}
            </span>
            <button
              className="btn"
              disabled={!ready}
              onClick={() => bookmark(war.id)}
              aria-pressed={saved.bookmarks.includes(war.id)}
            >
              <Bookmark
                size={16}
                fill={
                  saved.bookmarks.includes(war.id) ? 'currentColor' : 'none'
                }
              />
              {saved.bookmarks.includes(war.id) ? '저장됨' : '북마크'}
            </button>
          </div>
        </div>
        {error && (
          <p role="status" className="notice">
            읽던 위치를 저장할 수 없습니다. 전쟁 설명은 계속 읽을 수 있습니다.
          </p>
        )}
        {resume && (
          <div className="notice resume-banner">
            <span>저장된 읽기 위치가 있습니다.</span>
            <button className="text-button" onClick={() => select(resume)}>
              이어서 읽기
            </button>
          </div>
        )}
        {war.scopeNote && <p className="notice">{war.scopeNote}</p>}
        <div className="story-layout">
          <aside className="story-map-column">
            <AtlasMap
              detail
              points={war.events.map((e) => ({
                id: e.id,
                lon: e.lon,
                lat: e.lat,
                label: e.id === event.id ? e.title : '',
                sub: e.place,
                accessibleLabel:
                  e.title + ' · ' + e.dateLabel + ' · ' + e.place,
              }))}
              active={event.id}
              onSelect={select}
              region={war.region}
            />
            <div className="event-timeline">
              <div className="timeline-header">
                <p className="eyebrow">사건을 따라가기</p>
                <span>
                  {String(index + 1).padStart(2, '0')} /{' '}
                  {String(war.events.length).padStart(2, '0')}
                </span>
              </div>
              <Progress
                value={((index + 1) / war.events.length) * 100}
                aria-label="선택한 사건 위치"
              />
              <button
                className="btn playback-button"
                aria-pressed={playing}
                onClick={() => {
                  if (!playing && index === war.events.length - 1)
                    restarting.current = true;
                  if (!playing && index === war.events.length - 1)
                    router.replace(eventHref(war, war.events[0].id, mode), {
                      scroll: false,
                    });
                  setPlaying(!playing);
                }}
              >
                {playing ? '자동 진행 멈추기' : '사건 자동으로 따라가기'}
              </button>
              <div className="event-buttons">
                {war.events.map((e, i) => (
                  <button
                    key={e.id}
                    onClick={() => select(e.id)}
                    aria-current={e.id === event.id ? 'step' : undefined}
                  >
                    <span className="event-number">{i + 1}</span>
                    <span>
                      <small>{e.dateLabel}</small>
                      {e.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </aside>
          <article className="story-content">
            <div className="reading-mode">
              <span>
                <BookOpen size={16} /> 읽기 방식
              </span>
              <Tabs
                value={mode}
                onValueChange={(value) =>
                  router.replace(eventHref(war, event.id, String(value)), {
                    scroll: false,
                  })
                }
              >
                <TabsList aria-label="읽기 방식">
                  <TabsTrigger value="short">3분 코스</TabsTrigger>
                  <TabsTrigger value="full">자세히 보기</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <section className="summary-block">
              <span className="eyebrow">30초 요약</span>
              <p>{war.summary}</p>
              <div className="summary-facts">
                <span>{formatPeriod(war)}</span>
                <span>{war.region}</span>
              </div>
            </section>
            {full && (
              <section id="background" className="reading-section">
                <p className="section-number">01 · 전쟁 이전</p>
                <h2>전쟁의 배경</h2>
                <p>{war.cause}</p>
                <div className="trigger-callout">
                  <strong>직접적인 계기</strong>
                  <p>{war.trigger}</p>
                </div>
                <p className="small-heading">
                  주요 참전 세력 · 이름을 눌러 목표 보기
                </p>
                <div className="party-buttons">
                  {war.parties.map((p, i) => (
                    <button
                      key={p.name}
                      className={i === party ? 'active' : ''}
                      aria-pressed={i === party}
                      onClick={() => setParty(i)}
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
                <p className="party-goal" aria-live="polite">
                  {war.parties[party]?.goal}
                </p>
                <SourceLinks ids={war.sources} />
              </section>
            )}
            <section
              className="reading-section event-reading"
              id="event"
              aria-live="polite"
            >
              <p className="section-number">
                {full ? '02' : '01'} · 주요 전환점{' '}
                <span>
                  {index + 1} / {war.events.length}
                </span>
              </p>
              <div className="event-date">
                <MapPin size={14} />
                {event.place}
                <span>{event.dateLabel}</span>
              </div>
              <h2>{event.title}</h2>
              <div className="event-paragraph">
                <span>무슨 일이 있었나</span>
                <p>{event.what}</p>
              </div>
              <div className="event-paragraph">
                <span>왜 중요했나</span>
                <p>{event.why}</p>
              </div>
              <div className="event-paragraph">
                <span>무엇이 달라졌나</span>
                <p>{event.change}</p>
              </div>
              {full && event.detail && (
                <p className="interpretation">
                  <strong>해설</strong>
                  {event.detail}
                </p>
              )}
              <SourceLinks ids={event.sources} />
              <div className="event-navigation">
                <button
                  className="btn"
                  disabled={index === 0}
                  onClick={() => select(war.events[index - 1].id)}
                >
                  {' '}
                  이전 사건
                </button>
                <button
                  className="btn primary"
                  disabled={index === war.events.length - 1}
                  onClick={() => select(war.events[index + 1].id)}
                >
                  다음 사건{' '}
                </button>
              </div>
              {index === war.events.length - 1 && (
                <p className="completion">
                  <Check size={16} /> {war.events.length}개 사건을 모두
                  읽었습니다. 다음은 전후 변화입니다.
                </p>
              )}
            </section>
            {full && (
              <section className="reading-section" id="people">
                <p className="section-number">03 · 사람들의 삶</p>
                <h2>{war.civilianTitle}</h2>
                <p>{war.civilian}</p>
                <SourceLinks
                  ids={
                    war.id === 'ww2'
                      ? ['ushmm-holocaust']
                      : war.id === 'korea'
                        ? ['nara-records', 'nam-korea']
                        : war.id === 'ww1'
                          ? ['nam-peace']
                          : war.sources
                  }
                />
              </section>
            )}
            <section className="reading-section aftermath" id="after">
              <p className="section-number">{full ? '04' : '02'} · 전쟁 이후</p>
              <h2>전후 변화</h2>
              <p>{war.aftermath}</p>
              <div className="trigger-callout">
                <strong>종전 방식</strong>
                <p>{war.ending}</p>
              </div>
              <SourceLinks ids={war.sources} />
              <Link
                prefetch={false}
                className="btn"
                href={`/compare?left=${war.id}&right=${wars.find((w) => w.id !== war.id)!.id}`}
              >
                다른 전쟁과 비교하기{' '}
              </Link>
            </section>
            {full ? (
              <WarRecords warId={war.id} />
            ) : (
              <div className="reading-section">
                <Link className="btn" href={'/records?war=' + war.id}>
                  이 전쟁의 기록 자료 보기
                </Link>
              </div>
            )}
          </article>
        </div>
      </main>
      <AskPanel
        war={war}
        event={event}
        open={askOpen}
        available={aiAvailable}
        onOpenChange={setAskOpen}
      />
      <button className="ask-floating" onClick={() => setAskOpen(true)}>
        <MessageCircle size={19} /> 질문과 출처{' '}
        <span>{aiAvailable === false ? '질문 준비 중' : 'AI'}</span>
      </button>
      <Footer />
    </>
  );
}
