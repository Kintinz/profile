# Approved mobile bottom semicircle

On viewports up to 600px wide, move the chapter semicircle to bottom center with
its visible half facing up. Spread all five chapter controls across the upper
arc, keeping labels horizontal and preventing overlapping tap targets. Preserve
desktop layout, CV content, language/theme controls and existing motion.

- [x] Test upper-half mobile geometry while preserving desktop orbit angles.
- [x] Position mobile arc at bottom center with a dedicated reserved layout area
  and bottom safe-area inset. Move content up below the header.
- [x] Recompute angles on resize; keep rotating decorative rings and chapter
  page-turn/accent changes while mobile chapter labels occupy stable arc slots.
- [x] Test 300 mobile chapter-to-chapter taps across both languages/themes and
  320x568, 375x667 and 390x844; verify label hit targets, footer reservation,
  simulated 34px bottom safe area, resize across the breakpoint and mobile motion.
- [x] Split additional short-mobile detail pages, preserving all CV strings and
  font sizes. Verify complete intro goal text across its pages. Capture previews.
- [x] Production build and 18 unit tests pass. All four language/theme combinations
  pass 1,248 content states across 10 viewports, including 740px/820px boundaries;
  existing preference, motion and wheel browser suites pass. Independent review
  also verified 544 boundary states with no remaining important finding.

Flow: mobile breakpoint → reserve bottom navigation space → place upward arc →
tap chapter → rotate decorative rings/change accent/turn content page.
