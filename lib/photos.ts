export const photos: Record<
  string,
  {
    src: string;
    caption: string;
    credit: string;
    url: string;
    rights: string;
    width: number;
    height: number;
  }
> = {
  ww1: {
    src: '/images/ww1-bread-line-1914.jpg',
    caption: '1914년 영국에서 빵을 받기 위해 줄을 선 여성과 아이들.',
    credit: 'National Photo Company Collection / Library of Congress',
    url: 'https://www.loc.gov/pictures/item/95502517/',
    rights: '알려진 출판 제한 없음',
    width: 1024,
    height: 813,
  },
  ww2: {
    src: '/images/ww2-london-shelter.jpg',
    caption:
      '1940년 11월, 런던 엘리펀트 앤드 캐슬 지하철역에서 공습을 피해 잠을 청하는 시민들.',
    credit: 'Bill Brandt / Ministry of Information · IWM D 1568',
    url: 'https://commons.wikimedia.org/wiki/File:SHELTER_PHOTOGRAPHS_TAKEN_IN_LONDON_BY_BILL_BRANDT,_NOVEMBER_1940_D1568.jpg',
    rights: 'UK Crown Copyright 만료 · 원본 워터마크 유지',
    width: 761,
    height: 800,
  },
  korea: {
    src: '/images/korea-girl-1951.jpg',
    caption:
      '1951년 6월 9일, 행주에서 어린 남동생을 업고 전차 옆을 지나는 소녀.',
    credit: 'Maj. R. V. Spencer / U.S. National Archives · 80-G-429691',
    url: 'https://www.archives.gov/research/military/korean-war',
    rights: '미국 정부 촬영 · 퍼블릭 도메인',
    width: 600,
    height: 489,
  },
};
