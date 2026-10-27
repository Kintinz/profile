export function isVerticalWheel(event) {
  return !event.ctrlKey && !event.metaKey && !event.altKey && !event.shiftKey
    && event.deltaY !== 0 && Math.abs(event.deltaY) > Math.abs(event.deltaX);
}

export class WheelGesture {
  constructor() {
    this.lastTime = -Infinity;
    this.amount = 0;
    this.consumed = false;
  }

  read(event, now, busy = false, pageHeight = 800) {
    if (!isVerticalWheel(event)) return 0;
    if (now - this.lastTime > 180) {
      this.amount = 0;
      this.consumed = false;
    }
    this.lastTime = now;
    if (busy) this.consumed = true;
    if (this.consumed) return 0;

    const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? pageHeight : 1);
    if (Math.sign(delta) !== Math.sign(this.amount)) this.amount = 0;
    this.amount += delta;
    if (Math.abs(this.amount) < 60) return 0;
    this.consumed = true;
    return Math.sign(this.amount);
  }
}
