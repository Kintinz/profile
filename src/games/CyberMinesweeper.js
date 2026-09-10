/**
 * CyberMinesweeper.js - Quantum Core Minesweeper
 * Dò quét vi mạch và vô hiệu hóa mìn EMP lượng tử trên ma trận mạng.
 * Hỗ trợ chế độ gắn cờ (Flag Mode toggle) trên di động, chống nổ ở nước đi đầu tiên,
 * tính thời gian thực, lưu kỷ lục tốc độ và hiệu ứng hạt âm thanh.
 */
export class CyberMinesweeper {
  constructor(container, soundManager, onScoreUpdate, onGameOver) {
    this.container = typeof container === 'string' ? document.getElementById(container) : container;
    this.sound = soundManager;
    this.onScoreUpdate = onScoreUpdate;
    this.onGameOver = onGameOver;

    this.difficulty = 'easy'; // 'easy' (8x8, 10 mines), 'medium' (10x10, 16 mines)
    this.rows = 8;
    this.cols = 8;
    this.minesCount = 10;
    this.flagsLeft = 10;
    this.time = 0;
    this.timerInterval = null;

    this.grid = [];
    this.isFirstClick = true;
    this.isOver = false;
    this.isWon = false;
    this.isPaused = false;
    this.flagMode = false; // Dành cho di động không có chuột phải

    this.bestTime = parseInt(localStorage.getItem('cyber_mines_best') || '999', 10);

    this.initDOM();
    this.initEvents();
    this.start();
  }

  initDOM() {
    this.container.innerHTML = `
      <div class="cyber-mines-root max-w-md mx-auto p-4 sm:p-6 bg-slate-900/90 rounded-3xl border border-emerald-500/40 shadow-2xl backdrop-blur-2xl select-none">
        <!-- Top status bar -->
        <div class="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-emerald-500/20">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 flex items-center justify-center text-xl shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              <i data-lucide="shield-alert" class="w-6 h-6 text-emerald-400"></i>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <span class="font-black text-white text-base tracking-wide code-font">QUANTUM MINES</span>
                <span class="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold border border-emerald-500/30">CORE</span>
              </div>
              <span class="text-[11px] text-slate-400 code-font">Dò Quét Vi Mạch Lượng Tử</span>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <div class="bg-slate-950/90 border border-rose-500/40 px-2.5 py-1.5 rounded-2xl text-center min-w-[58px] shadow-[0_0_15px_rgba(244,63,94,0.15)]">
              <span class="text-[9px] text-rose-400/80 uppercase font-bold block">MINES</span>
              <span id="mines-flag-count" class="digital-lcd text-base font-black text-rose-400 tracking-wider">10</span>
            </div>
            <div class="bg-slate-950/90 border border-amber-500/40 px-2.5 py-1.5 rounded-2xl text-center min-w-[58px] shadow-[0_0_15px_rgba(245,158,11,0.15)]">
              <span class="text-[9px] text-amber-400/80 uppercase font-bold block">TIME</span>
              <span id="mines-timer" class="digital-lcd text-base font-black text-amber-300 tracking-wider">000</span>
            </div>
            <div class="bg-slate-950/90 border border-cyan-500/40 px-2.5 py-1.5 rounded-2xl text-center min-w-[58px] shadow-[0_0_15px_rgba(6,182,212,0.15)]">
              <span class="text-[9px] text-cyan-400/80 uppercase font-bold block">BEST</span>
              <span id="mines-best" class="digital-lcd text-base font-black text-cyan-300 tracking-wider">${this.bestTime === 999 ? '--' : this.bestTime + 's'}</span>
            </div>
          </div>
        </div>

        <!-- Controls Toolbar -->
        <div class="flex items-center justify-between mb-3 text-xs code-font">
          <!-- Size Selector -->
          <div class="flex items-center gap-1.5">
            <button data-diff="easy" class="mines-diff-btn px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold active:scale-95 transition-all">
              8x8 (Dễ)
            </button>
            <button data-diff="medium" class="mines-diff-btn px-3 py-1.5 rounded-xl bg-slate-950 text-slate-400 border border-white/10 hover:text-white font-bold active:scale-95 transition-all">
              10x10
            </button>
            <button data-diff="hard" class="mines-diff-btn px-3 py-1.5 rounded-xl bg-slate-950 text-slate-400 border border-white/10 hover:text-white font-bold active:scale-95 transition-all">
              12x12
            </button>
          </div>

          <!-- Flag Mode Toggle (Mobile) + Guide + Restart -->
          <div class="flex items-center gap-1.5">
            <button class="btn-open-guide px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/20 font-bold flex items-center gap-1.5 text-xs transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:scale-105 active:scale-95" data-game="mines">
              <i data-lucide="help-circle" class="w-3.5 h-3.5"></i> <span>Hướng Dẫn</span>
            </button>
            <button id="mines-flag-toggle" class="px-2.5 py-1.5 rounded-xl bg-slate-950 border border-white/15 text-slate-300 hover:text-white transition-all flex items-center gap-1 active:scale-95">
              <span id="mines-flag-icon">🚩</span> <span id="mines-flag-text">Mở Ô</span>
            </button>
            <button id="mines-restart-btn" class="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-black hover:scale-105 transition-all shadow-md shadow-emerald-500/20 active:scale-95">
              Ván Mới
            </button>
          </div>
        </div>

        <!-- Grid Board with Corner Brackets -->
        <div class="relative bg-slate-950 p-2 sm:p-2.5 rounded-2xl border border-emerald-500/30 aspect-square flex flex-col justify-between shadow-2xl overflow-hidden" id="mines-board-wrap">
          <div class="corner-bracket-tl border-emerald-400"></div>
          <div class="corner-bracket-tr border-emerald-400"></div>
          <div class="corner-bracket-bl border-emerald-400"></div>
          <div class="corner-bracket-br border-emerald-400"></div>
          <div class="cyber-scanlines absolute inset-0 z-10 opacity-15 pointer-events-none"></div>

          <div id="mines-board" class="grid gap-1 sm:gap-1.5 w-full h-full relative z-0"></div>

          <!-- Overlay Game Over / Win -->
          <div id="mines-overlay" class="hidden absolute inset-0 bg-slate-950/90 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center p-6 text-center z-20">
            <div id="mines-overlay-content"></div>
          </div>
        </div>

        <!-- Hint bar -->
        <p class="text-[11px] text-slate-400 text-center mt-3 code-font">
          Chuột trái / chạm để mở ô. Chuột phải hoặc bật chế độ 🚩 để khóa mìn.
        </p>
      </div>
    `;

    this.boardEl = this.container.querySelector('#mines-board');
    this.flagCountEl = this.container.querySelector('#mines-flag-count');
    this.timerEl = this.container.querySelector('#mines-timer');
    this.bestEl = this.container.querySelector('#mines-best');
    this.flagToggleBtn = this.container.querySelector('#mines-flag-toggle');
    this.flagIconEl = this.container.querySelector('#mines-flag-icon');
    this.flagTextEl = this.container.querySelector('#mines-flag-text');
    this.overlayEl = this.container.querySelector('#mines-overlay');
    this.overlayContent = this.container.querySelector('#mines-overlay-content');
    this.restartBtn = this.container.querySelector('#mines-restart-btn');
    this.diffBtns = this.container.querySelectorAll('.mines-diff-btn');
  }

  initEvents() {
    this.restartBtn?.addEventListener('click', () => {
      this.reset();
    });

    // Chuyển đổi cờ cho thiết bị cảm ứng
    this.flagToggleBtn?.addEventListener('click', () => {
      this.flagMode = !this.flagMode;
      if (this.flagMode) {
        this.flagToggleBtn.className = 'px-2.5 py-1 rounded-xl bg-rose-500/20 border border-rose-500 text-rose-300 transition-all flex items-center gap-1 font-bold';
        this.flagTextEl.innerText = 'Cắm Cờ';
      } else {
        this.flagToggleBtn.className = 'px-2.5 py-1 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:text-white transition-all flex items-center gap-1';
        this.flagTextEl.innerText = 'Mở Ô';
      }
      if (this.sound && this.sound.playClick) this.sound.playClick(500);
    });

    // Chuyển đổi độ khó
    this.diffBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const diff = btn.getAttribute('data-diff');
        if (diff === 'easy') {
          this.setDifficulty(8, 8, 10, 'easy');
        } else if (diff === 'hard') {
          this.setDifficulty(12, 12, 26, 'hard');
        } else {
          this.setDifficulty(10, 10, 16, 'medium');
        }
        this.diffBtns.forEach(b => {
          b.className = 'mines-diff-btn px-2.5 py-1 rounded-xl bg-slate-900 text-slate-400 border border-white/10 hover:text-white font-bold';
        });
        btn.className = 'mines-diff-btn px-2.5 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold';
      });
    });
  }

  setDifficulty(rows, cols, mines, diffName) {
    this.rows = rows;
    this.cols = cols;
    this.minesCount = mines;
    this.difficulty = diffName;
    this.start();
  }

  start() {
    this.stop();
    this.isFirstClick = true;
    this.isOver = false;
    this.isWon = false;
    this.isPaused = false;
    this.time = 0;
    this.flagsLeft = this.minesCount;
    this.hideOverlay();

    this.grid = Array(this.rows).fill(null).map(() =>
      Array(this.cols).fill(null).map(() => ({
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        adjacentMines: 0
      }))
    );

    this.renderBoard();
    this.updateStatus();
  }

  startTimer() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      if (this.isPaused) return;
      this.time++;
      if (this.timerEl) {
        this.timerEl.innerText = this.time.toString().padStart(3, '0');
      }
    }, 1000);
  }

  stop() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  pause() {
    this.isPaused = true;
  }

  resume() {
    this.isPaused = false;
  }

  togglePause() {
    this.isPaused = !this.isPaused;
  }

  reset() {
    this.start();
  }

  generateMines(firstR, firstC) {
    let planted = 0;
    while (planted < this.minesCount) {
      const r = Math.floor(Math.random() * this.rows);
      const c = Math.floor(Math.random() * this.cols);

      // Đảm bảo ô nhấn đầu tiên và 8 ô xung quanh nó không có mìn
      const isAroundFirst = Math.abs(r - firstR) <= 1 && Math.abs(c - firstC) <= 1;
      if (!this.grid[r][c].isMine && !isAroundFirst) {
        this.grid[r][c].isMine = true;
        planted++;
      }
    }

    // Đếm số mìn lân cận
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        if (!this.grid[r][c].isMine) {
          let count = 0;
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              const nr = r + dr;
              const nc = c + dc;
              if (nr >= 0 && nr < this.rows && nc >= 0 && nc < this.cols) {
                if (this.grid[nr][nc].isMine) count++;
              }
            }
          }
          this.grid[r][c].adjacentMines = count;
        }
      }
    }
  }

  renderBoard() {
    if (!this.boardEl) return;
    this.boardEl.style.gridTemplateColumns = `repeat(${this.cols}, minmax(0, 1fr))`;
    this.boardEl.style.gridTemplateRows = `repeat(${this.rows}, minmax(0, 1fr))`;

    let html = '';
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        html += `
          <div data-r="${r}" data-c="${c}" class="mines-cell w-full h-full rounded-lg sm:rounded-xl bg-slate-800/90 border border-white/10 hover:bg-slate-700/80 cursor-pointer flex items-center justify-center font-black code-font text-xs sm:text-sm select-none transition-all shadow-sm">
          </div>
        `;
      }
    }

    this.boardEl.innerHTML = html;

    // Gắn sự kiện từng ô
    this.boardEl.querySelectorAll('.mines-cell').forEach(cell => {
      const r = parseInt(cell.getAttribute('data-r'), 10);
      const c = parseInt(cell.getAttribute('data-c'), 10);

      cell.addEventListener('click', (e) => {
        e.preventDefault();
        if (this.flagMode) {
          this.toggleFlag(r, c);
        } else {
          this.revealCell(r, c);
        }
      });

      cell.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        this.toggleFlag(r, c);
      });
    });
  }

  revealCell(r, c) {
    if (this.isOver || this.isPaused) return;
    const cell = this.grid[r][c];
    if (cell.isRevealed || cell.isFlagged) return;

    if (this.isFirstClick) {
      this.isFirstClick = false;
      this.generateMines(r, c);
      this.startTimer();
    }

    if (cell.isMine) {
      // Nổ mìn!
      this.triggerGameOver(false, r, c);
      return;
    }

    // Mở ô an toàn
    cell.isRevealed = true;
    if (this.sound && this.sound.playClick) this.sound.playClick(580);

    // Nếu là ô trống không có mìn xung quanh (0) -> Loang mở các ô kề (Flood Fill)
    if (cell.adjacentMines === 0) {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < this.rows && nc >= 0 && nc < this.cols) {
            if (!this.grid[nr][nc].isRevealed) {
              this.revealCell(nr, nc);
            }
          }
        }
      }
    }

    this.updateCellDOM(r, c);
    this.checkWinCondition();
  }

  toggleFlag(r, c) {
    if (this.isOver || this.isPaused) return;
    const cell = this.grid[r][c];
    if (cell.isRevealed) return;

    cell.isFlagged = !cell.isFlagged;
    this.flagsLeft += cell.isFlagged ? -1 : 1;

    if (this.sound && this.sound.playMorseBeep) this.sound.playMorseBeep(0.04);
    this.updateCellDOM(r, c);
    this.updateStatus();
    this.checkWinCondition();
  }

  updateCellDOM(r, c) {
    const el = this.boardEl.querySelector(`[data-r="${r}"][data-c="${c}"]`);
    if (!el) return;
    const cell = this.grid[r][c];

    if (cell.isRevealed) {
      el.classList.remove('bg-slate-800/90', 'hover:bg-slate-700/80');
      el.classList.add('bg-slate-950', 'border-cyan-500/20');

      if (cell.isMine) {
        el.innerHTML = '💥';
        el.classList.add('bg-rose-950/80', 'border-rose-500');
      } else if (cell.adjacentMines > 0) {
        const colors = [
          '',
          'text-cyan-400',
          'text-emerald-400',
          'text-amber-400',
          'text-purple-400',
          'text-rose-400',
          'text-teal-400',
          'text-pink-400',
          'text-white'
        ];
        el.innerText = cell.adjacentMines;
        el.classList.add(colors[cell.adjacentMines] || 'text-cyan-400');
      } else {
        el.innerText = '';
      }
    } else if (cell.isFlagged) {
      el.innerHTML = '<span class="text-rose-400">🚩</span>';
      el.classList.add('border-rose-500/40');
    } else {
      el.innerHTML = '';
      el.classList.remove('border-rose-500/40');
    }
  }

  checkWinCondition() {
    let unrevealedSafeCells = 0;
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        if (!this.grid[r][c].isMine && !this.grid[r][c].isRevealed) {
          unrevealedSafeCells++;
        }
      }
    }

    if (unrevealedSafeCells === 0) {
      this.triggerGameOver(true);
    }
  }

  triggerGameOver(won, hitR = -1, hitC = -1) {
    this.isOver = true;
    this.stop();

    // Mở tất cả mìn
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        if (this.grid[r][c].isMine) {
          this.grid[r][c].isRevealed = true;
          this.updateCellDOM(r, c);
        }
      }
    }

    if (won) {
      if (this.sound && this.sound.playSuccess) this.sound.playSuccess();
      if (this.time < this.bestTime) {
        this.bestTime = this.time;
        localStorage.setItem('cyber_mines_best', this.bestTime.toString());
      }

      this.showOverlay(`
        <div class="text-3xl font-black text-emerald-400 code-font mb-1">GỠ MÌN HOÀN TẤT!</div>
        <p class="text-xs text-slate-300 mb-3">Tất cả lõi hạt nhân lượng tử đã được giải mã.</p>
        <div class="text-sm code-font text-cyan-400 mb-4">
          Thời gian kỷ lục: <strong class="text-white">${this.time} giây</strong>
        </div>
        <button id="mines-retry-btn" class="px-5 py-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-black text-xs hover:scale-105 transition-all shadow-lg shadow-emerald-500/30">
          Chơi Ván Mới
        </button>
      `);
    } else {
      if (this.sound && this.sound.playExplosion) this.sound.playExplosion();
      if (this.sound && this.sound.playFail) this.sound.playFail();

      this.showOverlay(`
        <div class="text-3xl font-black text-rose-500 code-font mb-1">KÍCH NỔ LÕI EMP!</div>
        <p class="text-xs text-slate-300 mb-3">Hệ thống phòng vệ đã bị vô hiệu hóa.</p>
        <button id="mines-retry-btn" class="px-5 py-2 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-500 text-white font-black text-xs hover:scale-105 transition-all shadow-lg shadow-rose-500/30">
          Tái Thiết Lập Vi Mạch
        </button>
      `);
    }

    this.overlayContent.querySelector('#mines-retry-btn')?.addEventListener('click', () => {
      this.reset();
    });

    if (this.onGameOver) this.onGameOver(won, this.time);
  }

  showOverlay(html) {
    if (!this.overlayEl || !this.overlayContent) return;
    this.overlayContent.innerHTML = html;
    this.overlayEl.classList.remove('hidden');
  }

  hideOverlay() {
    if (this.overlayEl) this.overlayEl.classList.add('hidden');
  }

  updateStatus() {
    if (this.flagCountEl) this.flagCountEl.innerText = this.flagsLeft;
    if (this.bestEl) this.bestEl.innerText = this.bestTime === 999 ? '--' : `${this.bestTime}s`;
    if (this.onScoreUpdate) this.onScoreUpdate(this.flagsLeft, this.time);
  }
}
