// node tests/motion-smoke.cjs [Playwright module path] [preview URL]
const assert = require('node:assert/strict');
const { chromium } = require(process.argv[2] || 'playwright');
const url = process.argv[3] || 'http://127.0.0.1:4173/profile/';

(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.addInitScript(() => {
      window.motionCalls = [];
      const original = Element.prototype.animate;
      Element.prototype.animate = function (frames, options) {
        window.motionCalls.push({ target: this.className || this.id, frames });
        return original.call(this, frames, options);
      };
    });
    await page.goto(url);
    assert.ok(await page.evaluate(() => motionCalls.some(call => call.target === 'orbit-disc')), 'opening should introduce the orbit');
    await page.waitForTimeout(950);
    const initialColor = await page.locator('.orbit-core').evaluate(element => getComputedStyle(element).backgroundImage);
    await page.getByRole('button', { name: 'Dự án', exact: true }).locator('.orbit-label').click();
    await page.waitForTimeout(120);
    const middleColor = await page.locator('.orbit-core').evaluate(element => getComputedStyle(element).backgroundImage);
    await page.waitForTimeout(780);
    const finalColor = await page.locator('.orbit-core').evaluate(element => getComputedStyle(element).backgroundImage);
    assert.notEqual(middleColor, initialColor, 'core color should start interpolating');
    assert.notEqual(middleColor, finalColor, 'core color should pass through an intermediate value');
    const calls = await page.evaluate(() => window.motionCalls);
    assert.ok(calls.some(call => call.target === 'orbit-ripple'), 'chapter click should pulse its node');
    assert.ok(calls.some(call => call.target === 'chapter' && call.frames.some(frame => 'boxShadow' in frame)), 'page turn should include edge shading');
    assert.ok(calls.some(call => call.target === 'description'), 'new content should reveal in sequence');
    assert.ok(await page.locator('.identity').evaluate(element => element.classList.contains('is-compact')));
    await page.waitForTimeout(200);
    assert.equal(await page.evaluate(() => document.getAnimations().filter(animation => animation.playState === 'running').length), 0, 'motion must settle instead of looping');

    const hoverLabel = page.locator('[data-section="2"] .orbit-label');
    await hoverLabel.hover();
    await page.waitForTimeout(250);
    assert.equal(await hoverLabel.evaluate(element => getComputedStyle(element).translate), '3px');
    const chip = page.locator('.chips li').first();
    await chip.hover();
    await page.waitForTimeout(250);
    assert.equal(await chip.evaluate(element => getComputedStyle(element).translate), '0px -2px');

    await page.locator('[data-section="1"] .orbit-label').click();
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.waitForTimeout(80);
    assert.equal(await page.evaluate(() => document.getAnimations().filter(animation => animation.playState === 'running').length), 0, 'enabling reduced motion should stop in-flight effects');
    assert.equal(await page.locator('#chapter').getAttribute('aria-label'), 'Kỹ năng');
    assert.equal(await page.locator('#chapter').evaluate(element => getComputedStyle(element).opacity), '1');

    await page.reload();
    assert.equal(await page.evaluate(() => motionCalls.length), 0, 'reduced motion should skip the intro');
    await page.locator('[data-section="0"] .orbit-label').click();
    assert.equal(await page.evaluate(() => motionCalls.length), 0, 'reduced motion should skip navigation effects');
    assert.deepEqual(errors, []);
    console.log('PASS: entrance, click ripple, shaded page turn, staggered reveal, settled motion, and runtime reduced-motion preference.');
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
