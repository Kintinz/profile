# Copilot Instructions

When working in this repository, follow these guidelines:

- Keep changes aligned with the existing React + Vite + TypeScript structure.
- Preserve the one-page portfolio layout, bilingual content flow, and theme toggle behavior.
- Prefer small, focused edits over broad refactors.
- Keep `siteContent.ts` as the source of truth for localized copy and structured content.
- Avoid changing the app state model unless the user asks for a functional change.
- Maintain accessibility: keep meaningful `aria-*` labels, keyboard support, and reduced-motion handling.
- Reuse the existing icon and visual language rather than introducing a new style system.
- Do not add new dependencies unless they are clearly necessary.
- Before modifying animation, scroll, or responsive logic, check the related effect or layout code nearby.
- Keep TypeScript types explicit when adding new content models or props.

If a task is unclear, inspect the nearest component or content module first and make the smallest safe change.