/**
 * Cyber2048.js - Quantum Memory Matrix 2048
 * Hợp nhất các khối dữ liệu từ 2B đến 2048TB và Lõi Lượng Tử.
 * Hỗ trợ vuốt chạm trên di động, phím mũi tên/WASD, nút hoàn tác (Undo), âm thanh và lưu điểm cao.
 */
export class Cyber2048 {
  constructor(container, soundManager, onScoreUpdate, onGameOver) {
    this.container = typeof container === 'string' ? document.getElementById(container) : container;
    this.sound = soundManager;
    this.onScoreUpdate = onScoreUpdate;
    this.onGameOver = onGameOver;

    this.size = 4;
    this.grid = [];
    this.previousState = null;
    this.score = 0;
    this.highScore = parseInt(localStorage.getItem('cyber_2048_high') || '0', 10);
    this.isWon = false;
    this.isOver = false;
    this.isPaused = false;

    this.initDOM();
    this.initEvents();
    this.start();
  }

  initDOM() {
    this.container.innerHTML = `
      <div class="cyber-2048-root max-w-md mx-auto p-4 sm:p-6 bg-slate-900/90 rounded-3xl border border-purple-500/40 shadow-2xl backdrop-blur-2xl select-none">
        <!-- Top status bar -->
        <div class="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-purple-500/20">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/40 flex items-center justify-center text-xl shadow-[0_0_15px_rgba(168,85,247,0.3)]">
              <i data-lucide="binary" class="w-6 h-6 text-purple-400"></i>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <span class="font-black text-white text-base tracking-wide code-font">MATRIX 2048</span>
                <span class="text-[9px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono font-bold border border-purple-500/30">v2.0</span>
              </div>
              <span class="text-[11px] text-slate-400 code-font">Hợp Nhất Khối Dữ Liệu Lượng Tử</span>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <div class="bg-slate-950/90 border border-cyan-500/40 px-3 py-1.5 rounded-2xl text-center shadow-[0_0_15px_rgba(6,182,212,0.15)] min-w-[62px]">
              <span class="text-[9px] text-cyan-400/80 uppercase font-bold block">SCORE</span>
              <span id="c2048-score" class="digital-lcd text-base font-black text-cyan-300 tracking-wider">0</span>
            </div>
            <div class="bg-slate-950/90 border border-amber-500/40 px-3 py-1.5 rounded-2xl text-center shadow-[0_0_15px_rgba(245,158,11,0.15)] min-w-[62px]">
              <span class="text-[9px] text-amber-400/80 uppercase font-bold block">BEST</span>
              <span id="c2048-best" class="digital-lcd text-base font-black text-amber-300 tracking-wider">${this.highScore}</span>
            </div>
          </div>
        </div>

        <!-- Controls Toolbar -->
        <div class="flex items-center justify-between mb-3 text-xs code-font">
          <div class="flex items-center gap-1.5">
            <select id="c2048-diff-select" class="cyber-select px-3 py-1.5 rounded-xl bg-slate-950 border border-purple-500/40 text-purple-300 font-bold text-xs focus:outline-none focus:border-purple-400 transition-all cursor-pointer shadow-sm">
              <option value="easy">Lưới: 5x5 (Dễ)</option>
              <option value="normal" selected>Lưới: 4x4 (Chuẩn)</option>
              <option value="hard">Lưới: 3x3 (Cao Thủ)</option>
            </select>
            <button id="c2048-undo" class="px-2.5 py-1.5 rounded-xl bg-slate-950 border border-white/15 text-slate-300 hover:text-white hover:border-purple-400/50 transition-all flex items-center gap-1 disabled:opacity-40 disabled:pointer-events-none active:scale-95">
              <span>↩ Hoàn Tác</span>
            </button>
            <button class="btn-open-guide px-2.5 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/40 text-purple-300 hover:bg-purple-500/20 font-bold flex items-center gap-1 text-xs transition-all shadow-[0_0_15px_rgba(168,85,247,0.2)] hover:scale-105 active:scale-95" data-game="2048">
              <i data-lucide="help-circle" class="w-3.5 h-3.5"></i> <span>Hướng Dẫn</span>
            </button>
          </div>
          <div class="flex items-center gap-1.5">
            <button id="c2048-restart" class="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-black hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all hover:scale-105 active:scale-95">
              <span>Chơi Lại</span>
            </button>
          </div>
        </div>

        <!-- 4x4 Grid Container with Corner Brackets -->
        <div class="relative bg-slate-950 p-2 sm:p-2.5 rounded-2xl border border-purple-500/30 aspect-square flex flex-col justify-between shadow-2xl overflow-hidden" id="c2048-grid-board">
          <div class="corner-bracket-tl border-purple-400"></div>
          <div class="corner-bracket-tr border-purple-400"></div>
          <div class="corner-bracket-bl border-purple-400"></div>
          <div class="corner-bracket-br border-purple-400"></div>
          <div class="cyber-scanlines absolute inset-0 z-10 opacity-15 pointer-events-none"></div>

          <div id="c2048-grid" class="grid grid-cols-4 grid-rows-4 gap-2 sm:gap-2.5 w-full h-full relative z-0"></div>
          
          <!-- Overlay Game Over / Win -->
          <div id="c2048-overlay" class="hidden absolute inset-0 bg-slate-950/85 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center p-6 text-center z-30">
            <div id="c2048-overlay-content"></div>
          </div>
        </div>

        <!-- Mobile Touch D-pad / Arrow buttons -->
        <div class="grid grid-cols-3 gap-2 max-w-[190px] mx-auto mt-4 sm:hidden">
          <div></div>
          <button data-dir="up" class="c2048-btn-dir p-3 rounded-2xl bg-slate-900 border border-purple-500/40 text-purple-300 active:bg-purple-500 active:text-slate-950 flex items-center justify-center font-black text-lg shadow-lg active:scale-95 transition-all">▲</button>
          <div></div>
          <button data-dir="left" class="c2048-btn-dir p-3 rounded-2xl bg-slate-900 border border-purple-500/40 text-purple-300 active:bg-purple-500 active:text-slate-950 flex items-center justify-center font-black text-lg shadow-lg active:scale-95 transition-all">◀</button>
          <button data-dir="down" class="c2048-btn-dir p-3 rounded-2xl bg-slate-900 border border-purple-500/40 text-purple-300 active:bg-purple-500 active:text-slate-950 flex items-center justify-center font-black text-lg shadow-lg active:scale-95 transition-all">▼</button>
          <button data-dir="right" class="c2048-btn-dir p-3 rounded-2xl bg-slate-900 border border-purple-500/40 text-purple-300 active:bg-purple-500 active:text-slate-950 flex items-center justify-center font-black text-lg shadow-lg active:scale-95 transition-all">▶</button>
        </div>

        <!-- Hint footer -->
        <p class="text-[11px] text-slate-400 text-center mt-3 code-font hidden sm:block">
          Dùng phím <kbd class="px-1.5 py-0.5 rounded bg-slate-800 border border-white/15 text-purple-300 font-mono font-bold">W/A/S/D</kbd> hoặc <kbd class="px-1.5 py-0.5 rounded bg-slate-800 border border-white/15 text-purple-300 font-mono font-bold">Mũi Tên</kbd> để dồn và nhân đôi dung lượng byte.
        </p>
      </div>
    `;

    this.gridEl = this.container.querySelector('#c2048-grid');
    this.scoreEl = this.container.querySelector('#c2048-score');
    this.bestEl = this.container.querySelector('#c2048-best');
    this.undoBtn = this.container.querySelector('#c2048-undo');
    this.overlayEl = this.container.querySelector('#c2048-overlay');
    this.overlayContent = this.container.querySelector('#c2048-overlay-content');
  }

  initEvents() {
    // Phím bấm bàn phím
    window.addEventListener('keydown', (e) => {
      const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
      if (activeTag === 'input' || activeTag === 'textarea') return;
      if (this.isOver || this.isPaused) return;

      let moved = false;
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        moved = this.move('up');
        e.preventDefault();
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        moved = this.move('down');
        e.preventDefault();
      } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        moved = this.move('left');
        e.preventDefault();
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        moved = this.move('right');
        e.preventDefault();
      }

      if (moved && this.sound && this.sound.playClick) {
        this.sound.playClick(440);
      }
    });

    // Touch Swipe trên mobile
    const board = this.container.querySelector('#c2048-grid-board');
    let touchStartX = 0;
    let touchStartY = 0;

    board.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }
    }, { passive: true });

    board.addEventListener('touchend', (e) => {
      if (this.isOver || this.isPaused) return;
      if (e.changedTouches.length === 1) {
        const dx = e.changedTouches[0].clientX - touchStartX;
        const dy = e.changedTouches[0].clientY - touchStartY;
        const absX = Math.abs(dx);
        const absY = Math.abs(dy);

        if (Math.max(absX, absY) > 30) {
          let moved = false;
          if (absX > absY) {
            moved = dx > 0 ? this.move('right') : this.move('left');
          } else {
            moved = dy > 0 ? this.move('down') : this.move('up');
          }
          if (moved && this.sound && this.sound.playClick) {
            this.sound.playClick(440);
          }
        }
      }
    }, { passive: true });

    // Buttons
    this.container.querySelector('#c2048-diff-select')?.addEventListener('change', (e) => {
      this.setDifficulty(e.target.value);
      this.reset();
    });

    this.container.querySelector('#c2048-restart')?.addEventListener('click', () => {
      this.reset();
    });

    this.undoBtn?.addEventListener('click', () => {
      this.undo();
    });

    // Virtual D-pad
    this.container.querySelectorAll('.c2048-btn-dir').forEach(btn => {
      btn.addEventListener('click', () => {
        const dir = btn.getAttribute('data-dir');
        if (dir && this.move(dir)) {
          if (this.sound && this.sound.playClick) this.sound.playClick(440);
        }
      });
    });
  }

  setDifficulty(level) {
    this.difficulty = level || 'normal';
    if (this.difficulty === 'easy') {
      this.size = 5;
    } else if (this.difficulty === 'hard') {
      this.size = 3;
    } else {
      this.size = 4;
    }
    if (this.gridEl) {
      this.gridEl.style.gridTemplateColumns = `repeat(${this.size}, minmax(0, 1fr))`;
      this.gridEl.style.gridTemplateRows = `repeat(${this.size}, minmax(0, 1fr))`;
    }
  }

  start() {
    this.setDifficulty(this.difficulty);
    this.grid = Array(this.size).fill(null).map(() => Array(this.size).fill(0));
    this.score = 0;
    this.previousState = null;
    this.isWon = false;
    this.isOver = false;
    this.isPaused = false;
    this.hideOverlay();

    this.addRandomTile();
    this.addRandomTile();
    this.updateUI();
  }

  stop() {
    this.isPaused = true;
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

  saveState() {
    this.previousState = {
      grid: this.grid.map(row => [...row]),
      score: this.score
    };
    if (this.undoBtn) this.undoBtn.disabled = false;
  }

  undo() {
    if (!this.previousState) return;
    this.grid = this.previousState.grid.map(row => [...row]);
    this.score = this.previousState.score;
    this.previousState = null;
    this.isOver = false;
    this.hideOverlay();
    if (this.undoBtn) this.undoBtn.disabled = true;
    this.updateUI();
    if (this.sound && this.sound.playClick) this.sound.playClick(360);
  }

  addRandomTile() {
    const emptyCells = [];
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.grid[r][c] === 0) {
          emptyCells.push({ r, c });
        }
      }
    }

    if (emptyCells.length > 0) {
      const { r, c } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      this.grid[r][c] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  move(direction) {
    if (this.isOver || this.isPaused) return false;

    let moved = false;
    let earnedScore = 0;
    const previousGrid = this.grid.map(row => [...row]);

    const rotateGrid = (matrix) => {
      return matrix[0].map((_, colIdx) => matrix.map(row => row[colIdx]).reverse());
    };

    let tempGrid = this.grid.map(row => [...row]);

    // Chuyển mọi hướng về dạng 'left' bằng cách xoay ma trận
    let rotations = 0;
    if (direction === 'up') rotations = 3;
    else if (direction === 'right') rotations = 2;
    else if (direction === 'down') rotations = 1;

    for (let i = 0; i < rotations; i++) {
      tempGrid = rotateGrid(tempGrid);
    }

    // Trượt sang trái và gộp các ô trùng nhau
    for (let r = 0; r < this.size; r++) {
      let row = tempGrid[r].filter(val => val !== 0);
      for (let c = 0; c < row.length - 1; c++) {
        if (row[c] === row[c + 1]) {
          row[c] *= 2;
          earnedScore += row[c];
          row.splice(c + 1, 1);
          if (row[c] === 2048 && !this.isWon) {
            this.isWon = true;
            if (this.sound && this.sound.playSuccess) this.sound.playSuccess();
          }
        }
      }
      while (row.length < this.size) row.push(0);
      tempGrid[r] = row;
    }

    // Xoay ngược lại vị trí ban đầu
    const backRotations = (4 - rotations) % 4;
    for (let i = 0; i < backRotations; i++) {
      tempGrid = rotateGrid(tempGrid);
    }

    // Kiểm tra xem ma trận có thay đổi không
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (tempGrid[r][c] !== this.grid[r][c]) {
          moved = true;
          break;
        }
      }
    }

    if (moved) {
      this.saveState();
      this.grid = tempGrid;
      this.score += earnedScore;

      if (earnedScore > 0 && this.sound && this.sound.playPop) {
        this.sound.playPop(520 + Math.min(600, earnedScore / 2));
      }

      if (this.score > this.highScore) {
        this.highScore = this.score;
        localStorage.setItem('cyber_2048_high', this.highScore.toString());
      }

      this.addRandomTile();
      this.updateUI();

      if (this.checkGameOver()) {
        this.triggerGameOver();
      }

      return true;
    }

    return false;
  }

  checkGameOver() {
    // Còn ô trống -> chưa thua
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.grid[r][c] === 0) return false;
      }
    }

    // Còn cặp ô kề nhau trùng giá trị -> chưa thua
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        const val = this.grid[r][c];
        if (r < this.size - 1 && val === this.grid[r + 1][c]) return false;
        if (c < this.size - 1 && val === this.grid[r][c + 1]) return false;
      }
    }

    return true;
  }

  triggerGameOver() {
    this.isOver = true;
    if (this.sound && this.sound.playFail) this.sound.playFail();

    this.showOverlay(`
      <div class="text-rose-400 text-3xl font-black mb-1 code-font">TRÀN BỘ NHỚ!</div>
      <p class="text-xs text-slate-300 mb-4">Không còn không gian phân bổ thanh ghi dữ liệu.</p>
      <div class="text-sm code-font text-cyan-400 mb-4">Điểm số: <strong class="text-white">${this.score}</strong></div>
      <button id="c2048-btn-retry" class="px-5 py-2 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-500 text-white font-black text-xs hover:scale-105 transition-all shadow-lg shadow-rose-500/30">
        Khởi Động Lại Hệ Thống
      </button>
    `);

    this.overlayContent.querySelector('#c2048-btn-retry')?.addEventListener('click', () => {
      this.reset();
    });

    if (this.onGameOver) this.onGameOver(this.score, this.highScore);
  }

  showOverlay(html) {
    if (!this.overlayEl || !this.overlayContent) return;
    this.overlayContent.innerHTML = html;
    this.overlayEl.classList.remove('hidden');
  }

  hideOverlay() {
    if (this.overlayEl) this.overlayEl.classList.add('hidden');
  }

  getTileStyle(val) {
    const styles = {
      2: { bg: 'bg-slate-800/90 text-cyan-300 border-cyan-500/20 shadow-cyan-500/5', label: '2 B' },
      4: { bg: 'bg-cyan-950/80 text-cyan-300 border-cyan-400/40 shadow-cyan-500/10', label: '4 B' },
      8: { bg: 'bg-sky-900/90 text-sky-200 border-sky-400/50 shadow-sky-500/20', label: '8 B' },
      16: { bg: 'bg-emerald-950/90 text-emerald-300 border-emerald-400/50 shadow-emerald-500/20', label: '16 B' },
      32: { bg: 'bg-emerald-800/90 text-emerald-100 border-emerald-300/60 shadow-emerald-500/30 font-bold', label: '32 B' },
      64: { bg: 'bg-amber-950/90 text-amber-300 border-amber-400/60 shadow-amber-500/30 font-bold', label: '64 B' },
      128: { bg: 'bg-amber-700/90 text-white border-amber-300/70 shadow-amber-500/40 font-black', label: '128 B' },
      256: { bg: 'bg-purple-950/90 text-purple-300 border-purple-400/70 shadow-purple-500/40 font-black', label: '256 B' },
      512: { bg: 'bg-purple-700/90 text-white border-purple-300/80 shadow-purple-500/50 font-black', label: '512 B' },
      1024: { bg: 'bg-fuchsia-600 text-white border-fuchsia-200 shadow-fuchsia-500/60 font-black', label: '1 KB' },
      2048: { bg: 'bg-gradient-to-tr from-cyan-400 via-amber-400 to-rose-500 text-slate-950 border-white shadow-cyan-400/70 font-black animate-pulse', label: '2048 TB' }
    };

    return styles[val] || { bg: 'bg-rose-600 text-white border-white font-black', label: `${val} TB` };
  }

  updateUI() {
    if (!this.gridEl) return;
    this.gridEl.style.display = 'grid';
    this.gridEl.style.gridTemplateColumns = `repeat(${this.size}, minmax(0, 1fr))`;
    this.gridEl.style.gridTemplateRows = `repeat(${this.size}, minmax(0, 1fr))`;
    this.scoreEl.innerText = this.score;
    this.bestEl.innerText = this.highScore;

    let html = '';
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        const val = this.grid[r][c];
        if (val === 0) {
          html += `<div class="w-full h-full rounded-xl bg-slate-950/60 border border-white/5 flex items-center justify-center"></div>`;
        } else {
          const info = this.getTileStyle(val);
          html += `
            <div class="w-full h-full rounded-xl ${info.bg} border shadow-lg flex flex-col items-center justify-center p-1 transform transition-all duration-100 scale-100 animate-in">
              <span class="text-sm sm:text-base font-black code-font tracking-tight leading-none">${val}</span>
              <span class="text-[9px] uppercase tracking-wider opacity-75 font-mono mt-0.5">${info.label}</span>
            </div>
          `;
        }
      }
    }

    this.gridEl.innerHTML = html;
    if (this.onScoreUpdate) this.onScoreUpdate(this.score, this.highScore);
  }
}
