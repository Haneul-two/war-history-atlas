import { extraWars, extraSources } from './catalogue-data.ts';
export const CONFIG = {
  minYear: -499,
  maxYear: 2021,
  initialYear: 1914,
  maxQuestion: 500,
  maxTokens: 1200,
  timeoutMs: 30000,
  model: 'gpt-4.1-mini',
  storageKey: 'war-atlas:v1',
  cataloguePageSize: 12,
  playbackMs: 2200,
};
export type Source = { id: string; name: string; url: string; scope: string };
export const sources: Source[] = [
  ...extraSources,
  {
    id: 'loc-ww1',
    name: '미 의회도서관 · 제1차 세계대전 연표',
    url: 'https://www.loc.gov/exhibitions/world-war-i-american-experiences/timeline/',
    scope: '1914년 발발, 미국 참전, 1918년 휴전 날짜',
  },
  {
    id: 'iwm-causes',
    name: 'IWM · 1914년 전쟁의 시작',
    url: 'https://www.iwm.org.uk/history/first-world-war/outbreak',
    scope: '사라예보 사건과 동맹·동원·외교적 선택',
  },
  {
    id: 'nam-marne',
    name: '영국 육군박물관 · 서부전선',
    url: 'https://www.nam.ac.uk/explore/cavalry-western-front',
    scope: '1914년 마른 전투와 참호전의 형성',
  },
  {
    id: 'nam-somme',
    name: '영국 육군박물관 · 솜 전투',
    url: 'https://www.nam.ac.uk/explore/battle-somme',
    scope: '1916년 솜 전투와 소모전',
  },
  {
    id: 'nam-peace',
    name: '영국 육군박물관 · 평화와 추모',
    url: 'https://www.nam.ac.uk/explore/peace-and-commemoration',
    scope: '휴전 뒤 사회 복귀와 전쟁 기억',
  },
  {
    id: 'ushmm-dates',
    name: '미국 홀로코스트기념관 · 제2차 세계대전 연표',
    url: 'https://encyclopedia.ushmm.org/content/en/article/world-war-ii-key-dates',
    scope: '1939~1945 주요 사건의 날짜와 전개',
  },
  {
    id: 'ww2-poland',
    name: '국립 제2차 세계대전박물관 · 폴란드 침공',
    url: 'https://www.nationalww2museum.org/war/articles/invasion-poland-september-1939',
    scope: '1939년 폴란드 침공',
  },
  {
    id: 'ushmm-holocaust',
    name: '미국 홀로코스트기념관 · 홀로코스트 개요',
    url: 'https://encyclopedia.ushmm.org/content/en/article/introduction-to-the-holocaust',
    scope: '민간인 박해, 유대인 집단학살',
  },
  {
    id: 'nam-korea',
    name: '영국 육군박물관 · 한국전쟁',
    url: 'https://www.nam.ac.uk/explore/korean-war',
    scope: '1950년 전선 변화, 인천상륙, 중국군 개입, 흥남 철수',
  },
  {
    id: 'nara-korea',
    name: '미 국립문서기록관리청 · 한국전쟁 참전',
    url: 'https://www.archives.gov/education/lessons/korean-conflict',
    scope: '북한의 남침과 유엔·미국의 개입',
  },
  {
    id: 'nara-armistice',
    name: '미 국립문서기록관리청 · 1953년 정전협정',
    url: 'https://www.archives.gov/milestone-documents/armistice-agreement-restoration-south-korean-state',
    scope: '정전협정 원문, DMZ, 평화조약과의 차이',
  },
  {
    id: 'nara-records',
    name: '미 국립문서기록관리청 · 한국전쟁 기록',
    url: 'https://www.archives.gov/research/military/korean-war',
    scope: '피란민 사진과 전쟁 기록',
  },
  {
    id: 'un-history',
    name: '유엔 · 유엔의 역사',
    url: 'https://www.un.org/en/about-us/history-of-the-un',
    scope: '1945년 유엔 설립',
  },
];
export type WarEvent = {
  id: string;
  date: string;
  year?: number;
  dateLabel: string;
  title: string;
  place: string;
  lon: number;
  lat: number;
  what: string;
  why: string;
  change: string;
  detail: string;
  sources: string[];
};
export type War = {
  id: string;
  title: string;
  english: string;
  regions?: string[];
  scopeNote?: string;
  start: number;
  end: number;
  region: string;
  tagline: string;
  summary: string;
  cause: string;
  trigger: string;
  aftermath: string;
  civilian: string;
  civilianTitle: string;
  scope: string;
  technology: string;
  ending: string;
  parties: { name: string; goal: string }[];
  sources: string[];
  events: WarEvent[];
};
export const wars: War[] = [
  ...extraWars,
  {
    id: 'ww1',
    title: '제1차 세계대전',
    english: 'THE FIRST WORLD WAR',
    start: 1914,
    end: 1918,
    region: '유럽에서 세계로',
    tagline: '사라예보 암살 사건 이후 유럽을 넘어 확대된 전쟁.',
    summary:
      '발칸의 위기가 유럽 열강의 전쟁으로 확대되고, 제국과 식민지까지 휘말렸습니다. 짧게 끝날 것이라는 기대와 달리 긴 소모전이 이어졌습니다.',
    cause:
      '발칸의 민족주의와 제국 간 경쟁, 군비 확장, 동맹 관계가 긴장을 높였습니다. 동맹만으로 전쟁이 자동 결정된 것은 아닙니다. 각국 지도자의 위기 대응과 동원 결정이 전쟁을 확대했습니다.',
    trigger:
      '1914년 6월 사라예보 암살 사건 이후 오스트리아-헝가리가 세르비아에 선전포고했습니다.',
    aftermath:
      '여러 제국이 무너지고 새로운 국가와 국경이 등장했습니다. 평화협정은 전쟁을 정리했지만 새로운 불만과 갈등도 남겼습니다. 이후 전쟁을 하나의 원인만으로 설명할 수는 없습니다.',
    civilianTitle: '피란과 배급, 군수공장 노동',
    civilian:
      '식량 부족과 피란, 군수공장 노동은 전선 밖 일상을 바꾸었습니다. 식민지의 병사와 노동자도 동원됐습니다. 귀환한 사람들은 상실과 부상, 재건이라는 과제를 마주했습니다.',
    scope: '유럽·중동·아프리카·해양과 식민지에 걸친 전쟁',
    technology:
      '기관총·중포·참호, 잠수함과 항공기. 후반에는 전차도 투입됐습니다.',
    ending: '1918년 독일과 연합국의 휴전. 이후 별도의 평화협정이 체결됐습니다.',
    parties: [
      {
        name: '독일·오스트리아-헝가리',
        goal: '각국의 안보와 세력 유지·확대를 추구했습니다. 오스트리아-헝가리는 세르비아를 제국 질서의 위협으로 보았습니다.',
      },
      {
        name: '프랑스·영국·러시아',
        goal: '독일의 팽창 억제와 자국 안보 등 이해가 결합했습니다. 세 나라의 목표는 같지 않았습니다.',
      },
      {
        name: '미국 (1917~)',
        goal: '무제한 잠수함전 등으로 중립을 포기하고 참전했습니다.',
      },
    ],
    sources: ['loc-ww1', 'iwm-causes', 'nam-peace'],
    events: [
      {
        id: 'sarajevo',
        date: '1914-06-28',
        dateLabel: '1914. 06. 28',
        title: '사라예보의 총성',
        place: '사라예보',
        lon: 18.413,
        lat: 43.856,
        what: '오스트리아-헝가리의 황태자 프란츠 페르디난트가 사라예보에서 암살됐습니다.',
        why: '사건은 발칸의 긴장을 국제적 위기로 바꾼 직접적인 계기였습니다.',
        change: '최후통첩과 외교 교섭을 거쳐 7월의 전쟁 위기로 이어졌습니다.',
        detail:
          '암살 직후 모든 국가가 전쟁을 결정한 것은 아닙니다. 사건과 발발 사이의 한 달 동안 내려진 선택을 함께 봐야 합니다.',
        sources: ['loc-ww1', 'iwm-causes'],
      },
      {
        id: 'july-crisis',
        date: '1914-07-28',
        dateLabel: '1914. 07. 28 ~ 08',
        title: '지역의 위기가 유럽의 전쟁으로',
        place: '빈 · 유럽 각국',
        lon: 16.373,
        lat: 48.208,
        what: '오스트리아-헝가리가 세르비아에 선전포고했습니다. 동원과 선전포고가 잇따르며 주요 열강이 참전했습니다.',
        why: '동맹, 군사 계획, 지도자의 판단이 얽히면서 분쟁 범위가 확대됐습니다.',
        change:
          '독일의 벨기에 침공과 영국의 참전으로 서유럽까지 전쟁에 들어갔습니다.',
        detail:
          '지도 위치는 빈을 대표 지점으로 표시합니다. 위기는 여러 수도에서 동시에 진행됐습니다.',
        sources: ['loc-ww1', 'iwm-causes'],
      },
      {
        id: 'marne',
        date: '1914-09-05',
        dateLabel: '1914. 09',
        title: '마른, 짧은 전쟁의 기대가 꺾이다',
        place: '마른강 일대',
        lon: 3.0,
        lat: 49.0,
        what: '프랑스·영국군의 반격으로 독일군의 파리 방면 진격이 저지됐습니다.',
        why: '서부전선에서 빠른 승리를 얻으려던 계획이 실현되지 못했습니다.',
        change: '이후 전선이 굳어지며 긴 참호전으로 이어졌습니다.',
        detail:
          '마른 전투만으로 전선 전체가 즉시 고정된 것은 아닙니다. 이후 기동과 전투를 거쳐 참호 체계가 확대됐습니다.',
        sources: ['nam-marne'],
      },
      {
        id: 'somme',
        date: '1916-07-01',
        dateLabel: '1916. 07 ~ 11',
        title: '솜, 소모전의 대가',
        place: '솜강 일대',
        lon: 2.7,
        lat: 50.0,
        what: '영국·프랑스군과 독일군 사이에 수개월에 걸친 대규모 전투가 벌어졌습니다.',
        why: '막대한 손실에 비해 제한적인 진격은 소모전의 성격을 드러냈습니다.',
        change: '군사 전술과 전쟁을 기억하는 방식에 깊은 흔적을 남겼습니다.',
        detail:
          '솜을 이해할 때 전선 이동뿐 아니라 병사들의 경험과 산업적 전쟁의 규모를 함께 보아야 합니다.',
        sources: ['nam-somme'],
      },
      {
        id: 'us-entry',
        date: '1917-04-06',
        dateLabel: '1917. 04. 06',
        title: '미국의 참전',
        place: '워싱턴 D.C.',
        lon: -77.037,
        lat: 38.907,
        what: '미국이 독일에 선전포고하며 전쟁에 들어갔습니다.',
        why: '참전은 연합국에 새로운 인력과 자원이 투입되는 계기가 됐습니다.',
        change: '미군의 본격적인 전선 투입은 이후 점진적으로 진행됐습니다.',
        detail:
          '선전포고일과 실제 대규모 전투 참여 시기는 다릅니다. 정치적 결정이 곧바로 전선의 변화를 뜻하지는 않습니다.',
        sources: ['loc-ww1'],
      },
      {
        id: 'armistice-1918',
        date: '1918-11-11',
        dateLabel: '1918. 11. 11',
        title: '휴전, 그리고 남겨진 과제',
        place: '콩피에뉴',
        lon: 2.9,
        lat: 49.42,
        what: '독일과 연합국 사이의 휴전이 발효됐습니다.',
        why: '서부전선의 전투가 중단됐지만 평화의 조건은 별도로 협상해야 했습니다.',
        change: '전후 재건과 평화협정, 추모의 시간이 시작됐습니다.',
        detail:
          '휴전은 총격을 멈추는 합의이고 평화조약은 전후 관계를 정하는 문서입니다. 두 시점을 구분해서 읽어야 합니다.',
        sources: ['loc-ww1', 'nam-peace'],
      },
    ],
  },
  {
    id: 'ww2',
    title: '제2차 세계대전',
    english: 'THE SECOND WORLD WAR',
    start: 1939,
    end: 1945,
    region: '유럽 · 아시아 · 태평양',
    tagline: '유럽과 아시아의 전쟁이 연결되며 세계로 확대된 전쟁.',
    summary:
      '유럽과 아시아의 침략 전쟁들이 연결되며 세계적 전쟁으로 확대됐습니다. 군사적 충돌뿐 아니라 점령, 강제노동, 집단학살이 민간인의 삶을 파괴했습니다.',
    cause:
      '나치 독일의 팽창과 일본 제국의 침략, 국제질서의 불안정 속에서 전쟁이 확대됐습니다. 아시아에서는 1937년 중일전쟁이 이미 진행 중이었습니다.',
    trigger:
      '유럽에서는 1939년 독일의 폴란드 침공과 영국·프랑스의 대독 선전포고가 기점입니다.',
    aftermath:
      '독일과 일본이 패전했고 유엔이 설립됐습니다. 재건과 탈식민화, 미국·소련의 대립은 전후 세계를 바꾸었습니다.',
    civilianTitle: '공습과 강제노동, 민간인 학살',
    civilian:
      '공습과 피란, 식량 배급과 강제노동이 일상에 침투했습니다. 나치 독일과 협력자들은 유대인을 조직적으로 학살했고 다른 집단들도 박해했습니다. 서로 다른 피해 경험을 하나로 뭉뚱그리지 않아야 합니다.',
    scope: '유럽·북아프리카·아시아·태평양을 잇는 여러 전역',
    technology:
      '기갑부대와 항공전, 항공모함·레이더. 종전기에 원자폭탄이 사용됐습니다.',
    ending: '1945년 5월 유럽에서 독일 항복, 9월 2일 일본의 공식 항복.',
    parties: [
      {
        name: '독일·이탈리아·일본',
        goal: '각자의 제국적 팽창을 추구했습니다. 목표와 전쟁 수행은 서로 달랐습니다.',
      },
      {
        name: '영국·소련·미국·중국 등',
        goal: '추축국의 침략에 맞섰습니다. 참전 시기와 전후 구상은 같지 않았습니다.',
      },
    ],
    sources: ['ushmm-dates', 'ushmm-holocaust', 'un-history'],
    events: [
      {
        id: 'poland',
        date: '1939-09-01',
        dateLabel: '1939. 09. 01',
        title: '폴란드 침공',
        place: '폴란드',
        lon: 19.1,
        lat: 52.0,
        what: '독일이 폴란드를 침공했습니다. 영국과 프랑스는 9월 3일 독일에 선전포고했습니다.',
        why: '유럽의 위기가 대규모 국가 간 전쟁으로 바뀌었습니다.',
        change: '9월 17일에는 소련도 동쪽에서 폴란드를 침공했습니다.',
        detail:
          '폴란드는 양쪽에서 침공을 받았습니다. 지도는 나라의 대표 지점이며 실제 공격로를 뜻하지 않습니다.',
        sources: ['ww2-poland', 'ushmm-dates'],
      },
      {
        id: 'barbarossa',
        date: '1941-06-22',
        dateLabel: '1941. 06. 22',
        title: '독일의 소련 침공',
        place: '동부전선 · 민스크 부근',
        lon: 27.56,
        lat: 53.9,
        what: '독일과 동맹국들이 소련을 침공했습니다.',
        why: '동부전선이 열리면서 전쟁의 규모와 폭력이 크게 확대됐습니다.',
        change: '소련이 독일에 맞서는 연합국의 주요 세력이 됐습니다.',
        detail:
          '전선은 발트해에서 흑해 방면까지 매우 넓었습니다. 한 점으로 전체 전역을 표현할 수는 없습니다.',
        sources: ['ushmm-dates'],
      },
      {
        id: 'pearl-harbor',
        date: '1941-12-07',
        dateLabel: '1941. 12. 07',
        title: '진주만 공격과 미국의 참전',
        place: '하와이 · 진주만',
        lon: -157.95,
        lat: 21.36,
        what: '일본이 진주만을 공격했습니다. 미국은 다음 날 일본에 선전포고했습니다.',
        why: '태평양의 전쟁이 확대되고 미국이 본격 참전했습니다.',
        change:
          '독일의 대미 선전포고 등으로 유럽과 태평양의 전쟁이 더욱 연결됐습니다.',
        detail:
          '아시아의 전쟁은 진주만에서 처음 시작된 것이 아닙니다. 중국과 다른 지역에서 이어진 전쟁도 함께 살펴야 합니다.',
        sources: ['ushmm-dates'],
      },
      {
        id: 'stalingrad',
        date: '1943-02-02',
        dateLabel: '1942. 08 ~ 1943. 02',
        title: '스탈린그라드의 전환점',
        place: '스탈린그라드 · 현재 볼고그라드',
        lon: 44.5,
        lat: 48.71,
        what: '장기간의 전투와 소련군의 포위 끝에 독일 제6군의 저항이 끝났습니다.',
        why: '동부전선에서 독일군이 큰 패배를 겪은 중요한 전환점입니다.',
        change: '전쟁의 주도권은 점차 소련군 쪽으로 이동했습니다.',
        detail:
          '대표 날짜는 전투가 끝난 1943년 2월 2일입니다. 한 전투가 전쟁 전체의 결과를 혼자 결정한 것은 아닙니다.',
        sources: ['ushmm-dates'],
      },
      {
        id: 'normandy',
        date: '1944-06-06',
        dateLabel: '1944. 06. 06',
        title: '노르망디 상륙',
        place: '프랑스 · 노르망디',
        lon: -0.87,
        lat: 49.36,
        what: '미국·영국·캐나다 등을 중심으로 한 연합군이 프랑스 해안에 상륙했습니다.',
        why: '서유럽에서 독일군에 맞서는 새로운 대규모 전선이 형성됐습니다.',
        change: '프랑스 해방과 독일 방면 진격을 위한 교두보가 확보됐습니다.',
        detail:
          '상륙 당일과 노르망디 전역 전체는 구분해야 합니다. 전투는 이후에도 계속됐습니다.',
        sources: ['ushmm-dates'],
      },
      {
        id: 'surrender-1945',
        date: '1945-09-02',
        dateLabel: '1945. 09. 02',
        title: '일본의 공식 항복',
        place: '도쿄만',
        lon: 139.76,
        lat: 35.35,
        what: '일본이 항복 문서에 서명했습니다. 유럽에서는 독일의 항복이 이미 5월에 이뤄졌습니다.',
        why: '아시아·태평양 전쟁의 공식적인 종결 시점입니다.',
        change: '점령과 재건, 새로운 국제질서의 형성이 이어졌습니다.',
        detail:
          '8월에는 원자폭탄 투하와 소련의 대일 참전이 있었습니다. 항복 결정의 요인별 비중은 추가 자료와 해석이 필요한 주제입니다.',
        sources: ['ushmm-dates', 'un-history'],
      },
    ],
  },
  {
    id: 'korea',
    title: '한국전쟁',
    english: 'THE KOREAN WAR',
    start: 1950,
    end: 1953,
    region: '한반도',
    tagline: '분단과 냉전 속에서 벌어진 한반도의 전쟁.',
    summary:
      '분단된 한반도에서 북한의 남침으로 시작된 전쟁은 유엔군과 중국군이 개입하며 국제전으로 확대됐습니다. 1953년 정전은 전투를 멈췄지만 평화조약은 아니었습니다.',
    cause:
      '해방 이후의 분단과 대립, 냉전 속 강대국의 이해관계가 겹쳤습니다. 남북한의 정치적 갈등은 국제적 긴장과 분리해 볼 수 없습니다.',
    trigger: '1950년 6월 25일 북한군이 38선을 넘어 남침했습니다.',
    aftermath:
      '군사분계선과 비무장지대가 설정됐습니다. 파괴된 삶의 터전과 이산가족, 분단의 지속은 전쟁이 남긴 장기적인 과제였습니다.',
    civilianTitle: '피란과 이산가족',
    civilian:
      '전선의 이동은 거듭된 피란을 낳았습니다. 폭격과 학살, 가족의 이산은 군사적 승패만으로 설명할 수 없는 상처를 남겼습니다. 흥남에서는 군인뿐 아니라 많은 민간인도 바다를 통해 철수했습니다.',
    scope: '한반도를 중심으로 여러 국가의 군대가 참여',
    technology: '보병·포병·전차, 제트 항공전과 해상 상륙작전.',
    ending: '1953년 7월 27일 정전협정. 영구적인 평화조약이 아닙니다.',
    parties: [
      {
        name: '대한민국·유엔군',
        goal: '북한의 침공을 저지했습니다. 이후 북진 과정에서는 전쟁 목표가 확대됐습니다.',
      },
      { name: '북한', goal: '무력으로 한반도를 통일하려 했습니다.' },
      {
        name: '중국·소련',
        goal: '중국은 군대를 투입했고 소련은 무기 등 지원을 제공했습니다. 개입 형태를 구분해야 합니다.',
      },
    ],
    sources: ['nam-korea', 'nara-korea', 'nara-armistice', 'nara-records'],
    events: [
      {
        id: 'invasion-1950',
        date: '1950-06-25',
        dateLabel: '1950. 06. 25',
        title: '38선을 넘어 시작된 전쟁',
        place: '38선 일대 · 서울 북쪽',
        lon: 127.0,
        lat: 38.0,
        what: '북한군이 38선을 넘어 남침했습니다.',
        why: '분단 속 대립이 전면전으로 바뀌었습니다.',
        change:
          '유엔의 대응과 미국을 비롯한 여러 나라의 군사 개입이 이어졌습니다.',
        detail:
          '여러 지점에서 공격이 진행됐습니다. 지도는 대표 위치를 표시합니다.',
        sources: ['nara-korea', 'nara-armistice'],
      },
      {
        id: 'busan',
        date: '1950-08-01',
        dateLabel: '1950. 08 ~ 09',
        title: '낙동강 방어선',
        place: '낙동강 · 대구 부근',
        lon: 128.4,
        lat: 35.9,
        what: '국군과 유엔군이 한반도 남동부의 방어선을 유지했습니다.',
        why: '부산을 통한 병력과 보급의 통로를 지키는 일이 중요했습니다.',
        change: '방어선 유지와 병력 증강은 이후 반격의 바탕이 됐습니다.',
        detail:
          '날짜는 8월 방어전의 시작 시기를 대표합니다. 여러 지역에서 전투가 이어졌습니다.',
        sources: ['nam-korea'],
      },
      {
        id: 'incheon',
        date: '1950-09-15',
        dateLabel: '1950. 09. 15',
        title: '인천상륙작전',
        place: '인천',
        lon: 126.62,
        lat: 37.47,
        what: '유엔군이 인천에 상륙했습니다.',
        why: '북한군 후방을 압박하면서 전선의 흐름을 바꿨습니다.',
        change: '서울 수복과 북진으로 이어졌습니다.',
        detail:
          '상륙 성공 이후 전쟁이 곧 끝나지는 않았습니다. 북진은 새로운 국제적 충돌로 이어졌습니다.',
        sources: ['nam-korea'],
      },
      {
        id: 'china-entry',
        date: '1950-10-25',
        dateLabel: '1950. 10 ~ 11',
        title: '중국군 개입',
        place: '평안북도 · 온정 일대',
        lon: 125.55,
        lat: 40.15,
        what: '중국군이 전투에 참여했고 11월 대규모 공세가 이어졌습니다.',
        why: '국군과 유엔군의 북진이 저지되며 전쟁의 양상이 다시 바뀌었습니다.',
        change: '전선은 남쪽으로 이동했고 전쟁은 장기화했습니다.',
        detail:
          '10월의 초기 전투와 11월의 대규모 공세를 구분합니다. 중국의 개입은 한 번의 전투로 끝난 사건이 아닙니다.',
        sources: ['nam-korea'],
      },
      {
        id: 'hungnam',
        date: '1950-12-24',
        dateLabel: '1950. 12',
        title: '흥남, 바다로 이어진 피란길',
        place: '흥남항',
        lon: 127.62,
        lat: 39.83,
        what: '군인과 민간인들이 흥남항에서 선박을 통해 철수했습니다.',
        why: '군사 작전과 민간인의 생존이 맞물린 사건입니다.',
        change: '피란과 이산의 경험이 전쟁 기억의 중요한 일부로 남았습니다.',
        detail: '사건의 날짜는 철수가 끝난 시점을 기준으로 표기했습니다.',
        sources: ['nam-korea', 'nara-records'],
      },
      {
        id: 'armistice-1953',
        date: '1953-07-27',
        dateLabel: '1953. 07. 27',
        title: '정전, 평화와는 다른 합의',
        place: '판문점',
        lon: 126.677,
        lat: 37.956,
        what: '유엔군·북한군·중국인민지원군 측이 정전협정에 서명했습니다.',
        why: '전투 중지와 비무장지대 설치를 정했지만 영구적인 평화조약은 아니었습니다.',
        change: '군사분계선 양쪽으로 비무장지대가 형성됐습니다.',
        detail:
          '대한민국은 협정 서명 당사자가 아닙니다. 정전의 법적·정치적 성격과 민간인의 전후 삶은 구분해서 살펴야 합니다.',
        sources: ['nara-armistice'],
      },
    ],
  },
];
export function getWar(id: string) {
  return wars.find((w) => w.id === id);
}
export function getSource(id: string) {
  return sources.find((s) => s.id === id);
}
export function eventHref(war: War, eventId: string, mode = 'full') {
  return `/wars/${war.id}?event=${encodeURIComponent(eventId)}&mode=${mode === 'short' ? 'short' : 'full'}`;
}
export function warsAtYear(year: number | null) {
  return year === null
    ? wars
    : wars.filter((w) => year >= w.start && year <= w.end);
}
export type SavedState = {
  bookmarks: string[];
  positions: Record<string, string>;
};
export function parseSaved(raw: string | null): SavedState {
  try {
    const x = JSON.parse(raw || '{}');
    return {
      bookmarks: Array.isArray(x?.bookmarks)
        ? x.bookmarks.filter(
            (id: unknown) => typeof id === 'string' && getWar(id),
          )
        : [],
      positions: Object.fromEntries(
        Object.entries(
          x?.positions && typeof x.positions === 'object' ? x.positions : {},
        ).filter(([id, event]) =>
          getWar(id)?.events.some((e) => e.id === event),
        ),
      ) as Record<string, string>,
    };
  } catch {
    return { bookmarks: [], positions: {} };
  }
}
export function validateQuestion(x: unknown) {
  if (!x || typeof x !== 'object') return null;
  const b = x as Record<string, unknown>;
  const war = typeof b.warId === 'string' ? getWar(b.warId) : undefined;
  const event = war?.events.find((e) => e.id === b.eventId);
  const question = typeof b.question === 'string' ? b.question.trim() : '';
  return war && event && question && question.length <= CONFIG.maxQuestion
    ? { war, event, question }
    : null;
}
