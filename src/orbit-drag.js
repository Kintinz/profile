const step = 36;
export const clampRotation = rotation => Math.max(-4 * step, Math.min(0, rotation)) || 0;
export const rotationForSection = section => clampRotation(-section * step);
export const sectionForRotation = rotation => Math.round(-clampRotation(rotation) / step) || 0;
export const pointerAngle = (x, y, centerX, centerY) => Math.atan2(y - centerY, x - centerX) * 180 / Math.PI;
export const angularDelta = (from, to) => (to - from + 540) % 360 - 180;

export class OrbitDrag {
  constructor({ element, getCenter, getRotation, isBusy, preview, commit, tap, cancel }) {
    Object.assign(this, { element, getCenter, getRotation, isBusy, preview, commit, tap, onCancel: cancel });
    this.pointer = null;
    this.frame = 0;
    this.handlers = {
      pointerdown: event => this.down(event),
      pointermove: event => this.move(event),
      pointerup: event => this.up(event),
      pointercancel: event => { if (event.pointerId === this.pointer?.id) this.cancel(); },
      lostpointercapture: event => { if (event.target === element && event.pointerId === this.pointer?.id) this.cancel(); },
    };
    for (const [type, handler] of Object.entries(this.handlers)) element.addEventListener(type, handler);
    this.captureClick = event => {
      // Pointer taps are handled on release; keyboard/assistive clicks have detail 0.
      if (event.detail > 0) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    };
    element.addEventListener('click', this.captureClick, true);
  }

  down(event) {
    if (!event.isPrimary) { this.cancel(); return; }
    if (event.button !== 0) return;
    const center = this.getCenter();
    if (Math.hypot(event.clientX - center.x, event.clientY - center.y) < 12) return;
    this.pointer = { id: event.pointerId, x: event.clientX, y: event.clientY, center, angle: pointerAngle(event.clientX, event.clientY, center.x, center.y), dragging: false, moved: false, blocked: this.isBusy(), section: event.target.closest('[data-section]')?.dataset.section };
    this.rotation = this.getRotation();
  }

  move(event) {
    const pointer = this.pointer;
    if (!pointer || event.pointerId !== pointer.id) return;
    if (!pointer.dragging) {
      if (Math.hypot(event.clientX - pointer.x, event.clientY - pointer.y) < 6) return;
      pointer.moved = true;
      if (pointer.blocked) return;
      pointer.dragging = true;
      this.element.classList.add('is-dragging');
      this.element.setPointerCapture(pointer.id);
    }
    event.preventDefault();
    const angle = pointerAngle(event.clientX, event.clientY, pointer.center.x, pointer.center.y);
    this.rotation = clampRotation(this.rotation + angularDelta(pointer.angle, angle));
    pointer.angle = angle;
    if (!this.frame) this.frame = requestAnimationFrame(() => { this.frame = 0; this.preview(this.rotation); });
  }

  up(event) {
    if (!this.pointer || event.pointerId !== this.pointer.id) return;
    const dragging = this.pointer.dragging;
    if (dragging) {
      this.move(event);
      if (this.frame) cancelAnimationFrame(this.frame);
      this.frame = 0;
      this.preview(this.rotation);
      // Flush the final finger position before enabling the snap transition.
      void this.element.offsetWidth;
      event.preventDefault();
    }
    const pointer = this.pointer;
    this.pointer = null;
    this.element.classList.remove('is-dragging');
    if (this.element.hasPointerCapture(pointer.id)) this.element.releasePointerCapture(pointer.id);
    event.preventDefault();
    if (dragging) this.commit(sectionForRotation(this.rotation));
    else if (!pointer.moved && Math.hypot(event.clientX - pointer.x, event.clientY - pointer.y) < 6 && pointer.section !== undefined) this.tap(Number(pointer.section));
  }

  cancel(notify = true) {
    const pointer = this.pointer;
    this.pointer = null;
    if (this.frame) cancelAnimationFrame(this.frame);
    this.frame = 0;
    this.element.classList.remove('is-dragging');
    if (pointer && this.element.hasPointerCapture(pointer.id)) this.element.releasePointerCapture(pointer.id);
    if (pointer && notify) this.onCancel();
  }

  destroy() {
    this.cancel(false);
    for (const [type, handler] of Object.entries(this.handlers)) this.element.removeEventListener(type, handler);
    this.element.removeEventListener('click', this.captureClick, true);
  }
}
