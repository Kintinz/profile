// node tests/orbit-drag-smoke.cjs [Playwright module path] [preview URL]
const assert = require('node:assert/strict');
const { chromium } = require(process.argv[2] || 'playwright');
const url = process.argv[3] || 'http://127.0.0.1:4173/profile/';

async function gesture(page, session, delta, cancel = false, finish = true, radiusFactor = .65) {
  const geometry = await page.locator('.orbit').evaluate(element => {
    const rect = element.getBoundingClientRect();
    return { x: rect.left, y: rect.top, radius: parseFloat(getComputedStyle(element.querySelector('.orbit-disc')).width) / 2 };
  });
  const current = await page.locator('[aria-current="page"]').getAttribute('data-section');
  const rotationBefore = Number(await page.locator('.orbit').getAttribute('data-rotation'));
  const content = await page.locator('#chapter').innerText();
  const point = angle => ({ x: geometry.x + Math.cos(angle * Math.PI / 180) * geometry.radius * radiusFactor, y: geometry.y + Math.sin(angle * Math.PI / 180) * geometry.radius * radiusFactor, id: 1 });
  await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [point(-90)] });
  for (let sample = 1; sample <= 6; sample++) {
    await session.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [point(-90 + delta * sample / 6)] });
    await page.waitForTimeout(20);
  }
  assert.equal(await page.locator('[aria-current="page"]').getAttribute('data-section'), current, 'drag preview must not change chapters before release');
  assert.equal(await page.locator('#chapter').innerText(), content, 'content must stay stable while dragging');
  if ((delta < 0 && current !== '4') || (delta > 0 && current !== '0')) assert.notEqual(Number(await page.locator('.orbit').getAttribute('data-rotation')), rotationBefore, 'the ring must follow the finger before release');
  assert.equal(await page.locator('.mobile-dock').evaluate(element => element.classList.contains('is-dragging')), true);
  if (!finish) return;
  await session.send('Input.dispatchTouchEvent', { type: cancel ? 'touchCancel' : 'touchEnd', touchPoints: [] });
  await page.waitForTimeout(50);
  assert.equal(await page.locator('.mobile-dock').evaluate(element => element.classList.contains('is-dragging')), false);
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    let drags = 0;
    for (const language of ['vi', 'en']) for (const theme of ['light', 'dark']) {
      const context = await browser.newContext({ viewport: { width: 375, height: 667 }, hasTouch: true, isMobile: true, reducedMotion: 'reduce' });
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.addInitScript(preferences => localStorage.setItem('profile.preferences.v1', JSON.stringify(preferences)), { language, theme });
      const session = await context.newCDPSession(page);
      for (const viewport of [{ width: 320, height: 568 }, { width: 375, height: 667 }, { width: 390, height: 844 }]) {
        await page.setViewportSize(viewport);
        await page.goto(url);
        await page.evaluate(() => document.fonts.ready);
        assert.equal(await page.locator('.sheet').getAttribute('data-layout'), 'mobile');
        assert.equal(await page.locator('.footer-bottom, #next-section, #previous-section, .hint').count(), 0);
        for (let target = 1; target < 5; target++) {
          const before = Number(await page.locator('.orbit').getAttribute('data-rotation'));
          await gesture(page, session, -36);
          assert.equal(await page.locator('[aria-current="page"]').getAttribute('data-section'), String(target));
          assert.equal(Number(await page.locator('.orbit').getAttribute('data-rotation')), before - 36);
          drags++;
        }
        await gesture(page, session, -72);
        assert.equal(await page.locator('[aria-current="page"]').getAttribute('data-section'), '4');
        for (let target = 3; target >= 0; target--) {
          await gesture(page, session, 36);
          assert.equal(await page.locator('[aria-current="page"]').getAttribute('data-section'), String(target));
          drags++;
        }
        await gesture(page, session, 72);
        assert.equal(await page.locator('[aria-current="page"]').getAttribute('data-section'), '0');
        await gesture(page, session, -24);
        assert.equal(await page.locator('[aria-current="page"]').getAttribute('data-section'), '1');
        await gesture(page, session, -24, true);
        assert.equal(await page.locator('[aria-current="page"]').getAttribute('data-section'), '1');
        assert.equal(Number(await page.locator('.orbit').getAttribute('data-rotation')), -36);
        await page.locator('[data-section="2"] .orbit-label').tap();
        assert.equal(await page.locator('[aria-current="page"]').getAttribute('data-section'), '2', 'a fresh tap after dragging should work');
        assert.equal(await page.evaluate(() => scrollY), 0);
      }
      await gesture(page, session, -20, false, false);
      await page.setViewportSize({ width: 1024, height: 768 });
      await page.locator('.sheet[data-layout="desktop"]').waitFor();
      await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
      assert.equal(await page.locator('.sheet').getAttribute('data-layout'), 'desktop');
      assert.equal(await page.locator('.mobile-dock').count(), 0);
      assert.equal(await page.locator('[aria-current="page"]').getAttribute('data-section'), '2');
      await page.setViewportSize({ width: 375, height: 667 });
      await page.locator('.sheet[data-layout="mobile"]').waitFor();
      assert.equal(await page.locator('.sheet').getAttribute('data-layout'), 'mobile');
      await gesture(page, session, -36);
      assert.equal(await page.locator('[aria-current="page"]').getAttribute('data-section'), '3', 'new mobile controller must work after remount');
      await gesture(page, session, 36, false, true, .3);
      assert.equal(await page.locator('[aria-current="page"]').getAttribute('data-section'), '2', 'the inner disc must also support dragging');
      await page.emulateMedia({ reducedMotion: 'no-preference' });
      await page.waitForTimeout(60);
      await gesture(page, session, -36);
      await page.locator('[data-section="2"] .orbit-label').tap();
      await page.waitForTimeout(950);
      assert.equal(await page.locator('[aria-current="page"]').getAttribute('data-section'), '2', 'a fresh tap during the page turn must not be suppressed as the old drag click');
      await page.locator('[data-section="3"] .orbit-label').tap();
      await page.waitForTimeout(950);
      assert.equal(await page.locator('[aria-current="page"]').getAttribute('data-section'), '3');
      await gesture(page, session, -12);
      await gesture(page, session, 36);
      await page.waitForTimeout(950);
      assert.equal(await page.locator('[aria-current="page"]').getAttribute('data-section'), '2', 'a new drag during a same-chapter snap must start from the visual position');
      await gesture(page, session, -20, false, false);
      await page.locator('.theme-toggle').evaluate(element => element.click());
      await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
      await page.waitForTimeout(950);
      assert.equal(await page.locator('[aria-current="page"]').getAttribute('data-section'), '2', 'changing appearance during drag must cancel without navigating');
      assert.equal(await page.locator('.mobile-dock').evaluate(element => element.classList.contains('is-dragging')), false);
      assert.equal(await page.evaluate(() => document.getAnimations().filter(animation => animation.playState === 'running').length), 0);
      assert.deepEqual(errors, []);
      await context.close();
    }
    console.log(`PASS: ${drags} native touch drags across 4 language/theme combinations and 3 mobile sizes, plus live preview, clamps, nearest snap, cancellation, fresh taps and responsive remount.`);
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
