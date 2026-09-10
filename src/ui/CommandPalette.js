import { getIconSvg } from '../utils/icons.js';

export class CommandPalette {
  constructor(appContext) {
    this.app = appContext;
    this.modalEl = null;
    this.selectedIndex = 0;
    this.filteredItems = [];
    this.isOpen = false;

    this.commands = [
      // 1. Hồ Sơ & Dự Án
      { id: 'resume', title: 'Xem Hồ Sơ Năng Lực Ứng Viên (CV)', cat: 'Hồ Sơ', icon: 'file-text', action: () => this.app.resumeModal?.open() },
      { id: 'dev-id', title: 'Xem Thẻ Căn Cước Số Dev ID (License & Stats)', cat: 'Hồ Sơ', icon: 'shield-check', action: () => this.app.devIdModal?.open() },
      { id: 'proj-hrm', title: 'Dự án: HRM & Workflow Engine (.NET Core / Angular)', cat: 'Dự Án', icon: 'server', action: () => this.app.projectModal?.open('hrm') },
      { id: 'proj-supplier', title: 'Dự án: Cổng Thông Tin Chuỗi Cung Ứng (.NET MVC / Angular)', cat: 'Dự Án', icon: 'workflow', action: () => this.app.projectModal?.open('supplier') },
      { id: 'proj-bpm', title: 'Dự án: BPM - Portal Quy Trình Doanh Nghiệp (Angular)', cat: 'Dự Án', icon: 'layout', action: () => this.app.projectModal?.open('bpm') },
      { id: 'proj-pos', title: 'Dự án: POS Customer Screen (Electron / SignalR Realtime)', cat: 'Dự Án', icon: 'monitor', action: () => this.app.projectModal?.open('pos') },
      { id: 'proj-kpi', title: 'Dự án: Dashboard KPI DWH Phân Tích Dữ Liệu (Vue.js / Vite)', cat: 'Dự Án', icon: 'bar-chart-3', action: () => this.app.projectModal?.open('kpi') },

      // 2. Trò Chơi Giải Trí (10 Casual Games)
      { id: 'game-snake', title: 'Game: Cyber Snake (Rắn Neon Lượng Tử)', cat: 'Game Giải Trí', icon: 'activity', action: () => this.launchCasualGame('snake') },
      { id: 'game-defender', title: 'Game: Cyber Defender (Bắn Phi Thuyền Vũ Trụ)', cat: 'Game Giải Trí', icon: 'rocket', action: () => this.launchCasualGame('defender') },
      { id: 'game-breaker', title: 'Game: Firewall Breaker (Phá Tường Lửa Bảo Mật)', cat: 'Game Giải Trí', icon: 'boxes', action: () => this.launchCasualGame('breaker') },
      { id: 'game-runner', title: 'Game: Neon Runner 3D (Đua Xe Cao Tốc Ánh Sáng)', cat: 'Game Giải Trí', icon: 'gauge', action: () => this.launchCasualGame('runner') },
      { id: 'game-flappy', title: 'Game: Flappy Cyber Drone (Drone Luồn Khe Laser)', cat: 'Game Giải Trí', icon: 'navigation', action: () => this.launchCasualGame('flappy') },
      { id: 'game-2048', title: 'Game: Matrix 2048 (Hợp Nhất Khối Byte Lõi Lượng Tử)', cat: 'Game Giải Trí', icon: 'binary', action: () => this.launchCasualGame('2048') },
      { id: 'game-pong', title: 'Game: Cyber Pong (Bóng Bàn Đối Đầu Mạng Nơ-ron AI)', cat: 'Game Giải Trí', icon: 'circle-dot', action: () => this.launchCasualGame('pong') },
      { id: 'game-whack', title: 'Game: Whack-A-Bug (Đập Sâu Bọ Server Diệt Virus)', cat: 'Game Giải Trí', icon: 'target', action: () => this.launchCasualGame('whack') },
      { id: 'game-tetris', title: 'Game: Tetris Matrix (Xếp Gạch Neon Lượng Tử & Ghost)', cat: 'Game Giải Trí', icon: 'shapes', action: () => this.launchCasualGame('tetris') },
      { id: 'game-mines', title: 'Game: Cyber Minesweeper (Gỡ Bom EMP Lõi Lượng Tử)', cat: 'Game Giải Trí', icon: 'shield-alert', action: () => this.launchCasualGame('mines') },

      // 3. Đấu Trường Dev (6 Dev Arenas)
      { id: 'dev-quiz', title: 'Đấu Trường: Git & System Architecture Arena (.NET, Git)', cat: 'Đấu Trường Dev', icon: 'terminal', action: () => this.launchDevGame('quiz') },
      { id: 'dev-typer', title: 'Đấu Trường: Terminal Speed Typer (Luyện Gõ Lệnh CLI)', cat: 'Đấu Trường Dev', icon: 'keyboard', action: () => this.launchDevGame('typer') },
      { id: 'dev-hunter', title: 'Đấu Trường: Code Bug Hunter (Truy Tìm & Vá Lỗi C#/SQL)', cat: 'Đấu Trường Dev', icon: 'bug', action: () => this.launchDevGame('hunter') },
      { id: 'dev-sql', title: 'Đấu Trường: SQL Query Forge (Tối Ưu Chỉ Mục & Truy Vấn)', cat: 'Đấu Trường Dev', icon: 'database', action: () => this.launchDevGame('sql') },
      { id: 'dev-git', title: 'Đấu Trường: Git Branch Master (Mô Phỏng Cây Nhánh Git)', cat: 'Đấu Trường Dev', icon: 'git-branch', action: () => this.launchDevGame('git') },
      { id: 'dev-matrix', title: 'Đấu Trường: Code Syntax Matrix (Ghi Nhớ Cặp Thẻ Lập Trình)', cat: 'Đấu Trường Dev', icon: 'cpu', action: () => this.launchDevGame('matrix') },

      // 4. Phòng Lab Kỹ Thuật
      { id: 'lab-linq', title: 'Phòng Lab: C# LINQ Pipeline & Execution Sandbox', cat: 'Phòng Lab Dev', icon: 'database', action: () => {
        document.getElementById('cipher')?.scrollIntoView({ behavior: 'smooth' });
      }},
      { id: 'lab-jwt', title: 'Phòng Lab: Soi & Giải Mã Token JWT', cat: 'Phòng Lab Dev', icon: 'lock', action: () => this.launchLab('jwt') },
      { id: 'lab-sql', title: 'Phòng Lab: Đo Tốc Độ SQL Query Benchmark (1.5M Rows)', cat: 'Phòng Lab Dev', icon: 'gauge', action: () => this.launchLab('sql') },
      { id: 'lab-xss', title: 'Phòng Lab: Bộ Lọc Bảo Mật XSS / SQL Injection', cat: 'Phòng Lab Dev', icon: 'shield-check', action: () => this.launchLab('xss') },
      { id: 'lab-micro', title: 'Phòng Lab: Mô Phỏng Microservices & SignalR Hub', cat: 'Phòng Lab Dev', icon: 'network', action: () => this.launchLab('micro') },
      { id: 'contact-dispatch', title: 'Kênh Liên Hệ: Trạm Phát Tín Hiệu Cyber Dispatcher', cat: 'Liên Hệ', icon: 'radio', action: () => {
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => document.getElementById('disp-sender')?.focus(), 350);
      }},
      { id: 'cli-terminal', title: 'Bàn Điều Khiển Hacker Terminal CLI', cat: 'Phòng Lab Dev', icon: 'terminal', action: () => {
        document.getElementById('terminal-section')?.scrollIntoView({ behavior: 'smooth' });
      }},

      // 5. Cài Đặt & Điều Hướng Nhanh
      { id: 'theme-cyan', title: 'Đổi Tông Màu: Cyan Nexus (Mặc định)', cat: 'Tùy Chỉnh Màu', icon: 'palette', action: () => this.app.themeSwitcher?.applyTheme('cyan') },
      { id: 'theme-emerald', title: 'Đổi Tông Màu: Emerald Hacker (Xanh Ma Trận)', cat: 'Tùy Chỉnh Màu', icon: 'palette', action: () => this.app.themeSwitcher?.applyTheme('emerald') },
      { id: 'theme-amber', title: 'Đổi Tông Màu: Amber Cyberpunk (Vàng Năng Lượng)', cat: 'Tùy Chỉnh Màu', icon: 'palette', action: () => this.app.themeSwitcher?.applyTheme('amber') },
      { id: 'theme-purple', title: 'Đổi Tông Màu: Synthwave Purple (Tím Neon)', cat: 'Tùy Chỉnh Màu', icon: 'palette', action: () => this.app.themeSwitcher?.applyTheme('purple') },

      { id: 'toggle-bgm', title: 'Bật / Tắt Nhạc Nền Cyber Synthwave (BGM)', cat: 'Âm Thanh', icon: 'music', action: () => document.getElementById('btn-toggle-bgm')?.click() },
      { id: 'toggle-sfx', title: 'Bật / Tắt Hiệu Ứng Âm Thanh Tương Tác (SFX)', cat: 'Âm Thanh', icon: 'volume-2', action: () => document.getElementById('btn-toggle-sfx')?.click() },
      { id: 'matrix-rain', title: 'Easter Egg: Kích Hoạt Mưa Ký Tự Ma Trận (Konami Rain)', cat: 'Hiệu Ứng', icon: 'sparkles', action: () => this.app.konami?.triggerMatrixRain() },
      
      { id: 'nav-exp', title: 'Điều hướng: Kinh Nghiệm Làm Việc (Kids Plaza 3+ năm)', cat: 'Điều Hướng', icon: 'briefcase', action: () => this.scrollTo('experience') },
      { id: 'nav-skills', title: 'Điều hướng: Kỹ Năng Kỹ Thuật (Tech Arsenal)', cat: 'Điều Hướng', icon: 'cpu', action: () => this.scrollTo('skills') },
      { id: 'nav-projects', title: 'Điều hướng: Dự Án Thực Chiến Tiêu Biểu', cat: 'Điều Hướng', icon: 'folder-git-2', action: () => this.scrollTo('projects') },
      { id: 'nav-contact', title: 'Điều hướng: Kết Nối & Thông Tin Liên Hệ', cat: 'Điều Hướng', icon: 'mail', action: () => this.scrollTo('contact') }
    ];

    this.filteredItems = [...this.commands];
    this.init();
  }

  init() {
    this.createDOM();
    this.bindKeyboard();
  }

  createDOM() {
    let el = document.getElementById('command-palette-root');
    if (!el) {
      el = document.createElement('div');
      el.id = 'command-palette-root';
      document.body.appendChild(el);
    }
    this.modalEl = el;
  }

  bindKeyboard() {
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        this.toggle();
      }

      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });

    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('.btn-open-command-palette');
      if (trigger) {
        this.open();
      }

      if (e.target.closest('#btn-close-palette') || e.target.classList.contains('palette-backdrop')) {
        this.close();
      }
    });
  }

  toggle() {
    if (this.isOpen) this.close();
    else this.open();
  }

  open() {
    this.isOpen = true;
    this.selectedIndex = 0;
    this.filteredItems = [...this.commands];

    if (this.app.sound && this.app.sound.playClick) {
      this.app.sound.playClick(600);
    }

    this.render();
    document.body.style.overflow = 'hidden';

    setTimeout(() => {
      const input = document.getElementById('palette-input');
      input?.focus();
    }, 50);
  }

  close() {
    this.isOpen = false;
    if (this.modalEl) this.modalEl.innerHTML = '';
    document.body.style.overflow = '';
  }

  render() {
    this.modalEl.innerHTML = `
      <div class="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-3 palette-backdrop bg-slate-950/80 backdrop-blur-xl animate-fade-in">
        <div class="relative w-full max-w-2xl bg-slate-900/95 border border-cyan-500/40 rounded-3xl p-4 shadow-2xl code-font overflow-hidden" onclick="event.stopPropagation()">
          
          <!-- Corner brackets -->
          <div class="corner-bracket-tl border-cyan-400"></div>
          <div class="corner-bracket-tr border-cyan-400"></div>
          <div class="corner-bracket-bl border-cyan-400"></div>
          <div class="corner-bracket-br border-cyan-400"></div>

          <!-- Input Bar -->
          <div class="relative flex items-center border-b border-white/10 pb-3 mb-2">
            <span class="pl-2 text-cyan-400 mr-2">${getIconSvg('search', 'w-5 h-5 text-cyan-400')}</span>
            <input id="palette-input" type="text" autocomplete="off" spellcheck="false"
              placeholder="Gõ tên trò chơi, dự án, công cụ lab, lệnh cài đặt..."
              class="w-full bg-transparent text-sm sm:text-base text-white focus:outline-none placeholder:text-slate-500 font-sans" />
            <span class="text-[10px] px-2 py-0.5 rounded-lg bg-slate-950 border border-white/10 text-slate-400 shrink-0 ml-2">ESC để đóng</span>
          </div>

          <!-- Results List -->
          <div id="palette-results" class="max-h-[55vh] overflow-y-auto cyber-scroll space-y-1 py-1">
            ${this.renderItemsHtml()}
          </div>

          <!-- Footer Tips -->
          <div class="flex items-center justify-between pt-2.5 mt-2 border-t border-white/10 text-[10px] text-slate-400">
            <span class="flex items-center gap-2">
              <span><b>↑ ↓</b> để điều hướng</span>
              <span>•</span>
              <span><b>ENTER</b> để chọn</span>
            </span>
            <span class="text-cyan-400 font-bold">${this.filteredItems.length} tác vụ khả dụng</span>
          </div>

        </div>
      </div>
    `;

    const input = document.getElementById('palette-input');
    input?.addEventListener('input', (e) => {
      this.filter(e.target.value);
    });

    input?.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        this.selectedIndex = (this.selectedIndex + 1) % this.filteredItems.length;
        this.updateSelection();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        this.selectedIndex = (this.selectedIndex - 1 + this.filteredItems.length) % this.filteredItems.length;
        this.updateSelection();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        this.executeSelected();
      }
    });

    this.bindItemClicks();
  }

  filter(query) {
    const q = query.trim().toLowerCase();
    if (!q) {
      this.filteredItems = [...this.commands];
    } else {
      this.filteredItems = this.commands.filter(cmd => 
        cmd.title.toLowerCase().includes(q) ||
        cmd.cat.toLowerCase().includes(q)
      );
    }

    this.selectedIndex = 0;
    const resultsContainer = document.getElementById('palette-results');
    if (resultsContainer) {
      resultsContainer.innerHTML = this.renderItemsHtml();
      this.bindItemClicks();
    }
  }

  renderItemsHtml() {
    if (this.filteredItems.length === 0) {
      return `
        <div class="py-8 text-center text-xs text-slate-500 font-sans">
          Không tìm thấy lệnh hoặc trò chơi nào khớp với từ khóa.
        </div>
      `;
    }

    return this.filteredItems.map((item, idx) => {
      const isSelected = idx === this.selectedIndex;
      const iconSvg = getIconSvg(item.icon, `w-4 h-4 ${isSelected ? 'text-cyan-300' : 'text-slate-400'}`, 18);
      return `
        <div class="palette-item flex items-center justify-between px-3 py-2.5 rounded-2xl cursor-pointer transition-all ${isSelected ? 'bg-cyan-500/20 border border-cyan-500/40 text-white font-bold' : 'hover:bg-white/5 border border-transparent text-slate-300'}" data-index="${idx}">
          <div class="flex items-center gap-3">
            <span class="p-1.5 rounded-xl bg-slate-950/80 border border-white/10 shrink-0">
              ${iconSvg}
            </span>
            <span class="text-xs sm:text-[13px] font-sans">${item.title}</span>
          </div>
          <span class="text-[10px] px-2 py-0.5 rounded-full bg-slate-950/80 border border-white/10 text-slate-400 shrink-0 ml-2">
            ${item.cat}
          </span>
        </div>
      `;
    }).join('');
  }

  updateSelection() {
    const items = document.querySelectorAll('.palette-item');
    items.forEach((item, idx) => {
      if (idx === this.selectedIndex) {
        item.className = 'palette-item flex items-center justify-between px-3 py-2.5 rounded-2xl cursor-pointer transition-all bg-cyan-500/20 border border-cyan-500/40 text-white font-bold';
        item.scrollIntoView({ block: 'nearest' });
      } else {
        item.className = 'palette-item flex items-center justify-between px-3 py-2.5 rounded-2xl cursor-pointer transition-all hover:bg-white/5 border border-transparent text-slate-300';
      }
    });
  }

  bindItemClicks() {
    document.querySelectorAll('.palette-item').forEach(item => {
      item.addEventListener('click', () => {
        const idx = parseInt(item.getAttribute('data-index') || '0', 10);
        this.selectedIndex = idx;
        this.executeSelected();
      });
    });
  }

  executeSelected() {
    const selected = this.filteredItems[this.selectedIndex];
    if (selected && selected.action) {
      this.close();
      selected.action();
    }
  }

  launchCasualGame(gameKey) {
    const btnCasual = document.getElementById('btn-cat-casual');
    btnCasual?.click();
    this.app.switchCasualGame(gameKey);
    document.getElementById('arcade')?.scrollIntoView({ behavior: 'smooth' });
  }

  launchDevGame(gameKey) {
    const btnDev = document.getElementById('btn-cat-dev');
    btnDev?.click();
    this.app.switchDevGame(gameKey);
    document.getElementById('arcade')?.scrollIntoView({ behavior: 'smooth' });
  }

  launchLab(toolType) {
    document.getElementById('cipher')?.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => {
      const btn = document.querySelector(`.cipher-tab-btn[data-type="${toolType}"]`);
      btn?.click();
    }, 300);
  }

  scrollTo(sectionId) {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  }
}
