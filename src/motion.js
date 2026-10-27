const easing = 'cubic-bezier(.22,1,.36,1)';

export class ProfileMotion {
  constructor(preference) {
    this.preference = preference;
    this.active = new Set();
  }

  play(element, frames, options) {
    if (!element || this.preference.matches) return null;
    const animation = element.animate(frames, { easing, ...options });
    this.active.add(animation);
    animation.finished.catch(() => {}).finally(() => this.active.delete(animation));
    return animation;
  }

  cancel(element, subtree = false) {
    element.getAnimations({ subtree }).forEach(animation => animation.cancel());
  }

  stop() {
    this.active.forEach(animation => animation.cancel());
    this.active.clear();
  }

  reveal(chapter, delay = 60) {
    const elements = chapter.querySelectorAll('h2, .page-content > h3, .page-content > .period, .project-facts, .description, .work-list li, .result, .tech, .about-copy > *, .skill-group > *, .education > *');
    elements.forEach((element, index) => this.play(element, [
      { opacity: 0, transform: 'translateY(9px)' },
      { opacity: 1, transform: 'translateY(0)' },
    ], { duration: 350, delay: delay + Math.min(index * 32, 160), fill: 'backwards' }));
  }

  enter(identity, orbit, chapter, marker, footer) {
    const transform = getComputedStyle(orbit).transform;
    const base = transform === 'none' ? '' : transform;
    this.play(orbit, [
      { opacity: 0, transform: `translateX(-14px) scale(.96) ${base}` },
      { opacity: 1, transform: `translateX(0) scale(1) ${base}` },
    ], { duration: 640 });
    this.play(identity, [
      { opacity: 0, transform: 'translateY(16px)' },
      { opacity: 1, transform: 'translateY(0)' },
    ], { duration: 620, delay: 60, fill: 'backwards' });
    [marker, footer].forEach((element, index) => this.play(element, [
      { opacity: 0, transform: 'translateY(6px)' },
      { opacity: 1, transform: 'translateY(0)' },
    ], { duration: 420, delay: 140 + index * 70, fill: 'backwards' }));
    this.reveal(chapter, 220);
  }

  pulse(button) {
    const ripple = button.querySelector('.orbit-ripple');
    this.cancel(ripple);
    this.play(ripple, [
      { opacity: .65, transform: 'scale(1)' },
      { opacity: 0, transform: 'scale(2.7)' },
    ], { duration: 520 });
  }
}
