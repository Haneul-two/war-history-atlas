# 확장판 상태

지도로 읽는 세계 전쟁사: 주요 전쟁 60개 · 대표 사건 189개. 고대~2021년의 선정 목록이며 모든 전쟁 또는 진행 중 분쟁의 실시간 현황을 포함하지 않는다.

- 개발: npm run dev
- 타입: npx tsc --noEmit
- 규칙 테스트: node --test tests/history.test.ts tests/comparison.test.ts tests/ai.test.ts tests/catalogue.test.ts
- 빌드: npm run build
- 로컬 Worker: npm start -- --port 8787
- HTTP 검사: node scripts/smoke.mjs http://localhost:8787
- 실제 UI 검사: node scripts/ui-regression.mjs (설치된 Edge, headless, 1440×900/390×844)

## 유지 규칙

- lib/catalogue-data.ts의 새 개요와 lib/history.ts의 기존 상세를 함께 사용한다. docs/catalogue.md가 수록 ID·이름·기간·출처 목록이다.
- 기원전 날짜는 음수 연도. 연도 슬라이더는 ordinal() / calendar()로 0년을 건너뛴다. 접근성 aria-valuetext는 실제 한국어 연도로 제공한다.
- 지역 배열은 영문 대륙 ID이며 theaters()에서 한국어 필터로 변환한다. 주요 전장 기준이며 참전국 국적과 다르다.
- 시대는 시작 연도 기준. 검색은 사건 제목·장소도 포함한다. 모든 필터는 AND이며 URL과 뒤로 가기에서 복원한다.
- 지도는 해안선과 대표 위치. 역사 국경과 전선을 재현하지 않는다. 목록 현재 페이지12개+다른 페이지 선택1개까지 표시한다.
- 상세의 사건 수를 하드코딩하지 않고 war.events.length로 표시한다. 자료 사진은 photos[war.id]가 실제 있을 때만 렌더링한다.
- 첫 사건이 명시된 URL은 사용자가 그 사건을 선택한 경우에만 사용한다. 일반 읽기 링크는 /wars/id로 열어 기존 저장 위치를 지키고 복원 배너를 보여준다. 독립 리뷰에서 복원 덮어쓰기 결함을 발견해 수정했다.
- 자동 진행 마지막 사건에서 재시작할 때 첫 사건 URL 도착 전 종료 효과가 재생을 꺼버리지 않도록 restarting ref를 사용한다. 실제 브라우저 재시작 검사 통과.
- 같은 장소의 사건도 접근성 이름은 사건 제목·날짜·장소로 구별한다. 지도 선택 마커가 마지막에 렌더링되므로 테스트는 순서가 아닌 고유 이름으로 대상을 고정한다.
- SiteLink의 표준 a 요소를 유지한다. Vinext beta의 Link 이동 오류를 기존 브라우저 검사에서 재현했음. 사건과 비교 쿼리는 router.push/replace를 사용한다.
- 저장 key war-atlas:v1과 기존 데이터 보존. 브라우저 로컬 기록이며 계정 동기화가 아니다.
- 새로운 전쟁 조합은 사실 비교표를 사용하며 임의 공통점3개를 생성하지 않는다. 기존3쌍의 작성된 해설은 보존한다.
- AI 실제 키 미연결. UI 준비 중, API503. 가짜 응답 금지. 키는 승인된 공식 연결을 통해 서버 비밀로만 구성한다.
- 한국어 문구는 구체적으로 작성하고 장식 영어/긴 대시/추상적 홍보 문장을 피한다.
- Pretendard Variable 자체 호스팅과 OFL.txt 보존. 배경은 실제 퍼블릭 도메인 기록 지도이며 /about에서 출처·용도·권리 안내.
- 같은 Site project_id 유지. credential은 세션 메모리/숨김 stdin에만 사용한다.

## 확인하지 않은 것

AI 실제 제공자 호출·답변 품질, WebMCP 등록 런타임, 전문 연구자의 역사 감수. 전역 lint에는 기존 템플릿·효과 초기화 규칙 지적이 남는다. 신규 카탈로그/자료 화면/비교/메뉴 범위 lint는 통과.

## 기록·주제 확장 유지 규칙
- /themes 및 /themes/[id]: lib/themes.ts의6코스×4단계. step=1~4만 유효, 잘못된값1로redirect. 실제eventId와기존sourceIDs 연결, 뒤로/새로고침 복원.
- /records: 문서15건(14원문·전사·번역+1소장목록), 이미지9건(신규6+기존3). type와war AND필터,0건/초기화/뒤로복원. 자료없는전쟁도선택가능.
- lib/records.ts의date는자료대로표시문자열을유지한다. 매체·접근형태·작성자·소장처·권리·한계필수. 현대편집주석을당시원문으로표시하지않음(FRUS65주석/64당시전문).
- 기록은 본문 모든사실의근거가아니다. sourceIDs와구분한다. 자세히보기에서긴기록표시,3분코스에는자료실링크만둔다.
- RecordCard는 BaseUI Dialog의초점관리/Escape/복원을유지. 원본보다큰크기로확대하지않음. 캡처는 animations:disabled로진입중반투명을배제.
- node --test tests/records.test.ts 및 node scripts/records-ui.mjs. 출처 docs/records-sources.md, 검증표 docs/records-verification.md.
- 사양독립점검반영. 최종독립리뷰는사용량제한으로실패, 자체점검으로대체했으므로 완료라고주장하지않음.

## 보안 점검
세부 결과: docs/security-review.md. worker.ts에서 공통 보안 헤더와 AI API를 처리한다. lib/request-body.ts에서 본문을 4096 UTF-8 바이트로 제한한다. tests/*.test.ts와 scripts/security-check.mjs를 실행한다. braces 미패치 경고가 남아 있다. AI 연결 전 지속적인 서버 요청 제한과 비용 한도가 필요하다.
