'use client';
import Link from '@/components/site-link';
import { useRouter } from 'next/navigation';
import { Equal, Split } from 'lucide-react';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { Header, Footer } from '@/components/shell';
import { SourceLinks } from '@/components/war-experience';
import { wars, eventHref, type War } from '@/lib/history';
import { formatPeriod } from '@/lib/catalogue';
import { getComparison, resolvePair } from '@/lib/comparison';
export default function ComparisonView({
  left,
  right,
}: {
  left: War;
  right: War;
}) {
  const router = useRouter();
  const comparison = getComparison(left, right);
  const rows: {
    label: string;
    key: keyof Pick<
      War,
      | 'cause'
      | 'trigger'
      | 'scope'
      | 'technology'
      | 'civilian'
      | 'ending'
      | 'aftermath'
    >;
  }[] = [
    { label: '발발 배경', key: 'cause' },
    { label: '직접적인 계기', key: 'trigger' },
    { label: '전쟁의 범위', key: 'scope' },
    { label: '주요 기술', key: 'technology' },
    { label: '민간인의 경험', key: 'civilian' },
    { label: '종전 방식', key: 'ending' },
    { label: '전후 변화', key: 'aftermath' },
  ];
  function change(side: 'left' | 'right', id: string | null) {
    if (!id) return;
    const [l, r] =
      side === 'left'
        ? resolvePair(id, right.id)
        : resolvePair(id, left.id).reverse();
    router.push(`/compare?left=${l.id}&right=${r.id}`, { scroll: false });
  }
  return (
    <>
      <Header />
      <main id="main" className="page compare-page">
        <Link prefetch={false} href="/" className="back-link">
          {' '}
          지도로 돌아가기
        </Link>
        <div className="intro">
          <div>
            <h1>두 전쟁 비교하기</h1>
          </div>
          <p className="muted">발발 배경, 참전 세력, 전후 변화를 비교합니다.</p>
        </div>
        <div className="compare-selectors">
          {[left, right].map((w, i) => (
            <div key={i}>
              <label id={`compare-label-${i}`}>
                {i === 0 ? '첫 번째 전쟁' : '두 번째 전쟁'}
              </label>
              <Select
                value={w.id}
                onValueChange={(v) => change(i === 0 ? 'left' : 'right', v)}
              >
                <SelectTrigger aria-labelledby={`compare-label-${i}`}>
                  <SelectValue>{w.title}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {wars.map((w) => (
                    <SelectItem key={w.id} value={w.id}>
                      {w.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p>
                {formatPeriod(w)} <span>· {w.region}</span>
              </p>
            </div>
          ))}
          <button
            className="swap-button icon-btn"
            aria-label="두 전쟁 자리 바꾸기"
            onClick={() =>
              router.push(`/compare?left=${right.id}&right=${left.id}`, {
                scroll: false,
              })
            }
          >
            <span>교체</span>
          </button>
        </div>
        <p className="table-scroll-hint">
          표를 좌우로 밀어 두 전쟁을 비교하세요 →
        </p>
        <div className="comparison-table">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>비교할 질문</TableHead>
                <TableHead>{left.title}</TableHead>
                <TableHead>{right.title}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.key}>
                  <TableCell className="row-label">{row.label}</TableCell>
                  {[left, right].map((w) => (
                    <TableCell key={w.id}>{String(w[row.key])}</TableCell>
                  ))}
                </TableRow>
              ))}
              <TableRow>
                <TableCell className="row-label">
                  주요 참전 세력과 목표
                </TableCell>
                {[left, right].map((w) => (
                  <TableCell key={w.id}>
                    {w.parties.map((p) => (
                      <p className="compare-party" key={p.name}>
                        <strong>{p.name}</strong>
                        {p.goal}
                      </p>
                    ))}
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <p className="comparison-note">
          참전 세력은 대표 목록입니다. 피해 규모는 집계 범위와 기준이 달라 단순
          순위로 비교하지 않습니다.
        </p>
        {comparison && (
          <div className="insights-grid">
            {(['common', 'different'] as const).map((kind) => (
              <section key={kind} className="insight-panel">
                <h2>
                  {kind === 'common' ? (
                    <Equal size={22} />
                  ) : (
                    <Split size={22} />
                  )}{' '}
                  {kind === 'common' ? '공통점 3가지' : '중요한 차이 3가지'}
                </h2>
                {comparison[kind].map((item, i) => (
                  <article key={i}>
                    <span className="insight-number">0{i + 1}</span>
                    <div>
                      <p>{item.text}</p>
                      <div className="insight-links">
                        {[left, right].map((w) => (
                          <Link
                            prefetch={false}
                            key={w.id}
                            href={eventHref(w, item.events[w.id])}
                          >
                            {w.title}의 장면{' '}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </article>
                ))}
              </section>
            ))}
          </div>
        )}
        {[left, right].some((w) => w.scopeNote) && (
          <p className="comparison-note">
            수록 범위:{' '}
            {[left, right]
              .filter((w) => w.scopeNote)
              .map((w) => w.title + ': ' + w.scopeNote)
              .join(' / ')}
          </p>
        )}
        <div className="comparison-sources">
          <h2>참고 자료</h2>
          <div>
            {[left, right].map((w) => (
              <section key={w.id}>
                <h3>{w.title}</h3>
                <SourceLinks
                  ids={Array.from(
                    new Set([
                      ...w.sources,
                      ...w.events.flatMap((e) => e.sources),
                    ]),
                  )}
                />
              </section>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
