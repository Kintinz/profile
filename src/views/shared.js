export const number = value => String(value).padStart(2, '0');
export const arrow = direction => `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${direction < 0 ? 'M14 5 7 12l7 7' : 'm10 5 7 7-7 7'}"/></svg>`;

export function sharedMarkup({ identity, sections, ui, preferences, logoUrl, darkLogoUrl }) {
  return {
    header: `<header class="header">
      <a class="monogram" href="#about" aria-label="${identity.name} — ${ui.home}"><img src="${preferences.theme === 'dark' ? darkLogoUrl : logoUrl}" width="68" height="38" alt="" draggable="false" /></a>
      <span class="header-rule"></span><span class="identity-anchor" aria-hidden="true"></span>
      <span class="header-caption"><span>${ui.personalProfile}</span><i></i></span>
      <div class="header-tools" role="group" aria-label="${ui.settings}">
        <div class="language-switch" role="group" aria-label="${ui.language}">
          <button type="button" data-language="vi" lang="vi" aria-label="Tiếng Việt" aria-pressed="${preferences.language === 'vi'}">VI</button>
          <button type="button" data-language="en" lang="en" aria-label="English" aria-pressed="${preferences.language === 'en'}">EN</button>
        </div>
        <button type="button" class="theme-toggle" aria-label="${preferences.theme === 'dark' ? ui.toLight : ui.toDark}" aria-pressed="${preferences.theme === 'dark'}">
          <svg class="sun-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/></svg>
          <svg class="moon-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 14A8.5 8.5 0 0 1 10 3.5 8.5 8.5 0 1 0 20.5 14Z"/></svg>
        </button>
      </div>
    </header>`,
    orbit: `<div class="orbit-disc" aria-hidden="true"><div class="orbit-ticks"></div><div class="orbit-core"></div></div>
      ${sections.map((section, index) => `<button class="orbit-item" data-section="${index}" aria-controls="chapter" aria-label="${section.label}"><span class="orbit-node"><span class="orbit-ripple" aria-hidden="true"></span></span><span class="orbit-label"><span>${number(index + 1)}</span>${section.label}</span></button>`).join('')}`,
    main: `<main class="main">
      <div class="chapter-marker"><span id="chapter-number">01 / 05</span><i></i><span id="chapter-label">${sections[0].label}</span></div>
      <div class="identity-home" aria-hidden="true"></div>
      <div class="page-stage"><section id="chapter" tabindex="-1" aria-label="${sections[0].label}"></section></div>
      <div class="subnav" hidden>
        <div id="subnav-label"></div>
        <div class="subnav-buttons"><button id="previous-page" class="arrow" aria-label="${ui.previousPage}">${arrow(-1)}</button><button id="next-page" class="arrow" aria-label="${ui.nextPage}">${arrow(1)}</button></div>
      </div>
      <footer class="footer"><address class="contacts"><a href="tel:${identity.phone}"><span aria-hidden="true">↗</span>${identity.phone}</a><a href="mailto:${identity.email}"><span aria-hidden="true">✉</span>${identity.email}</a><span><span aria-hidden="true">⌖</span>${identity.address}</span></address></footer>
    </main>`,
    identity: `<div class="identity"><div class="identity-name">${identity.name}</div><div class="identity-role">.NET DEVELOPER</div></div>`,
    status: '<p class="sr-only" role="status" id="announcement"></p>',
  };
}
