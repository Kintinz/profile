import './style.css';
import './theme.css';
import logoUrl from './assets/logo-dd.svg';
import darkLogoUrl from './assets/logo-dd-dark.svg';
import { getContent } from './locales.js';
import { readPreferences, savePreferences } from './preferences.js';
import { createState, selectSection, movePage } from './navigation.js';
import { ProfileMotion } from './motion.js';
import { WheelGesture, isVerticalWheel } from './wheel.js';
import { DesktopView } from './views/desktop.js';
import { MobileView } from './views/mobile.js';
import { number, arrow } from './views/shared.js';

const chips = items => `<ul class="chips">${items.map(item => `<li>${item}</li>`).join('')}</ul>`;
const list = items => `<ul class="work-list">${items.map(item => `<li>${item}</li>`).join('')}</ul>`;
const preferences = readPreferences();
let { identity, skills, experience, projects, sections, ui } = getContent(preferences.language);
document.documentElement.lang = preferences.language;
document.documentElement.dataset.theme = preferences.theme;
let state = createState();
let transitionId = 0;
let projectIndex = 0;
let isTransitioning = true;
const wheel = new WheelGesture();
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const motion = new ProfileMotion(reducedMotion);

const app = document.querySelector('#app');
const mobileQuery = matchMedia('(max-width: 600px)');
let view;
let sheet;
let chapter;
let identityElement;

function mountView(animate = false) {
  const id = ++transitionId;
  isTransitioning = true;
  view?.destroy();
  motion.stop();
  view = mobileQuery.matches ? new MobileView() : new DesktopView();
  app.innerHTML = view.render({ identity, sections, ui, preferences, logoUrl, darkLogoUrl });
  sheet = app.querySelector('.sheet');
  chapter = app.querySelector('#chapter');
  identityElement = app.querySelector('.identity');
  view.mount({ sheet, onSelect: navigate, getSection: () => state.section, isBusy: () => isTransitioning });
  bindViewEvents();
  updatePreferenceLabels();
  updateOrbit();
  render();
  positionIdentity();
  if (animate) motion.enter(identityElement, sheet.querySelector('.orbit-disc'), chapter, sheet.querySelector('.chapter-marker'), sheet.querySelector('.footer'));
  finishTransition(id);
}

function aboutPages() {
  const goal = `<p class="goal">${identity.goal}</p>`;
  const highlights = [`<div><span class="eyebrow">${ui.experience}</span><p>${ui.company}</p><small>.NET Developer · 12/2022–09/2026</small></div>`, `<div><span class="eyebrow">${ui.expertise}</span><p>C#, ASP.NET Core, Entity Framework</p><small>Angular, React, Vue.js, TypeScript</small></div>`];
  const summary = `<div class="summary">${highlights.join('')}</div>`;
  if (innerWidth <= 600 && innerHeight < 820) {
    const breakAt = preferences.language === 'en' ? identity.goal.indexOf(' and contribute') : identity.goal.indexOf(', ') + 1;
    const goals = innerHeight < 640 ? [identity.goal.slice(0, breakAt).trim(), identity.goal.slice(breakAt).trim()] : [identity.goal];
    return [...goals.map(text => `<div class="about-copy"><p class="goal">${text}</p></div>`), ...highlights.map(item => `<div class="about-copy"><div class="summary">${item}</div></div>`)];
  }
  return innerWidth <= 600 || innerHeight < 620
    ? [`<div class="about-copy">${goal}</div>`, `<div class="about-copy">${summary}</div>`]
    : [`<div class="about-copy">${goal}${summary}</div>`];
}

function projectPages() {
  const project = projects[projectIndex];
  const overview = `<h3>${project.title}</h3><p class="period">${project.period}</p><div class="project-facts"><div><span class="eyebrow">${ui.role}</span><p>${project.role}</p></div><div><span class="eyebrow">${projectIndex === 4 ? ui.collaboration : ui.teamSize}</span><p>${project.team}</p></div></div><p class="description">${project.description}</p>`;
  const result = project.result ? `<div class="result"><span class="eyebrow">${ui.result}</span><p>${project.result}</p></div>` : '';
  const tech = items => `<div class="tech"><span class="eyebrow">${ui.technology}</span>${chips(items)}</div>`;
  if ((innerHeight < 520 && innerWidth > 600) || (innerWidth <= 600 && innerHeight < 820)) {
    const heading = `<h3>${project.title}</h3><p class="period">${project.period}</p>`;
    const facts = `<div class="project-facts"><div><span class="eyebrow">${ui.role}</span><p>${project.role}</p></div><div><span class="eyebrow">${projectIndex === 4 ? ui.collaboration : ui.teamSize}</span><p>${project.team}</p></div></div>`;
    const detailPages = project.parts
      ? project.parts.flatMap(part => innerWidth <= 600 && innerHeight < 640
        ? [`<h3>${part.title}</h3>`, ...part.work.map(work => list([work])), `<h3>${part.title}</h3>${tech(part.tech)}`]
        : [...part.work.map(work => `<h3>${part.title}</h3>${list([work])}`), `<h3>${part.title}</h3>${tech(part.tech)}`])
      : [...(project.work || []).map(work => list([work])), ...(result ? [result] : []), tech(project.tech)];
    const opening = innerWidth <= 600 && innerHeight < 640 ? [heading, facts] : [heading + facts];
    return [...opening, `<p class="description">${project.description}</p>`, ...detailPages];
  }
  const compact = innerWidth <= 1200 || innerHeight < 800;
  if (project.parts) return [overview, ...project.parts.map(part => `<h3>${part.title}</h3>${list(part.work)}${tech(part.tech)}`)];
  const details = `${project.work ? list(project.work) : ''}${result}${tech(project.tech)}`;
  return compact ? [overview, `<h3 class="continuation">${project.title}</h3>${details}`] : [`${overview}${details}`];
}

function pages() {
  switch (state.section) {
    case 0: return aboutPages();
    case 1: return skills.flatMap((skill, index) => {
      const chunk = innerWidth <= 600 && innerHeight < 820 ? (innerHeight < 640 ? 2 : 4) : skill.items.length;
      return Array.from({ length: Math.ceil(skill.items.length / chunk) }, (_, page) => `<div class="skill-group"><span class="eyebrow">${number(index + 1)} / 04</span><h3>${skill.title}</h3>${chips(skill.items.slice(page * chunk, (page + 1) * chunk))}</div>`);
    });
    case 2: {
      if (innerWidth <= 600 && innerHeight < 640) return [`<h3>${ui.company}</h3><p class="period">12/2022–09/2026</p><div class="job-role">.NET Developer</div>`, ...experience.map(work => list([work]))];
      const chunk = innerHeight < 520 || (innerWidth <= 600 && innerHeight < 820) ? 1 : innerWidth <= 600 || innerHeight < 700 ? 2 : 3;
      return Array.from({ length: Math.ceil(experience.length / chunk) }, (_, index) => `<h3>${ui.company}</h3><p class="period">12/2022–09/2026</p><div class="job-role">.NET Developer</div>${list(experience.slice(index * chunk, (index + 1) * chunk))}`);
    }
    case 3: return projectPages();
    case 4: return innerWidth <= 600 && innerHeight < 640
      ? [`<div class="education"><span class="eyebrow">2020 — 2023</span><h3>${ui.school}</h3></div>`, `<div class="education"><span class="eyebrow">${ui.major}</span><p>${ui.subject}</p></div>`]
      : [`<div class="education"><span class="eyebrow">2020 — 2023</span><h3>${ui.school}</h3><div class="education-rule"></div><span class="eyebrow">${ui.major}</span><p>${ui.subject}</p></div>`];
    default: return [];
  }
}

function positionIdentity(animate = false) {
  const before = identityElement.getBoundingClientRect();
  motion.cancel(identityElement);
  const target = document.querySelector(state.section === 0 ? '.identity-home' : '.identity-anchor').getBoundingClientRect();
  sheet.classList.toggle('is-about', state.section === 0);
  identityElement.classList.toggle('is-compact', state.section !== 0);
  identityElement.style.left = `${target.left}px`;
  identityElement.style.top = `${target.top}px`;
  if (animate && !reducedMotion.matches) {
    const after = identityElement.getBoundingClientRect();
    motion.play(identityElement, [
      { transform: `translate(${before.left - after.left}px, ${before.top - after.top}px) scale(${before.width / after.width})` },
      { transform: 'translate(0, 0) scale(1)' },
    ], { duration: 680 });
  }
}

function render() {
  const section = sections[state.section];
  const content = pages();
  state.page = Math.min(state.page, content.length - 1);
  chapter.innerHTML = `${state.section === 0 ? '' : `<h2>${section.label}</h2>`}<div class="page-content">${content[state.page]}</div>`;
  chapter.setAttribute('aria-label', section.label);
  document.querySelector('#chapter-number').textContent = `${number(state.section + 1)} / 05`;
  document.querySelector('#chapter-label').textContent = section.label;
  document.querySelector('.subnav').hidden = content.length === 1 && state.section !== 3;
  document.querySelector('#subnav-label').innerHTML = state.section === 3
    ? `<div class="project-selector"><button class="text-button" id="previous-project" aria-label="${ui.previousProject}" ${projectIndex === 0 ? 'disabled' : ''}>${arrow(-1)}</button><span>${ui.project} <b>${number(projectIndex + 1)}</b> / 05</span><button class="text-button" id="next-project" aria-label="${ui.nextProject}" ${projectIndex === 4 ? 'disabled' : ''}>${arrow(1)}</button></div><span class="detail-count">${ui.detail} ${state.page + 1} / ${content.length}</span>`
    : `<span>${state.section === 1 ? ui.skillGroup : ui.content} <b>${number(state.page + 1)}</b> / ${number(content.length)}</span>`;
  document.querySelector('.subnav-buttons').hidden = content.length === 1;
  document.querySelector('#previous-page').disabled = state.page === 0;
  document.querySelector('#next-page').disabled = state.page === content.length - 1;
  document.querySelector('#previous-project')?.addEventListener('click', () => changeProject(-1));
  document.querySelector('#next-project')?.addEventListener('click', () => changeProject(1));
  document.querySelector('#announcement').textContent = `${section.label}, ${ui.page} ${state.page + 1} ${ui.of} ${content.length}${state.section === 3 ? `, ${projects[projectIndex].title}` : ''}`;
}

function updateOrbit() {
  const section = sections[state.section];
  const darkAccents = ['#59c5be', '#83b7f4', '#baa5f0', '#eaa17d', '#b1c77a'];
  const darkSurfaces = ['#153c3d', '#1d324d', '#352b4d', '#432c25', '#303b24'];
  sheet.style.setProperty('--accent', preferences.theme === 'dark' ? darkAccents[state.section] : section.color);
  sheet.style.setProperty('--accent-soft', preferences.theme === 'dark' ? darkSurfaces[state.section] : section.soft);
  view.setSection(state.section);
  sections.forEach((section, index) => {
    const item = document.querySelector(`[data-section="${index}"]`);
    item.classList.toggle('active', index === state.section);
    if (index === state.section) item.setAttribute('aria-current', 'page');
    else item.removeAttribute('aria-current');
  });
}

function updatePreferenceLabels() {
  document.querySelector('.header-caption > span').textContent = ui.personalProfile;
  document.querySelector('.header-tools').setAttribute('aria-label', ui.settings);
  document.querySelector('.language-switch').setAttribute('aria-label', ui.language);
  document.querySelector('.chapter-navigation').setAttribute('aria-label', ui.navigation);
  document.querySelector('.monogram').setAttribute('aria-label', `${identity.name} — ${ui.home}`);
  document.querySelector('.monogram img').src = preferences.theme === 'dark' ? darkLogoUrl : logoUrl;
  const dragHelp = document.querySelector('#orbit-help');
  if (dragHelp) dragHelp.textContent = ui.dragHint;
  const themeButton = document.querySelector('.theme-toggle');
  themeButton.setAttribute('aria-label', preferences.theme === 'dark' ? ui.toLight : ui.toDark);
  themeButton.title = preferences.theme === 'dark' ? ui.toLight : ui.toDark;
  themeButton.setAttribute('aria-pressed', String(preferences.theme === 'dark'));
  document.querySelectorAll('[data-language]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.language === preferences.language)));
  for (const [id, label] of Object.entries({ 'previous-page': ui.previousPage, 'next-page': ui.nextPage })) {
    document.getElementById(id).setAttribute('aria-label', label);
  }
  sections.forEach((section, index) => {
    const button = document.querySelector(`[data-section="${index}"]`);
    button.setAttribute('aria-label', section.label);
    button.querySelector('.orbit-label').innerHTML = `<span>${number(index + 1)}</span>${section.label}`;
  });
}

function changePreferences(next) {
  view.cancelDrag();
  const id = ++transitionId;
  isTransitioning = true;
  Object.assign(preferences, next);
  ({ identity, skills, experience, projects, sections, ui } = getContent(preferences.language));
  motion.stop();
  document.documentElement.lang = preferences.language;
  document.documentElement.dataset.theme = preferences.theme;
  updatePreferenceLabels();
  updateOrbit();
  render();
  positionIdentity();
  savePreferences(preferences);
  finishTransition(id);
}

async function finishTransition(id) {
  await Promise.all(sheet.getAnimations({ subtree: true }).map(animation => animation.finished.catch(() => {})));
  if (id === transitionId) isTransitioning = false;
}

async function transition(nextState, identityChanged = false) {
  const id = ++transitionId;
  isTransitioning = true;
  state = nextState;
  updateOrbit();
  if (identityChanged) positionIdentity(true);
  motion.cancel(chapter, true);
  if (!reducedMotion.matches) {
    const outgoing = motion.play(chapter, [
      { opacity: 1, transform: 'rotateY(0deg)', boxShadow: '0 0 0 rgba(12,32,63,0)' },
      { opacity: 0, transform: 'rotateY(-20deg) translateX(-8px)', boxShadow: '16px 3px 24px -15px rgba(12,32,63,.16)' },
    ], { duration: 180, easing: 'ease-in', fill: 'forwards' });
    await outgoing.finished.catch(() => {});
  }
  if (id !== transitionId) return;
  render();
  motion.cancel(chapter, true);
  motion.play(chapter, [
    { opacity: 0, transform: 'rotateY(18deg) translateX(10px)', boxShadow: '-14px 3px 22px -14px rgba(12,32,63,.14)' },
    { opacity: 1, transform: 'rotateY(0deg)', boxShadow: '0 0 0 rgba(12,32,63,0)' },
  ], { duration: 450 });
  motion.reveal(chapter);
  await finishTransition(id);
}

function navigate(section) {
  if (section < 0 || section >= sections.length || section === state.section) return;
  const next = selectSection(state, section);
  history.replaceState(null, '', `#${sections[section].id}`);
  transition(next, true);
}

function changeProject(direction) {
  const next = Math.max(0, Math.min(projects.length - 1, projectIndex + direction));
  if (next === projectIndex) return;
  projectIndex = next;
  transition({ ...state, page: 0 });
}

function bindViewEvents() {
  document.querySelectorAll('[data-section]').forEach(button => button.addEventListener('click', () => {
    motion.pulse(button);
    navigate(Number(button.dataset.section));
  }));
  document.querySelector('.monogram').addEventListener('click', event => { event.preventDefault(); navigate(0); });
  document.querySelectorAll('[data-language]').forEach(button => button.addEventListener('click', () => {
    if (button.dataset.language !== preferences.language) changePreferences({ language: button.dataset.language });
  }));
  document.querySelector('.theme-toggle').addEventListener('click', () => changePreferences({ theme: preferences.theme === 'light' ? 'dark' : 'light' }));
  document.querySelector('#previous-page').addEventListener('click', () => transition(movePage(state, -1, pages().length)));
  document.querySelector('#next-page').addEventListener('click', () => transition(movePage(state, 1, pages().length)));
  document.querySelector('.chapter-navigation').addEventListener('keydown', event => {
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? 4 : Math.max(0, Math.min(4, state.section + (event.key === 'ArrowDown' ? 1 : -1)));
    navigate(next);
    document.querySelector(`[data-section="${next}"]`).focus({ preventScroll: true });
  });
}

addEventListener('wheel', event => {
  if (!isVerticalWheel(event)) return;
  event.preventDefault();
  const direction = wheel.read(event, performance.now(), isTransitioning || view.dragging, innerHeight);
  if (!direction) return;
  const next = state.section + direction;
  if (next < 0 || next >= sections.length) return;
  motion.pulse(document.querySelector(`[data-section="${next}"]`));
  navigate(next);
}, { passive: false });
addEventListener('resize', () => {
  if (view.kind !== (mobileQuery.matches ? 'mobile' : 'desktop')) { mountView(); return; }
  view.cancelDrag();
  motion.cancel(chapter, true);
  updateOrbit();
  render();
  positionIdentity();
});
reducedMotion.addEventListener('change', () => {
  view.cancelDrag();
  ++transitionId;
  motion.stop();
  render();
  positionIdentity();
  isTransitioning = false;
});
addEventListener('hashchange', () => {
  const index = sections.findIndex(section => `#${section.id}` === location.hash);
  if (index >= 0) navigate(index);
});
const initial = sections.findIndex(section => `#${section.id}` === location.hash);
if (initial >= 0) state = selectSection(state, initial);
mountView(true);
