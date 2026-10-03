import { wars, type War } from './history.ts';
type Insight = { text: string; events: Record<string, string> };
export type Comparison = { common: Insight[]; different: Insight[] };
export const comparisons: Record<string, Comparison> = {
  'ww1-ww2': {
    common: [
      {
        text: '여러 나라의 동맹과 이해관계가 얽혀 전쟁의 범위가 확대됐습니다.',
        events: { ww1: 'july-crisis', ww2: 'pearl-harbor' },
      },
      {
        text: '인력과 산업 생산을 대규모로 동원했고, 장기전의 부담이 사회 전체에 미쳤습니다.',
        events: { ww1: 'somme', ww2: 'stalingrad' },
      },
      {
        text: '전투가 끝난 뒤에도 재건과 새로운 국제질서를 만드는 과제가 남았습니다.',
        events: { ww1: 'armistice-1918', ww2: 'surrender-1945' },
      },
    ],
    different: [
      {
        text: '제1차 세계대전은 발칸의 위기에서 확대됐고, 제2차 세계대전은 유럽과 아시아의 침략 전쟁이 연결됐습니다.',
        events: { ww1: 'sarajevo', ww2: 'poland' },
      },
      {
        text: '첫 전쟁의 서부전선에서는 참호전이 두드러졌습니다. 두 번째 전쟁에서는 기갑·항공·상륙작전이 넓게 결합됐습니다.',
        events: { ww1: 'marne', ww2: 'normandy' },
      },
      {
        text: '1918년은 독일과 연합국의 휴전, 1945년은 독일과 일본의 항복으로 끝맺음 방식과 시점이 달랐습니다.',
        events: { ww1: 'armistice-1918', ww2: 'surrender-1945' },
      },
    ],
  },
  'korea-ww1': {
    common: [
      {
        text: '지역에서 시작된 충돌이 다른 국가의 참전으로 확대됐습니다.',
        events: { ww1: 'july-crisis', korea: 'invasion-1950' },
      },
      {
        text: '전선이 정체되면서 전쟁이 장기화했고 병사와 민간인의 부담이 커졌습니다.',
        events: { ww1: 'somme', korea: 'china-entry' },
      },
      {
        text: '전투 중지와 이후 정치적 합의를 구분해야 합니다. 휴전·정전만으로 모든 갈등이 해소된 것은 아닙니다.',
        events: { ww1: 'armistice-1918', korea: 'armistice-1953' },
      },
    ],
    different: [
      {
        text: '제1차 세계대전은 제국 간 경쟁의 맥락, 한국전쟁은 분단과 냉전의 맥락에서 시작됐습니다.',
        events: { ww1: 'sarajevo', korea: 'invasion-1950' },
      },
      {
        text: '미국은 1917년에 참전했지만 한국전쟁에서는 전쟁 초기부터 유엔군의 중심 역할을 했습니다.',
        events: { ww1: 'us-entry', korea: 'busan' },
      },
      {
        text: '1918년 휴전 뒤에는 평화협정이 뒤따랐습니다. 한국전쟁의 정전협정은 영구적 평화조약이 아닙니다.',
        events: { ww1: 'armistice-1918', korea: 'armistice-1953' },
      },
    ],
  },
  'korea-ww2': {
    common: [
      {
        text: '군사적 진격과 반격으로 전선이 크게 바뀌었고 민간인의 피란이 이어졌습니다.',
        events: { ww2: 'barbarossa', korea: 'hungnam' },
      },
      {
        text: '대규모 상륙작전은 지리적 조건을 이용해 전쟁의 흐름을 바꾸려는 시도였습니다.',
        events: { ww2: 'normandy', korea: 'incheon' },
      },
      {
        text: '여러 국가가 서로 다른 목표를 가지고 참전했습니다. 같은 편이라고 이해관계가 모두 같지는 않았습니다.',
        events: { ww2: 'pearl-harbor', korea: 'china-entry' },
      },
    ],
    different: [
      {
        text: '제2차 세계대전은 여러 대륙과 대양에 걸쳤습니다. 한국전쟁의 주된 전장은 한반도였습니다.',
        events: { ww2: 'pearl-harbor', korea: 'busan' },
      },
      {
        text: '제2차 세계대전은 1945년 추축국의 패전으로 끝났지만 한국전쟁은 분단을 남긴 정전으로 이어졌습니다.',
        events: { ww2: 'surrender-1945', korea: 'armistice-1953' },
      },
      {
        text: '제2차 세계대전 뒤에 유엔이 설립됐고, 한국전쟁에는 유엔군이 개입했습니다.',
        events: { ww2: 'surrender-1945', korea: 'invasion-1950' },
      },
    ],
  },
};
export function resolvePair(
  left: string | undefined,
  right: string | undefined,
): [War, War] {
  const l =
    wars.find((w) => w.id === left) || wars.find((w) => w.id === 'ww1')!;
  const r =
    wars.find((w) => w.id === right && w.id !== l.id) ||
    wars.find((w) => w.id === 'ww2' && w.id !== l.id) ||
    wars.find((w) => w.id !== l.id)!;
  return [l, r];
}
export function getComparison(left: War, right: War) {
  return comparisons[[left.id, right.id].sort().join('-')] || null;
}
