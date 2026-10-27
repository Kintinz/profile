import test from 'node:test';
import assert from 'node:assert/strict';
import { clampRotation, rotationForSection, sectionForRotation, angularDelta, pointerAngle } from '../src/orbit-drag.js';

test('releasing between chapters snaps to the nearest chapter', () => {
  assert.equal(sectionForRotation(-12), 0);
  assert.equal(sectionForRotation(-24), 1);
  assert.equal(sectionForRotation(-88), 2);
});
test('dragging past either end never wraps or selects an invalid chapter', () => {
  assert.equal(clampRotation(50), rotationForSection(0));
  assert.equal(clampRotation(-400), rotationForSection(4));
  assert.equal(sectionForRotation(-400), 4);
  assert.equal(sectionForRotation(400), 0);
});
test('angular movement remains continuous across the atan2 seam', () => {
  assert.ok(Math.abs(angularDelta(179, -179) - 2) < .001);
  assert.ok(Math.abs(angularDelta(-179, 179) + 2) < .001);
});
test('pointer coordinates describe the real wheel center rather than the viewport', () => {
  assert.equal(pointerAngle(200, 300, 200, 500), -90);
  assert.equal(pointerAngle(100, 500, 200, 500), 180);
});
test('each chapter can be centered and recovered without rounding drift', () => {
  for (let index = 0; index < 5; index++) assert.equal(sectionForRotation(rotationForSection(index)), index);
});
