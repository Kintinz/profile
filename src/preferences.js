export const preferenceKey = 'profile.preferences.v1';

export function readPreferences(storage) {
  try {
    const saved = JSON.parse((storage ?? globalThis.localStorage).getItem(preferenceKey));
    return {
      language: saved?.language === 'en' ? 'en' : 'vi',
      theme: saved?.theme === 'dark' ? 'dark' : 'light',
    };
  } catch {
    return { language: 'vi', theme: 'light' };
  }
}

export function savePreferences(preferences, storage) {
  try {
    (storage ?? globalThis.localStorage).setItem(preferenceKey, JSON.stringify(preferences));
    return true;
  } catch {
    return false;
  }
}
