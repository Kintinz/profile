import { getIconSvg } from '../utils/icons.js';

export class SystemTelemetry {
  constructor(soundManager) {
    this.sound = soundManager;
    this.container = null;
    this.fps = 60;
    this.frameCount = 0;
    this.lastTime = performance.now();
    this.startTime = Date.now();
    this.ping = 18;
    this.isMinimized = false;

    this.init();
  }

  init() {
    this.createDOM();
    this.startFpsLoop();
    this.startUptimeLoop();
    this.startPingSimulation();
    this.bindEvents();
  }

  createDOM() {
    let el = document.getElementById('system-telemetry-root');
    if (!el) {
      el = document.createElement('div');
      el.id = 'system-telemetry-root';
      document.body.appendChild(el);
    }
    this.container = el;
    this.render();
  }

  render() {
    this.container.innerHTML = `
      <div id="telemetry-bar" class="fixed bottom-3 right-3 z-40 code-font select-none transition-all duration-300">
        <!-- Expanded Widget -->
        <div id="telemetry-expanded" class="flex items-center gap-3 bg-slate-950/90 border border-cyan-500/30 backdrop-blur-xl rounded-2xl px-3.5 py-2 shadow-2xl shadow-cyan-500/10 text-xs text-slate-300">
          
          <!-- Status Node -->
          <div class="flex items-center gap-1.5 pr-2 border-r border-white/10">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span class="text-[10px] font-bold text-emerald-400">NODE-ONLINE</span>
          </div>

          <!-- Real FPS Counter -->
          <div class="flex items-center gap-1">
            <span class="text-[10px] text-slate-400">FPS:</span>
            <span id="telemetry-fps" class="font-bold text-cyan-400 text-xs">60</span>
          </div>

          <!-- Network Ping -->
          <div class="hidden sm:flex items-center gap-1">
            <span class="text-[10px] text-slate-400">PING:</span>
            <span id="telemetry-ping" class="font-bold text-emerald-400 text-xs">18ms</span>
          </div>

          <!-- Session Uptime -->
          <div class="hidden md:flex items-center gap-1">
            <span class="text-[10px] text-slate-400">UPTIME:</span>
            <span id="telemetry-uptime" class="font-bold text-purple-300 text-xs">00:00:00</span>
          </div>

          <!-- Mini Audio Waveform Pulse -->
          <div class="flex items-center gap-0.5 h-3 px-1" title="Audio / Matrix Pulse">
            <span class="w-0.5 h-full bg-cyan-400 rounded-full animate-pulse"></span>
            <span class="w-0.5 h-2/3 bg-emerald-400 rounded-full animate-pulse delay-75"></span>
            <span class="w-0.5 h-full bg-purple-400 rounded-full animate-pulse delay-150"></span>
            <span class="w-0.5 h-1/2 bg-amber-400 rounded-full animate-pulse delay-100"></span>
          </div>

          <!-- Minimize Toggle Button -->
          <button id="btn-minimize-telemetry" class="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-all ml-1" title="Thu gọn bảng giám sát">
            ${getIconSvg('chevron-down', 'w-3.5 h-3.5')}
          </button>
        </div>

        <!-- Minimized Floating Badge -->
        <div id="telemetry-minimized" class="hidden cursor-pointer bg-slate-950/90 border border-cyan-500/40 rounded-full px-3 py-1.5 shadow-xl flex items-center gap-2 hover:scale-105 transition-all">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span class="text-[10px] font-bold text-cyan-400 code-font">60 FPS</span>
          <span class="text-slate-400">${getIconSvg('chevron-up', 'w-3 h-3')}</span>
        </div>
      </div>
    `;
  }

  bindEvents() {
    const minBtn = document.getElementById('btn-minimize-telemetry');
    const minBadge = document.getElementById('telemetry-minimized');
    const expanded = document.getElementById('telemetry-expanded');

    minBtn?.addEventListener('click', () => {
      expanded?.classList.add('hidden');
      minBadge?.classList.remove('hidden');
      this.isMinimized = true;
      if (this.sound && this.sound.playClick) this.sound.playClick(450);
    });

    minBadge?.addEventListener('click', () => {
      minBadge?.classList.add('hidden');
      expanded?.classList.remove('hidden');
      this.isMinimized = false;
      if (this.sound && this.sound.playClick) this.sound.playClick(500);
    });
  }

  startFpsLoop() {
    const fpsEl = document.getElementById('telemetry-fps');
    const minBadge = document.getElementById('telemetry-minimized');

    const updateLoop = (currentTime) => {
      this.frameCount++;
      const delta = currentTime - this.lastTime;

      if (delta >= 1000) {
        this.fps = Math.round((this.frameCount * 1000) / delta);
        this.frameCount = 0;
        this.lastTime = currentTime;

        if (fpsEl) {
          fpsEl.innerText = this.fps;
          if (this.fps >= 55) {
            fpsEl.className = 'font-bold text-cyan-400 text-xs';
          } else if (this.fps >= 30) {
            fpsEl.className = 'font-bold text-amber-400 text-xs';
          } else {
            fpsEl.className = 'font-bold text-rose-400 text-xs';
          }
        }

        if (minBadge) {
          const badgeText = minBadge.querySelector('span:nth-child(2)');
          if (badgeText) badgeText.innerText = `${this.fps} FPS`;
        }
      }

      requestAnimationFrame(updateLoop);
    };

    requestAnimationFrame(updateLoop);
  }

  startUptimeLoop() {
    const uptimeEl = document.getElementById('telemetry-uptime');
    setInterval(() => {
      if (!uptimeEl) return;
      const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
      const hours = Math.floor(elapsed / 3600).toString().padStart(2, '0');
      const minutes = Math.floor((elapsed % 3600) / 60).toString().padStart(2, '0');
      const seconds = (elapsed % 60).toString().padStart(2, '0');
      uptimeEl.innerText = `${hours}:${minutes}:${seconds}`;
    }, 1000);
  }

  startPingSimulation() {
    const pingEl = document.getElementById('telemetry-ping');
    setInterval(() => {
      if (!pingEl) return;
      // Slight natural variance between 15ms and 24ms
      this.ping = Math.floor(15 + Math.random() * 9);
      pingEl.innerText = `${this.ping}ms`;
    }, 4000);
  }
}
