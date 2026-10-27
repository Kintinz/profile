async function selectChapter(page, section, touch = false) {
  const label = page.locator(`[data-section="${section}"] .orbit-label`);
  if (await label.isVisible()) {
    if (touch) await label.tap();
    else await label.click();
    return;
  }
  // Hidden mobile entries can be rotated into view with native keyboard controls.
  await page.locator('[aria-current="page"]').focus();
  for (let step = 0; step < 5; step++) {
    const current = Number(await page.locator('[aria-current="page"]').getAttribute('data-section'));
    if (current === section) return;
    await page.keyboard.press(current < section ? 'ArrowDown' : 'ArrowUp');
  }
  throw new Error(`Unable to select chapter ${section}`);
}
module.exports = { selectChapter };
