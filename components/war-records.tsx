import Link from '@/components/site-link';
import { RecordCard } from '@/components/record-card';
import { recordsForWar } from '@/lib/records';
import { themesForWar } from '@/lib/themes';
export function WarRecords({ warId }: { warId: string }) {
  const records = recordsForWar(warId),
    related = themesForWar(warId);
  return (
    <section className="reading-section war-records" id="records">
      <p className="section-number">기록과 주제</p>
      <h2>기록으로 더 읽기</h2>
      <p className="record-section-note">
        당시의 문서와 이미지를 질문과 함께 읽어보세요. 아래 설명은 편집
        요약이며, 자료는 각 작성자의 관점과 목적을 담고 있습니다.
      </p>
      {records.length ? (
        <div className="records-grid">
          {records.map((r) => (
            <RecordCard key={r.id} record={r} showWar={false} />
          ))}
        </div>
      ) : (
        <p className="notice">
          이 전쟁의 원문 자료는 아직 보강하지 않았습니다. 본문에 연결한 개요
          출처를 먼저 읽어보세요.
        </p>
      )}
      <Link className="btn" href={'/records?war=' + warId}>
        기록 자료실에서 보기
      </Link>
      {related.length > 0 && (
        <div className="related-themes">
          <h3>이 전쟁이 담긴 주제</h3>
          {related.map((t) => (
            <Link
              key={t.id}
              href={`/themes/${t.id}?step=${t.stops.findIndex((s) => s.warId === warId) + 1}`}
            >
              {t.title} →
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
