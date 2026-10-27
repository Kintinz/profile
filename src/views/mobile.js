import './mobile.css';
import { sharedMarkup } from './shared.js';
import { OrbitDrag, clampRotation, rotationForSection } from '../orbit-drag.js';

export class MobileView {
  kind = 'mobile';
  get dragging() { return Boolean(this.drag.pointer?.dragging); }

  render(context) {
    const parts = sharedMarkup(context);
    return `<div class="sheet" data-layout="mobile">${parts.header}${parts.main}<nav class="chapter-navigation mobile-dock" aria-label="${context.ui.navigation}" aria-describedby="orbit-help"><span class="mobile-selection-marker" aria-hidden="true"></span><div class="orbit">${parts.orbit}</div></nav><p class="sr-only" id="orbit-help">${context.ui.dragHint}</p>${parts.identity}${parts.status}</div>`;
  }

  mount({ sheet, onSelect, getSection, isBusy }) {
    this.sheet = sheet;
    this.orbit = sheet.querySelector('.orbit');
    this.disc = sheet.querySelector('.orbit-disc');
    this.drag = new OrbitDrag({
      element: sheet.querySelector('.mobile-dock'),
      getCenter: () => { const rect = this.orbit.getBoundingClientRect(); return { x: rect.left, y: rect.top }; },
      getRotation: () => {
        const matrix = new DOMMatrixReadOnly(getComputedStyle(this.disc).transform);
        return clampRotation(Math.atan2(matrix.b, matrix.a) * 180 / Math.PI);
      },
      isBusy,
      preview: rotation => this.applyRotation(rotation),
      commit: section => { this.setSection(section); onSelect(section); },
      tap: section => sheet.querySelector(`[data-section="${section}"]`).click(),
      cancel: () => this.setSection(getSection()),
    });
  }

  applyRotation(rotation) {
    this.disc.style.transform = `rotate(${rotation}deg)`;
    this.orbit.dataset.rotation = String(rotation);
    this.sheet.querySelector('.orbit-ticks').style.transform = 'rotate(0deg)';
    this.sheet.querySelectorAll('[data-section]').forEach((item, index) => {
      const angle = -90 + index * 36 + rotation;
      const visible = angle >= -162.01 && angle <= -17.99;
      item.style.setProperty('--angle', `${angle}deg`);
      item.style.setProperty('--counter-angle', `${-angle}deg`);
      item.classList.toggle('is-off-arc', !visible);
      item.setAttribute('aria-hidden', String(!visible));
      item.tabIndex = visible ? 0 : -1;
    });
  }

  setSection(section) {
    this.drag.cancel(false);
    this.applyRotation(rotationForSection(section));
  }

  cancelDrag() { this.drag.cancel(); }
  destroy() { this.drag.destroy(); }
}
