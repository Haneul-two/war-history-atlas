'use client';
import { useRouter } from 'next/navigation';
import Link from '@/components/site-link';
import { Header, Footer } from '@/components/shell';
import { AtlasMap } from '@/components/atlas-map';
import { RecordCard } from '@/components/record-card';
import { getWar, getSource, eventHref } from '@/lib/history';
import { recordsForWar } from '@/lib/records';
import type { HistoryTheme } from '@/lib/themes';
export function ThemeExperience({
  theme,
  index,
}: {
  theme: HistoryTheme;
  index: number;
}) {
  const router = useRouter();
  const stop = theme.stops[index],
    war = getWar(stop.warId)!,
    event = war.events.find((e) => e.id === stop.eventId)!;
  const records = recordsForWar(war.id).filter((r) => r.kind === 'document');
  const select = (id: string) =>
    router.push('/themes/' + theme.id + '?step=' + id, { scroll: false });
  return (
    <>
      <Header />
      <main id="main" className="page theme-experience">
        <Link className="back-link" href="/themes">
          모든 주제 보기
        </Link>
        <header className="archive-heading">
          <p className="eyebrow">주제 탐험 · 네 개의 사건</p>
          <h1>{theme.title}</h1>
          <p>{theme.description}</p>
        </header>
        <div className="theme-layout">
          <aside className="theme-map-column">
            <AtlasMap
              points={theme.stops.map((s, i) => {
                const w = getWar(s.warId)!,
                  e = w.events.find((e) => e.id === s.eventId)!;
                return {
                  id: String(i + 1),
                  lon: e.lon,
                  lat: e.lat,
                  label: w.title,
                  sub: e.place,
                  accessibleLabel: `${i + 1}단계 · ${w.title} · ${e.title}`,
                };
              })}
              active={String(index + 1)}
              onSelect={select}
              region="선택한 네 사건"
              showPicker={false}
            />
            <nav className="theme-steps" aria-label="코스 단계">
              {theme.stops.map((s, i) => {
                const w = getWar(s.warId)!;
                return (
                  <button
                    key={s.warId}
                    onClick={() => select(String(i + 1))}
                    aria-current={i === index ? 'step' : undefined}
                  >
                    <span className="theme-step-number">{i + 1}</span>
                    <span>
                      <small>
                        {w.events.find((e) => e.id === s.eventId)?.dateLabel}
                      </small>
                      {w.title}
                    </span>
                  </button>
                );
              })}
            </nav>
          </aside>
          <article className="theme-reading" aria-live="polite">
            <p className="theme-position">
              {index + 1} / 4 · {war.title}
            </p>
            <p className="event-date">
              {event.dateLabel} · {event.place}
            </p>
            <h2>{stop.question}</h2>
            <p className="theme-note">{stop.note}</p>
            <section className="theme-event">
              <p className="eyebrow">함께 읽을 사건</p>
              <h3>{event.title}</h3>
              <p>{event.what}</p>
              <p>{event.change}</p>
              <Link className="btn" href={eventHref(war, event.id, 'full')}>
                이 사건 자세히 읽기 →
              </Link>
              <div className="source-links" aria-label="사건 출처">
                {event.sources.map((id) => {
                  const s = getSource(id);
                  return s ? (
                    <a key={id} href={s.url} target="_blank" rel="noreferrer">
                      {s.name} ↗
                    </a>
                  ) : null;
                })}
              </div>
            </section>
            {records.length > 0 && (
              <section className="theme-records">
                <h3>함께 읽을 기록</h3>
                <p className="record-section-note">
                  아래는 별도의 기록 읽기 자료입니다. 원문과 작성자의 관점을
                  확인해 보세요.
                </p>
                {records.map((r) => (
                  <RecordCard key={r.id} record={r} showWar={false} />
                ))}
              </section>
            )}
            <div className="event-navigation">
              <button
                className="btn"
                disabled={index === 0}
                onClick={() => select(String(index))}
              >
                이전 단계
              </button>
              <button
                className="btn primary"
                disabled={index === 3}
                onClick={() => select(String(index + 2))}
              >
                다음 단계
              </button>
            </div>
            {index === 3 && (
              <section className="theme-closing">
                <h3>네 사건을 읽고 나서</h3>
                <p>{theme.closing}</p>
                <Link
                  className="btn"
                  href={`/compare?left=${theme.stops[0].warId}&right=${theme.stops[3].warId}`}
                >
                  첫 전쟁과 마지막 전쟁 비교
                </Link>
                <Link href="/themes">다른 주제 고르기 →</Link>
              </section>
            )}
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}
