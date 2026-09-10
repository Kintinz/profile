import { getIconSvg } from '../utils/icons.js';
import confetti from 'canvas-confetti';

/**
 * NeonMemoryMatrix - Expanded Edition
 * Hỗ trợ 4 cấp độ từ 16 đến 48 thẻ (4x4, 6x4, 6x6, 8x6),
 * thư viện 28 biểu tượng công nghệ, tính năng quét hé lộ (Peek scan),
 * hệ số nhân combo điểm và sửa triệt để lỗi chữ lật ngược.
 */
export class MemoryMatrix {
  constructor(container, soundManager, onComplete) {
    this.container = container;
    this.sound = soundManager;
    this.onComplete = onComplete;

    this.cards = [];
    this.flippedCards = [];
    this.matchedPairs = 0;
    this.moves = 0;
    this.timer = 0;
    this.timerInterval = null;
    this.isLocked = false;
    this.isPaused = false;
    this.combo = 1;
    this.score = 0;
    this.peeksRemaining = 3;
    this.isPeeking = false;

    // Cấu hình các cấp độ (Cols x Rows)
    this.difficulty = 'medium'; // easy (4x4), medium (6x4), hard (6x6), hacker (8x6)
    this.modes = {
      easy:   { cols: 4, rows: 4, total: 16, pairs: 8,  name: '4x4 (16 Thẻ)' },
      medium: { cols: 6, rows: 4, total: 24, pairs: 12, name: '6x4 (24 Thẻ)' },
      hard:   { cols: 6, rows: 6, total: 36, pairs: 18, name: '6x6 (36 Thẻ)' },
      hacker: { cols: 8, rows: 6, total: 48, pairs: 24, name: '8x6 (48 Thẻ // Cực Đại)' }
    };

    // Thư viện 28 biểu tượng công nghệ phong phú
        // Thư viện 28 biểu tượng công nghệ chuyên nghiệp với SVG Lucide & Neon Palette
    this.symbolsPool = [
      { icon: 'atom', name: 'React', color: '#06b6d4' },
      { icon: 'box', name: 'Three.js', color: '#38bdf8' },
      { icon: 'server', name: 'Node.js', color: '#22c55e' },
      { icon: 'file-code', name: 'Python', color: '#eab308' },
      { icon: 'shield-check', name: 'Security', color: '#ef4444' },
      { icon: 'key-round', name: 'Cipher', color: '#a855f7' },
      { icon: 'terminal', name: 'Terminal', color: '#10b981' },
      { icon: 'rocket', name: 'Deploy', color: '#f97316' },
      { icon: 'cpu', name: '.NET Core', color: '#6366f1' },
      { icon: 'shield', name: 'Angular', color: '#ef4444' },
      { icon: 'database', name: 'SQL Server', color: '#0ea5e9' },
      { icon: 'code-2', name: 'TypeScript', color: '#3b82f6' },
      { icon: 'zap', name: 'SignalR', color: '#f59e0b' },
      { icon: 'monitor', name: 'Electron', color: '#06b6d4' },
      { icon: 'boxes', name: 'Docker', color: '#0284c7' },
      { icon: 'git-branch', name: 'Git', color: '#f43f5e' },
      { icon: 'layout', name: 'Vue.js', color: '#10b981' },
      { icon: 'leaf', name: 'MongoDB', color: '#22c55e' },
      { icon: 'sparkles', name: 'Vite', color: '#ec4899' },
      { icon: 'palette', name: 'Tailwind', color: '#06b6d4' },
      { icon: 'database', name: 'Redis', color: '#dc2626' },
      { icon: 'lock', name: 'JWT Auth', color: '#8b5cf6' },
      { icon: 'network', name: 'Microservices', color: '#14b8a6' },
      { icon: 'webhook', name: 'WebAPI', color: '#6366f1' },
      { icon: 'workflow', name: 'CI/CD', color: '#10b981' },
      { icon: 'layers', name: 'Clean Arch', color: '#3b82f6' },
      { icon: 'activity', name: 'High Load', color: '#f59e0b' },
      { icon: 'cloud', name: 'Cloud AWS', color: '#0284c7' }
    ];

    this.render();
  }

  render() {
    this.container.innerHTML = `
      <div class="flex flex-col items-center w-full max-w-4xl mx-auto font-sans">
        <!-- Control HUD -->
        <div class="w-full bg-slate-950/80 border border-purple-500/30 rounded-2xl p-4 sm:p-5 mb-4 shadow-2xl backdrop-blur-md">
          <!-- Level selector row -->
          <div class="flex flex-wrap items-center justify-between gap-3 border-b border-purple-500/20 pb-3 mb-3 text-xs">
            <div class="flex items-center gap-2">
              <span class="text-slate-400 font-bold text-[11px] tracking-wider uppercase">CẤP ĐỘ:</span>
              <div class="flex flex-wrap items-center gap-1.5" id="matrix-mode-buttons">
                <button data-mode="easy" class="mode-btn px-3 py-1.5 rounded-full text-xs font-bold transition-all border border-slate-800 bg-slate-900/90 text-slate-400 hover:text-white hover:border-purple-500/40">
                  4x4 (16 Thẻ)
                </button>
                <button data-mode="medium" class="mode-btn px-3.5 py-1.5 rounded-full text-xs font-bold transition-all bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-[0_0_12px_rgba(168,85,247,0.4)] border border-purple-400/50">
                  6x4 (24 Thẻ)
                </button>
                <button data-mode="hard" class="mode-btn px-3 py-1.5 rounded-full text-xs font-bold transition-all border border-slate-800 bg-slate-900/90 text-slate-400 hover:text-white hover:border-purple-500/40">
                  6x6 (36 Thẻ)
                </button>
                <button data-mode="hacker" class="mode-btn px-3 py-1.5 rounded-full text-xs font-bold transition-all border border-amber-500/40 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20">
                  👑 8x6 (48 Thẻ)
                </button>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <button id="btn-matrix-peek" class="px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30 text-xs font-bold transition-all flex items-center gap-1 shadow-sm">
                <span class="flex items-center gap-1.5">${getIconSvg('eye', 'w-3.5 h-3.5')} <span>Soi Bài (<span id="peek-count">3</span>)</span></span>
              </button>
              <button id="btn-pause-matrix" class="px-3 py-1.5 rounded-xl bg-slate-900/90 border border-purple-500/30 hover:bg-purple-500/20 text-purple-300 font-bold transition-all flex items-center gap-1 text-xs">
                <span class="flex items-center gap-1.5">${getIconSvg('pause', 'w-3.5 h-3.5')} <span>Tạm Dừng</span></span>
              </button>
              <button id="btn-restart-matrix" class="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-bold border border-cyan-500/30 transition-all flex items-center gap-1 text-xs">
                <span class="flex items-center gap-1.5">${getIconSvg('rotate-ccw', 'w-3.5 h-3.5')} <span>Reset ↻</span></span>
              </button>
            </div>
          </div>

          <!-- Stats row with LCD display -->
          <div class="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div class="flex flex-wrap items-center gap-3 sm:gap-4">
              <div class="bg-slate-900/80 px-3 py-1.5 rounded-xl border border-cyan-500/30 flex items-center gap-2 shadow-inner">
                <span class="text-slate-400 text-[10px] font-bold">THỜI GIAN</span>
                <span id="matrix-timer" class="digital-lcd font-bold text-cyan-300 text-base tracking-wider">00:00</span>
              </div>
              <div class="bg-slate-900/80 px-3 py-1.5 rounded-xl border border-amber-500/30 flex items-center gap-2 shadow-inner">
                <span class="text-slate-400 text-[10px] font-bold">SỐ BƯỚC</span>
                <span id="matrix-moves" class="digital-lcd font-bold text-amber-300 text-base tracking-wider">0</span>
              </div>
              <div class="bg-slate-900/80 px-3 py-1.5 rounded-xl border border-emerald-500/30 flex items-center gap-2 shadow-inner">
                <span class="text-slate-400 text-[10px] font-bold">TIẾN ĐỘ</span>
                <span id="matrix-pairs" class="digital-lcd font-bold text-emerald-300 text-base tracking-wider">0 / 12</span>
              </div>
            </div>
            <div class="flex flex-wrap items-center gap-3 sm:gap-4">
              <div class="bg-slate-900/80 px-3 py-1.5 rounded-xl border border-fuchsia-500/30 flex items-center gap-2 shadow-inner">
                <span class="text-slate-400 text-[10px] font-bold">COMBO</span>
                <span id="matrix-combo" class="digital-lcd font-bold text-fuchsia-300 text-base tracking-wider">🔥 1x</span>
              </div>
              <div class="bg-slate-900/80 px-3.5 py-1.5 rounded-xl border border-purple-500/40 flex items-center gap-2 shadow-inner">
                <span class="text-slate-400 text-[10px] font-bold">TỔNG ĐIỂM</span>
                <span id="matrix-score" class="digital-lcd font-bold text-purple-300 text-base tracking-wider">0</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Matrix Card Grid Container with Corner Brackets & Scanlines -->
        <div class="relative w-full rounded-3xl p-1 group">
          <div class="corner-bracket corner-bracket-tl border-purple-400"></div>
          <div class="corner-bracket corner-bracket-tr border-purple-400"></div>
          <div class="corner-bracket corner-bracket-bl border-purple-400"></div>
          <div class="corner-bracket corner-bracket-br border-purple-400"></div>
          <div class="scanline-overlay pointer-events-none rounded-3xl"></div>

          <!-- Pause Overlay -->
          <div id="matrix-pause-overlay" class="hidden absolute inset-0 z-30 bg-slate-950/95 backdrop-blur-md rounded-3xl flex flex-col items-center justify-center gap-3 p-6 text-center animate-fade-in border border-purple-500/40">
            <div class="w-14 h-14 rounded-2xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-300 shadow-xl shadow-purple-500/20">${getIconSvg('pause', 'w-7 h-7', 28)}</div>
            <h4 class="text-lg font-bold text-purple-300 tracking-wider">TRÒ CHƠI ĐANG TẠM DỪNG</h4>
            <p class="text-xs text-slate-300 max-w-sm font-sans">Đồng hồ giải đố đã tạm khóa. Toàn bộ thẻ bài được che chắn an toàn để đảm bảo tính công bằng.</p>
            <div class="flex items-center gap-3 mt-3">
              <button id="btn-matrix-modal-resume" class="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xs hover:from-purple-500 hover:to-pink-500 transition-all shadow-lg shadow-purple-500/30 flex items-center gap-1.5">
                <span class="flex items-center gap-1.5">${getIconSvg('play', 'w-3.5 h-3.5 fill-current')} <span>TIẾP TỤC GIẢI MÃ</span></span>
              </button>
              <button id="btn-matrix-modal-reset" class="px-5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:text-white font-bold text-xs transition-all flex items-center gap-1.5">
                <span class="flex items-center gap-1.5">${getIconSvg('rotate-ccw', 'w-3.5 h-3.5')} <span>LÀM MỚI BÀN CỜ</span></span>
              </button>
            </div>
          </div>

          <!-- The Grid Element -->
          <div id="matrix-grid" class="w-full gap-2 sm:gap-3 p-3 bg-slate-950/70 rounded-3xl border border-purple-500/20 shadow-inner relative z-10"></div>
        </div>
      </div>
    `;

    this.bindEvents();
    this.start();
  }

  bindEvents() {
    const restartBtn = this.container.querySelector('#btn-restart-matrix');
    const pauseBtn = this.container.querySelector('#btn-pause-matrix');
    const modalResume = this.container.querySelector('#btn-matrix-modal-resume');
    const modalReset = this.container.querySelector('#btn-matrix-modal-reset');
    const peekBtn = this.container.querySelector('#btn-matrix-peek');

    if (restartBtn) restartBtn.addEventListener('click', () => { this.sound.playClick(600); this.reset(); });
    if (pauseBtn) pauseBtn.addEventListener('click', () => {
      this.sound.playClick(500);
      this.togglePause();
      pauseBtn.innerHTML = this.isPaused
        ? `<span class="inline-flex items-center gap-1">${getIconSvg('play', 'w-3.5 h-3.5')} Tiếp Tục</span>`
        : `<span class="inline-flex items-center gap-1">${getIconSvg('pause', 'w-3.5 h-3.5')} Tạm Dừng</span>`;
    });
    if (modalResume) modalResume.addEventListener('click', () => {
      this.sound.playClick(500);
      this.resume();
      if (pauseBtn) pauseBtn.innerHTML = `<span class="inline-flex items-center gap-1">${getIconSvg('pause', 'w-3.5 h-3.5')} Tạm Dừng</span>`;
    });
    if (modalReset) modalReset.addEventListener('click', () => {
      this.sound.playClick(600);
      this.reset();
      if (pauseBtn) pauseBtn.innerHTML = `<span class="inline-flex items-center gap-1">${getIconSvg('pause', 'w-3.5 h-3.5')} Tạm Dừng</span>`;
    });

    if (peekBtn) {
      peekBtn.addEventListener('click', () => this.triggerPeek());
    }

    // Difficulty switch buttons
    const modeBtns = this.container.querySelectorAll('.mode-btn');
    modeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const mode = btn.dataset.mode;
        if (mode && this.modes[mode]) {
          this.sound.playClick(600);
          this.difficulty = mode;

          modeBtns.forEach(b => {
            b.className = 'mode-btn px-3 py-1.5 rounded-full text-xs font-bold transition-all border border-slate-800 bg-slate-900/90 text-slate-400 hover:text-white hover:border-purple-500/40';
          });
          btn.className = 'mode-btn px-3.5 py-1.5 rounded-full text-xs font-bold transition-all bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-[0_0_12px_rgba(168,85,247,0.4)] border border-purple-400/50 scale-105';

          this.reset();
        }
      });
    });
  }

  triggerPeek() {
    if (this.isPeeking || this.isLocked || this.isPaused || this.peeksRemaining <= 0) return;
    this.peeksRemaining--;
    this.isPeeking = true;
    this.sound.playLaser();

    const peekCountEl = this.container.querySelector('#peek-count');
    if (peekCountEl) peekCountEl.textContent = this.peeksRemaining.toString();

    // Flip all unmatched cards temporarily
    const inners = this.container.querySelectorAll('.card-inner');
    inners.forEach(el => el.classList.add('rotate-y-180'));

    setTimeout(() => {
      // Flip back all cards that are not yet matched
      this.cards.forEach((c, idx) => {
        if (!c.isMatched && !c.isFlipped) {
          if (inners[idx]) inners[idx].classList.remove('rotate-y-180');
        }
      });
      this.isPeeking = false;
    }, 1500);
  }

  start() {
    this.flippedCards = [];
    this.matchedPairs = 0;
    this.moves = 0;
    this.timer = 0;
    this.combo = 1;
    this.score = 0;
    this.peeksRemaining = 3;
    this.isLocked = false;
    this.isPaused = false;
    this.isPeeking = false;
    clearInterval(this.timerInterval);

    const peekCountEl = this.container.querySelector('#peek-count');
    if (peekCountEl) peekCountEl.textContent = '3';

    const currentMode = this.modes[this.difficulty];
    const pairCount = currentMode.pairs;

    // Pick unique symbols for this round
    const shuffledPool = [...this.symbolsPool].sort(() => Math.random() - 0.5);
    const chosenSymbols = shuffledPool.slice(0, pairCount);

    // Duplicate to make pairs and shuffle
    const deck = [...chosenSymbols, ...chosenSymbols]
      .sort(() => Math.random() - 0.5)
      .map((item, id) => ({
        id: id,
        name: item.name,
        icon: item.icon,
        color: item.color,
        isFlipped: false,
        isMatched: false
      }));

    this.cards = deck;

    // Update Grid layout styling dynamically
    const grid = this.container.querySelector('#matrix-grid');
    if (!grid) return;

    // Grid CSS class based on columns
    grid.className = `grid gap-2 sm:gap-3 p-3 bg-slate-950/70 rounded-3xl border border-purple-500/20 shadow-inner w-full relative z-10`;
    if (currentMode.cols === 4) grid.classList.add('grid-cols-4');
    else if (currentMode.cols === 6) grid.classList.add('grid-cols-4', 'sm:grid-cols-6');
    else if (currentMode.cols === 8) grid.classList.add('grid-cols-4', 'sm:grid-cols-8');

    grid.innerHTML = '';

    deck.forEach(card => {
      const cardEl = document.createElement('div');
      cardEl.className = 'matrix-card relative cursor-pointer select-none rounded-2xl perspective-1000 aspect-square';
      cardEl.dataset.id = card.id;

      cardEl.innerHTML = `
        <div class="card-inner w-full h-full duration-300 transform-style-3d relative rounded-2xl border border-white/10 shadow-lg transition-transform">
          <!-- Back of card (visible initially) -->
          <div class="card-back absolute inset-0 bg-slate-900/95 border border-purple-500/30 rounded-2xl flex flex-col items-center justify-center hover:border-purple-400 hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-all backface-hidden shadow-inner">
            <div class="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-1">
              ${getIconSvg('cpu', 'w-5 h-5 text-purple-400', 20)}
            </div>
            <span class="text-[9px] sm:text-[10px] text-slate-400 font-mono font-bold tracking-wider">MATRIX</span>
          </div>
          <!-- Front of card (visible when flipped, text upright) -->
          <div class="card-front absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-emerald-400/60 rounded-2xl flex flex-col items-center justify-center rotate-y-180 backface-hidden p-1.5 text-center shadow-2xl">
            <div class="w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center mb-1" style="background-color: ${card.color}18; border: 1px solid ${card.color}44; color: ${card.color};">
              ${getIconSvg(card.icon, 'w-5 h-5 sm:w-6 sm:h-6', 24)}
            </div>
            <span class="text-[9px] sm:text-[11px] font-mono font-bold truncate max-w-full px-1" style="color: ${card.color}">${card.name}</span>
          </div>
        </div>
      `;

      cardEl.addEventListener('click', () => this.handleCardClick(card, cardEl));
      grid.appendChild(cardEl);
    });

    this.updateStats();

    this.timerInterval = setInterval(() => {
      if (!this.isPaused) {
        this.timer++;
        this.updateStats();
      }
    }, 1000);
  }

  handleCardClick(card, cardEl) {
    if (this.isLocked || this.isPaused || this.isPeeking || card.isFlipped || card.isMatched) return;

    this.sound.playClick(440 + this.flippedCards.length * 120);
    card.isFlipped = true;

    const inner = cardEl.querySelector('.card-inner');
    if (inner) inner.classList.add('rotate-y-180');

    this.flippedCards.push({ card, el: cardEl });

    if (this.flippedCards.length === 2) {
      this.moves++;
      this.updateStats();
      this.checkMatch();
    }
  }

  checkMatch() {
    this.isLocked = true;
    const [first, second] = this.flippedCards;

    if (first.card.name === second.card.name) {
      setTimeout(() => {
        this.sound.playSuccess();
        first.card.isMatched = true;
        second.card.isMatched = true;

        const fFront = first.el.querySelector('.card-front');
        const sFront = second.el.querySelector('.card-front');
        if (fFront) fFront.classList.add('border-cyan-400', 'bg-cyan-950/60', 'shadow-lg', 'shadow-cyan-500/20');
        if (sFront) sFront.classList.add('border-cyan-400', 'bg-cyan-950/60', 'shadow-lg', 'shadow-cyan-500/20');

        this.matchedPairs++;
        const currentMode = this.modes[this.difficulty];

        // Combo points
        this.score += 100 * this.combo;
        this.combo++;

        this.flippedCards = [];
        this.isLocked = false;
        this.updateStats();

        if (this.matchedPairs === currentMode.pairs) {
          this.handleVictory();
        }
      }, 300);
    } else {
      setTimeout(() => {
        this.sound.playClick(300);
        first.card.isFlipped = false;
        second.card.isFlipped = false;

        this.combo = 1;

        const fInner = first.el.querySelector('.card-inner');
        const sInner = second.el.querySelector('.card-inner');
        if (fInner) fInner.classList.remove('rotate-y-180');
        if (sInner) sInner.classList.remove('rotate-y-180');

        this.flippedCards = [];
        this.isLocked = false;
        this.updateStats();
      }, 700);
    }
  }

  handleVictory() {
    clearInterval(this.timerInterval);
    confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });

    setTimeout(() => {
      confetti({ particleCount: 100, angle: 60, spread: 55, origin: { x: 0 } });
      confetti({ particleCount: 100, angle: 120, spread: 55, origin: { x: 1 } });
    }, 300);

    if (this.onComplete) {
      this.onComplete(this.moves, this.timer, this.score, this.difficulty);
    }
  }

  updateStats() {
    const timerEl = this.container.querySelector('#matrix-timer');
    const movesEl = this.container.querySelector('#matrix-moves');
    const pairsEl = this.container.querySelector('#matrix-pairs');
    const comboEl = this.container.querySelector('#matrix-combo');
    const scoreEl = this.container.querySelector('#matrix-score');

    const currentMode = this.modes[this.difficulty];

    if (timerEl) {
      const mins = Math.floor(this.timer / 60).toString().padStart(2, '0');
      const secs = (this.timer % 60).toString().padStart(2, '0');
      timerEl.textContent = `${mins}:${secs}`;
    }
    if (movesEl) movesEl.textContent = this.moves.toString();
    if (pairsEl) pairsEl.textContent = `${this.matchedPairs} / ${currentMode.pairs}`;
    if (comboEl) comboEl.textContent = `🔥 ${this.combo}x`;
    if (scoreEl) scoreEl.textContent = this.score.toString();
  }

  pause() {
    if (this.isPaused) return false;
    this.isPaused = true;
    clearInterval(this.timerInterval);
    const pauseEl = this.container.querySelector('#matrix-pause-overlay');
    if (pauseEl) pauseEl.classList.remove('hidden');
    return true;
  }

  resume() {
    if (!this.isPaused) return false;
    this.isPaused = false;
    const pauseEl = this.container.querySelector('#matrix-pause-overlay');
    if (pauseEl) pauseEl.classList.add('hidden');
    this.timerInterval = setInterval(() => {
      this.timer++;
      this.updateStats();
    }, 1000);
    return true;
  }

  togglePause() {
    if (this.isPaused) {
      this.resume();
      return false;
    } else {
      this.pause();
      return true;
    }
  }

  reset() {
    this.isPaused = false;
    const pauseEl = this.container.querySelector('#matrix-pause-overlay');
    if (pauseEl) pauseEl.classList.add('hidden');
    this.start();
  }
}
