// node tests/browser-smoke.cjs [Playwright module path] [preview URL]
const assert = require('node:assert/strict');
const { chromium } = require(process.argv[2] || 'playwright');
const url = process.argv[3] || 'http://127.0.0.1:4173/profile/';
const language = process.argv[4] || 'vi';
const theme = process.argv[5] || 'light';

(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage();
    const { getContent } = await import('../src/locales.js');
    const { ui, sections } = getContent(language);
    await page.addInitScript(({ language, theme }) => localStorage.setItem('profile.preferences.v1', JSON.stringify({ language, theme })), { language, theme });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.emulateMedia({ reducedMotion: 'reduce' });
    let verifiedPages = 0;
    const viewports = [
      { width: 1440, height: 900 }, { width: 1366, height: 768 },
      { width: 1024, height: 768 }, { width: 768, height: 1024 },
      { width: 390, height: 844 }, { width: 375, height: 667 },
      { width: 320, height: 568 },
      { width: 375, height: 740 }, { width: 390, height: 820 },
      { width: 844, height: 390 },
    ];
    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.goto(url);
      assert.equal(await page.locator('html').getAttribute('lang'), language);
      assert.equal(await page.locator('html').getAttribute('data-theme'), theme);
      await page.evaluate(() => document.fonts.ready);
      assert.ok(await page.locator('.monogram img').evaluate(image => image.complete && image.naturalWidth > 0), 'header logo should load at the Pages base path');
      for (let section = 0; section < 5; section++) {
        await page.locator(`[data-section="${section}"] .orbit-label`).click();
        assert.equal(await page.locator('[aria-current="page"]').getAttribute('data-section'), String(section));
        for (let project = 0; project < (section === 3 ? 5 : 1); project++) {
          if (project > 0) await page.getByRole('button', { name: ui.nextProject, exact: true }).click();
          for (let detail = 0; detail < 20; detail++) {
            const layout = await page.evaluate(() => {
              const content = document.querySelector('#chapter').getBoundingClientRect();
              const subnav = document.querySelector('.subnav');
              const boundary = (subnav.hidden ? document.querySelector('.footer') : subnav).getBoundingClientRect();
              return {
                overlap: Math.round(content.bottom - boundary.top),
                verticalScroll: document.documentElement.scrollHeight > innerHeight,
                horizontalScroll: document.documentElement.scrollWidth > innerWidth,
                label: document.querySelector('#announcement').textContent,
              };
            });
            assert.ok(layout.overlap <= 2, `${JSON.stringify(viewport)} ${layout.label}: overlaps controls by ${layout.overlap}px`);
            assert.equal(layout.verticalScroll, false);
            assert.equal(layout.horizontalScroll, false);
            verifiedPages++;
            if (await page.locator('#next-page').isDisabled()) break;
            await page.getByRole('button', { name: ui.nextPage, exact: true }).click();
          }
        }
      }
    }
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(url);
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.locator('[data-section="3"] .orbit-label').click();
    await page.waitForTimeout(850);
    assert.ok(await page.locator('.identity').evaluate(element => element.classList.contains('is-compact')));
    const headerIdentity = await page.locator('.identity').boundingBox();
    assert.ok(headerIdentity.y < 80);
    await page.locator('[data-section="0"] .orbit-label').click();
    await page.waitForTimeout(850);
    assert.equal(await page.locator('.identity').evaluate(element => element.classList.contains('is-compact')), false);
    const homeIdentity = await page.locator('.identity').boundingBox();
    assert.ok(homeIdentity.y > 100 && homeIdentity.width > headerIdentity.width);
    // Programmatic clicks intentionally stress interruption, rather than waiting for each animation.
    await page.evaluate(() => [1, 3, 2, 4].forEach(index => document.querySelector(`[data-section="${index}"]`).click()));
    await page.waitForTimeout(850);
    assert.equal(await page.locator('#chapter').getAttribute('aria-label'), sections[4].label);
    assert.ok(await page.locator('#chapter').evaluate(element => Number(getComputedStyle(element).opacity) === 1));
    await page.locator('[data-section="4"]').focus();
    await page.keyboard.press('Home');
    await page.waitForTimeout(850);
    assert.equal(await page.locator('[aria-current="page"]').getAttribute('data-section'), '0');
    await page.locator('[data-section="3"] .orbit-label').click();
    await page.waitForTimeout(850);
    await page.getByRole('link', { name: `Dương Tiến Đạt — ${ui.home}`, exact: true }).click();
    await page.waitForTimeout(850);
    assert.equal(await page.locator('#chapter').getAttribute('aria-label'), sections[0].label);
    assert.deepEqual(errors, []);
    console.log(`PASS (${language}/${theme}): ${verifiedPages} content states across ${viewports.length} viewports; identity motion, interrupted navigation, keyboard and reduced motion; no page errors.`);
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
