import { getIconSvg } from '../utils/icons.js';

export class ProjectFilter {
  constructor(soundManager) {
    this.sound = soundManager;
    this.container = document.getElementById('project-filter-container');
    this.activeFilter = 'all';

    if (this.container) {
      this.init();
    }
  }

  init() {
    this.render();
    this.bindEvents();
  }

  render() {
    const filters = [
      { id: 'all', label: 'Tất Cả Dự Án', count: 5, icon: 'layers' },
      { id: 'dotnet', label: '.NET Core & C#', count: 2, icon: 'server' },
      { id: 'angular', label: 'Angular Ecosystem', count: 3, icon: 'layout' },
      { id: 'realtime', label: 'SignalR & Electron', count: 1, icon: 'zap' },
      { id: 'vue', label: 'Vue.js & Vite DWH', count: 1, icon: 'bar-chart-3' }
    ];

    this.container.innerHTML = `
      <div class="flex flex-wrap items-center justify-center gap-2 mb-8 code-font text-xs">
        ${filters.map(f => `
          <button data-filter="${f.id}" class="project-filter-btn px-3.5 py-2 rounded-2xl border transition-all flex items-center gap-2 ${
            f.id === this.activeFilter
              ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-purple-400/80 shadow-lg shadow-purple-500/25 font-bold scale-105'
              : 'bg-slate-900/80 border-white/10 text-slate-300 hover:text-white hover:border-purple-500/30'
          }">
            ${getIconSvg(f.icon, 'w-3.5 h-3.5')}
            <span>${f.label}</span>
            <span class="px-1.5 py-0.2 rounded-full text-[10px] ${
              f.id === this.activeFilter ? 'bg-white/20 text-white' : 'bg-slate-950 text-slate-400'
            }">${f.count}</span>
          </button>
        `).join('')}
      </div>
    `;
  }

  bindEvents() {
    this.container.addEventListener('click', (e) => {
      const btn = e.target.closest('.project-filter-btn');
      if (btn) {
        const filter = btn.getAttribute('data-filter');
        if (filter && filter !== this.activeFilter) {
          this.applyFilter(filter);
        }
      }
    });
  }

  applyFilter(filterId) {
    this.activeFilter = filterId;
    if (this.sound && this.sound.playClick) this.sound.playClick(520);
    this.render();

    const cards = document.querySelectorAll('.project-card-item');
    cards.forEach(card => {
      const categories = (card.getAttribute('data-category') || '').split(' ');
      if (filterId === 'all' || categories.includes(filterId)) {
        card.classList.remove('hidden');
        card.classList.add('animate-fade-in');
      } else {
        card.classList.add('hidden');
        card.classList.remove('animate-fade-in');
      }
    });
  }
}
