import test from 'node:test';
import assert from 'node:assert/strict';
import { createState, selectSection, movePage, orbitAngles } from '../src/navigation.js';

test('selecting another chapter resets its subpage and moves identity to header', () => {
  const state = selectSection({ section: 3, page: 4 }, 1);
  assert.deepEqual(state, { section: 1, page: 0 });
  assert.equal(selectSection(state, 0).section, 0);
});
test('selecting the current chapter preserves its current subpage', () => {
  const state = { section: 3, page: 2 };
  assert.deepEqual(selectSection(state, 3), state);
});
test('subpage navigation clamps at both boundaries', () => {
  assert.equal(movePage({ section: 3, page: 0 }, -1, 5).page, 0);
  assert.equal(movePage({ section: 3, page: 4 }, 1, 5).page, 4);
  assert.equal(movePage({ section: 3, page: 1 }, 1, 5).page, 2);
});
test('all orbit items stay visible and active chapter moves closest to center', () => {
  for (let active = 0; active < 5; active++) {
    const angles = orbitAngles(active);
    assert.equal(angles.length, 5);
    assert.ok(angles.every(angle => angle >= -76 && angle <= 76));
    assert.equal(Math.abs(angles[active]), Math.min(...angles.map(Math.abs)));
  }
  assert.deepEqual(createState(), { section: 0, page: 0 });
});
