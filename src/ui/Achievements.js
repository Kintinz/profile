import { getIconSvg } from '../utils/icons.js';
export class Achievements {
  constructor(soundManager) {
    this.sound = soundManager;
    this.unlocked = JSON.parse(localStorage.getItem('nexus_achievements') || '{}');
    this.container = document.createElement('div');
    this.container.id = 'achievement-toast-container';
    this.container.className = 'fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none';
    document.body.appendChild(this.container);
  }

  unlock(id, title, desc, icon = '🎖️') {
    if (this.unlocked[id]) return;

    this.unlocked[id] = { title, desc, icon, time: Date.now() };
    localStorage.setItem('nexus_achievements', JSON.stringify(this.unlocked));

    this.sound.playSuccess();
    this.showToast(title, desc, icon);
  }

  showToast(title, desc, icon) {
    let iconSvg = '';
    if (typeof icon === 'string' && icon.startsWith('<svg')) {
      iconSvg = icon;
    } else {
      const iconMap = {
        '⚡': 'zap', '🚀': 'rocket', '👑': 'crown', '🧱': 'boxes',
        '🧠': 'brain', '🔐': 'lock', '🏆': 'trophy', '💻': 'terminal',
        '🎵': 'music', '🐍': 'activity', '🏎️': 'gauge', '🛸': 'navigation',
        '🔢': 'binary', '🏓': 'circle-dot', '👾': 'target', '🧩': 'shapes',
        '💣': 'shield-alert', '⚔️': 'terminal', '🕶️': 'glasses'
      };
      const iconName = iconMap[icon] || icon;
      iconSvg = getIconSvg(iconName, 'w-5 h-5 text-amber-400', 20) || getIconSvg('award', 'w-5 h-5 text-amber-400', 20);
    }

    const toast = document.createElement('div');
    toast.className = 'pointer-events-auto bg-slate-900/95 border border-amber-500/50 shadow-2xl rounded-2xl p-4 flex items-center gap-3.5 max-w-sm transform translate-y-6 opacity-0 transition-all duration-300';
    toast.innerHTML = [
      '<div class="w-11 h-11 rounded-xl bg-amber-500/20 border border-amber-500/40 text-2xl flex items-center justify-center shrink-0">',
      '  ' + iconSvg,
      '</div>',
      '<div>',
      '  <div class="flex items-center gap-2">',
      '    <span class="text-[9px] uppercase tracking-wider font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">Thành Tựu Mới!</span>',
      '  </div>',
      '  <h4 class="text-xs font-bold text-white mt-0.5">' + title + '</h4>',
      '  <p class="text-[11px] text-slate-300">' + desc + '</p>',
      '</div>'
    ].join('');

    this.container.appendChild(toast);

    setTimeout(() => {
      toast.classList.remove('translate-y-6', 'opacity-0');
    }, 50);

    setTimeout(() => {
      toast.classList.add('translate-y-6', 'opacity-0');
      setTimeout(() => toast.remove(), 400);
    }, 4500);
  }

  getUnlockedCount() {
    return Object.keys(this.unlocked).length;
  }
}
