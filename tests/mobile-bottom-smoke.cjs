// node tests/mobile-bottom-smoke.cjs [Playwright module path] [preview URL]
const assert = require('node:assert/strict');
const { selectChapter } = require('./browser-helpers.cjs');
const { chromium } = require(process.argv[2] || 'playwright');
const url = process.argv[3] || 'http://127.0.0.1:4173/profile/';

(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    let selections = 0;
    for (const language of ['vi', 'en']) for (const theme of ['light', 'dark']) {
      const page = await browser.newPage({ hasTouch: true, isMobile: true, reducedMotion: 'reduce' });
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      const { getContent } = await import('../src/locales.js');
      await page.addInitScript(preferences => localStorage.setItem('profile.preferences.v1', JSON.stringify(preferences)), { language, theme });
      for (const viewport of [{ width: 320, height: 568 }, { width: 375, height: 667 }, { width: 390, height: 844 }]) {
        await page.setViewportSize(viewport);
        await page.goto(url);
        await page.evaluate(() => document.fonts.ready);
        for (let source = 0; source < 5; source++) for (let target = 0; target < 5; target++) {
          await selectChapter(page, source, true);
          const geometry = await page.evaluate(() => {
            const bounds = element => { const r = element.getBoundingClientRect(); return { left: r.left, right: r.right, top: r.top, bottom: r.bottom }; };
            return {
              orbit: bounds(document.querySelector('.orbit')),
              sheet: bounds(document.querySelector('.sheet')),
              footer: bounds(document.querySelector('.footer')),
              nodes: [...document.querySelectorAll('.orbit-item:not(.is-off-arc) .orbit-node')].map(bounds),
              labels: [...document.querySelectorAll('.orbit-item:not(.is-off-arc) .orbit-label')].map(element => {
                const r = bounds(element);
                const hit = document.elementFromPoint((r.left + r.right) / 2, (r.top + r.bottom) / 2)?.closest('[data-section]')?.dataset.section;
                return { ...r, hit, section: element.closest('[data-section]').dataset.section };
              }),
            };
          });
          assert.ok(Math.abs(geometry.orbit.left - (geometry.sheet.left + geometry.sheet.right) / 2) < 1);
          assert.ok(geometry.orbit.top > viewport.height - 70, 'orbit should be anchored near the bottom');
          assert.ok(geometry.footer.bottom + 8 <= Math.min(...geometry.nodes.map(node => node.top)), 'footer must stay above the arc');
          geometry.labels.forEach((label, index) => {
            assert.ok(label.left >= 0 && label.right <= geometry.sheet.right + 1, `${language}/${theme} ${viewport.width}px: label ${index} clipped horizontally`);
            assert.ok(label.bottom <= viewport.height && label.top > geometry.footer.bottom, 'labels must fit in their reserved bottom area');
            assert.equal(label.hit, label.section, 'every chapter must have its own unobstructed hit target');
          });
          await selectChapter(page, target, true);
          assert.equal(await page.locator('[aria-current="page"]').getAttribute('data-section'), String(target));
          selections++;
        }
        await selectChapter(page, 0, true);
        const goalText = [];
        for (let detail = 0; detail < 10; detail++) {
          if (await page.locator('.goal').count()) goalText.push(await page.locator('.goal').innerText());
          if (await page.locator('#next-page').isDisabled()) break;
          await page.locator('#next-page').tap();
        }
        assert.equal(goalText.join(' '), getContent(language).identity.goal, 'intro pagination must preserve the complete original goal');
        // Exercise the same CSS offset used by a device bottom safe-area inset.
        await page.locator('.sheet').evaluate(element => element.style.setProperty('--safe-bottom', '34px'));
        assert.ok(await page.locator('.orbit').evaluate(element => [...element.querySelectorAll('.orbit-item:not(.is-off-arc) .orbit-label')].every(label => label.getBoundingClientRect().bottom <= innerHeight - 34)));
      }
      // Crossing the breakpoint must restore left-hand desktop geometry.
      await page.setViewportSize({ width: 1024, height: 768 });
      await page.locator('.sheet[data-layout="desktop"]').waitFor();
      assert.ok(await page.locator('.orbit').evaluate(element => element.getBoundingClientRect().left < 2));
      await page.setViewportSize({ width: 390, height: 844 });
      await page.locator('.sheet[data-layout="mobile"]').waitFor();
      assert.ok(await page.locator('.orbit').evaluate(element => element.getBoundingClientRect().left > 150));
      await page.emulateMedia({ reducedMotion: 'no-preference' });
      await page.waitForTimeout(850);
      const initialRotation = await page.locator('.orbit-disc').evaluate(element => getComputedStyle(element).transform);
      await page.locator('[data-section="1"] .orbit-label').tap();
      await page.waitForTimeout(950);
      assert.notEqual(await page.locator('.orbit-disc').evaluate(element => getComputedStyle(element).transform), initialRotation, 'mobile rings should still rotate on chapter selection');
      assert.equal(await page.locator('#chapter').getAttribute('aria-label'), getContent(language).sections[1].label);
      assert.equal(await page.evaluate(() => document.getAnimations().filter(animation => animation.playState === 'running').length), 0, 'mobile motion should finish cleanly');
      assert.deepEqual(errors, []);
      await page.close();
    }
    console.log(`PASS: ${selections} mobile chapter selections via visible taps and keyboard across 4 language/theme combinations and 3 sizes; unobstructed labels, complete goal copy, reserved footer, bottom safe area, breakpoint resize and motion.`);
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
