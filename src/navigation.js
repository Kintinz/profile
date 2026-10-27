export const createState = () => ({ section: 0, page: 0 });

export function selectSection(state, section) {
  return section === state.section ? state : { section, page: 0 };
}

export function movePage(state, direction, count) {
  return { ...state, page: Math.max(0, Math.min(count - 1, state.page + direction)) };
}

export function orbitAngles(active, mobile = false) {
  if (mobile) return [-162, -126, -90, -54, -18];
  const spacing = Math.min(32, 76 / Math.max(active, 4 - active));
  return Array.from({ length: 5 }, (_, index) => (index - active) * spacing);
}
