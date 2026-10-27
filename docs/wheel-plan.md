# Approved wheel navigation

Scope: vertical wheel gestures navigate only the five main profile chapters.
Detail pages and project selection keep their existing buttons. Layout and CV
content are unchanged; the page remains fixed without document scrolling.

- [x] Test accumulation, gesture boundaries, momentum tails, direction changes,
  animation gating, line/page deltas, and browser zoom/horizontal exclusions.
- [x] Add `src/wheel.js` to normalize and consume one chapter move per gesture.
- [x] Integrate with the current transition lifecycle in `src/main.js`, waiting
  for the actual animations to finish rather than queuing wheel navigation.
- [x] Verify native browser wheel input, click interruptions, reduced motion,
  11 unit tests, 156 existing content states across 7 viewports and motion checks.
  Focused review found no important issue; the 7 wheel unit tests were rerun
  independently. Commit the scoped change after these checks.

Flow: vertical input → accumulate 60px equivalent → one chapter step → wait for
animation completion and a quiet interval of 180ms before accepting a new gesture.
Wheel input during a click/entrance animation is consumed, never queued.
First/last chapter clamp at their existing boundaries. Ctrl/Meta zoom, Shift/Alt
gestures and predominantly horizontal scrolling are not intercepted.
