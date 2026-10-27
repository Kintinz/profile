// node tests/wheel-smoke.cjs [Playwright module path] [preview URL]
const assert = require('node:assert/strict');
const { chromium } = require(process.argv[2] || 'playwright');
const url = process.argv[3] || 'http://127.0.0.1:4173/profile/';

(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    const current = () => page.locator('[aria-current="page"]').getAttribute('data-section');
    await page.goto(url);
    await page.waitForTimeout(1000);
    await page.mouse.move(1100, 450);
    await page.mouse.wheel(0, 120);
    await page.waitForTimeout(50);
    assert.equal(await current(), '1');
    for (let tail = 0; tail < 12; tail++) {
      await page.waitForTimeout(80);
      await page.mouse.wheel(0, 35);
      assert.equal(await current(), '1', 'momentum must not skip or queue chapters');
    }
    await page.waitForTimeout(250);
    assert.equal(await current(), '1');
    assert.match(await page.locator('#subnav-label').innerText(), /01.*04/);
    await page.mouse.wheel(0, 120);
    await page.waitForTimeout(950);
    assert.equal(await current(), '2');
    await page.mouse.wheel(0, -120);
    await page.waitForTimeout(950);
    assert.equal(await current(), '1');

    // Click starts its own animation; wheel input cannot interrupt or queue behind it.
    await page.locator('[data-section="3"]').evaluate(element => element.click());
    await page.mouse.wheel(0, 120);
    await page.waitForTimeout(950);
    assert.equal(await current(), '3');
    await page.waitForTimeout(250);
    assert.equal(await current(), '3');
    await page.mouse.wheel(0, 120);
    await page.waitForTimeout(950);
    assert.equal(await current(), '4');
    await page.mouse.wheel(0, 120);
    await page.waitForTimeout(250);
    assert.equal(await current(), '4', 'last chapter must not wrap');

    const ignored = await page.evaluate(() => [
      { deltaY: 120, ctrlKey: true }, { deltaY: 120, metaKey: true },
      { deltaY: 120, shiftKey: true }, { deltaY: 10, deltaX: 150 },
    ].map(options => {
      const event = new WheelEvent('wheel', { ...options, bubbles: true, cancelable: true });
      window.dispatchEvent(event);
      return event.defaultPrevented;
    }));
    assert.deepEqual(ignored, [false, false, false, false]);
    assert.equal(await current(), '4');

    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(url);
    await page.mouse.wheel(0, -120);
    await page.waitForTimeout(250);
    assert.equal(await current(), '0', 'first chapter must not wrap');
    for (let index = 1; index < 5; index++) {
      await page.mouse.wheel(0, 120);
      await page.waitForTimeout(250);
      assert.equal(await current(), String(index));
    }
    assert.equal(await page.evaluate(() => document.getAnimations().filter(animation => animation.playState === 'running').length), 0);
    assert.equal(await page.evaluate(() => scrollY), 0);
    assert.deepEqual(errors, []);
    console.log('PASS: native wheel navigation, long momentum, reverse direction, animation gating, chapter boundaries, zoom/horizontal exclusions, and reduced motion.');
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
