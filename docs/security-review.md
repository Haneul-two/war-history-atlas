# 보안 점검 · 2026-10-03

현재 소스, 설치 의존성, 생성 번들, 로컬 Worker HTTP 응답과 Edge 브라우저, Sites 공유 설정을 점검했다. 외부 침투 테스트·호스팅 인프라·전체 Git 이력 감사는 아니다.

## 수정

- React·React DOM·React Server Components 19.2.8, Vite 8.0.16으로 업데이트했다. image-size 2.0.4, undici 7.30.0, esbuild 0.28.2, ws 8.21.0, sharp 0.35.4를 고정했다. Cloudflare 도구는 Wrangler 4.147.0·Vite 플러그인 1.62.5·Workers 타입 5.20261003.1로 함께 업데이트했다.
- AI 본문을 전체 문자열로 읽던 코드를 스트림 읽기로 변경했다. Content-Length 유무와 관계없이 실제 UTF-8 바이트를 합산하고 4096바이트를 넘으면 추가 읽기를 중단한다. 초과 413, 잘못된 JSON·UTF-8 400, 지원하지 않는 미디어 타입 415, 외부 Origin·cross-site 요청 403으로 처리하며 거절 경로는 제공자를 호출하지 않는다.
- 제한된 본문 읽기를 먼저 수행한다. 본문을 읽지 않고 거절한 요청 뒤 연속 POST가 로컬 Worker 연결 오류로 바뀌던 문제를 재현하고 수정했다. Worker의 AI 경로는 기존 GET·POST 함수를 직접 호출한다.
- Worker 응답에 nosniff, Referrer-Policy, Permissions-Policy, CSP를 적용했다. CSP는 외부 스크립트·연결·이미지·폰트를 기본 차단하고 object, 외부 base·form 대상을 제한한다. SSR 호환성을 위해 script/style unsafe-inline은 유지하므로 엄격한 nonce 기반 CSP는 아니다.
- 키는 서버에서만 읽는다. AI 출력은 현재 전쟁에 속한 출처·사건 ID만 허용하고, 답변과 검색 문자열은 React 텍스트로 표시한다. 오류 응답에서 내부 정보·키를 노출하지 않는다.

## 남은 사항

1. npm audit 전체·production 모두 high 9, critical 0이다. 패치 없는 braces 3.0.3 취약점 하나가 micromatch·fast-glob·ts-morph·shadcn·Vinext 빌드 플러그인 등의 의존성으로 전파된 결과다. 9개의 독립 취약점이라는 뜻은 아니다. 설치 경로는 빌드·CLI 용도이고 배포 JS에서 해당 패키지 참조를 찾지 못했지만 취약점 제거를 뜻하지 않는다. 신뢰할 수 없는 glob 패턴을 빌드 도구에 전달하지 않고 upstream 패치를 추적해야 한다. 강제 프레임워크 변경·shadcn 다운그레이드는 적용하지 않았다.
2. AI 실제 키는 미연결이다. 지속적인 사용자별 요청 제한·비용 한도가 아직 없다. Origin·Sec-Fetch-Site 검사는 인증이나 사용량 제한이 아니며 비브라우저 클라이언트가 위조할 수 있다. 실제 AI 연결 또는 공개 공유 전에 서버에서 적용되는 제한과 제공자 예산을 구현해야 한다.
3. CSP unsafe-inline 제거·nonce 적용, Sites 임베딩에 맞는 프레임 정책 검증은 추가 과제다. 현재 CSP를 완전한 XSS 방어로 표현하지 않는다.

## 검증과 한계

- 단위 검사 25개 통과. 길이 없는 스트림, UTF-8 바이트 제한, 선언·실제 길이 불일치, 미디어 타입·cross-site, 잘못된 JSON·UTF-8 포함.
- 기존 실제 UI 32개 및 기록·주제 UI 14개 통과. 전쟁 60개, 주제 24단계, 모바일·키보드·이미지 모달을 확인했다.
- 보안 HTTP·브라우저 13개 통과. 보안 헤더, 오류 상태와 no-store, 검색 HTML 실행 방지, 브라우저 POST 및 CSP 오류 없음을 확인했다. 단일 XSS 문자열 검사만으로 모든 XSS를 배제할 수 없다.
- TypeScript, 변경 범위 lint, 프로덕션 빌드 통과.
- 추적 텍스트 파일 224개와 생성 JS의 주요 API 키·AWS 키·개인키 형식 검사에서 일치 항목 없음. 모든 비밀 형식이나 전체 Git 이력을 감사한 것은 아니다.
- Sites 조회에서 소유자 전용 접근을 확인하고 배포에서도 유지한다. 실제 유료 AI 호출은 수행하지 않았다.

근거: [React RSC 권고](https://github.com/advisories/GHSA-wx67-qw84-cm4g), [Vite Windows 개발 서버 권고](https://github.com/advisories/GHSA-fx2h-pf6j-xcff), [braces 미패치 권고](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm). 원본 검사 결과는 로컬 outputs/qa/security-*.json에 보관한다.
