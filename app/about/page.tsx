import { Header, Footer } from '@/components/shell';
import Link from '@/components/site-link';
import { wars, sources } from '@/lib/history';
export default function About() {
  return (
    <>
      <Header />
      <main id="main" className="page">
        <Link className="back-link" href="/">
          지도로 돌아가기
        </Link>
        <article className="about-content">
          <h1>수록 기준과 자료 안내</h1>
          <h2>어떤 전쟁을 담았나요?</h2>
          <p>
            고대부터 2021년까지 주요 전쟁 60개와 대표 사건 189개를 선정했습니다.
            여러 나라가 참전했거나, 넓은 지역에서 장기간 이어졌거나, 국가의
            질서와 민간인의 삶을 크게 바꾼 전쟁을 중심으로 다룹니다.
            유럽·아시아·아프리카·아메리카의 사례를 함께 담았습니다.
          </p>
          <p>
            모든 전쟁을 망라한 목록은 아닙니다. 진행 중인 분쟁의 실시간 현황은
            포함하지 않습니다. 십자군 전쟁, 몽골의 정복 전쟁처럼 여러 전쟁을
            묶은 항목은 개별 전쟁과 규모·기간을 그대로 비교하기 어렵습니다. 이런
            항목에는 수록 범위를 별도로 적었습니다.
          </p>
          <h2>날짜와 지도 읽기</h2>
          <p>
            시대는 전쟁의 시작 연도를 기준으로 구분합니다. 지역은 주요 전장을
            기준으로 하며 여러 대륙에서 벌어진 전쟁은 각 지역에 함께 나타납니다.
            연도 필터는 수록된 시작·종료 기간을 기준으로 합니다.
          </p>
          <p>
            사건의 날짜를 연도까지만 적은 경우에는 정확한 월·일을 제시하지
            않습니다. 지도는 해안선과 대표 사건의 위치를 보여주며 당시의
            국경이나 전선을 재현하지 않습니다.
          </p>
          <h2>설명과 출처</h2>
          <p>
            기존 제1·2차 세계대전과 한국전쟁은 박물관·기록관 자료를
            사용했습니다. 추가한 전쟁은 종합 백과사전 개요를 바탕으로 배경·주요
            사건·전후 변화를 요약했습니다. 각 사건과 비교 화면에서 해당 출처로
            이동할 수 있습니다. 이는 전문 연구자의 역사 감수를 마친 자료라는
            뜻은 아닙니다.
          </p>
          <p>
            AI 질문 기능은 서버 연결 전까지 준비 중으로 표시됩니다. 연결되면
            답변은 AI가 작성하며, 사이트에 확보한 자료와 관련 사건을 근거로
            제시합니다.
          </p>
          <h2>기록 자료실과 주제 코스</h2>
          <p>
            대표 전쟁 15개의 문서 15건을 우선 보강했습니다. 14건은 원문
            이미지·전사·번역본으로 읽을 수 있으며, 워털루 전투 보고 1건은 소장
            목록만 제공합니다. 기록 이미지 9건에는 사진·회화·문서 이미지가
            포함됩니다. 전쟁마다 모든 형태의 자료가 있는 것은 아닙니다.
          </p>
          <p>
            자료실의 한국어 설명과 질문은 편집 요약입니다. 원문 번역이나
            인용으로 표시하지 않습니다. 당시 작성자의 관점, 자료의 작성 목적과
            한계를 각 항목에 적었습니다. 새 기록을 추가했다고 기존 본문의 모든
            주장을 이 자료로 검증한 것은 아닙니다.
          </p>
          <p>
            주제 코스 6개는 각각 네 전쟁의 대표 사건을 연결합니다. 비슷한 질문을
            던지는 비교 읽기이며, 서로 떨어진 전쟁 사이에 직접적인 인과관계가
            있다고 주장하지 않습니다. 각 사건의 개요 출처와 관련 기록을 구분해
            연결합니다.
          </p>
          <p>
            <Link className="btn" href="/records">
              기록 자료실
            </Link>{' '}
            <Link className="btn" href="/themes">
              주제 탐험
            </Link>
          </p>
          <h2>배경 이미지와 지도</h2>
          <p>
            홈 배경은 19세기 후반 일본에서 제작된 목각 세계지도입니다. 당시의
            세계 인식을 보여주는 기록이며, 정확한 지리나 전쟁 위치를 설명하는
            용도로 쓰지 않았습니다. 미 의회도서관 소장, 퍼블릭 도메인 자료를
            장식 배경으로 사용했습니다.
          </p>
          <p>
            <a
              href="https://commons.wikimedia.org/wiki/File:A_Map_of_the_World_WDL6672.png"
              target="_blank"
              rel="noreferrer"
            >
              배경 원본과 권리 안내 · Wikimedia Commons
            </a>
          </p>
          <p>
            <a
              href="https://www.naturalearthdata.com/about/terms-of-use/"
              target="_blank"
              rel="noreferrer"
            >
              해안선 데이터 · Natural Earth
            </a>
          </p>
          <h2>전쟁별 자료 {wars.length}개</h2>
          <div className="source-links">
            {wars.map((w) => (
              <p key={w.id}>
                <Link href={'/wars/' + w.id}>{w.title}</Link>
                {w.sources.map((id) => {
                  const s = sources.find((s) => s.id === id);
                  return s ? (
                    <a key={id} href={s.url} target="_blank" rel="noreferrer">
                      {s.name}
                    </a>
                  ) : null;
                })}
              </p>
            ))}
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
