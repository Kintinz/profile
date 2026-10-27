import './style.css';
import { identity, skills, experience, projects, sections } from './content.js';
import { createState, selectSection, movePage, orbitAngles } from './navigation.js';

const number = value => String(value).padStart(2, '0');
const arrow = direction => `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${direction < 0 ? 'M14 5 7 12l7 7' : 'm10 5 7 7-7 7'}"/></svg>`;
const chips = items => `<ul class="chips">${items.map(item => `<li>${item}</li>`).join('')}</ul>`;
const list = items => `<ul class="work-list">${items.map(item => `<li>${item}</li>`).join('')}</ul>`;
let state = createState();
let transitionId = 0;
let projectIndex = 0;
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

document.querySelector('#app').innerHTML = `
  <div class="sheet">
    <header class="header">
      <a class="monogram" href="#about" aria-label="Dương Tiến Đạt — Về bản thân">DĐ</a>
      <span class="header-rule"></span><span class="identity-anchor" aria-hidden="true"></span>
      <span class="header-caption">Hồ sơ cá nhân <i></i></span>
    </header>
    <nav class="orbit" aria-label="Các mục hồ sơ">
      <div class="orbit-disc" aria-hidden="true"><div class="orbit-ticks"></div><div class="orbit-core"></div></div>
      ${sections.map((section, index) => `<button class="orbit-item" data-section="${index}" aria-controls="chapter" aria-label="${section.label}"><span class="orbit-node"></span><span class="orbit-label"><span>${number(index + 1)}</span>${section.label}</span></button>`).join('')}
    </nav>
    <main class="main">
      <div class="chapter-marker"><span id="chapter-number">01 / 05</span><i></i><span id="chapter-label">Về bản thân</span></div>
      <div class="identity-home" aria-hidden="true"></div>
      <div class="page-stage"><section id="chapter" tabindex="-1" aria-label="Về bản thân"></section></div>
      <div class="subnav" hidden>
        <div id="subnav-label"></div>
        <div class="subnav-buttons"><button id="previous-page" class="arrow" aria-label="Trang nội dung trước">${arrow(-1)}</button><button id="next-page" class="arrow" aria-label="Trang nội dung tiếp">${arrow(1)}</button></div>
      </div>
      <footer class="footer">
        <address class="contacts"><a href="tel:${identity.phone}"><span aria-hidden="true">↗</span>${identity.phone}</a><a href="mailto:${identity.email}"><span aria-hidden="true">✉</span>${identity.email}</a><span><span aria-hidden="true">⌖</span>${identity.address}</span></address>
        <div class="footer-bottom"><span class="hint">Chọn một mục để xoay trang</span><div class="chapter-controls"><span id="footer-number">01 <span>/ 05</span></span><button id="previous-section" class="arrow" aria-label="Mục trước">${arrow(-1)}</button><button id="next-section" class="arrow" aria-label="Mục tiếp">${arrow(1)}</button></div></div>
      </footer>
    </main>
    <div class="identity"><div class="identity-name">${identity.name}</div><div class="identity-role">.NET DEVELOPER</div></div>
    <p class="sr-only" role="status" id="announcement"></p>
  </div>`;

const sheet = document.querySelector('.sheet');
const chapter = document.querySelector('#chapter');
const identityElement = document.querySelector('.identity');

function aboutPages() {
  const goal = `<p class="goal">${identity.goal}</p>`;
  const summary = `<div class="summary"><div><span class="eyebrow">Kinh nghiệm</span><p>Công ty Cổ phần Kids Plaza</p><small>.NET Developer · 12/2022–09/2026</small></div><div><span class="eyebrow">Chuyên môn</span><p>C#, ASP.NET Core, Entity Framework</p><small>Angular, React, Vue.js, TypeScript</small></div></div>`;
  return innerWidth <= 600 || innerHeight < 620
    ? [`<div class="about-copy">${goal}</div>`, `<div class="about-copy">${summary}</div>`]
    : [`<div class="about-copy">${goal}${summary}</div>`];
}

function projectPages() {
  const project = projects[projectIndex];
  const overview = `<h3>${project.title}</h3><p class="period">${project.period}</p><div class="project-facts"><div><span class="eyebrow">Vai trò</span><p>${project.role}</p></div><div><span class="eyebrow">${projectIndex === 4 ? 'Phối hợp' : 'Quy mô team'}</span><p>${project.team}</p></div></div><p class="description">${project.description}</p>`;
  const result = project.result ? `<div class="result"><span class="eyebrow">Kết quả</span><p>${project.result}</p></div>` : '';
  const tech = items => `<div class="tech"><span class="eyebrow">Công nghệ</span>${chips(items)}</div>`;
  if (innerHeight < 520 && innerWidth > 600) {
    const heading = `<h3>${project.title}</h3><p class="period">${project.period}</p>`;
    const facts = `<div class="project-facts"><div><span class="eyebrow">Vai trò</span><p>${project.role}</p></div><div><span class="eyebrow">${projectIndex === 4 ? 'Phối hợp' : 'Quy mô team'}</span><p>${project.team}</p></div></div>`;
    const detailPages = project.parts
      ? project.parts.flatMap(part => [ ...part.work.map(work => `<h3>${part.title}</h3>${list([work])}`), `<h3>${part.title}</h3>${tech(part.tech)}` ])
      : [...(project.work || []).map(work => list([work])), ...(result ? [result] : []), tech(project.tech)];
    return [heading + facts, `<p class="description">${project.description}</p>`, ...detailPages];
  }
  const compact = innerWidth <= 1200 || innerHeight < 800;
  if (project.parts) return [overview, ...project.parts.map(part => `<h3>${part.title}</h3>${list(part.work)}${tech(part.tech)}`)];
  const details = `${project.work ? list(project.work) : ''}${result}${tech(project.tech)}`;
  return compact ? [overview, `<h3 class="continuation">${project.title}</h3>${details}`] : [`${overview}${details}`];
}

function pages() {
  switch (state.section) {
    case 0: return aboutPages();
    case 1: return skills.map((skill, index) => `<div class="skill-group"><span class="eyebrow">${number(index + 1)} / 04</span><h3>${skill.title}</h3>${chips(skill.items)}</div>`);
    case 2: {
      const chunk = innerHeight < 520 ? 1 : innerWidth <= 600 || innerHeight < 700 ? 2 : 3;
      return Array.from({ length: Math.ceil(experience.length / chunk) }, (_, index) => `<h3>Công ty Cổ phần Kids Plaza</h3><p class="period">12/2022–09/2026</p><div class="job-role">.NET Developer</div>${list(experience.slice(index * chunk, (index + 1) * chunk))}`);
    }
    case 3: return projectPages();
    case 4: return [`<div class="education"><span class="eyebrow">2020 — 2023</span><h3>Cao đẳng kinh tế công nghiệp Hà Nội</h3><div class="education-rule"></div><span class="eyebrow">Chuyên ngành</span><p>Công nghệ Thông tin</p></div>`];
    default: return [];
  }
}

function positionIdentity(animate = false) {
  const before = identityElement.getBoundingClientRect();
  identityElement.getAnimations().forEach(animation => animation.cancel());
  const target = document.querySelector(state.section === 0 ? '.identity-home' : '.identity-anchor').getBoundingClientRect();
  sheet.classList.toggle('is-about', state.section === 0);
  identityElement.classList.toggle('is-compact', state.section !== 0);
  identityElement.style.left = `${target.left}px`;
  identityElement.style.top = `${target.top}px`;
  if (animate && !reducedMotion.matches) {
    const after = identityElement.getBoundingClientRect();
    identityElement.animate([
      { transform: `translate(${before.left - after.left}px, ${before.top - after.top}px) scale(${before.width / after.width})` },
      { transform: 'translate(0, 0) scale(1)' },
    ], { duration: 720, easing: 'cubic-bezier(.22,1,.36,1)' });
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
  document.querySelector('#footer-number').innerHTML = `${number(state.section + 1)} <span>/ 05</span>`;
  document.querySelector('#previous-section').disabled = state.section === 0;
  document.querySelector('#next-section').disabled = state.section === 4;
  document.querySelector('.subnav').hidden = content.length === 1 && state.section !== 3;
  document.querySelector('#subnav-label').innerHTML = state.section === 3
    ? `<div class="project-selector"><button class="text-button" id="previous-project" aria-label="Dự án trước" ${projectIndex === 0 ? 'disabled' : ''}>${arrow(-1)}</button><span>Dự án <b>${number(projectIndex + 1)}</b> / 05</span><button class="text-button" id="next-project" aria-label="Dự án tiếp" ${projectIndex === 4 ? 'disabled' : ''}>${arrow(1)}</button></div><span class="detail-count">Chi tiết ${state.page + 1} / ${content.length}</span>`
    : `<span>${state.section === 1 ? 'Nhóm kỹ năng' : 'Nội dung'} <b>${number(state.page + 1)}</b> / ${number(content.length)}</span>`;
  document.querySelector('.subnav-buttons').hidden = content.length === 1;
  document.querySelector('#previous-page').disabled = state.page === 0;
  document.querySelector('#next-page').disabled = state.page === content.length - 1;
  document.querySelector('#previous-project')?.addEventListener('click', () => changeProject(-1));
  document.querySelector('#next-project')?.addEventListener('click', () => changeProject(1));
  document.querySelector('#announcement').textContent = `${section.label}, trang ${state.page + 1} trên ${content.length}${state.section === 3 ? `, ${projects[projectIndex].title}` : ''}`;
}

function updateOrbit() {
  const section = sections[state.section];
  sheet.style.setProperty('--accent', section.color);
  sheet.style.setProperty('--accent-soft', section.soft);
  document.querySelector('.orbit-ticks').style.transform = `rotate(${state.section * -32}deg)`;
  orbitAngles(state.section).forEach((angle, index) => {
    const item = document.querySelector(`[data-section="${index}"]`);
    item.style.setProperty('--angle', `${angle}deg`);
    item.style.setProperty('--counter-angle', `${-angle}deg`);
    item.classList.toggle('active', index === state.section);
    if (index === state.section) item.setAttribute('aria-current', 'page');
    else item.removeAttribute('aria-current');
  });
}

async function transition(nextState, identityChanged = false) {
  const id = ++transitionId;
  state = nextState;
  updateOrbit();
  if (identityChanged) positionIdentity(true);
  chapter.getAnimations().forEach(animation => animation.cancel());
  if (!reducedMotion.matches) {
    await chapter.animate([{ opacity: 1, transform: 'rotateY(0deg)' }, { opacity: 0, transform: 'rotateY(-14deg) translateX(-10px)' }], { duration: 190, easing: 'ease-in', fill: 'forwards' }).finished.catch(() => {});
  }
  if (id !== transitionId) return;
  render();
  chapter.getAnimations().forEach(animation => animation.cancel());
  if (!reducedMotion.matches) chapter.animate([{ opacity: 0, transform: 'rotateY(16deg) translateX(12px)' }, { opacity: 1, transform: 'rotateY(0deg)' }], { duration: 460, easing: 'cubic-bezier(.22,1,.36,1)' });
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

document.querySelectorAll('[data-section]').forEach(button => button.addEventListener('click', () => navigate(Number(button.dataset.section))));
document.querySelector('.monogram').addEventListener('click', event => { event.preventDefault(); navigate(0); });
document.querySelector('#previous-section').addEventListener('click', () => navigate(state.section - 1));
document.querySelector('#next-section').addEventListener('click', () => navigate(state.section + 1));
document.querySelector('#previous-page').addEventListener('click', () => transition(movePage(state, -1, pages().length)));
document.querySelector('#next-page').addEventListener('click', () => transition(movePage(state, 1, pages().length)));
document.querySelector('.orbit').addEventListener('keydown', event => {
  if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
  event.preventDefault();
  const next = event.key === 'Home' ? 0 : event.key === 'End' ? 4 : Math.max(0, Math.min(4, state.section + (event.key === 'ArrowDown' ? 1 : -1)));
  navigate(next);
  document.querySelector(`[data-section="${next}"]`).focus();
});
addEventListener('resize', () => { render(); positionIdentity(); });
addEventListener('hashchange', () => {
  const index = sections.findIndex(section => `#${section.id}` === location.hash);
  if (index >= 0) navigate(index);
});
const initial = sections.findIndex(section => `#${section.id}` === location.hash);
if (initial >= 0) state = selectSection(state, initial);
updateOrbit();
render();
positionIdentity();
