// TerminalSpeedTyper.js - Luyện gõ lệnh CLI thần tốc (.NET, Git, Docker, SQL, Linux, K8s)
import { getIconSvg } from '../utils/icons.js';

export class TerminalSpeedTyper {
  constructor(canvasId) {
    this.canvasId = canvasId;
    this.container = document.getElementById(canvasId)?.parentElement;
    this.audioCtx = null;

    this.commands = [
      // .NET & C# CLI
      { cmd: 'dotnet new webapi -n OrderService -controllers', cat: 'dotnet', desc: 'Tạo Web API .NET với Controller mẫu' },
      { cmd: 'dotnet ef migrations add AddPaymentTable -o Data/Migrations', cat: 'dotnet', desc: 'Sinh Migration EF Core mới vào thư mục chỉ định' },
      { cmd: 'dotnet ef database update --connection "Server=localhost;Database=AppDb;"', cat: 'dotnet', desc: 'Chạy migration cập nhật schema database' },
      { cmd: 'dotnet watch run --launch-profile "Development"', cat: 'dotnet', desc: 'Chạy ứng dụng với Hot Reload trong môi trường Dev' },
      { cmd: 'dotnet test --logger "console;verbosity=detailed"', cat: 'dotnet', desc: 'Chạy Unit Test với log chi tiết' },
      { cmd: 'dotnet publish -c Release -r linux-x64 --self-contained true', cat: 'dotnet', desc: 'Đóng gói ứng dụng độc lập cho Linux 64-bit' },
      { cmd: 'dotnet add package Microsoft.EntityFrameworkCore.SqlServer', cat: 'dotnet', desc: 'Thêm thư viện EF Core SQL Server từ NuGet' },
      { cmd: 'dotnet format whitespace --include-generated false', cat: 'dotnet', desc: 'Format code toàn dự án chuẩn phong cách C#' },
      
      // Git CLI
      { cmd: 'git checkout -b feature/jwt-auth origin/main', cat: 'git', desc: 'Tạo nhánh mới từ main và chuyển sang nhánh đó' },
      { cmd: 'git commit -am "feat: implement refresh token rotation with redis"', cat: 'git', desc: 'Commit tất cả thay đổi kèm message chuẩn Conventional' },
      { cmd: 'git cherry-pick 7f3a9b2', cat: 'git', desc: 'Bốc lẻ commit 7f3a9b2 từ nhánh khác vào nhánh hiện tại' },
      { cmd: 'git rebase -i HEAD~3', cat: 'git', desc: 'Tương tác gom gộp (squash/edit) 3 commit gần nhất' },
      { cmd: 'git reflog expire --expire=now --all && git gc --prune=now', cat: 'git', desc: 'Dọn sạch commit mồ côi và tối ưu hóa git repository' },
      { cmd: 'git push origin --delete feature/old-payment', cat: 'git', desc: 'Xóa nhánh feature cũ trên remote repository' },
      { cmd: 'git stash push -m "wip: bugfix cart" --include-untracked', cat: 'git', desc: 'Tạm cất mã nguồn đang dở dang bao gồm cả file mới' },
      { cmd: 'git diff --staged --stat', cat: 'git', desc: 'Xem thống kê thay đổi giữa các file đã git add' },

      // Docker & Linux
      { cmd: 'docker compose -f docker-compose.prod.yml up -d --build', cat: 'devops', desc: 'Build và khởi chạy toàn bộ container nền tảng production' },
      { cmd: 'docker exec -it sqlserver /opt/mssql-tools/bin/sqlcmd -S localhost -U sa', cat: 'devops', desc: 'Truy cập dòng lệnh SQL Server bên trong Docker container' },
      { cmd: 'docker logs -f --tail 100 api-gateway', cat: 'devops', desc: 'Xem trực tiếp (stream) 100 dòng log gần nhất của container' },
      { cmd: 'kubectl get pods -n production -l app=payment-service -o wide', cat: 'devops', desc: 'Liệt kê pods chi tiết theo namespace và label trong K8s' },
      { cmd: 'kubectl rollout restart deployment/order-processor -n production', cat: 'devops', desc: 'Zero-downtime rolling restart cho microservice' },
      { cmd: 'grep -rnw "/var/log/nginx/" -e "502 Bad Gateway" | tail -n 20', cat: 'devops', desc: 'Tìm nhanh mã lỗi 502 trong log hệ thống Linux' },
      { cmd: 'netstat -tulnp | grep :5000', cat: 'devops', desc: 'Kiểm tra process nào đang chiếm port 5000 trên server' },
      { cmd: 'chmod 600 ~/.ssh/id_ed25519 && ssh -i ~/.ssh/id_ed25519 root@prod-srv', cat: 'devops', desc: 'Bảo mật SSH key và kết nối tới server sản xuất' },

      // SQL & DB CLI
      { cmd: 'SELECT TOP 10 o.Id, c.Name, SUM(d.Total) FROM Orders o WITH (NOLOCK)', cat: 'sql', desc: 'Truy vấn bảng đơn hàng không chờ lock với NOLOCK hint' },
      { cmd: 'CREATE NONCLUSTERED INDEX IX_Users_Email ON Users(Email) INCLUDE(FullName, Role);', cat: 'sql', desc: 'Tạo Index bao gồm (Covering Index) tối ưu hóa truy vấn' },
      { cmd: 'DBCC FREEPROCCACHE; DBCC DROPCLEANBUFFERS;', cat: 'sql', desc: 'Xóa cache execution plan và memory buffer để test tốc độ thực tế' },
      { cmd: 'EXEC sp_updatestats;', cat: 'sql', desc: 'Cập nhật lại toàn bộ số liệu thống kê index của cơ sở dữ liệu' },

      // TypeScript & Frontend
      { cmd: 'npx vite build --emptyOutDir && npx preview --port 8080', cat: 'web', desc: 'Build production và xem thử web server local' },
      { cmd: 'npm run lint -- --fix && npm run type-check', cat: 'web', desc: 'Kiểm tra lỗi TypeScript và tự động sửa format code' },
      { cmd: 'npx tailwindcss -i ./src/input.css -o ./dist/output.css --minify', cat: 'web', desc: 'Biên dịch và nén nhỏ CSS tối đa cho production' },

      // Python / Go / Tools
      { cmd: 'python -m venv .venv && source .venv/bin/activate && pip install -r req.txt', cat: 'tools', desc: 'Tạo và kích hoạt môi trường ảo Python cô lập' },
      { cmd: 'go build -ldflags="-s -w" -o server main.go', cat: 'tools', desc: 'Biên dịch file thực thi Go lược bỏ debug symbol để siêu nhẹ' }
    ];

    this.selectedCat = 'all';
    this.currentIndex = 0;
    this.filteredCommands = [...this.commands];
    this.activeCommand = null;
    this.typedChars = '';
    
    this.score = 0;
    this.combo = 0;
    this.maxCombo = 0;
    this.completedCount = 0;
    this.totalKeystrokes = 0;
    this.correctKeystrokes = 0;
    
    this.difficulty = 'normal';
    this.initialTime = 60;
    this.timeLeft = 60;
    this.isPaused = false;
    this.isStarted = false;
    this.timer = null;
    this.soundEnabled = true;

    this.init();
  }

  initAudio() {
    if (!this.audioCtx) {
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        this.audioCtx = new AudioCtx();
      } catch (e) {
        console.warn('Web Audio not supported');
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  playBeep(freq = 440, type = 'sine', duration = 0.05, vol = 0.08) {
    if (!this.soundEnabled) return;
    this.initAudio();
    if (!this.audioCtx) return;
    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
      gain.gain.setValueAtTime(vol, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + duration);
    } catch (e) {}
  }

  playSuccess() {
    this.playBeep(587.33, 'triangle', 0.08, 0.1);
    setTimeout(() => this.playBeep(880, 'triangle', 0.12, 0.12), 70);
  }

  playError() {
    this.playBeep(180, 'sawtooth', 0.1, 0.1);
  }

  filterCommands(cat) {
    this.selectedCat = cat;
    if (cat === 'all') {
      this.filteredCommands = [...this.commands];
    } else {
      this.filteredCommands = this.commands.filter(c => c.cat === cat);
    }
    this.filteredCommands.sort(() => Math.random() - 0.5);
    this.currentIndex = 0;
    this.loadNextCommand();
    this.render();
  }

  loadNextCommand() {
    if (this.filteredCommands.length === 0) return;
    if (this.currentIndex >= this.filteredCommands.length) {
      this.currentIndex = 0;
      this.filteredCommands.sort(() => Math.random() - 0.5);
    }
    this.activeCommand = this.filteredCommands[this.currentIndex];
    this.typedChars = '';
    this.renderPrompt();
  }

  init() {
    if (!this.container) return;
    // Replace canvas with HTML terminal interface
    this.container.innerHTML = `
      <div id="terminalTyperRoot" class="w-full h-full flex flex-col justify-between bg-slate-950/80 text-slate-100 font-mono rounded-2xl border border-cyan-500/30 p-3 sm:p-5 select-none relative overflow-hidden shadow-2xl backdrop-blur-md">
        
        <!-- Terminal Header -->
        <div class="flex flex-wrap items-center justify-between pb-3 border-b border-cyan-500/20 gap-2 shrink-0">
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-rose-500/90 shadow-sm shadow-rose-500/50 inline-block animate-pulse"></span>
            <span class="w-3 h-3 rounded-full bg-amber-500/90 shadow-sm shadow-amber-500/50 inline-block"></span>
            <span class="w-3 h-3 rounded-full bg-emerald-500/90 shadow-sm shadow-emerald-500/50 inline-block"></span>
            <span class="text-xs font-bold tracking-widest text-cyan-300 ml-2 flex items-center gap-1.5 drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]">
              <svg class="w-4 h-4 text-cyan-400 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
              TERMINAL SPEED TYPER v3.0
            </span>
          </div>

          <!-- Stats Badges with LCD effect -->
          <div class="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
            <div class="bg-slate-900/90 px-3 py-1 rounded-xl border border-cyan-500/30 shadow-inner flex items-center gap-2">
              <span class="text-slate-400 text-[10px] font-bold">WPM:</span>
              <span id="typerWpm" class="digital-lcd font-bold text-cyan-300 text-base tracking-wider">0</span>
            </div>
            <div class="bg-slate-900/90 px-3 py-1 rounded-xl border border-emerald-500/30 shadow-inner flex items-center gap-2">
              <span class="text-slate-400 text-[10px] font-bold">CHÍNH XÁC:</span>
              <span id="typerAcc" class="digital-lcd font-bold text-emerald-300 text-base tracking-wider">100%</span>
            </div>
            <div class="bg-slate-900/90 px-3 py-1 rounded-xl border border-amber-500/30 shadow-inner flex items-center gap-2">
              <span class="text-slate-400 text-[10px] font-bold">COMBO:</span>
              <span id="typerCombo" class="digital-lcd font-bold text-amber-300 text-base tracking-wider">0x</span>
            </div>
            <select id="typer-diff-select" class="bg-slate-900/90 px-2.5 py-1 rounded-xl border border-cyan-500/40 text-cyan-300 font-bold text-xs focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all cursor-pointer">
              <option value="easy">90s (Dễ)</option>
              <option value="normal" selected>60s (Chuẩn)</option>
              <option value="hard">40s (Thần Tốc)</option>
            </select>
            <div class="bg-slate-900/90 px-3 py-1 rounded-xl border border-rose-500/40 shadow-inner flex items-center gap-2">
              <span class="text-slate-400 text-[10px] font-bold">THỜI GIAN:</span>
              <span id="typerTimer" class="digital-lcd font-bold text-rose-300 text-base tracking-wider">60s</span>
            </div>
          </div>
        </div>

        <!-- Filter category tabs (Cyber Capsules) -->
        <div class="flex flex-wrap gap-1.5 py-2.5 shrink-0 border-b border-cyan-500/10 text-xs">
          <button data-cat="all" class="cat-btn px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200 bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.3)]">Tất cả lệnh</button>
          <button data-cat="dotnet" class="cat-btn px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200 bg-slate-900/80 text-slate-400 border border-slate-800 hover:border-purple-500/50 hover:text-purple-300">.NET & C#</button>
          <button data-cat="git" class="cat-btn px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200 bg-slate-900/80 text-slate-400 border border-slate-800 hover:border-orange-500/50 hover:text-orange-300">Git CLI</button>
          <button data-cat="devops" class="cat-btn px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200 bg-slate-900/80 text-slate-400 border border-slate-800 hover:border-blue-500/50 hover:text-blue-300">Docker & Linux</button>
          <button data-cat="sql" class="cat-btn px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200 bg-slate-900/80 text-slate-400 border border-slate-800 hover:border-emerald-500/50 hover:text-emerald-300">SQL Server</button>
          <button data-cat="web" class="cat-btn px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200 bg-slate-900/80 text-slate-400 border border-slate-800 hover:border-yellow-500/50 hover:text-yellow-300">Web / TS</button>
          <button data-cat="tools" class="cat-btn px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200 bg-slate-900/80 text-slate-400 border border-slate-800 hover:border-indigo-500/50 hover:text-indigo-300">Python & Go</button>
        </div>

        <!-- Main Terminal Body -->
        <div class="my-auto py-3 flex flex-col justify-center gap-3">
          <!-- Command purpose explanation -->
          <div class="bg-slate-900/80 p-3 rounded-xl border border-cyan-500/20 flex items-start gap-3 shadow-inner">
            <span class="px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 shrink-0 shadow-sm" id="typerCatBadge">
              CLI COMMAND
            </span>
            <p id="typerDesc" class="text-sm text-slate-200 leading-relaxed font-sans">
              Đang tải nhiệm vụ gõ lệnh...
            </p>
          </div>

          <!-- Code Display Panel with Corner Brackets & Scanlines -->
          <div class="relative bg-slate-950/90 rounded-2xl p-4 sm:p-6 border border-cyan-500/30 shadow-[0_0_20px_rgba(0,0,0,0.6)] font-mono text-base sm:text-lg overflow-x-auto tracking-wide group">
            <div class="corner-bracket corner-bracket-tl border-cyan-400"></div>
            <div class="corner-bracket corner-bracket-tr border-cyan-400"></div>
            <div class="corner-bracket corner-bracket-bl border-cyan-400"></div>
            <div class="corner-bracket corner-bracket-br border-cyan-400"></div>
            <div class="scanline-overlay pointer-events-none rounded-2xl"></div>

            <div class="flex items-center gap-2 text-xs text-slate-400 mb-3 pb-2 border-b border-slate-800/80">
              <span class="text-emerald-400 font-bold">dev@production-node</span>:<span class="text-cyan-400">~/workspace</span>$
              <span class="text-slate-500 text-[10px] ml-auto">INTERACTIVE CLI SHELL</span>
            </div>
            <div id="typerCodeDisplay" class="leading-relaxed break-all select-none relative z-10 py-1">
              <!-- Rendered characters with highlighting -->
            </div>
          </div>

          <!-- Typing Input Bar with Neon Ring -->
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-cyan-400 font-bold">
              <span>&gt;</span>
            </div>
            <input id="typerInput" type="text" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"
              placeholder="Gõ lệnh trực tiếp tại đây để bắt đầu thử thách..."
              class="w-full bg-slate-900/90 text-cyan-300 font-mono text-sm pl-8 pr-4 py-3.5 rounded-xl border border-cyan-500/40 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/40 placeholder:text-slate-500 transition-all shadow-[inset_0_2px_8px_rgba(0,0,0,0.5)]" />
          </div>
        </div>

        <!-- Terminal Footer Controls -->
        <div class="flex flex-wrap items-center justify-between pt-3 border-t border-cyan-500/20 gap-2 shrink-0 text-xs">
          <div class="flex items-center gap-3 text-slate-300">
            <span>Hoàn thành: <strong id="typerDoneCount" class="digital-lcd text-emerald-300 font-bold text-sm tracking-wide">0</strong> lệnh</span>
            <span class="text-slate-600">|</span>
            <span>Kỷ lục: <strong id="typerMaxCombo" class="digital-lcd text-amber-300 font-bold text-sm tracking-wide">0x</strong></span>
          </div>

          <div class="flex items-center gap-2">
            <button id="typerSkipBtn" class="px-3.5 py-1.5 rounded-xl bg-slate-800/90 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700 transition-all flex items-center gap-1.5 font-medium">
              Bỏ qua ➔
            </button>
            <button id="typerResetBtn" class="px-3.5 py-1.5 rounded-xl bg-rose-950/40 text-rose-300 border border-rose-500/40 hover:bg-rose-900/60 transition-all flex items-center gap-1.5 font-medium shadow-sm">
              Làm mới ↻
            </button>
          </div>
        </div>

        <!-- Pause overlay -->
        <div id="typerPauseOverlay" class="absolute inset-0 bg-slate-950/90 backdrop-blur-md z-20 flex flex-col items-center justify-center gap-4 hidden">
          <div class="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 shadow-lg shadow-amber-500/20">${getIconSvg('pause', 'w-6 h-6 text-amber-300')}</div>
          <div class="text-xl font-bold text-amber-300 tracking-wider">HỆ THỐNG TẠM DỪNG</div>
          <p class="text-xs text-slate-400">Trò chơi đang dừng. Nhấn tiếp tục để chinh phục thử thách!</p>
          <button id="typerResumeBtn" class="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold text-xs hover:from-cyan-500 hover:to-blue-500 transition-all shadow-lg shadow-cyan-600/30 flex items-center gap-2">
            ${getIconSvg('play', 'w-3.5 h-3.5')} TIẾP TỤC NGAY
          </button>
        </div>

      </div>
    `;

    this.bindEvents();
    this.filterCommands('all');
  }

  bindEvents() {
    const input = document.getElementById('typerInput');
    const skipBtn = document.getElementById('typerSkipBtn');
    const resetBtn = document.getElementById('typerResetBtn');
    const resumeBtn = document.getElementById('typerResumeBtn');
    const diffSelect = document.getElementById('typer-diff-select');
    const catBtns = this.container.querySelectorAll('.cat-btn');

    if (diffSelect) {
      diffSelect.value = this.difficulty;
      diffSelect.addEventListener('change', (e) => {
        this.setDifficulty(e.target.value);
        this.reset();
      });
    }

    catBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        catBtns.forEach(b => {
          b.className = 'cat-btn px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200 bg-slate-900/80 text-slate-400 border border-slate-800 hover:border-cyan-500/40 hover:text-slate-200';
        });
        btn.className = 'cat-btn px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200 bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.3)]';
        this.filterCommands(btn.dataset.cat);
        input?.focus();
      });
    });

    if (input) {
      input.addEventListener('input', (e) => {
        if (this.isPaused) return;
        this.onUserInput(e.target.value);
      });
      // Auto focus
      this.container.addEventListener('click', () => {
        if (!this.isPaused) input.focus();
      });
    }

    if (skipBtn) {
      skipBtn.addEventListener('click', () => {
        this.combo = 0;
        this.updateStats();
        this.currentIndex++;
        this.loadNextCommand();
        if (input) input.value = '';
        input?.focus();
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', () => this.reset());
    }

    if (resumeBtn) {
      resumeBtn.addEventListener('click', () => this.resume());
    }
  }

  startTimer() {
    if (this.timer) clearInterval(this.timer);
    this.timer = setInterval(() => {
      if (this.isPaused) return;
      this.timeLeft--;
      const timerEl = document.getElementById('typerTimer');
      if (timerEl) timerEl.innerText = `${this.timeLeft}s`;
      this.updateStats();

      if (this.timeLeft <= 0) {
        clearInterval(this.timer);
        this.onGameOver();
      }
    }, 1000);
  }

  onGameOver() {
    alert(`⏰ Hết giờ thử thách CLI!\n- Số lệnh gõ đúng: ${this.completedCount}\n- Độ chính xác: ${this.calculateAccuracy()}%\n- Tốc độ: ${this.calculateWpm()} WPM\n- Kỷ lục Combo: ${this.maxCombo}x`);
    this.reset();
  }

  onUserInput(val) {
    if (!this.isStarted) {
      this.isStarted = true;
      this.startTime = Date.now();
      this.startTimer();
    }

    if (!this.activeCommand) return;
    const target = this.activeCommand.cmd;
    this.totalKeystrokes++;

    // Check if input matches target prefix
    if (target.startsWith(val)) {
      this.typedChars = val;
      this.correctKeystrokes++;
      this.playBeep(400 + val.length * 15, 'sine', 0.03, 0.05);

      if (val === target) {
        // Complete command!
        this.completedCount++;
        this.combo++;
        if (this.combo > this.maxCombo) this.maxCombo = this.combo;
        this.score += 100 * this.combo;
        this.playSuccess();

        // Bonus time for fast completion
        this.timeLeft = Math.min(120, this.timeLeft + 5);

        this.currentIndex++;
        this.loadNextCommand();
        const input = document.getElementById('typerInput');
        if (input) input.value = '';
      }
    } else {
      this.combo = 0;
      this.playError();
      this.typedChars = val;
    }

    this.renderPrompt();
    this.updateStats();
  }

  calculateAccuracy() {
    if (this.totalKeystrokes === 0) return 100;
    return Math.round((this.correctKeystrokes / this.totalKeystrokes) * 100);
  }

  calculateWpm() {
    if (!this.startTime) return 0;
    const minutes = (Date.now() - this.startTime) / 60000;
    if (minutes <= 0.01) return 0;
    const words = this.correctKeystrokes / 5;
    return Math.round(words / minutes);
  }

  updateStats() {
    const wpmEl = document.getElementById('typerWpm');
    const accEl = document.getElementById('typerAcc');
    const comboEl = document.getElementById('typerCombo');
    const doneEl = document.getElementById('typerDoneCount');
    const maxComboEl = document.getElementById('typerMaxCombo');

    if (wpmEl) wpmEl.innerText = this.calculateWpm();
    if (accEl) accEl.innerText = `${this.calculateAccuracy()}%`;
    if (comboEl) comboEl.innerText = `${this.combo}x`;
    if (doneEl) doneEl.innerText = this.completedCount;
    if (maxComboEl) maxComboEl.innerText = `${this.maxCombo}x`;
  }

  renderPrompt() {
    const codeEl = document.getElementById('typerCodeDisplay');
    const descEl = document.getElementById('typerDesc');
    const badgeEl = document.getElementById('typerCatBadge');

    if (!this.activeCommand || !codeEl) return;

    if (descEl) descEl.innerText = this.activeCommand.desc;
    if (badgeEl) {
      const catLabels = {
        dotnet: '.NET 8 / C#',
        git: 'GIT CLI',
        devops: 'DOCKER & K8S',
        sql: 'SQL SERVER',
        web: 'TS & FRONTEND',
        tools: 'PYTHON / GO'
      };
      badgeEl.innerText = catLabels[this.activeCommand.cat] || 'CLI COMMAND';
    }

    const target = this.activeCommand.cmd;
    const typed = this.typedChars;
    let html = '';

    for (let i = 0; i < target.length; i++) {
      const char = target[i];
      const charDisp = char === ' ' ? '&nbsp;' : char;

      if (i < typed.length) {
        if (typed[i] === char) {
          html += `<span class="text-emerald-400 bg-emerald-950/50 font-semibold">${charDisp}</span>`;
        } else {
          html += `<span class="text-rose-400 bg-rose-950/80 font-bold underline">${charDisp}</span>`;
        }
      } else if (i === typed.length) {
        // Cursor
        html += `<span class="bg-cyan-400 text-black font-bold animate-pulse">${charDisp}</span>`;
      } else {
        html += `<span class="text-slate-500">${charDisp}</span>`;
      }
    }

    codeEl.innerHTML = html;
  }

  render() {
    this.renderPrompt();
    this.updateStats();
  }

  pause() {
    this.isPaused = true;
    const overlay = document.getElementById('typerPauseOverlay');
    if (overlay) overlay.classList.remove('hidden');
  }

  resume() {
    this.isPaused = false;
    const overlay = document.getElementById('typerPauseOverlay');
    if (overlay) overlay.classList.add('hidden');
    const input = document.getElementById('typerInput');
    input?.focus();
  }

  setDifficulty(level) {
    this.difficulty = level || 'normal';
    if (this.difficulty === 'easy') {
      this.initialTime = 90;
    } else if (this.difficulty === 'hard') {
      this.initialTime = 40;
    } else {
      this.initialTime = 60;
    }
    this.timeLeft = this.initialTime;
  }

  reset() {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
    this.isStarted = false;
    this.isPaused = false;
    this.startTime = null;
    this.timeLeft = this.initialTime || 60;
    this.score = 0;
    this.combo = 0;
    this.completedCount = 0;
    this.totalKeystrokes = 0;
    this.correctKeystrokes = 0;

    const overlay = document.getElementById('typerPauseOverlay');
    if (overlay) overlay.classList.add('hidden');

    const input = document.getElementById('typerInput');
    if (input) input.value = '';

    const timerEl = document.getElementById('typerTimer');
    if (timerEl) timerEl.innerText = `${this.timeLeft}s`;

    this.filteredCommands.sort(() => Math.random() - 0.5);
    this.currentIndex = 0;
    this.loadNextCommand();
    this.updateStats();
    input?.focus();
  }

  getStatus() {
    return {
      isPaused: this.isPaused,
      isStarted: this.isStarted,
      score: this.score,
      completed: this.completedCount,
      wpm: this.calculateWpm(),
      accuracy: this.calculateAccuracy()
    };
  }

  destroy() {
    if (this.timer) clearInterval(this.timer);
  }
}
