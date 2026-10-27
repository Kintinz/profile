import test from 'node:test';
import assert from 'node:assert/strict';
import { WheelGesture, isVerticalWheel } from '../src/wheel.js';

const event = (deltaY, options = {}) => ({ deltaY, deltaX: 0, deltaMode: 0, ...options });

test('small touchpad deltas accumulate before changing one chapter', () => {
  const wheel = new WheelGesture();
  assert.equal(wheel.read(event(20), 0), 0);
  assert.equal(wheel.read(event(20), 20), 0);
  assert.equal(wheel.read(event(20), 40), 1);
  assert.equal(wheel.read(event(120), 60), 0);
});

test('a long inertial tail never queues additional chapter changes', () => {
  const wheel = new WheelGesture();
  assert.equal(wheel.read(event(100), 0), 1);
  for (let time = 20; time < 2000; time += 20) assert.equal(wheel.read(event(70), time), 0);
  assert.equal(wheel.read(event(100), 2250), 1);
});

test('changing direction within a gesture waits for a quiet interval', () => {
  const wheel = new WheelGesture();
  assert.equal(wheel.read(event(100), 0), 1);
  assert.equal(wheel.read(event(-100), 40), 0);
  assert.equal(wheel.read(event(-100), 300), -1);
});

test('wheel input during a click animation consumes the gesture rather than queueing', () => {
  const wheel = new WheelGesture();
  assert.equal(wheel.read(event(120), 0, true), 0);
  assert.equal(wheel.read(event(120), 100, false), 0);
  assert.equal(wheel.read(event(120), 400, false), 1);
});

test('line and page wheel units normalize to viewport pixels', () => {
  assert.equal(new WheelGesture().read(event(4, { deltaMode: 1 }), 0), 1);
  assert.equal(new WheelGesture().read(event(-1, { deltaMode: 2 }), 0, false, 667), -1);
});

test('horizontal scrolling and browser zoom gestures are left alone', () => {
  for (const options of [{ ctrlKey: true }, { metaKey: true }, { shiftKey: true }, { altKey: true }, { deltaX: 150 }]) {
    assert.equal(isVerticalWheel(event(100, options)), false);
    assert.equal(new WheelGesture().read(event(100, options), 0), 0);
  }
  assert.equal(isVerticalWheel(event(0)), false);
});

test('incomplete gestures expire and opposite deltas start a fresh accumulation', () => {
  const wheel = new WheelGesture();
  assert.equal(wheel.read(event(40), 0), 0);
  assert.equal(wheel.read(event(30), 300), 0);
  assert.equal(wheel.read(event(-40), 320), 0);
  assert.equal(wheel.read(event(-20), 340), -1);
});
