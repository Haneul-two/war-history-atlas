import { chromium, expect } from '@playwright/test';
import { wars } from '../lib/history.ts';
import fs from 'node:fs';
const origin = process.argv[2] || 'http://localhost:8787';
const browser = await chromium.launch({ channel: 'msedge', headless: true });
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  permissions: ['clipboard-write', 'clipboard-read'],
});
const page = await context.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
let count = 0;
const check = async (name, fn) => {
  await fn();
  console.log('PASS ' + name);
  count++;
};
const home = () => page.goto(origin, { waitUntil: 'networkidle' });
fs.mkdirSync('outputs/qa', { recursive: true });
try {
  await home();
  await check(
    '60 wars, twelve results per page and selected marker',
    async () => {
      await expect(page.locator('.results-heading h2')).toHaveText('60개 전쟁');
      await expect(page.locator('.catalogue-item')).toHaveCount(12);
      await expect(page.locator('.map-marker')).toHaveCount(13);
    },
  );
  await check('local Korean font loaded', async () => {
    await page.evaluate(() => document.fonts.ready);
    expect(
      await page.evaluate(() =>
        document.fonts.check('16px "Pretendard Variable"'),
      ),
    ).toBe(true);
  });
  await check('catalogue list changes preview and map', async () => {
    await page
      .locator('.catalogue-select')
      .filter({ hasText: '임진왜란' })
      .click();
    await expect(page.locator('.map-preview h2')).toHaveText('임진왜란');
    await expect(page.locator('.map-marker.selected')).toHaveAttribute(
      'aria-label',
      /임진왜란/,
    );
  });
  await check('map supports keyboard selection', async () => {
    const name = await page
      .locator('.map-marker')
      .first()
      .getAttribute('aria-label');
    const m = page.getByRole('button', { name, exact: true });
    await m.focus();
    await page.keyboard.press('Enter');
    await expect(m).toHaveAttribute('aria-pressed', 'true');
  });
  await check('zoom and world reset change viewBox', async () => {
    const before = await page.locator('.world-map').getAttribute('viewBox');
    await page.getByRole('button', { name: '지도 확대', exact: true }).click();
    expect(await page.locator('.world-map').getAttribute('viewBox')).not.toBe(
      before,
    );
    await page
      .getByRole('button', { name: '세계 지도 보기', exact: true })
      .click();
    expect(await page.locator('.world-map').getAttribute('viewBox')).toMatch(
      /^0 0 1000/,
    );
  });
  await check('search finds event location 인천', async () => {
    await page.getByRole('textbox', { name: '전쟁 검색' }).fill('인천');
    await expect(page.locator('.results-heading h2')).toHaveText('1개 전쟁');
    await expect(page.locator('.map-preview h2')).toHaveText('한국전쟁');
  });
  await check('search URL survives refresh', async () => {
    await page.reload({ waitUntil: 'networkidle' });
    await expect(page.getByRole('textbox', { name: '전쟁 검색' })).toHaveValue(
      '인천',
    );
    await expect(page.locator('.map-preview h2')).toHaveText('한국전쟁');
  });
  await check('empty results remove all points and selected URL', async () => {
    await page
      .getByRole('textbox', { name: '전쟁 검색' })
      .fill('존재하지않는전쟁xyz');
    await expect(page.locator('.map-marker')).toHaveCount(0);
    await expect(page.locator('.map-preview h2')).toContainText('없습니다');
    expect(new URL(page.url()).searchParams.has('war')).toBe(false);
  });
  await check('reset restores catalogue', async () => {
    await page
      .getByRole('button', { name: '필터 초기화', exact: true })
      .click();
    await expect(page.locator('.results-heading h2')).toHaveText('60개 전쟁');
  });
  await check(
    'era and region combine with empty state and history restore',
    async () => {
      await page.getByRole('button', { name: '고대', exact: true }).click();
      await page.getByLabel('지역 선택').selectOption('아메리카');
      await expect(page.locator('.results-heading h2')).toHaveText('0개 전쟁');
      await page.goBack();
      await expect(page.getByLabel('지역 선택')).toHaveValue('전체 지역');
      await expect(
        page.getByRole('button', { name: '고대', exact: true }),
      ).toHaveAttribute('aria-pressed', 'true');
    },
  );
  await check('region includes African wars', async () => {
    await home();
    await page.getByLabel('지역 선택').selectOption('아프리카');
    await page.getByLabel('전쟁 정렬').selectOption('newest');
    await expect(page.locator('.catalogue-list')).toContainText('콩고');
  });
  await check('pagination exposes all sixty unique entries', async () => {
    await home();
    const ids = new Set();
    for (let i = 0; i < 5; i++) {
      for (const href of await page
        .locator('.catalogue-read')
        .evaluateAll((els) => els.map((e) => e.getAttribute('href'))))
        ids.add(href);
      if (i < 4)
        await page
          .getByRole('navigation', { name: '목록 페이지' })
          .getByRole('button', { name: '다음', exact: true })
          .click();
    }
    expect(ids.size).toBe(60);
  });
  await check(
    'year filter has no year zero and correct accessible label',
    async () => {
      await home();
      await page.getByLabel('연도로 좁히기').check();
      const slider = page.getByRole('slider', { name: '연도 선택' });
      await page.goto(origin + '/?year=1', { waitUntil: 'networkidle' });
      await expect(slider).toHaveAttribute('aria-valuetext', '1년');
      await slider.focus();
      await page.keyboard.press('ArrowLeft');
      await expect(slider).toHaveAttribute('aria-valuetext', '기원전 1년');
      await page.goto(origin + '/?year=1000', { waitUntil: 'networkidle' });
      await expect(page.locator('.results-heading h2')).toHaveText('0개 전쟁');
    },
  );
  await check('new war bookmarks survive reload and saved filter', async () => {
    await home();
    await page.getByRole('textbox', { name: '전쟁 검색' }).fill('임진');
    await page
      .getByRole('button', { name: '임진왜란 북마크', exact: true })
      .click();
    await page.reload({ waitUntil: 'networkidle' });
    await expect(
      page.getByRole('button', { name: '임진왜란 북마크 해제', exact: true }),
    ).toHaveAttribute('aria-pressed', 'true');
    await page
      .getByRole('button', { name: '필터 초기화', exact: true })
      .click();
    await page.getByRole('button', { name: '북마크만', exact: true }).click();
    await expect(page.locator('.results-heading h2')).toHaveText('1개 전쟁');
  });
  await check('share current filters copies real URL', async () => {
    await page
      .getByRole('button', { name: '현재 탐험 주소 복사', exact: true })
      .click();
    await expect(
      page.getByRole('button', { name: '주소 복사됨' }),
    ).toBeVisible();
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
      page.url(),
    );
  });
  await check('all sixty detail pages hydrate without errors', async () => {
    for (const w of wars) {
      await page.goto(origin + '/wars/' + w.id + '?mode=full', {
        waitUntil: 'networkidle',
      });
      await expect(page.locator('.story-heading h1')).toHaveText(w.title);
      await expect(page.locator('.event-buttons button')).toHaveCount(
        w.events.length,
      );
      await expect(page.locator('#event h2')).toHaveText(w.events[0].title);
    }
  });
  await check('BCE detail periods and dynamic event count', async () => {
    await page.goto(origin + '/wars/persian?mode=full', {
      waitUntil: 'networkidle',
    });
    await expect(page.locator('.story-heading')).toContainText('기원전 499년');
    await expect(page.locator('.timeline-header')).toContainText('01 / 03');
  });
  await check(
    'manual event selection updates text, map, URL and navigation',
    async () => {
      await page.goto(origin + '/wars/imjin?mode=full', {
        waitUntil: 'networkidle',
      });
      await page.locator('.event-buttons button').nth(1).click();
      await expect(page.locator('#event h2')).toHaveText('한산도 해전');
      expect(new URL(page.url()).searchParams.get('event')).toBe('event-2');
      await expect(page.locator('.map-marker.selected')).toHaveAttribute(
        'aria-label',
        /한산도 해전.*1592년/,
      );
    },
  );
  await check(
    'reading position is not overwritten by home read link',
    async () => {
      await home();
      await page.getByRole('textbox', { name: '전쟁 검색' }).fill('임진');
      await page.getByRole('link', { name: '이야기 시작하기' }).click();
      await expect(
        page.getByText('저장된 읽기 위치가 있습니다.'),
      ).toBeVisible();
      const state = await page.evaluate(() =>
        JSON.parse(localStorage.getItem('war-atlas:v1')),
      );
      expect(state.positions.imjin).toBe('event-2');
      await page
        .getByRole('button', { name: '이어서 읽기', exact: true })
        .click();
      await expect(page.locator('#event h2')).toHaveText('한산도 해전');
    },
  );
  await check('party choice and reading modes work', async () => {
    await page.getByRole('button', { name: '일본군', exact: true }).click();
    await expect(page.locator('.party-goal')).toContainText('진출');
    await page.getByRole('tab', { name: '3분 코스', exact: true }).click();
    await expect(page.locator('#background')).toHaveCount(0);
    await page.getByRole('tab', { name: '자세히 보기', exact: true }).click();
    await expect(page.locator('#background')).toBeVisible();
  });
  await check('playback advances, stops at last and restarts', async () => {
    await page.goto(origin + '/wars/imjin?event=event-1&mode=short', {
      waitUntil: 'networkidle',
    });
    await page
      .getByRole('button', { name: '사건 자동으로 따라가기', exact: true })
      .click();
    await expect(page.locator('#event h2')).toHaveText('노량 해전과 철수', {
      timeout: 8000,
    });
    await expect(
      page.getByRole('button', { name: '사건 자동으로 따라가기', exact: true }),
    ).toHaveAttribute('aria-pressed', 'false');
    await page
      .getByRole('button', { name: '사건 자동으로 따라가기', exact: true })
      .click();
    await expect(page.locator('#event h2')).toHaveText('부산 상륙');
    await expect(
      page.getByRole('button', { name: '자동 진행 멈추기', exact: true }),
    ).toHaveAttribute('aria-pressed', 'true');
    await page
      .getByRole('button', { name: '자동 진행 멈추기', exact: true })
      .click();
  });
  await check('manual event selection stops playback', async () => {
    await page
      .getByRole('button', { name: '사건 자동으로 따라가기', exact: true })
      .click();
    await page.locator('.event-buttons button').nth(1).click();
    await expect(
      page.getByRole('button', { name: '사건 자동으로 따라가기', exact: true }),
    ).toHaveAttribute('aria-pressed', 'false');
  });
  await check('southern hemisphere coordinates use S', async () => {
    await page.goto(origin + '/wars/zulu?mode=full', {
      waitUntil: 'networkidle',
    });
    await expect(page.locator('.location-label small')).toContainText('S');
  });
  await check(
    'comparison renders two new wars without invented insights',
    async () => {
      await page.goto(origin + '/compare?left=imjin&right=persian', {
        waitUntil: 'networkidle',
      });
      await expect(page.locator('thead')).toContainText('임진왜란');
      await expect(page.locator('thead')).toContainText('그리스·페르시아 전쟁');
      await expect(page.locator('.insights-grid')).toHaveCount(0);
      await page.getByRole('button', { name: '두 전쟁 자리 바꾸기' }).click();
      await expect(page.locator('thead th').nth(1)).toHaveText(
        '그리스·페르시아 전쟁',
      );
    },
  );
  await check(
    'comparison selectors change data and preserve distinct wars',
    async () => {
      await page.getByRole('combobox').first().click();
      await page.getByRole('option', { name: '한국전쟁', exact: true }).click();
      await expect(page.locator('thead th').nth(1)).toHaveText('한국전쟁');
    },
  );
  await check(
    'legacy comparison retains authored sourced insights',
    async () => {
      await page.goto(origin + '/compare?left=ww1&right=ww2', {
        waitUntil: 'networkidle',
      });
      await expect(page.locator('.insights-grid article')).toHaveCount(6);
    },
  );
  await check(
    'AI availability remains honest and sources accessible',
    async () => {
      await page.goto(origin + '/wars/imjin', { waitUntil: 'networkidle' });
      await expect(page.locator('.ask-floating')).toContainText('질문 준비 중');
      await page.locator('.ask-floating').click();
      await expect(page.getByRole('dialog')).toBeVisible();
      await expect(page.getByRole('dialog')).toContainText('연결');
      await page.keyboard.press('Escape');
    },
  );
  await home();
  await page.screenshot({
    path: 'outputs/qa/archive-home-desktop.png',
    fullPage: true,
  });
  await page.goto(origin + '/wars/imjin?mode=full', {
    waitUntil: 'networkidle',
  });
  await page.screenshot({
    path: 'outputs/qa/archive-story-desktop.png',
    fullPage: true,
  });
  await page.goto(origin + '/compare?left=imjin&right=persian', {
    waitUntil: 'networkidle',
  });
  await page.screenshot({
    path: 'outputs/qa/archive-compare-desktop.png',
    fullPage: true,
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await check(
    'mobile home has no page overflow and functional search',
    async () => {
      await home();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      await page.getByRole('textbox', { name: '전쟁 검색' }).fill('나폴레옹');
      await page
        .locator('.catalogue-select')
        .filter({
          has: page.getByRole('heading', {
            name: '나폴레옹 전쟁',
            exact: true,
          }),
        })
        .click();
      await expect(page.locator('.map-preview h2')).toHaveText('나폴레옹 전쟁');
      await page.getByRole('link', { name: '이야기 시작하기' }).click();
      await expect(page.locator('.story-heading h1')).toHaveText(
        '나폴레옹 전쟁',
      );
    },
  );
  await check('mobile story map and manual next event work', async () => {
    const bookmark = await page.locator('.story-actions .btn').boundingBox();
    expect(bookmark.width).toBeGreaterThanOrEqual(104);
    expect(bookmark.height).toBeLessThanOrEqual(60);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.getByRole('button', { name: '다음 사건', exact: true }).click();
    await expect(page.locator('#event h2')).toHaveText('러시아 원정');
    await page.screenshot({
      path: 'outputs/qa/archive-story-mobile.png',
      fullPage: true,
    });
  });
  await check('mobile comparison scroll stays inside table', async () => {
    await page.goto(origin + '/compare?left=imjin&right=persian', {
      waitUntil: 'networkidle',
    });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.screenshot({
      path: 'outputs/qa/archive-compare-mobile.png',
      fullPage: true,
    });
  });
  await home();
  await page.screenshot({
    path: 'outputs/qa/archive-home-mobile.png',
    fullPage: true,
  });
  await check(
    'source page is navigable with explicit scope and rights',
    async () => {
      await page.getByRole('link', { name: '자료 안내', exact: true }).click();
      await expect(page.locator('h1')).toHaveText('수록 기준과 자료 안내');
      await expect(page.locator('.about-content')).toContainText(
        '퍼블릭 도메인',
      );
      await expect(page.locator('.about-content')).toContainText(
        '모든 전쟁을 망라한 목록은 아닙니다',
      );
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
    },
  );
  await check('no unexpected browser errors', async () =>
    expect(errors).toEqual([]),
  );
  console.log('TOTAL ' + count + ' checks passed');
  fs.writeFileSync(
    'outputs/qa/expansion-results.json',
    JSON.stringify(
      {
        checks: count,
        errors,
        viewports: ['1440x900', '390x844'],
        browser: 'headless Edge',
      },
      null,
      2,
    ),
  );
} finally {
  await browser.close();
}
