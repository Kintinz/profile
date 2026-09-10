/**
 * KonamiCode - Easter Egg kích hoạt Ma Trận Mưa Ký Tự
 * Chuỗi phím: ↑ ↑ ↓ ↓ ← → ← → B A
 */
export class KonamiCode {
  constructor(achievementsManager, soundManager) {
    this.achievements = achievementsManager;
    this.sound = soundManager;
    this.sequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    this.inputIndex = 0;

    this.init();
  }

  init() {
    window.addEventListener('keydown', (e) => {
      const key = e.key;
      const expected = this.sequence[this.inputIndex];

      if (key.toLowerCase() === expected.toLowerCase()) {
        this.inputIndex++;
        this.sound.playClick(400 + this.inputIndex * 80);

        if (this.inputIndex === this.sequence.length) {
          this.triggerMatrixRain();
          this.inputIndex = 0;
        }
      } else {
        this.inputIndex = 0;
      }
    });
  }

  triggerMatrixRain() {
    this.sound.playSuccess();
    this.achievements.unlock('konami_god', 'The Matrix Awakened', 'Bạn đã nhập mã Konami thần thánh để giải phóng Ma Trận!', 'glasses');

    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 z-50 pointer-events-auto bg-black/90 flex flex-col items-center justify-center animate-fade-in';

    const canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.className = 'absolute inset-0';
    overlay.appendChild(canvas);

    const closeBtn = document.createElement('button');
    closeBtn.className = 'absolute top-6 right-6 z-10 px-5 py-2.5 rounded-2xl bg-emerald-500 text-slate-950 font-mono font-bold shadow-2xl hover:scale-105 active:scale-95 transition-all';
    closeBtn.textContent = 'THOÁT MA TRẬN [ESC]';
    overlay.appendChild(closeBtn);

    document.body.appendChild(overlay);

    const ctx = canvas.getContext('2d');
    const cols = Math.floor(canvas.width / 20);
    const ypos = Array(cols).fill(0);

    const matrixInterval = setInterval(() => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#10b981';
      ctx.font = '15pt monospace';

      ypos.forEach((y, ind) => {
        const text = String.fromCharCode(Math.random() * 128);
        const x = ind * 20;
        ctx.fillText(text, x, y);
        if (y > 100 + Math.random() * 10000) ypos[ind] = 0;
        else ypos[ind] = y + 20;
      });
    }, 45);

    const closeMatrix = () => {
      clearInterval(matrixInterval);
      overlay.remove();
    };

    closeBtn.addEventListener('click', closeMatrix);
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMatrix();
    }, { once: true });
  }
}
