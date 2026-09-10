/**
 * WhackABug.js - Cyber Virus & Glitch Patch Blitz
 * Đập bọ lỗi mã nguồn, diệt trojan và ransomware trên 9 cổng máy chủ lượng tử.
 * Hệ thống Combo Streak, Fever Mode, tính điểm blitz 45 giây, âm thanh và hiệu ứng nổ hạt.
 */
export class WhackABug {
  constructor(container, soundManager, onScoreUpdate, onGameOver) {
    this.container = typeof container === 'string' ? document.getElementById(container) : container;
    this.sound = soundManager;
    this.onScoreUpdate = onScoreUpdate;
    this.onGameOver = onGameOver;

    this.score = 0;
    this.highScore = parseInt(localStorage.getItem('whack_bug_high') || '0', 10);
    this.difficulty = 'normal';
    this.initialTime = 45;
    this.durationMultiplier = 1.0;
    this.spawnRateMultiplier = 1.0;
    this.scoreMultiplier = 1.5;
    this.timeLeft = 45;
    this.timerInterval = null;
    this.spawnInterval = null;
    this.isPlaying = false;
    this.isPaused = false;
    this.combo = 0;
    this.maxCombo = 0;

    this.nodes = [];
    this.bugTypes = [
      { type: 'bug', name: 'Null Pointer', icon: '🐛', score: 100, color: 'text-cyan-400 border-cyan-500/40', duration: 1100 },
      { type: 'leak', name: 'Memory Leak', icon: '🪲', score: 200, color: 'text-amber-400 border-amber-500/40', duration: 900 },
      { type: 'trojan', name: 'Ransomware', icon: '👾', score: 300, color: 'text-rose-400 border-rose-500/40', duration: 800 },
      { type: 'golden', name: 'Golden Byte', icon: '💎', score: 500, color: 'text-emerald-300 border-emerald-400/70', duration: 700 },
      { type: 'honeypot', name: 'Decoy Trap', icon: '🛡️', score: -150, color: 'text-purple-400 border-purple-500/40', duration: 1300 }
    ];

    this.initDOM();
    this.initEvents();
  }

  initDOM() {
    this.container.innerHTML = `
      <div class="whack-bug-root max-w-md mx-auto p-4 sm:p-6 bg-slate-900/90 rounded-3xl border border-rose-500/40 shadow-2xl backdrop-blur-2xl select-none">
        <!-- Top status bar -->
        <div class="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-rose-500/20">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/40 flex items-center justify-center text-xl shadow-[0_0_15px_rgba(244,63,94,0.3)]">
              <i data-lucide="target" class="w-6 h-6 text-rose-400"></i>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <span class="font-black text-white text-base tracking-wide code-font">WHACK-A-BUG</span>
                <span id="whack-combo-badge" class="hidden text-xs px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black animate-bounce">
                  x1 COMBO
                </span>
              </div>
              <span class="text-[11px] text-slate-400 code-font">Diệt Sâu Bọ & Glitch Server</span>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <div class="bg-slate-950/90 border border-amber-500/40 px-3 py-1.5 rounded-2xl text-center min-w-[64px] shadow-[0_0_15px_rgba(245,158,11,0.15)]">
              <span class="text-[9px] text-amber-400/80 uppercase font-bold block">TIME</span>
              <span id="whack-time" class="digital-lcd text-base font-black text-amber-300 tracking-wider">45s</span>
            </div>
            <div class="bg-slate-950/90 border border-rose-500/40 px-3 py-1.5 rounded-2xl text-center min-w-[70px] shadow-[0_0_15px_rgba(244,63,94,0.15)]">
              <span class="text-[9px] text-rose-400/80 uppercase font-bold block">SCORE</span>
              <span id="whack-score" class="digital-lcd text-base font-black text-rose-300 tracking-wider">0</span>
            </div>
          </div>
        </div>

        <!-- Controls Toolbar -->
        <div class="flex items-center justify-between mb-3 text-xs code-font">
          <div class="flex items-center gap-1.5">
            <select id="whack-diff-select" class="cyber-select px-3 py-1.5 rounded-xl bg-slate-950 border border-rose-500/40 text-rose-300 font-bold text-xs focus:outline-none focus:border-rose-400 transition-all cursor-pointer shadow-sm">
              <option value="easy">Cấp: 60s (Dễ)</option>
              <option value="normal" selected>Cấp: 45s (Chuẩn)</option>
              <option value="hard">Cấp: 35s (Cyber God)</option>
            </select>
          </div>
          <div class="flex items-center gap-1.5">
            <button class="btn-open-guide px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/40 text-rose-300 hover:bg-rose-500/20 hover:border-rose-400 font-bold flex items-center gap-1.5 text-xs transition-all shadow-[0_0_15px_rgba(244,63,94,0.2)] hover:scale-105 active:scale-95" data-game="whack">
              <i data-lucide="help-circle" class="w-3.5 h-3.5"></i> <span>Hướng Dẫn</span>
            </button>
            <button id="whack-btn-pause" class="px-3 py-1.5 rounded-xl bg-slate-950 border border-white/15 text-slate-300 hover:text-white hover:border-rose-400/50 transition-all font-bold active:scale-95">
              Tạm Dừng
            </button>
            <button id="whack-btn-start" class="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 text-white font-black hover:scale-105 transition-all shadow-md shadow-rose-500/20 active:scale-95">
              Bắt Đầu
            </button>
          </div>
        </div>

        <!-- 3x3 Server Node Ports with Corner Brackets -->
        <div class="relative bg-slate-950 p-3 sm:p-4 rounded-2xl border border-rose-500/30 aspect-square grid grid-cols-3 grid-rows-3 gap-2.5 sm:gap-3 shadow-2xl overflow-hidden" id="whack-grid">
          <div class="corner-bracket-tl border-rose-400"></div>
          <div class="corner-bracket-tr border-rose-400"></div>
          <div class="corner-bracket-bl border-rose-400"></div>
          <div class="corner-bracket-br border-rose-400"></div>
          <div class="cyber-scanlines absolute inset-0 z-10 opacity-15 pointer-events-none"></div>

          ${Array(9).fill(0).map((_, idx) => `
            <div data-node-idx="${idx}" class="whack-node relative rounded-2xl bg-slate-900 border border-white/10 hover:border-rose-500/40 overflow-hidden flex flex-col items-center justify-center cursor-pointer transition-all active:scale-95 shadow-inner">
              <div class="whack-slot-inner flex flex-col items-center justify-center w-full h-full">
                <span class="whack-icon text-3xl sm:text-4xl opacity-0 transform translate-y-4 transition-all duration-150 select-none">🐛</span>
                <span class="whack-name text-[9px] code-font text-slate-400 opacity-0 mt-1 uppercase tracking-tight"></span>
              </div>
              <!-- Status LED -->
              <span class="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-slate-700 whack-led"></span>
            </div>
          `).join('')}

          <!-- Game Over Overlay -->
          <div id="whack-overlay" class="hidden absolute inset-0 bg-slate-950/90 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center p-6 text-center z-20">
            <div id="whack-overlay-content"></div>
          </div>
        </div>

        <!-- Hint bar -->
        <div class="flex items-center justify-between text-[11px] text-slate-400 mt-3 code-font">
          <span>🎯 Đập bọ & virus để cộng điểm. Chú ý Decoy Trap 🛡️ gây trừ điểm!</span>
        </div>
          <span class="text-rose-400">⚠️ Tránh 🛡️ Bẫy Honeypot!</span>
        </div>
      </div>
    `;

    this.scoreEl = this.container.querySelector('#whack-score');
    this.timeEl = this.container.querySelector('#whack-time');
    this.bestEl = this.container.querySelector('#whack-best');
    this.comboBadge = this.container.querySelector('#whack-combo-badge');
    this.overlayEl = this.container.querySelector('#whack-overlay');
    this.overlayContent = this.container.querySelector('#whack-overlay-content');
    this.startBtn = this.container.querySelector('#whack-btn-start');
    this.pauseBtn = this.container.querySelector('#whack-btn-pause');

    // Lưu mảng 9 DOM nodes
    this.nodeEls = Array.from(this.container.querySelectorAll('.whack-node'));
  }

  initEvents() {
    this.container.querySelector('#whack-diff-select')?.addEventListener('change', (e) => {
      this.setDifficulty(e.target.value);
      this.start();
    });

    this.startBtn?.addEventListener('click', () => {
      this.start();
    });

    this.pauseBtn?.addEventListener('click', () => {
      this.togglePause();
    });

    this.nodeEls.forEach(node => {
      const handleHit = (e) => {
        e.preventDefault();
        const idx = parseInt(node.getAttribute('data-node-idx'), 10);
        this.hitNode(idx);
      };

      node.addEventListener('mousedown', handleHit);
      node.addEventListener('touchstart', handleHit, { passive: false });
    });
  }

  setDifficulty(level) {
    this.difficulty = level || 'normal';
    if (this.difficulty === 'easy') {
      this.initialTime = 60;
      this.durationMultiplier = 1.35;
      this.spawnRateMultiplier = 1.25;
      this.scoreMultiplier = 1.0;
    } else if (this.difficulty === 'hard') {
      this.initialTime = 35;
      this.durationMultiplier = 0.65;
      this.spawnRateMultiplier = 0.72;
      this.scoreMultiplier = 2.5;
    } else { // normal
      this.initialTime = 45;
      this.durationMultiplier = 1.0;
      this.spawnRateMultiplier = 1.0;
      this.scoreMultiplier = 1.5;
    }
  }

  start() {
    this.stop();
    this.setDifficulty(this.difficulty);
    this.isPlaying = true;
    this.isPaused = false;
    this.score = 0;
    this.timeLeft = this.initialTime || 45;
    this.combo = 0;
    this.maxCombo = 0;
    this.hideOverlay();
    this.updateUI();

    this.startBtn.innerText = 'Chơi Lại';
    this.pauseBtn.innerText = 'Tạm Dừng';

    // Đếm ngược thời gian
    this.timerInterval = setInterval(() => {
      if (this.isPaused) return;
      this.timeLeft--;
      this.timeEl.innerText = `${this.timeLeft}s`;

      if (this.timeLeft <= 5) {
        this.timeEl.classList.add('text-rose-500', 'animate-pulse');
      } else {
        this.timeEl.classList.remove('text-rose-500', 'animate-pulse');
      }

      if (this.timeLeft <= 0) {
        this.triggerGameOver();
      }
    }, 1000);

    // Chu kỳ xuất hiện quái
    this.scheduleNextSpawn();
  }

  scheduleNextSpawn() {
    if (!this.isPlaying || this.isPaused) return;
    const baseInterval = Math.max(380, 850 - ((this.initialTime || 45) - this.timeLeft) * 12);
    const interval = Math.max(250, Math.round(baseInterval * (this.spawnRateMultiplier || 1.0)));

    this.spawnInterval = setTimeout(() => {
      this.spawnBug();
      this.scheduleNextSpawn();
    }, interval);
  }

  spawnBug() {
    if (!this.isPlaying || this.isPaused) return;

    // Tìm các ô trống
    const freeIndices = [];
    this.nodeEls.forEach((el, idx) => {
      if (!el.classList.contains('has-bug')) freeIndices.push(idx);
    });

    if (freeIndices.length === 0) return;

    const chosenIdx = freeIndices[Math.floor(Math.random() * freeIndices.length)];
    const node = this.nodeEls[chosenIdx];

    // Chọn loại bug ngẫu nhiên (tăng bẫy honeypot ở độ khó hard)
    const rand = Math.random();
    let bug;
    const honeypotChance = this.difficulty === 'hard' ? 0.82 : 0.94;
    if (rand < 0.40) bug = this.bugTypes[0]; // Null pointer
    else if (rand < 0.65) bug = this.bugTypes[1]; // Leak
    else if (rand < 0.80) bug = this.bugTypes[2]; // Trojan
    else if (rand < honeypotChance) bug = this.bugTypes[3]; // Golden
    else bug = this.bugTypes[4]; // Honeypot trap

    node.classList.add('has-bug');
    node.dataset.bugType = bug.type;

    const iconEl = node.querySelector('.whack-icon');
    const nameEl = node.querySelector('.whack-name');
    const ledEl = node.querySelector('.whack-led');

    iconEl.innerText = bug.icon;
    nameEl.innerText = bug.name;
    iconEl.className = 'whack-icon text-3xl sm:text-4xl transform translate-y-0 opacity-100 transition-all duration-150 select-none';
    nameEl.className = 'whack-name text-[9px] code-font opacity-100 mt-1 uppercase font-bold ' + bug.color;

    ledEl.className = 'absolute top-2 right-2 w-1.5 h-1.5 rounded-full animate-ping ' + (bug.type === 'honeypot' ? 'bg-purple-500' : 'bg-rose-500');

    // Tự động lặn xuống sau khoảng thời gian theo độ khó
    const duration = Math.round(bug.duration * (this.durationMultiplier || 1.0));
    const hideTimeout = setTimeout(() => {
      if (node.classList.contains('has-bug')) {
        this.hideBug(node);
        // Nếu là bug thường mà để thoát -> đứt combo
        if (bug.type !== 'honeypot') {
          this.combo = 0;
          this.updateCombo();
        }
      }
    }, duration);

    node._hideTimeout = hideTimeout;
  }

  hideBug(node) {
    node.classList.remove('has-bug');
    delete node.dataset.bugType;
    if (node._hideTimeout) clearTimeout(node._hideTimeout);

    const iconEl = node.querySelector('.whack-icon');
    const nameEl = node.querySelector('.whack-name');
    const ledEl = node.querySelector('.whack-led');

    iconEl.className = 'whack-icon text-3xl sm:text-4xl opacity-0 transform translate-y-4 transition-all duration-150 select-none';
    nameEl.className = 'whack-name text-[9px] code-font text-slate-400 opacity-0 mt-1 uppercase tracking-tight';
    ledEl.className = 'absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-slate-700 whack-led';
  }

  hitNode(idx) {
    if (!this.isPlaying || this.isPaused) return;

    const node = this.nodeEls[idx];
    if (!node.classList.contains('has-bug')) {
      // Đập hụt
      this.combo = 0;
      this.updateCombo();
      return;
    }

    const bugTypeKey = node.dataset.bugType;
    const bug = this.bugTypes.find(b => b.type === bugTypeKey) || this.bugTypes[0];

    // Xử lý điểm số & combo
    if (bug.type === 'honeypot') {
      // Đập trúng bẫy
      this.score = Math.max(0, this.score + bug.score);
      this.combo = 0;
      if (this.sound && this.sound.playFail) this.sound.playFail();
      this.showPopFeedback(node, `${bug.score}`, 'text-rose-400');
    } else {
      // Đập trúng bọ
      this.combo++;
      if (this.combo > this.maxCombo) this.maxCombo = this.combo;
      const multiplier = Math.min(4, 1 + Math.floor(this.combo / 4));
      const points = Math.round(bug.score * multiplier * (this.scoreMultiplier || 1.5));
      this.score += points;

      if (this.sound) {
        if (bug.type === 'golden') {
          if (this.sound.playScore) this.sound.playScore();
        } else {
          if (this.sound.playPop) this.sound.playPop(520 + Math.min(400, this.combo * 40));
        }
      }

      this.showPopFeedback(node, `+${points}`, multiplier > 1 ? 'text-amber-400 font-black' : 'text-cyan-400');
    }

    if (this.score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem('whack_bug_high', this.highScore.toString());
    }

    this.hideBug(node);
    this.updateUI();
  }

  showPopFeedback(node, text, colorCls) {
    const floatEl = document.createElement('span');
    floatEl.className = `absolute pointer-events-none text-xs font-black code-font ${colorCls} animate-bounce z-30`;
    floatEl.style.top = '25%';
    floatEl.innerText = text;
    node.appendChild(floatEl);

    setTimeout(() => floatEl.remove(), 600);
  }

  updateCombo() {
    if (!this.comboBadge) return;
    if (this.combo >= 3) {
      this.comboBadge.classList.remove('hidden');
      this.comboBadge.innerText = `x${Math.min(4, 1 + Math.floor(this.combo / 4))} COMBO (${this.combo})`;
    } else {
      this.comboBadge.classList.add('hidden');
    }
  }

  updateUI() {
    if (this.scoreEl) this.scoreEl.innerText = this.score;
    if (this.timeEl) this.timeEl.innerText = `${this.timeLeft}s`;
    if (this.bestEl) this.bestEl.innerText = this.highScore;
    this.updateCombo();
    if (this.onScoreUpdate) this.onScoreUpdate(this.score, this.highScore);
  }

  stop() {
    this.isPlaying = false;
    this.isPaused = false;
    if (this.timerInterval) clearInterval(this.timerInterval);
    if (this.spawnInterval) clearTimeout(this.spawnInterval);
    this.nodeEls.forEach(n => this.hideBug(n));
  }

  pause() {
    if (!this.isPlaying || this.isPaused) return false;
    this.isPaused = true;
    if (this.pauseBtn) this.pauseBtn.innerText = 'Tiếp Tục';
    return true;
  }

  resume() {
    if (!this.isPlaying || !this.isPaused) return false;
    this.isPaused = false;
    if (this.pauseBtn) this.pauseBtn.innerText = 'Tạm Dừng';
    this.scheduleNextSpawn();
    return true;
  }

  togglePause() {
    if (this.isPaused) return this.resume();
    else return this.pause();
  }

  reset() {
    this.start();
  }

  triggerGameOver() {
    this.stop();
    if (this.sound && this.sound.playSuccess) this.sound.playSuccess();

    this.showOverlay(`
      <div class="text-3xl font-black text-amber-400 code-font mb-1">HẾT GIỜ!</div>
      <p class="text-xs text-slate-300 mb-3">Hệ thống máy chủ đã được vá lỗi an toàn.</p>
      <div class="bg-slate-900 border border-white/10 rounded-2xl p-3 mb-4 w-full max-w-[200px]">
        <span class="text-[10px] text-slate-400 block code-font">TỔNG ĐIỂM SỐ</span>
        <span class="text-2xl font-black text-rose-400 code-font">${this.score}</span>
        <span class="text-[10px] text-amber-300 block mt-0.5">Max Combo: ${this.maxCombo}🔥</span>
      </div>
      <button id="whack-retry-btn" class="px-5 py-2 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-500 text-white font-black text-xs hover:scale-105 transition-all shadow-lg shadow-rose-500/30">
        Chơi Lại Ván Mới
      </button>
    `);

    this.overlayContent.querySelector('#whack-retry-btn')?.addEventListener('click', () => {
      this.start();
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
}
