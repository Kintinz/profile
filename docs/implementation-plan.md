# Profile implementation plan

Approved direction: a smaller left semicircular chapter menu, white/navy layout,
chapter accent colors, page turns, and identity moving between introduction and
header. All content comes from the supplied TopCV CV dated 27/10/2026.

- [x] Back up the original source, including uncommitted edits, outside Git.
- [x] Keep Vite, dependency versions, Pages base path and deployment workflow.
- [x] Store CV copy in `src/content.js`; implement chapter and detail-page state in `src/navigation.js`.
- [x] Build the layout and motion in `src/main.js` and `src/style.css`.
- [x] Remove unused legacy games, audio, terminal and cyber UI modules after backup.
- [x] Verify navigation logic, production build, responsive content and motion in Chromium.
- [x] Verify the production build, 4 navigation tests and 156 browser content states across 7 viewport sizes; commit the replacement.
- [ ] Confirm before pushing to main, which triggers Pages deployment.

Flow: chapter selection → rotate menu and change accent → move identity if needed
→ turn content page → navigate detail pages without scrolling.

On short landscape screens, additional detail pages preserve content at readable
sizes. CV date inconsistencies and incomplete original HRM work description are
retained instead of silently corrected.
