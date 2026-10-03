# Source and asset register

Checked 2026-10-03. Historical claims are short editorial paraphrases; no invented direct quotations. Source IDs in lib/history.ts link each event to its supporting record. Dates and locations are representative when the event spans a period/region; labels disclose this.

- WWI chronology: Library of Congress exhibition timeline (search index confirmed; direct browser fetch restricted). Causes: IWM outbreak page read through UK Government Web Archive copy. Marne: National Army Museum Cavalry on the Western Front. Somme: NAM Battle of the Somme. Return and commemoration: NAM Peace and commemoration.
- WWII chronology: US Holocaust Memorial Museum World War II Dates and Timeline. Poland: National WWII Museum The Invasion of Poland. Civilian persecution: USHMM Introduction to the Holocaust. UN formation: official UN history; public chronology of 1945.
- Korea: National Army Museum Korean War; NARA US Enters the Korean Conflict; original Korean Armistice Agreement, July 27 1953. The armistice text explicitly distinguishes suspension of hostilities from permanent peace.
- Coordinates indicate representative locations, never reconstructed front lines. Natural Earth ne_110m_land public-domain coastline data: https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_110m_land.geojson . Simplified outlines may be coarse at city scale.

## Images

1. Women and children in an English bread line, 1914. Library of Congress National Photo Company collection, LCCN95502517. No known publication restrictions. https://www.loc.gov/pictures/item/95502517/ . Local 1024x813 JPG.
2. Bill Brandt, Elephant & Castle shelter, November 1940. Ministry of Information / IWM D1568. UK Crown Copyright expired per Commons record, original IWM watermark preserved. https://commons.wikimedia.org/wiki/File:SHELTER_PHOTOGRAPHS_TAKEN_IN_LONDON_BY_BILL_BRANDT,_NOVEMBER_1940_D1568.jpg . Local 761x800 JPG.
3. Girl carrying brother, Haengju June 9 1951. Maj. R. V. Spencer / NARA 80-G-429691, NAID520796. Official US military public-domain photograph. https://www.archives.gov/research/military/korean-war . Local 600x489 JPG.

All 3 assets verified by asset researcher; WWII and Korea opened with view_image. Captions and rights visible in the site.

## AI implementation reference

OpenAI official Text generation guide and Structured model outputs guide read. Responses API with developer/user separation, JSON schema, store:false. GPT-4.1-mini official model page verified. No real API call or API key creation performed. Only mocked provider responses tested.

## UI 폰트

Pretendard Variable: https://github.com/orioncactus/pretendard (main packages/pretendard/dist/web/variable/woff2/PretendardVariable.woff2). 자체 호스팅, SIL Open Font License 1.1, 라이선스 public/fonts/OFL.txt.

## 2026-10-03 확장 자료

새로운 57개 전쟁의 백과사전 개요 페이지를 탐색하여 기간·대표 사건·결과를 대조했다. 개요 기반의 편집 요약이며 전문 연구자의 감수를 거친 자료로 주장하지 않는다. 각 항목의 원문은 [catalogue.md](catalogue.md)에 기록했다. 기존 3개 전쟁의 박물관·기록관 자료와 사진은 보존했다. 새로운 전쟁에 기존 사진을 재사용하지 않았다.

배경: [A Map of the World WDL6672](https://commons.wikimedia.org/wiki/File:A_Map_of_the_World_WDL6672.png). 1850~1900년 사이 일본 목각 세계지도, 미 의회도서관 소장. Commons 권리 표기의 퍼블릭 도메인 확인. 원본 1347×1024 PNG를 내려받아 JPEG 품질85로 압축한 public/images/archive-world-map.jpg를 자체 호스팅한다. 정확한 지리 설명용 지도가 아닌 장식용 이미지다.

독립 리뷰의 인천 검색·읽던 위치·URL 선택·자동 진행·키보드 포커스·연도 및 지도 접근성 지적을 반영했다.
