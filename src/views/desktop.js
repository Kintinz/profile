import { sharedMarkup } from './shared.js';
import { orbitAngles } from '../navigation.js';

export class DesktopView {
  kind = 'desktop';

  render(context) {
    const parts = sharedMarkup(context);
    return `<div class="sheet" data-layout="desktop">${parts.header}<nav class="chapter-navigation orbit" aria-label="${context.ui.navigation}">${parts.orbit}</nav>${parts.main}${parts.identity}${parts.status}</div>`;
  }

  mount({ sheet }) { this.sheet = sheet; }

  setSection(section) {
    this.sheet.querySelector('.orbit-ticks').style.transform = `rotate(${section * -32}deg)`;
    orbitAngles(section).forEach((angle, index) => {
      const item = this.sheet.querySelector(`[data-section="${index}"]`);
      item.style.setProperty('--angle', `${angle}deg`);
      item.style.setProperty('--counter-angle', `${-angle}deg`);
    });
  }

  cancelDrag() {}
  destroy() {}
}
