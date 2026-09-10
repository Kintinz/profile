import { getIconSvg } from '../utils/icons.js';

export class ThemeSwitcher {
  constructor(soundManager) {
    this.sound = soundManager;
    this.storageKey = 'nexus_cyber_theme';
    this.themes = [
      { id: 'cyan', name: 'Cyan Nexus', color: '#06b6d4', ringClass: 'ring-cyan-400', bgClass: 'bg-cyan-500' },
      { id: 'emerald', name: 'Emerald Hacker', color: '#10b981', ringClass: 'ring-emerald-400', bgClass: 'bg-emerald-500' },
      { id: 'amber', name: 'Amber Cyberpunk', color: '#f59e0b', ringClass: 'ring-amber-400', bgClass: 'bg-amber-500' },
      { id: 'purple', name: 'Synthwave Purple', color: '#a855f7', ringClass: 'ring-purple-400', bgClass: 'bg-purple-500' }
    ];

    this.currentTheme = localStorage.getItem(this.storageKey) || 'cyan';
    this.init();
  }

  init() {
    this.applyTheme(this.currentTheme, false);
    this.renderUI();
  }

  renderUI() {
    const container = document.getElementById('theme-switcher-container');
    if (!container) return;

    container.innerHTML = `
      <div class="relative group">
        <button id="btn-theme-dropdown" class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900/90 border border-white/10 hover:border-cyan-400/40 text-slate-300 hover:text-white transition-all text-xs code-font">
          <span class="w-2.5 h-2.5 rounded-full inline-block shadow-sm" style="background-color: var(--theme-color, #06b6d4);"></span>
          <span class="hidden xl:inline text-[11px]" id="current-theme-label">${this.getThemeName(this.currentTheme)}</span>
          <span class="text-slate-400">${getIconSvg('chevron-down', 'w-3 h-3')}</span>
        </button>
        <div id="theme-menu" class="hidden absolute right-0 top-full mt-2 w-48 bg-slate-950/95 border border-white/15 rounded-2xl p-2 shadow-2xl backdrop-blur-2xl z-50 flex flex-col gap-1">
          <div class="px-2 py-1 text-[10px] uppercase tracking-wider text-slate-400 code-font border-b border-white/10">
            Tông Màu Ma Trận
          </div>
          ${this.themes.map(t => `
            <button class="theme-option-btn flex items-center justify-between w-full px-2.5 py-1.5 rounded-xl text-left text-xs code-font hover:bg-white/10 transition-colors ${this.currentTheme === t.id ? 'text-white font-bold bg-white/5' : 'text-slate-300'}" data-theme="${t.id}">
              <span class="flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full" style="background-color: ${t.color};"></span>
                <span>${t.name}</span>
              </span>
              ${this.currentTheme === t.id ? `<span class="text-cyan-400">${getIconSvg('check', 'w-3.5 h-3.5')}</span>` : ''}
            </button>
          `).join('')}
        </div>
      </div>
    `;

    const btnDropdown = document.getElementById('btn-theme-dropdown');
    const menu = document.getElementById('theme-menu');

    if (btnDropdown && menu) {
      btnDropdown.addEventListener('click', (e) => {
        e.stopPropagation();
        menu.classList.toggle('hidden');
        if (this.sound && this.sound.playClick) this.sound.playClick(450);
      });

      document.addEventListener('click', (e) => {
        if (!e.target.closest('#theme-switcher-container')) {
          menu.classList.add('hidden');
        }
      });
    }

    container.querySelectorAll('.theme-option-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const themeId = btn.getAttribute('data-theme');
        if (themeId) {
          this.applyTheme(themeId, true);
          menu?.classList.add('hidden');
          this.renderUI();
        }
      });
    });
  }

  applyTheme(themeId, playSound = true) {
    const theme = this.themes.find(t => t.id === themeId) || this.themes[0];
    this.currentTheme = theme.id;
    localStorage.setItem(this.storageKey, theme.id);

    document.documentElement.setAttribute('data-cyber-theme', theme.id);
    document.documentElement.style.setProperty('--theme-color', theme.color);

    if (playSound && this.sound && this.sound.playLaser) {
      this.sound.playLaser();
    }
  }

  getThemeName(id) {
    const t = this.themes.find(item => item.id === id);
    return t ? t.name : 'Cyber Theme';
  }
}
