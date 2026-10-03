'use client';
import { useEffect, useState } from 'react';
import Link from '@/components/site-link';
import { Bookmark, Search, ArrowRight } from 'lucide-react';
import { Header, Footer } from '@/components/shell';
import { AtlasMap } from '@/components/atlas-map';
import { useReading } from '@/hooks/use-reading';
import { CONFIG, eventHref, wars } from '@/lib/history';
import {
  catalogue,
  defaults,
  eras,
  regions,
  formatPeriod,
  formatYear,
  ordinal,
  calendar,
  parseQuery,
  queryURL,
  type Query,
} from '@/lib/catalogue';
export default function Home() {
  const [query, setQuery] = useState<Query>(defaults),
    [focused, setFocused] = useState(false),
    [copied, setCopied] = useState(false);
  const { saved, ready, error, bookmark } = useReading();
  useEffect(() => {
    const restore = () => {
      setQuery(parseQuery(new URLSearchParams(location.search)));
      setFocused(false);
    };
    restore();
    window.addEventListener('popstate', restore);
    return () => window.removeEventListener('popstate', restore);
  }, []);
  const found = catalogue(query, saved.bookmarks),
    pages = Math.max(1, Math.ceil(found.length / CONFIG.cataloguePageSize)),
    page = Math.min(query.page, pages),
    visible = found.slice(
      (page - 1) * CONFIG.cataloguePageSize,
      page * CONFIG.cataloguePageSize,
    ),
    war = found.find((w) => w.id === query.war) || visible[0];
  const shown = war && !visible.includes(war) ? [...visible, war] : visible;
  function update(change: Partial<Query>, replace = false) {
    const next = { ...query, ...change };
    const results = catalogue(next, saved.bookmarks);
    next.page = Math.min(
      next.page,
      Math.max(1, Math.ceil(results.length / CONFIG.cataloguePageSize)),
    );
    if (!results.some((w) => w.id === next.war))
      next.war = results[(next.page - 1) * CONFIG.cataloguePageSize]?.id || '';
    setQuery(next);
    window.history[replace ? 'replaceState' : 'pushState'](
      {},
      '',
      queryURL(next),
    );
    setCopied(false);
  }
  function filter(change: Partial<Query>, replace = false) {
    setFocused(false);
    update({ ...change, page: 1 }, replace);
  }
  function select(id: string) {
    setFocused(true);
    update({ war: id });
  }
  return (
    <>
      <Header />
      <main id="main" className="page home-page archive-home">
        <section className="archive-intro">
          <p className="eyebrow">
            기원전 499년부터 2021년까지 · 주요 전쟁 60개
          </p>
          <h1>지도로 읽는 세계 전쟁사</h1>
          <p>
            전쟁은 어디에서 시작됐고, 사람들의 삶을 어떻게 바꿨을까.
            <br />
            시대와 지역을 고르고, 사건의 흐름을 따라가세요.
          </p>
          <Link href="/about" className="archive-credit">
            수록 기준과 자료 안내
          </Link>
        </section>
        <section className="catalogue-tools" aria-label="전쟁 찾기">
          <label className="search-field">
            <Search size={19} />
            <input
              aria-label="전쟁 검색"
              placeholder="전쟁, 나라, 지역으로 찾기"
              value={query.q}
              onChange={(e) => filter({ q: e.target.value }, true)}
            />
          </label>
          <div className="era-tabs" aria-label="시대 선택">
            {eras.map((e) => (
              <button
                key={e.id}
                aria-pressed={query.era === e.id}
                onClick={() => filter({ era: e.id })}
              >
                {e.label}
              </button>
            ))}
          </div>
          <div className="filter-row">
            <label>
              지역{' '}
              <select
                aria-label="지역 선택"
                value={query.region}
                onChange={(e) => filter({ region: e.target.value })}
              >
                {regions.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </label>
            <label>
              정렬{' '}
              <select
                aria-label="전쟁 정렬"
                value={query.sort}
                onChange={(e) => filter({ sort: e.target.value })}
              >
                <option value="oldest">오래된 순</option>
                <option value="newest">최근 순</option>
              </select>
            </label>
            <button
              aria-pressed={query.saved}
              onClick={() => filter({ saved: !query.saved })}
            >
              <Bookmark size={15} /> 북마크만
            </button>
            <button
              className="text-button"
              onClick={() => {
                setFocused(false);
                update({ ...defaults });
              }}
            >
              필터 초기화
            </button>
          </div>
          <div className="year-filter">
            <label>
              <input
                type="checkbox"
                checked={query.year !== null}
                onChange={(e) =>
                  filter({ year: e.target.checked ? 1914 : null })
                }
              />{' '}
              연도로 좁히기
            </label>
            {query.year !== null && (
              <>
                <input
                  aria-label="연도 선택"
                  aria-valuetext={formatYear(query.year)}
                  type="range"
                  min={ordinal(CONFIG.minYear)}
                  max={ordinal(CONFIG.maxYear)}
                  value={ordinal(query.year)}
                  onChange={(e) =>
                    filter({ year: calendar(Number(e.target.value)) }, true)
                  }
                />
                <output>{formatYear(query.year)}</output>
              </>
            )}
          </div>
        </section>
        <div className="results-heading">
          <h2>{found.length}개 전쟁</h2>
          <span>지도에 {shown.length}개 표시 · 대표 사건 위치</span>
          <button
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(location.href);
                setCopied(true);
              } catch {
                setCopied(false);
              }
            }}
          >
            {copied ? '주소 복사됨' : '현재 탐험 주소 복사'}
          </button>
        </div>
        <div className="explore-layout">
          <AtlasMap
            focus={focused}
            showPicker={false}
            points={shown.map((w) => ({
              id: w.id,
              lon: w.events[0].lon,
              lat: w.events[0].lat,
              label: w.title,
              sub: formatPeriod(w),
            }))}
            active={war?.id}
            onSelect={select}
          />
          <aside className="map-preview" aria-live="polite">
            {war ? (
              <>
                <div className="preview-top">
                  <span className="eyebrow">선택한 전쟁</span>
                  <button
                    className="icon-btn"
                    disabled={!ready}
                    aria-label={`${war.title} ${saved.bookmarks.includes(war.id) ? '북마크 해제' : '북마크'}`}
                    aria-pressed={saved.bookmarks.includes(war.id)}
                    onClick={() => bookmark(war.id)}
                  >
                    <Bookmark
                      size={20}
                      fill={
                        saved.bookmarks.includes(war.id)
                          ? 'currentColor'
                          : 'none'
                      }
                    />
                  </button>
                </div>
                <p className="large-date">{formatPeriod(war)}</p>
                <h2>{war.title}</h2>
                <p className="preview-tagline">{war.tagline}</p>
                <dl>
                  <dt>주요 무대</dt>
                  <dd>{war.region}</dd>
                  <dt>주요 사건</dt>
                  <dd>{war.events.length}개 · 약 3~10분</dd>
                </dl>
                {war.scopeNote && <p className="scope-note">{war.scopeNote}</p>}
                <Link className="btn primary" href={'/wars/' + war.id}>
                  이야기 시작하기 <ArrowRight size={16} />
                </Link>
                <Link
                  className="text-button"
                  href={`/compare?left=${war.id}&right=${war.id === 'ww1' ? 'ww2' : 'ww1'}`}
                >
                  다른 전쟁과 비교하기
                </Link>
              </>
            ) : (
              <>
                <h2>조건에 맞는 전쟁이 없습니다</h2>
                <p>시대·지역·연도 조건을 줄이거나 검색어를 바꿔보세요.</p>
                <button className="btn" onClick={() => update({ ...defaults })}>
                  전체 목록 보기
                </button>
              </>
            )}
          </aside>
        </div>
        <p className="catalogue-note">
          연도 필터는 수록 기간을 기준으로 합니다. 여러 전쟁을 묶은 항목에는
          전투가 없던 기간이 포함될 수 있습니다. 진행 중인 분쟁의 실시간 현황은
          다루지 않습니다.
        </p>
        <section className="catalogue-list" aria-label="전쟁 목록">
          {visible.map((w) => (
            <article
              key={w.id}
              className={'catalogue-item ' + (w.id === war?.id ? 'active' : '')}
            >
              <button
                className="catalogue-select"
                onClick={() => select(w.id)}
                aria-pressed={w.id === war?.id}
              >
                <span>{formatPeriod(w)}</span>
                <h3>{w.title}</h3>
                <p>{w.region}</p>
              </button>
              <Link
                className="catalogue-read"
                href={'/wars/' + w.id}
                aria-label={`${w.title} 읽기`}
              >
                <ArrowRight size={20} />
              </Link>
            </article>
          ))}
        </section>
        <nav className="pagination" aria-label="목록 페이지">
          <button
            disabled={page === 1}
            onClick={() => update({ page: page - 1 })}
          >
            이전
          </button>
          <span>
            {page} / {pages}
          </span>
          <button
            disabled={page === pages}
            onClick={() => update({ page: page + 1 })}
          >
            다음
          </button>
        </nav>
        <aside className="records-invitation">
          <div>
            <h2>하나의 질문으로 여러 전쟁 읽기</h2>
            <p>
              동맹, 독립, 민간인의 삶과 평화협정을 네 개의 사건으로 살펴보세요.
            </p>
          </div>
          <Link className="btn" href="/themes">
            주제 코스 고르기
          </Link>
          <Link className="btn" href="/records">
            기록 자료실
          </Link>
        </aside>
        <section id="reading-list" className="reading-list">
          <h2>나의 기록</h2>
          <p className="muted">
            이 브라우저에 저장한 북마크와 읽던 위치입니다.
          </p>
          {error && <output>기록을 저장할 수 없습니다.</output>}
          {ready && saved.bookmarks.length === 0 && (
            <p>관심 있는 전쟁의 북마크를 눌러 여기에 모아보세요.</p>
          )}
          <div className="saved-links">
            {wars
              .filter((w) => saved.bookmarks.includes(w.id))
              .map((w) => (
                <Link
                  key={w.id}
                  className="btn"
                  href={eventHref(w, saved.positions[w.id] || w.events[0].id)}
                >
                  {w.title} · {saved.positions[w.id] ? '이어서 읽기' : '읽기'}
                </Link>
              ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
