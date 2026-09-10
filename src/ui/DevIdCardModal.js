import { getIconSvg } from '../utils/icons.js';

export class DevIdCardModal {
  constructor(soundManager, achievementsManager) {
    this.sound = soundManager;
    this.achievements = achievementsManager;
    this.modalEl = null;

    this.init();
  }

  init() {
    this.createDOM();
    this.bindEvents();
  }

  createDOM() {
    let el = document.getElementById('dev-id-modal-root');
    if (!el) {
      el = document.createElement('div');
      el.id = 'dev-id-modal-root';
      document.body.appendChild(el);
    }
    this.modalEl = el;
  }

  bindEvents() {
    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('.btn-open-dev-id');
      if (trigger) {
        this.open();
      }

      if (e.target.closest('#btn-close-dev-id') || e.target.classList.contains('dev-id-backdrop')) {
        this.close();
      }
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen()) {
        this.close();
      }
    });
  }

  isOpen() {
    return this.modalEl && this.modalEl.innerHTML.trim() !== '';
  }

  calculateStats() {
    let totalScore = 0;
    try {
      const gameKeys = ['snake', 'defender', 'breaker', 'runner', 'flappy', '2048', 'pong', 'whack', 'tetris', 'mines'];
      gameKeys.forEach(k => {
        const val = localStorage.getItem(`cyber_${k}_highscore`);
        if (val) totalScore += parseInt(val, 10) || 0;
      });
    } catch {}

    const unlockedCount = this.achievements ? this.achievements.getUnlockedCount() : 3;
    const exp = 2450 + (unlockedCount * 300) + Math.floor(totalScore / 10);
    const level = Math.min(10, Math.floor(exp / 500) + 1);

    const rankTitles = [
      'Script Explorer',
      'Junior .NET Coder',
      'Fullstack Craftsman',
      'CQRS & Microservices Engineer',
      'High-Performance SQL Specialist',
      'Realtime SignalR Architect',
      'Senior .NET Fullstack Lead',
      'Enterprise System Architect',
      'Cyber Matrix Mastermind',
      'Quantum Code Grandmaster'
    ];

    return {
      level,
      title: rankTitles[level - 1] || 'Senior .NET Fullstack Lead',
      exp,
      unlockedCount,
      totalScore
    };
  }

  open() {
    if (this.sound && this.sound.playClick) this.sound.playClick(650);

    const stats = this.calculateStats();

    this.modalEl.innerHTML = `
      <div class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 dev-id-backdrop bg-slate-950/85 backdrop-blur-xl animate-fade-in code-font text-slate-200">
        <div class="relative w-full max-w-lg bg-slate-900 border border-cyan-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden" onclick="event.stopPropagation()">
          
          <!-- Corner brackets -->
          <div class="corner-bracket-tl border-cyan-400"></div>
          <div class="corner-bracket-tr border-cyan-400"></div>
          <div class="corner-bracket-bl border-cyan-400"></div>
          <div class="corner-bracket-br border-cyan-400"></div>

          <!-- Header -->
          <div class="flex items-center justify-between border-b border-white/10 pb-3 mb-5">
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
              <span class="text-xs font-black uppercase text-cyan-400 tracking-wider">CYBER DEV ID // THẺ CĂN CƯỚC SỐ</span>
            </div>
            <button id="btn-close-dev-id" class="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all">
              ${getIconSvg('x', 'w-5 h-5')}
            </button>
          </div>

          <!-- Physical Card Simulation -->
          <div class="relative bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950/40 border border-cyan-500/40 rounded-2xl p-5 shadow-2xl overflow-hidden mb-5">
            <!-- Background Holographic Circuit Lines -->
            <div class="absolute inset-0 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:16px_16px] opacity-15 pointer-events-none"></div>

            <!-- Top Row: Chip & Hologram Seal -->
            <div class="flex items-center justify-between mb-4 relative z-10">
              <div class="flex items-center gap-3">
                <!-- Smart Chip Graphic -->
                <div class="w-10 h-7 rounded bg-gradient-to-br from-amber-300 via-amber-400 to-amber-600 border border-amber-500/50 flex items-center justify-center shadow-md">
                  <div class="w-8 h-5 border border-amber-700/40 rounded flex items-center justify-around">
                    <span class="w-0.5 h-full bg-amber-700/40"></span>
                    <span class="w-0.5 h-full bg-amber-700/40"></span>
                  </div>
                </div>
                <div class="text-[10px] text-cyan-300 font-bold uppercase tracking-wider">
                  NEXUS ARCHITECT LICENSE
                </div>
              </div>
              <div class="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[10px] font-bold">
                ${getIconSvg('shield-check', 'w-3.5 h-3.5')} VERIFIED
              </div>
            </div>

            <!-- Middle Row: Avatar & Identity Details -->
            <div class="flex items-center gap-4 mb-4 relative z-10">
              <div class="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500/30 to-purple-500/30 border border-cyan-400/50 flex items-center justify-center text-cyan-300 shadow-lg shadow-cyan-500/20 flex-shrink-0">
                <span class="text-2xl font-black">ĐT</span>
              </div>
              <div>
                <h3 class="text-lg font-black text-white tracking-wide">DƯƠNG TIẾN ĐẠT</h3>
                <span class="text-xs text-cyan-400 font-bold block">${stats.title}</span>
                <span class="text-[10px] text-slate-400 block mt-0.5">ID: <strong class="text-slate-200">DTD-8942-NET</strong> • Hanoi, Vietnam</span>
              </div>
            </div>

            <!-- Stats Grid -->
            <div class="grid grid-cols-3 gap-2 bg-slate-950/80 border border-white/10 rounded-xl p-2.5 text-center mb-4 relative z-10">
              <div>
                <span class="text-[10px] text-slate-400 block uppercase">Level</span>
                <span class="text-base font-black text-amber-400">LVL ${stats.level}</span>
              </div>
              <div>
                <span class="text-[10px] text-slate-400 block uppercase">EXP Điểm</span>
                <span class="text-base font-black text-cyan-400">${stats.exp}</span>
              </div>
              <div>
                <span class="text-[10px] text-slate-400 block uppercase">Thành Tựu</span>
                <span class="text-base font-black text-emerald-400">${stats.unlockedCount}/10</span>
              </div>
            </div>

            <!-- Bottom Row: Barcode & Security Hash -->
            <div class="flex items-end justify-between text-[9px] text-slate-500 relative z-10 pt-1 border-t border-white/5">
              <div class="flex items-center gap-1 font-mono">
                <span>|||| || | |||| ||| || ||||</span>
                <span>DTD-2026-NEXUS</span>
              </div>
              <div class="text-cyan-400/70 font-mono">
                SHA-256: 7f8a9e2...
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center justify-between gap-3">
            <button id="btn-copy-id" class="flex-1 py-2.5 rounded-xl bg-slate-950 border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-2">
              ${getIconSvg('copy', 'w-3.5 h-3.5')} <span>Sao Chép Thông Tin Thẻ</span>
            </button>
            <button id="btn-share-id" class="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-400 hover:opacity-90 text-slate-950 text-xs font-black transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20">
              ${getIconSvg('award', 'w-4 h-4')} <span>Xác Nhận Năng Lực</span>
            </button>
          </div>
        </div>
      </div>
    `;

    document.getElementById('btn-copy-id')?.addEventListener('click', () => {
      const text = `[NEXUS DEV ID] Dương Tiến Đạt - .NET Fullstack Developer\nCấp bậc: LVL ${stats.level} (${stats.title})\nTổng EXP: ${stats.exp} | Thành tựu: ${stats.unlockedCount}/10\nChuyên môn: ASP.NET Core, SQL Server, Angular, Electron, SignalR`;
      navigator.clipboard.writeText(text).then(() => {
        const btn = document.getElementById('btn-copy-id');
        if (btn) btn.innerHTML = `${getIconSvg('check', 'w-3.5 h-3.5 text-emerald-400')} <span class="text-emerald-400">Đã Sao Chép!</span>`;
      });
      if (this.sound && this.sound.playClick) this.sound.playClick(600);
    });

    document.getElementById('btn-share-id')?.addEventListener('click', () => {
      this.close();
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    });
  }

  close() {
    if (this.modalEl) this.modalEl.innerHTML = '';
  }
}
