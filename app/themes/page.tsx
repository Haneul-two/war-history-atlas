import Link from '@/components/site-link';
import { Header, Footer } from '@/components/shell';
import { themes } from '@/lib/themes';
import { getWar } from '@/lib/history';
export const metadata = { title: '주제 탐험 | 지도로 읽는 전쟁사' };
export default function ThemesPage() {
  return (
    <>
      <Header />
      <main id="main" className="page themes-page">
        <header className="archive-heading">
          <p className="eyebrow">여러 전쟁을 하나의 질문으로</p>
          <h1>주제로 읽는 전쟁사</h1>
          <p>
            네 개의 사건을 따라가며 공통점과 차이를 살펴보세요.
            <br />
            동맹과 독립, 일상과 평화를 여러 시대의 전쟁에서 읽어봅니다.
          </p>
        </header>
        <section className="theme-grid" aria-label="주제 코스">
          {themes.map((t, i) => (
            <Link className="theme-card" key={t.id} href={'/themes/' + t.id}>
              <span className="theme-card-number">0{i + 1}</span>
              <h2>{t.title}</h2>
              <p>{t.description}</p>
              <div className="theme-war-list">
                {t.stops.map((s) => (
                  <span key={s.warId}>{getWar(s.warId)?.title}</span>
                ))}
              </div>
              <span className="theme-card-start">
                4개 사건 · 5~10분 읽기 <span aria-hidden="true">→</span>
              </span>
            </Link>
          ))}
        </section>
        <aside className="records-invitation">
          <div>
            <h2>당시 기록을 함께 읽어보세요</h2>
            <p>조약과 선언, 사진과 그림을 출처와 함께 모았습니다.</p>
          </div>
          <Link className="btn" href="/records">
            기록 자료실
          </Link>
        </aside>
      </main>
      <Footer />
    </>
  );
}
