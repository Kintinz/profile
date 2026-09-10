export class HackerTerminal {
  constructor(container, soundManager, onCommandExecuted) {
    this.container = container;
    this.sound = soundManager;
    this.onCommandExecuted = onCommandExecuted;
    this.commandHistory = [];
    this.historyIndex = -1;

    this.render();
  }

  render() {
    this.container.innerHTML = [
      '<div class="w-full bg-slate-950/95 border border-emerald-500/40 rounded-2xl overflow-hidden shadow-2xl font-mono text-xs">',
      '  <div class="bg-slate-900/90 px-4 py-2.5 border-b border-emerald-500/30 flex items-center justify-between">',
      '    <div class="flex items-center gap-2">',
      '      <div class="w-3 h-3 rounded-full bg-red-500/80"></div>',
      '      <div class="w-3 h-3 rounded-full bg-amber-500/80"></div>',
      '      <div class="w-3 h-3 rounded-full bg-emerald-500/80"></div>',
      '      <span class="ml-2 text-emerald-400 font-bold text-[11px]">root@nexus-core: ~ (v2.4.0)</span>',
      '    </div>',
      '    <div class="text-[10px] text-slate-400">Gõ "help" để xem danh sách lệnh</div>',
      '  </div>',
      '  <div id="terminal-output" class="p-4 h-64 overflow-y-auto space-y-2 text-emerald-400">',
      '    <div>',
      '      <p class="text-emerald-300 font-bold">=====================================================</p>',
      '      <p class="text-emerald-300 font-bold">       NEXUS CYBERNETIC OS // SECURE TERMINAL        </p>',
      '      <p class="text-emerald-300 font-bold">=====================================================</p>',
      '      <p class="text-slate-400 mt-1">Hệ thống bảo mật trực tuyến. Hãy gõ <span class="text-amber-400 font-bold">"help"</span> để tra cứu các lệnh khả dụng.</p>',
      '    </div>',
      '  </div>',
      '  <div class="bg-slate-900/60 p-2.5 border-t border-emerald-500/20 flex items-center gap-2">',
      '    <span class="text-emerald-400 font-bold select-none">guest@nexus:~$</span>',
      '    <input id="terminal-input" type="text" autocomplete="off" spellcheck="false" class="flex-1 bg-transparent border-none outline-none text-emerald-300 font-mono text-xs placeholder-slate-600" placeholder="Nhập lệnh (vd: help, scan, secret, whoami)..." />',
      '  </div>',
      '</div>'
    ].join('');

    this.outputEl = this.container.querySelector('#terminal-output');
    this.inputEl = this.container.querySelector('#terminal-input');
    this.bindEvents();
  }

  bindEvents() {
    this.inputEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const val = this.inputEl.value.trim();
        if (val) {
          this.executeCommand(val);
          this.commandHistory.push(val);
          this.historyIndex = this.commandHistory.length;
          this.inputEl.value = '';
        }
      } else if (e.key === 'ArrowUp') {
        if (this.historyIndex > 0) {
          this.historyIndex--;
          this.inputEl.value = this.commandHistory[this.historyIndex];
        }
      } else if (e.key === 'ArrowDown') {
        if (this.historyIndex < this.commandHistory.length - 1) {
          this.historyIndex++;
          this.inputEl.value = this.commandHistory[this.historyIndex];
        } else {
          this.historyIndex = this.commandHistory.length;
          this.inputEl.value = '';
        }
      }
    });
  }

  executeCommand(cmd) {
    this.sound.playClick(680);
    this.printLine('guest@nexus:~$ ' + cmd, 'text-slate-300 font-bold');

    const parts = cmd.split(' ');
    const mainCmd = parts[0].toLowerCase();
    const arg = parts.slice(1).join(' ');

    if (this.onCommandExecuted) this.onCommandExecuted(mainCmd, arg);

    switch (mainCmd) {
      case 'help':
        this.printLines([
          'Danh mục lệnh khả dụng:',
          '  help             - Hiển thị danh sách này',
          '  whoami           - Thông tin định danh của Dương Tiến Đạt',
          '  skills           - Xem cây kỹ năng (.NET, Angular, SQL Server...)',
          '  projects         - Xem 5 dự án thực chiến tiêu biểu (HRM, BPM, POS...)',
          '  contact          - Thông tin liên hệ nhanh (Phone, Email, Địa chỉ)',
          '  scan             - Quét lỗ hổng hệ thống & phát hiện mật mã',
          '  secret           - Xem tập tin tuyệt mật bị mã hóa',
          '  decode <text>    - Công cụ giải mã nhanh chuỗi ký tự',
          '  matrix           - Kích hoạt mưa ký tự kỹ thuật số',
          '  clear            - Xóa màn hình terminal'
        ], 'text-cyan-300');
        break;

      case 'whoami':
        this.printLines([
          '=====================================================',
          'IDENTITY: DƯƠNG TIẾN ĐẠT (.NET FULLSTACK DEVELOPER)',
          'EXPERIENCE: 3+ năm kinh nghiệm tại Kids Plaza (HRM & BPM)',
          'LOCATION: Tô Hiệu, Hà Đông, Hà Nội',
          'CONTACT: [Bảo mật thông tin - Cung cấp khi phỏng vấn]',
          'CORE TECH: ASP.NET Core, SQL Server, Angular, REST API',
          'STATUS: Sẵn sàng cống hiến cho các hệ thống phần mềm lớn!',
          '====================================================='
        ], 'text-cyan-300');
        break;

      case 'skills':
        this.printLines([
          '[+] BACKEND:  C#, ASP.NET Core, Entity Framework, REST API, JWT',
          '[+] FRONTEND: Angular (v12+), React, Vue.js, TypeScript, RxJS',
          '[+] REALTIME: Electron, SignalR (Đồng bộ màn hình bán hàng & khách hàng)',
          '[+] DATABASE: SQL Server (Tối ưu Query & Indexing), MongoDB',
          '[+] DEVOPS:   Git, GitLab, Postman, Swagger, Docker'
        ], 'text-emerald-300');
        break;

      case 'scan':
        this.printLine('Đang quét toàn bộ hệ thống Nexus Core...', 'text-amber-400');
        setTimeout(() => {
          this.printLines([
            '-> Phát hiện 1 TẬP TIN BÍ MẬT đang bị khóa mã hóa!',
            '-> Hãy truy cập phòng thí nghiệm [Cipher Lab] bên dưới để giải mã.'
          ], 'text-emerald-400 font-bold');
        }, 600);
        break;

      case 'secret':
        this.printLines([
          '=== [TOP SECRET ARCHIVE // CLASSIFIED] ===',
          'Dữ liệu mã hóa: "Q1lCRVJfTkVYVVNfMjAyNg=="',
          'Gợi ý giải mã: Chuỗi trên được mã hóa bằng Base64!',
          'Hãy dùng lệnh: decode <chuỗi> hoặc kéo xuống phòng Giải Mã để thử sức!'
        ], 'text-red-400 font-bold');
        break;

      case 'decode':
        if (!arg) {
          this.printLine('Cú pháp: decode <chuỗi cần giải mã>', 'text-red-400');
        } else {
          try {
            const decoded = atob(arg);
            this.printLine('Kết quả giải mã Base64: "' + decoded + '"', 'text-emerald-300 font-bold');
            this.sound.playSuccess();
          } catch (e) {
            const rot13 = arg.replace(/[a-zA-Z]/g, c => {
              const base = c <= 'Z' ? 65 : 97;
              return String.fromCharCode(((c.charCodeAt(0) - base + 13) % 26) + base);
            });
            this.printLine('Kết quả biến đổi ROT-13: "' + rot13 + '"', 'text-cyan-300 font-bold');
          }
        }
        break;

      case 'matrix':
        this.sound.playSuccess();
        this.printLine('Kích hoạt dòng chảy ma trận...', 'text-emerald-400');
        let count = 0;
        const matrixInterval = setInterval(() => {
          let line = '';
          for (let i = 0; i < 40; i++) {
            line += String.fromCharCode(33 + Math.floor(Math.random() * 90));
          }
          this.printLine(line, 'text-emerald-500 font-mono text-[10px]');
          count++;
          if (count > 8) clearInterval(matrixInterval);
        }, 100);
        break;

      case 'clear':
        this.outputEl.innerHTML = '';
        break;

      case 'contact':
        this.printLines([
          '📞 SĐT:    [Bảo mật - Cung cấp trực tiếp cho nhà tuyển dụng]',
          '✉️ EMAIL:  [Bảo mật - Cung cấp trực tiếp cho nhà tuyển dụng]',
          '📍 ĐỊA CHỈ: Tô Hiệu, Hà Đông, Hà Nội'
        ], 'text-amber-300');
        break;

      case 'projects':
        this.printLines([
          '1. HỆ THỐNG QUẢN TRỊ NHÂN SỰ (HRM) - ASP.NET Core, Angular, SQL Server',
          '2. CỔNG CHUỖI CUNG ỨNG NCC (40-50 NCC, rút ngắn duyệt còn 3-5 ngày)',
          '3. BPM - PORTAL (Xử lý quy trình nội bộ, form động, Angular, REST API)',
          '4. POS BÁN HÀNG & MÀN HÌNH KHÁCH HÀNG (Electron, React, SignalR realtime)',
          '5. BÁO CÁO KPI TỔNG QUAN / DWH (Vue.js, TypeScript, Vite)'
        ], 'text-purple-300');
        break;

      default:
        this.printLine('Lệnh không nhận diện: "' + cmd + '". Gõ "help" để xem danh sách lệnh.', 'text-red-400');
        break;
    }
  }

  printLine(text, className = 'text-slate-300') {
    const p = document.createElement('p');
    p.className = className;
    p.textContent = text;
    this.outputEl.appendChild(p);
    this.outputEl.scrollTop = this.outputEl.scrollHeight;
  }

  printLines(lines, className = 'text-slate-300') {
    lines.forEach(l => this.printLine(l, className));
  }
}
