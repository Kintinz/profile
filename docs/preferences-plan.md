# Approved bilingual and appearance support

Defaults: Vietnamese and light. Restore only an explicit valid saved selection;
never infer language or theme from browser/system preferences. Store choices
locally with graceful fallback if browser storage is unavailable.

- [x] Preserve original Vietnamese CV data; provide matching English content and
  a complete UI-label dictionary, retaining names, dates, facts and technologies.
- [x] Add VI/EN and light/dark controls on the header, including mobile layout.
- [x] Keep the current chapter, project and detail page when changing settings;
  cancel stale motion before updating the view and re-open wheel input safely.
- [x] Centralize palette tokens; add dark accents and a light-colored DĐ logo.
- [x] Verify all four language/theme combinations: 624 content states across
  7 viewports; 17 unit tests; defaults/persistence/blocked storage; header layout
  at 375px and 320px; preference changes during motion and subsequent wheel input.
  Check text/accent contrast across all 10 chapter/theme palettes, plus the
  existing motion and wheel browser suites. Focused source/translation review
  found no important issues and independently reran the preference browser test.

Flow: open → validate saved preferences or use vi/light → render → change
language/theme → retain navigation state → update labels/palette → save choice.
Only frontend source changes; no dependencies or deployment configuration changes.
Known preexisting mobile orbit-label overlap remains outside this scope.
