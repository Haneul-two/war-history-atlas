import { wars, type War } from './history.ts';
export const eras = [
  { id: 'all', label: '모든 시대' },
  { id: 'ancient', label: '고대' },
  { id: 'medieval', label: '중세' },
  { id: 'early', label: '근세' },
  { id: '19c', label: '19세기' },
  { id: '20c', label: '20세기' },
  { id: 'modern', label: '1990년 이후' },
];
export const regions = [
  '전체 지역',
  '유럽',
  '아시아',
  '아프리카',
  '아메리카',
  '여러 대륙',
];
export function formatYear(year: number) {
  return year < 0 ? `기원전 ${Math.abs(year)}년` : `${year}년`;
}
export function formatPeriod(w: War) {
  return w.start === w.end
    ? formatYear(w.start)
    : `${formatYear(w.start)} ~ ${formatYear(w.end)}`;
}
export function ordinal(year: number) {
  return year > 0 ? year - 1 : year;
}
export function calendar(index: number) {
  return index >= 0 ? index + 1 : index;
}
export function era(w: War) {
  const y = w.start;
  return y < 500
    ? 'ancient'
    : y < 1500
      ? 'medieval'
      : y < 1800
        ? 'early'
        : y < 1900
          ? '19c'
          : y < 1990
            ? '20c'
            : 'modern';
}
export function theaters(w: War) {
  return (
    w.regions?.map(
      (r) =>
        ({
          europe: '유럽',
          asia: '아시아',
          africa: '아프리카',
          americas: '아메리카',
        })[r] || r,
    ) ||
    (w.id === 'korea' ? ['아시아'] : ['유럽', '아시아', '아프리카', '아메리카'])
  );
}
export type Query = {
  q: string;
  era: string;
  region: string;
  year: number | null;
  saved: boolean;
  sort: string;
  page: number;
  war: string;
};
export const defaults: Query = {
  q: '',
  era: 'all',
  region: '전체 지역',
  year: null,
  saved: false,
  sort: 'oldest',
  page: 1,
  war: 'ww1',
};
export function parseQuery(params: URLSearchParams): Query {
  const year = Number(params.get('year'));
  return {
    q: (params.get('q') || '').slice(0, 100),
    era: eras.some((e) => e.id === params.get('era'))
      ? params.get('era')!
      : 'all',
    region: regions.includes(params.get('region') || '')
      ? params.get('region')!
      : '전체 지역',
    year:
      params.has('year') &&
      Number.isInteger(year) &&
      year !== 0 &&
      year >= -499 &&
      year <= 2021
        ? year
        : null,
    saved: params.get('saved') === '1',
    sort: params.get('sort') === 'newest' ? 'newest' : 'oldest',
    page: Math.max(1, Math.min(5, Math.floor(Number(params.get('page'))) || 1)),
    war: wars.some((w) => w.id === params.get('war'))
      ? params.get('war')!
      : 'ww1',
  };
}
export function queryURL(query: Query) {
  const p = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (
      value !== '' &&
      value !== null &&
      value !== false &&
      value !== defaults[key as keyof Query]
    )
      p.set(key, value === true ? '1' : String(value));
  }
  return '/' + (p.size ? '?' + p.toString() : '');
}
export function catalogue(query: Query, bookmarks: string[] = []) {
  const text = query.q.trim().toLocaleLowerCase();
  return wars
    .filter(
      (w) =>
        (!text ||
          [
            w.title,
            w.region,
            w.cause,
            ...w.parties.map((p) => p.name),
            ...w.events.flatMap((e) => [e.title, e.place, e.what]),
          ]
            .join(' ')
            .toLocaleLowerCase()
            .includes(text)) &&
        (query.era === 'all' || era(w) === query.era) &&
        (query.region === '전체 지역' ||
          (query.region === '여러 대륙'
            ? theaters(w).length > 1
            : theaters(w).includes(query.region))) &&
        (query.year === null ||
          (w.start <= query.year && w.end >= query.year)) &&
        (!query.saved || bookmarks.includes(w.id)),
    )
    .sort((a, b) =>
      query.sort === 'newest' ? b.start - a.start : a.start - b.start,
    );
}
