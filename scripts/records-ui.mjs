import { chromium, expect } from '@playwright/test';
import fs from 'node:fs';
import { themes } from '../lib/themes.ts';
import { imageRecords } from '../lib/records.ts';
import { getWar } from '../lib/history.ts';
const origin = process.argv[2] || 'http://localhost:8787';
const browser = await chromium.launch({ channel: 'msedge', headless: true });
const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  }),
  page = await context.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
let count = 0;
const check = async (name, fn) => {
  await fn();
  console.log('PASS ' + name);
  count++;
};
const goto = (path) => page.goto(origin + path, { waitUntil: 'networkidle' });
const noOverflow = async () =>
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
fs.mkdirSync('outputs/qa', { recursive: true });
try {
  await goto('/themes');
  await check('six courses with working native navigation', async () => {
    await expect(page.locator('.theme-card')).toHaveCount(6);
    await page.locator('.theme-card').first().click();
    await expect(page).toHaveURL(/\/themes\/alliances$/);
    await expect(page.locator('.theme-position')).toContainText('1 / 4');
  });
  await check(
    'next, previous, browser history and refresh preserve step',
    async () => {
      await page
        .getByRole('button', { name: '다음 단계', exact: true })
        .click();
      await expect(page.locator('.theme-position')).toContainText('2 / 4');
      await page
        .getByRole('button', { name: '다음 단계', exact: true })
        .click();
      await expect(page.locator('.theme-position')).toContainText('3 / 4');
      await page.goBack();
      await expect(page.locator('.theme-position')).toContainText('2 / 4');
      await page.reload({ waitUntil: 'networkidle' });
      await expect(page.locator('.theme-position')).toContainText('2 / 4');
      await page
        .getByRole('button', { name: '이전 단계', exact: true })
        .click();
      await expect(page.locator('.theme-position')).toContainText('1 / 4');
    },
  );
  await check(
    'map keyboard selects course event and boundaries disable',
    async () => {
      const marker = page.getByRole('button', {
        name: '4단계 · 한국전쟁 · 중국군 개입',
        exact: true,
      });
      await marker.focus();
      await page.keyboard.press('Enter');
      await expect(page.locator('.theme-position')).toContainText('4 / 4');
      await expect(
        page.getByRole('button', { name: '다음 단계', exact: true }),
      ).toBeDisabled();
      await expect(page.locator('.theme-closing')).toBeVisible();
    },
  );
  await check(
    'all 24 stops show correct question and linked event',
    async () => {
      for (const t of themes)
        for (let i = 0; i < t.stops.length; i++) {
          await goto('/themes/' + t.id + '?step=' + (i + 1));
          const s = t.stops[i],
            w = getWar(s.warId);
          await expect(page.locator('.theme-reading h2')).toHaveText(
            s.question,
          );
          await expect(page.locator('.theme-event h3')).toHaveText(
            w.events.find((e) => e.id === s.eventId).title,
          );
          await expect(page.locator('.theme-event a.btn')).toHaveAttribute(
            'href',
            new RegExp('/wars/' + w.id + '\\?event=' + s.eventId),
          );
          await noOverflow();
        }
    },
  );
  await check('theme source and event navigation work', async () => {
    await goto('/themes/peace?step=3');
    await expect(
      page.locator('.theme-event .source-links a').first(),
    ).toHaveAttribute('href', /^https:/);
    await page.locator('.theme-event a.btn').click();
    await expect(page).toHaveURL(/\/wars\/korea\?event=armistice-1953/);
    await expect(page.locator('.event-reading h2')).toHaveText(
      '정전, 평화와는 다른 합의',
    );
  });
  await check('story has contextual records and related themes', async () => {
    await expect(page.locator('.war-records .record-card')).toHaveCount(2);
    await page
      .locator('.related-themes a')
      .filter({ hasText: '협정 뒤에 남은 문제' })
      .click();
    await expect(page).toHaveURL(/\/themes\/peace\?step=3/);
  });
  await goto('/records');
  await check(
    'archive reports honest coverage and all 24 records',
    async () => {
      await expect(page.locator('.record-card')).toHaveCount(24);
      await expect(page.locator('.archive-coverage')).toContainText('14건');
      await expect(
        page.locator('[data-record-id="waterloo-dispatch"]'),
      ).toContainText('소장 목록');
      await noOverflow();
    },
  );
  await check('filters intersect, refresh and history restore', async () => {
    await page.selectOption('#record-type', 'image');
    await expect(page.locator('.record-card')).toHaveCount(9);
    await page.selectOption('#record-war', 'ww1');
    await expect(page.locator('.record-card')).toHaveCount(2);
    await page.reload({ waitUntil: 'networkidle' });
    await expect(page.locator('#record-war')).toHaveValue('ww1');
    await expect(page.locator('.record-card')).toHaveCount(2);
    await page.selectOption('#record-war', 'mongol');
    await expect(page.locator('.archive-empty')).toBeVisible();
    await page.goBack();
    await expect(page.locator('#record-war')).toHaveValue('ww1');
    await expect(page.locator('.record-card')).toHaveCount(2);
  });
  await check(
    'empty state reset and missing war records remain honest',
    async () => {
      await page.selectOption('#record-war', 'mongol');
      await page
        .getByRole('button', { name: '전체 자료 보기', exact: true })
        .click();
      await expect(page.locator('.record-card')).toHaveCount(24);
      await goto('/wars/mongol');
      await expect(page.locator('.war-records')).toContainText(
        '아직 보강하지 않았습니다',
      );
      await page.locator('.war-records a.btn').click();
      await expect(page.locator('#record-war')).toHaveValue('mongol');
      await expect(page.locator('.archive-empty')).toBeVisible();
    },
  );
  await goto('/records?type=image');
  await check(
    'nine real images open, retain size, close with Escape and return focus',
    async () => {
      for (const r of imageRecords) {
        const trigger = page.locator(
          '[data-record-id="' + r.id + '"] .record-image-trigger',
        );
        await trigger.scrollIntoViewIfNeeded();
        await expect(trigger.locator('img')).toBeVisible();
        expect(
          await trigger
            .locator('img')
            .evaluate((im) => im.complete && im.naturalWidth > 0),
        ).toBe(true);
        await trigger.click();
        const dialog = page.getByRole('dialog');
        await expect(dialog).toBeVisible();
        await expect(dialog.locator('[data-slot="dialog-title"]')).toHaveText(
          r.title,
        );
        await expect(dialog).toContainText(r.image.rights);
        const dims = await dialog
          .locator('.record-full-image')
          .evaluate((im) => ({
            width: im.getBoundingClientRect().width,
            natural: im.naturalWidth,
            ratio:
              im.getBoundingClientRect().width /
              im.getBoundingClientRect().height,
            naturalRatio: im.naturalWidth / im.naturalHeight,
          }));
        expect(dims.width).toBeLessThanOrEqual(dims.natural + 1);
        expect(Math.abs(dims.ratio - dims.naturalRatio)).toBeLessThan(0.01);
        await page.keyboard.press('Escape');
        await expect(dialog).toHaveCount(0);
        await expect(trigger).toBeFocused();
      }
    },
  );
  await check(
    'dialog traps keyboard and close button returns focus',
    async () => {
      const trigger = page.locator('.record-image-trigger').first();
      await trigger.click();
      await page
        .getByRole('dialog')
        .getByRole('button', { name: '닫기', exact: true })
        .focus();
      await page.keyboard.press('Tab');
      expect(
        await page.evaluate(
          () => !!document.activeElement.closest('[role="dialog"]'),
        ),
      ).toBe(true);
      await page
        .getByRole('dialog')
        .getByRole('button', { name: '닫기', exact: true })
        .click();
      await expect(trigger).toBeFocused();
    },
  );
  await goto('/themes');
  await page.screenshot({
    animations: 'disabled',
    path: 'outputs/qa/themes-desktop.png',
    fullPage: true,
  });
  await goto('/themes/peace?step=3');
  await page.screenshot({
    animations: 'disabled',
    path: 'outputs/qa/theme-desktop.png',
    fullPage: true,
  });
  await goto('/records?war=napoleonic');
  await page.screenshot({
    animations: 'disabled',
    path: 'outputs/qa/records-desktop.png',
    fullPage: true,
  });
  await page.locator('.record-image-trigger').click();
  await page.screenshot({
    animations: 'disabled',
    path: 'outputs/qa/record-dialog-desktop.png',
  });
  await page.keyboard.press('Escape');
  await page.setViewportSize({ width: 390, height: 844 });
  await check(
    'mobile course cards, navigation and steps have no overflow',
    async () => {
      await goto('/themes');
      await noOverflow();
      await page.screenshot({
        animations: 'disabled',
        path: 'outputs/qa/themes-mobile.png',
        fullPage: true,
      });
      await page
        .locator('.theme-card')
        .filter({ hasText: '협정 뒤에 남은 문제' })
        .click();
      await page
        .getByRole('button', { name: '다음 단계', exact: true })
        .click();
      await expect(page.locator('.theme-position')).toContainText('2 / 4');
      await noOverflow();
      await page.screenshot({
        animations: 'disabled',
        path: 'outputs/qa/theme-mobile.png',
        fullPage: true,
      });
      for (const button of await page
        .locator('.theme-steps button,.event-navigation button')
        .all()) {
        const b = await button.boundingBox();
        expect(b.height).toBeGreaterThanOrEqual(44);
      }
    },
  );
  await check(
    'mobile archive filters and image dialog remain usable',
    async () => {
      await goto('/records?war=crimean');
      await noOverflow();
      await page.screenshot({
        animations: 'disabled',
        path: 'outputs/qa/records-mobile.png',
        fullPage: true,
      });
      await page.locator('.record-image-trigger').click();
      await expect(page.getByRole('dialog')).toBeVisible();
      await noOverflow();
      await page.screenshot({
        animations: 'disabled',
        path: 'outputs/qa/record-dialog-mobile.png',
      });
      await page.keyboard.press('Escape');
      await expect(page.locator('.record-image-trigger')).toBeFocused();
      await page.selectOption('#record-type', 'document');
      await expect(page.locator('.archive-empty')).toBeVisible();
    },
  );
  await check('mobile detail related links work', async () => {
    await goto('/wars/imjin');
    await expect(page.locator('.war-records .record-card')).toHaveCount(1);
    await noOverflow();
    await page.locator('.related-themes a').click();
    await expect(page).toHaveURL(/\/themes\/empires\?step=2/);
  });
  expect(errors).toEqual([]);
  fs.writeFileSync(
    'outputs/qa/records-results.json',
    JSON.stringify(
      {
        count,
        errors,
        viewport: ['1440x900', '390x844'],
        browser: 'Edge headless',
      },
      null,
      2,
    ),
  );
  console.log(count + ' checks passed');
} finally {
  await browser.close();
}
