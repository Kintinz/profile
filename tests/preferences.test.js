import test from 'node:test';
import assert from 'node:assert/strict';
import { readPreferences, savePreferences, preferenceKey } from '../src/preferences.js';
import { getContent } from '../src/locales.js';

test('first visit defaults to Vietnamese and light regardless of system preferences', () => {
  assert.deepEqual(readPreferences({ getItem: () => null }), { language: 'vi', theme: 'light' });
});
test('explicit language and theme choices survive storage round trip', () => {
  const values = new Map();
  const storage = { getItem: key => values.get(key), setItem: (key, value) => values.set(key, value) };
  savePreferences({ language: 'en', theme: 'dark' }, storage);
  assert.ok(values.has(preferenceKey));
  assert.deepEqual(readPreferences(storage), { language: 'en', theme: 'dark' });
});
test('invalid storage and blocked storage preserve usable defaults', () => {
  for (const value of ['{', 'null', '[]', '{"language":"fr","theme":"system"}']) {
    assert.deepEqual(readPreferences({ getItem: () => value }), { language: 'vi', theme: 'light' });
  }
  const blocked = { getItem() { throw new Error('blocked'); }, setItem() { throw new Error('blocked'); } };
  assert.deepEqual(readPreferences(blocked), { language: 'vi', theme: 'light' });
  assert.equal(savePreferences({ language: 'en', theme: 'dark' }, blocked), false);
});
test('each stored setting is validated independently', () => {
  assert.deepEqual(readPreferences({ getItem: () => '{"language":"en","theme":"invalid"}' }), { language: 'en', theme: 'light' });
});
test('English content preserves identity, project structure, dates and technologies', () => {
  const vi = getContent('vi');
  const en = getContent('en');
  for (const key of ['name', 'phone', 'email', 'address']) assert.equal(en.identity[key], vi.identity[key]);
  assert.deepEqual(en.sections.map(section => section.id), vi.sections.map(section => section.id));
  assert.equal(en.experience.length, vi.experience.length);
  assert.equal(en.projects.length, vi.projects.length);
  en.projects.forEach((project, index) => {
    const original = vi.projects[index];
    assert.equal(project.period, original.period.replace('Hiện tại', 'Present'));
    assert.deepEqual(project.tech, original.tech);
    assert.equal(project.work?.length, original.work?.length);
    assert.equal(project.parts?.length, original.parts?.length);
    project.parts?.forEach((part, partIndex) => {
      assert.deepEqual(part.tech, original.parts[partIndex].tech);
      assert.equal(part.work.length, original.parts[partIndex].work.length);
    });
  });
});
test('UI dictionaries cover the same labels in both languages', () => {
  assert.deepEqual(Object.keys(getContent('en').ui).sort(), Object.keys(getContent('vi').ui).sort());
  assert.equal(getContent('en').sections[0].label, 'About me');
  assert.equal(getContent('vi').sections[0].label, 'Về bản thân');
});
