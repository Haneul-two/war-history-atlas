'use client';
import { useEffect, useState } from 'react';
import { Header, Footer } from '@/components/shell';
import Link from '@/components/site-link';
import { RecordCard } from '@/components/record-card';
import { documents, imageRecords, filterRecords } from '@/lib/records';
import { wars } from '@/lib/history';
const validType = (s: string) =>
  ['document', 'image'].includes(s) ? s : 'all';
const validWar = (s: string) => (wars.some((w) => w.id === s) ? s : 'all');
export function RecordsArchive({
  initialType,
  initialWar,
}: {
  initialType: string;
  initialWar: string;
}) {
  const [type, setType] = useState(validType(initialType)),
    [warId, setWarId] = useState(validWar(initialWar));
  useEffect(() => {
    const restore = () => {
      const q = new URLSearchParams(location.search);
      setType(validType(q.get('type') || 'all'));
      setWarId(validWar(q.get('war') || 'all'));
    };
    window.addEventListener('popstate', restore);
    return () => window.removeEventListener('popstate', restore);
  }, []);
  function update(nextType: string, nextWar: string) {
    setType(nextType);
    setWarId(nextWar);
    const q = new URLSearchParams();
    if (nextType !== 'all') q.set('type', nextType);
    if (nextWar !== 'all') q.set('war', nextWar);
    history.pushState(
      null,
      '',
      '/records' + (q.size ? '?' + q.toString() : ''),
    );
  }
  const records = filterRecords(type, warId);
  return (
    <>
      <Header />
      <main id="main" className="page archive-page">
        <Link className="back-link" href="/themes">
          주제 탐험으로 돌아가기
        </Link>
        <header className="archive-heading">
          <p className="eyebrow">문서와 이미지</p>
          <h1>기록 자료실</h1>
          <p>
            누가, 언제, 어떤 목적으로 남긴 기록일까요?
            <br />
            소장처의 원본과 함께 살펴보세요.
          </p>
        </header>
        <div className="archive-coverage">
          <span>문서 {documents.length}건</span>
          <span>기록 이미지 {imageRecords.length}건</span>
          <p>
            문서 14건은 원문·전사·번역으로 열람할 수 있으며, 1건은 소장
            목록입니다. 문서는 대표 전쟁 15개를 우선 보강했습니다. 모든 전쟁에
            자료가 갖춰진 것은 아닙니다.
          </p>
        </div>
        <div className="record-filters">
          <label htmlFor="record-type">
            자료 유형
            <select
              id="record-type"
              value={type}
              onChange={(e) => update(e.target.value, warId)}
            >
              <option value="all">모든 자료</option>
              <option value="document">문서</option>
              <option value="image">기록 이미지</option>
            </select>
          </label>
          <label htmlFor="record-war">
            전쟁
            <select
              id="record-war"
              value={warId}
              onChange={(e) => update(type, e.target.value)}
            >
              <option value="all">모든 전쟁</option>
              {wars.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.title}
                </option>
              ))}
            </select>
          </label>
          <button
            className="btn"
            disabled={type === 'all' && warId === 'all'}
            onClick={() => update('all', 'all')}
          >
            필터 초기화
          </button>
        </div>
        <div className="archive-results-heading">
          <h2 aria-live="polite">자료 {records.length}건</h2>
          <Link href="/about">수록 기준과 출처 안내 →</Link>
        </div>
        <p className="record-section-note">
          한국어 설명은 편집 요약입니다. 자료가 기록한 범위와 작성자의 관점을
          살피며 읽어보세요.
        </p>
        {records.length ? (
          <section className="records-grid" aria-label="기록 목록">
            {records.map((r) => (
              <RecordCard key={r.id} record={r} />
            ))}
          </section>
        ) : (
          <section className="archive-empty">
            <h3>선택한 조건의 자료가 없습니다</h3>
            <p>이 전쟁의 해당 자료는 아직 보강하지 않았습니다.</p>
            <button className="btn" onClick={() => update('all', 'all')}>
              전체 자료 보기
            </button>
            {warId !== 'all' && (
              <Link className="btn" href={'/wars/' + warId}>
                전쟁 설명 읽기
              </Link>
            )}
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
