# 지도로 읽는 전쟁사

세계 주요 전쟁을 지도에서 찾고, 사건의 흐름과 원인·영향을 따라 읽는 한국어 역사 탐험 웹앱입니다.

## 주요 기능

- **전쟁 지도**: 주요 전쟁 60개, 대표 사건 189개. 검색, 시대·지역·연도 필터, 지도 확대와 사건 선택.
- **전쟁 상세**: 배경, 발발, 주요 사건, 민간인의 경험과 전후 변화. 3분 코스·자세히 보기, 자동 진행.
- **주제 탐험**: 동맹·독립·민간인·제국·평화·냉전의 6개 코스, 24개 단계.
- **전쟁 비교**: 두 전쟁의 배경·세력·기술·민간인 경험·종전과 영향을 비교.
- **자료실**: 문서 15건과 기록 이미지 9건. 전쟁·종류별 필터, 출처·권리 안내와 이미지 확대.
- **나의 기록**: 브라우저 북마크와 읽던 위치 저장, 탐험 URL 공유.
- **반응형 화면**: 모바일·데스크톱, 키보드 조작과 자체 호스팅 한국어 폰트.

AI 해설용 서버 코드는 포함되어 있지만 **실제 AI 연결은 보류 중**입니다. 기본 설정에서는 제공자를 호출하지 않고 미연결 안내를 표시합니다.

## 실행

Node.js 22.13 이상과 npm이 필요합니다.

```sh
npm ci
npm run dev
```

개발 서버가 출력하는 주소를 엽니다. 프로덕션 Worker를 로컬에서 확인하려면:

```sh
npm run build
npm start -- --port 8787
```

기본 기능에는 API 키가 필요하지 않습니다. `.env.example`은 빈 값의 예시입니다. `.env`와 비밀 키를 Git에 올리지 마세요. AI 활성화 전에는 서버 요청 제한과 비용 한도를 구현해야 합니다.

## 검증

```sh
node --test tests/*.test.ts
npx tsc --noEmit
npm run build
```

로컬 Worker 실행 후 아래 검사를 사용할 수 있습니다. UI 검사는 설치된 Microsoft Edge를 headless로 실행합니다. 결과 폴더 `outputs/qa`를 먼저 만듭니다 (`mkdir -p outputs/qa`, PowerShell: `New-Item -ItemType Directory -Force outputs/qa`).

```sh
node scripts/smoke.mjs http://localhost:8787
node scripts/ui-regression.mjs
node scripts/records-ui.mjs
node scripts/security-check.mjs
```

## 기술과 구조

TypeScript, React 19, Vinext, Vite, Cloudflare Workers, Tailwind CSS를 사용합니다.

| 경로 | 내용 |
| --- | --- |
| `app/` | 지도 홈, 전쟁 상세, 비교, 주제 탐험, 자료실, API |
| `components/` | 지도·사건·자료 카드와 공통 UI |
| `lib/` | 전쟁·사건·자료·코스 데이터와 검색·저장·AI 처리 |
| `worker.ts` | Worker 진입점, 보안 헤더와 AI API |
| `public/` | 기록 이미지, 지도 데이터, 폰트와 라이선스 |
| `tests/`, `scripts/` | 규칙·API·브라우저 검사 |
| `docs/` | 수록 목록, 출처, 구현 기록과 보안 점검 |

공개 저장소의 `.openai/hosting.json`은 로컬 빌드용 빈 바인딩 설정입니다. 운영 Site 식별자나 인증 정보를 포함하지 않습니다. 실제 배포에는 별도의 호스팅 설정이 필요합니다.

## 자료와 수록 범위

고대부터 2021년까지 대규모 전쟁을 중심으로 선정했습니다. 모든 전쟁이나 진행 중 분쟁의 실시간 현황을 다루지는 않습니다. 지도는 대표 위치와 해안선이며 당시 국경·전선을 재현하지 않습니다. 피해 수치는 출처의 집계 범위가 달라 단순 순위를 매기지 않습니다.

- [수록 목록과 개요 출처](docs/catalogue.md)
- [기록·문서 출처](docs/records-sources.md)
- [이미지·지도·폰트 출처](docs/sources.md)
- [보안 점검과 남은 과제](docs/security-review.md)

전문 연구자의 감수를 완료한 자료가 아닙니다. 자료의 접근 형태와 한계를 화면에서 안내합니다. 이미지별 권리는 각 출처를 따릅니다. Pretendard는 [SIL Open Font License](public/fonts/OFL.txt), Natural Earth 지도 데이터는 퍼블릭 도메인입니다. 코드 전체의 별도 오픈소스 라이선스는 아직 지정하지 않았습니다.

제작: [Haneul-two](https://github.com/Haneul-two)
