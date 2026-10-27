// node tests/preferences-smoke.cjs [Playwright module path] [preview URL]
const assert = require('node:assert/strict');
const { chromium } = require(process.argv[2] || 'playwright');
const url = process.argv[3] || 'http://127.0.0.1:4173/profile/';

function contrast(first, second) {
  const luminance = color => {
    const rgb = color.startsWith('#')
      ? [1, 3, 5].map(offset => parseInt(color.slice(offset, offset + 2), 16))
      : color.match(/[\d.]+/g).slice(0, 3).map(Number);
    const linear = rgb.map(channel => { const value = channel / 255; return value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4; });
    return linear[0] * .2126 + linear[1] * .7152 + linear[2] * .0722;
  };
  const values = [luminance(first), luminance(second)].sort((a, b) => b - a);
  return (values[0] + .05) / (values[1] + .05);
}

async function checkContrast(page) {
  const colors = await page.locator('.sheet').evaluate(element => {
    const style = getComputedStyle(element);
    return Object.fromEntries(['ink', 'body-text', 'muted', 'surface', 'accent', 'on-accent'].map(key => [key, style.getPropertyValue(`--${key}`).trim()]));
  });
  for (const key of ['ink', 'body-text', 'muted', 'accent']) assert.ok(contrast(colors[key], colors.surface) >= 4.5, `${key} text needs 4.5:1 contrast against the page`);
  assert.ok(contrast(colors['on-accent'], colors.accent) >= 4.5, 'active controls need readable text');
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const context = await browser.newContext({ locale: 'en-US', colorScheme: 'dark', reducedMotion: 'reduce', viewport: { width: 1024, height: 768 } });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(url);
    assert.equal(await page.locator('html').getAttribute('lang'), 'vi');
    assert.equal(await page.locator('html').getAttribute('data-theme'), 'light');
    await checkContrast(page);
    await page.locator('[data-section="3"] .orbit-label').click();
    await page.locator('#next-project').click();
    await page.locator('#next-page').click();
    const detailNumbers = (await page.locator('#subnav-label').innerText()).match(/\d+/g);
    await page.getByRole('button', { name: 'English', exact: true }).click();
    assert.equal(await page.locator('html').getAttribute('lang'), 'en');
    assert.equal(await page.locator('#chapter').getAttribute('aria-label'), 'Projects');
    assert.deepEqual((await page.locator('#subnav-label').innerText()).match(/\d+/g), detailNumbers);
    assert.equal(new URL(page.url()).hash, '#projects');
    await page.getByRole('button', { name: 'Switch to dark theme', exact: true }).click();
    assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark');
    await checkContrast(page);
    assert.deepEqual((await page.locator('#subnav-label').innerText()).match(/\d+/g), detailNumbers);
    const darkLogo = await page.locator('.monogram img').getAttribute('src');
    assert.ok(darkLogo.includes('e8edf5'));
    await page.reload();
    assert.equal(await page.locator('html').getAttribute('lang'), 'en');
    assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark');

    // Switching preferences while a chapter animation runs must render the latest state.
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.locator('[data-section="2"]').evaluate(element => element.click());
    await page.getByRole('button', { name: 'Tiếng Việt', exact: true }).click();
    await page.waitForTimeout(950);
    assert.equal(await page.locator('#chapter').getAttribute('aria-label'), 'Kinh nghiệm');
    assert.equal(await page.locator('#chapter').evaluate(element => getComputedStyle(element).opacity), '1');
    assert.equal(await page.locator('[data-section="2"]').getAttribute('aria-current'), 'page');
    await page.mouse.move(800, 400);
    await page.mouse.wheel(0, 120);
    await page.waitForTimeout(950);
    assert.equal(await page.locator('#chapter').getAttribute('aria-label'), 'Dự án', 'wheel navigation must resume after preferences change');
    for (const viewport of [{ width: 375, height: 667 }, { width: 320, height: 740 }]) {
      await page.setViewportSize(viewport);
      const header = await page.evaluate(() => {
        const identity = document.querySelector('.identity').getBoundingClientRect();
        const controls = document.querySelector('.header-tools').getBoundingClientRect();
        return { identityRight: identity.right, controlsLeft: controls.left, controlsRight: controls.right };
      });
      assert.ok(header.identityRight + 3 <= header.controlsLeft, `${viewport.width}px header controls overlap the name`);
      assert.ok(header.controlsRight <= viewport.width);
      await page.getByRole('button', { name: 'English', exact: true }).click();
      await page.getByRole('button', { name: 'Tiếng Việt', exact: true }).click();
    }
    assert.deepEqual(errors, []);

    const blocked = await browser.newPage({ reducedMotion: 'reduce' });
    await blocked.addInitScript(() => Object.defineProperty(window, 'localStorage', { get() { throw new Error('Storage blocked'); } }));
    await blocked.goto(url);
    assert.equal(await blocked.locator('html').getAttribute('lang'), 'vi');
    assert.equal(await blocked.locator('html').getAttribute('data-theme'), 'light');
    await blocked.getByRole('button', { name: 'English', exact: true }).click();
    await blocked.getByRole('button', { name: 'Switch to dark theme', exact: true }).click();
    assert.equal(await blocked.locator('html').getAttribute('lang'), 'en');
    assert.equal(await blocked.locator('html').getAttribute('data-theme'), 'dark');
    const palette = await browser.newPage({ reducedMotion: 'reduce' });
    await palette.goto(url);
    for (const theme of ['light', 'dark']) {
      if (await palette.locator('html').getAttribute('data-theme') !== theme) await palette.locator('.theme-toggle').click();
      for (let index = 0; index < 5; index++) {
        await palette.locator(`[data-section="${index}"]`).evaluate(element => element.click());
        await checkContrast(palette);
      }
    }
    console.log('PASS: explicit defaults, live localization/theme, detail preservation, persistence, interrupted motion, wheel recovery, compact headers, blocked storage and contrast across all chapter palettes.');
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
