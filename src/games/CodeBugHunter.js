// CodeBugHunter.js - Săn & Diệt Lỗi Mã Nguồn Thực Tế (.NET, SQL, JS, Python, Go, Docker)
import { getIconSvg } from '../utils/icons.js';

export class CodeBugHunter {
  constructor(canvasId) {
    this.canvasId = canvasId;
    this.container = document.getElementById(canvasId)?.parentElement;
    this.audioCtx = null;

    this.scenarios = [
  {
    "id": 1,
    "lang": "csharp",
    "title": "Crash tiến trình ứng dụng Web API với async void",
    "desc": "Một endpoint xử lý thanh toán bất đồng bộ bị sập đột ngột (unhandled process termination) khi xảy ra lỗi mạng.",
    "code": [
      "public class PaymentController : ControllerBase",
      "{",
      "    [HttpPost(\"process\")]",
      "    public async void ProcessPayment([FromBody] OrderDto dto)",
      "    {",
      "        await _paymentGateway.ChargeAsync(dto.Amount);",
      "        _logger.LogInformation(\"Paid successfully\");",
      "    }",
      "}"
    ],
    "buggyLine": 4,
    "options": [
      "Đổi \"public async void\" thành \"public async Task<IActionResult>\" và return Ok()",
      "Bỏ từ khóa await ở dòng 6",
      "Chuyển hàm sang private",
      "Dùng Task.Run bọc toàn bộ code bên trong"
    ],
    "correctOption": 0,
    "explanation": "Trong C#, \"async void\" không cho phép caller bắt exception (bỏ qua SynchronizationContext), nếu bên trong throw exception sẽ làm crash ngay lập tức toàn bộ process .NET runtime! Cần luôn dùng async Task."
  },
  {
    "id": 2,
    "lang": "csharp",
    "title": "Hiểm họa N+1 Query làm nghẽn CPU Database với EF Core",
    "desc": "Hệ thống chạy chậm khủng khiếp khi tải 1000 người dùng kèm thông tin đơn hàng.",
    "code": [
      "public async Task<List<UserOrderDto>> GetUserOrders()",
      "{",
      "    var users = await _dbContext.Users.ToListAsync();",
      "    var result = new List<UserOrderDto>();",
      "    foreach (var user in users) {",
      "        var orders = await _dbContext.Orders.Where(o => o.UserId == user.Id).ToListAsync();",
      "        result.Add(new UserOrderDto(user, orders));",
      "    }",
      "    return result;",
      "}"
    ],
    "buggyLine": 6,
    "options": [
      "Dùng .Include(u => u.Orders) hoặc AsSplitQuery() trong 1 query duy nhất để nạp dữ liệu gom cụm",
      "Bỏ từ khóa await ở dòng 6 để query chạy song song",
      "Dùng Thread.Sleep để giảm tải cho database",
      "Thay List bằng Array để tiết kiệm RAM"
    ],
    "correctOption": 0,
    "explanation": "Vòng lặp foreach thực thi 1 câu lệnh SELECT cho từng User riêng biệt (N+1 query). Với 10,000 user sẽ sinh ra 10,001 truy vấn round-trip tới SQL server, gây nghẽn kết nối. Cần dùng .Include() hoặc Projection DTO."
  },
  {
    "id": 3,
    "lang": "sql",
    "title": "Lỗ hổng SQL Injection đánh cắp toàn bộ CSDL",
    "desc": "Hacker có thể truyền chuỗi \"' OR '1'='1\" vào ô tìm kiếm để đăng nhập vào tài khoản Admin.",
    "code": [
      "CREATE PROCEDURE sp_GetUserByUsername",
      "    @Username NVARCHAR(100)",
      "AS",
      "BEGIN",
      "    DECLARE @Sql NVARCHAR(MAX);",
      "    SET @Sql = 'SELECT * FROM Accounts WHERE Username = ''' + @Username + '''';",
      "    EXEC(@Sql);",
      "END;"
    ],
    "buggyLine": 6,
    "options": [
      "Dùng câu lệnh SELECT trực tiếp có tham số hoặc sp_executesql kèm định nghĩa tham số an toàn",
      "Dùng hàm REPLACE(@Username, \"'\", \"\") để lọc",
      "Đổi NVARCHAR thành VARCHAR",
      "Mã hóa base64 trước khi cộng chuỗi"
    ],
    "correctOption": 0,
    "explanation": "Cộng chuỗi động trong EXEC(@Sql) tạo kẽ hở SQLi kinh điển. Luôn dùng Parameterized Queries (sp_executesql @Sql, N'@Username NVARCHAR(100)', @Username) hoặc viết thẳng SELECT ... WHERE Username = @Username."
  },
  {
    "id": 4,
    "lang": "sql",
    "title": "Non-SARGable Query gây Full Table Scan 50 triệu dòng",
    "desc": "Truy vấn tìm hóa đơn năm 2024 không tận dụng được Index trên cột CreatedDate dù đã đánh chỉ mục.",
    "code": [
      "SELECT OrderId, CustomerId, TotalAmount",
      "FROM Orders WITH (NOLOCK)",
      "WHERE YEAR(CreatedDate) = 2024 AND Status = 1",
      "ORDER BY TotalAmount DESC;"
    ],
    "buggyLine": 3,
    "options": [
      "Viết lại điều kiện dải ngày: WHERE CreatedDate >= '2024-01-01' AND CreatedDate < '2025-01-01'",
      "Bỏ mệnh đề WITH (NOLOCK)",
      "Chuyển ORDER BY lên trước WHERE",
      "Thêm TOP 100 vào câu lệnh"
    ],
    "correctOption": 0,
    "explanation": "Bọc hàm YEAR(CreatedDate) biến điều kiện thành Non-SARGable, khiến SQL Server bắt buộc phải quét toàn bộ bảng (Table/Index Scan) để tính YEAR cho từng dòng. Dùng khoảng >= và < giữ nguyên cột gốc sẽ tận dụng được Index Seek siêu tốc."
  },
  {
    "id": 5,
    "lang": "ts",
    "title": "Memory Leak do Event Listener không được dọn dẹp",
    "desc": "Trình duyệt bị ngốn RAM liên tục tăng cao mỗi khi người dùng chuyển trang.",
    "code": [
      "useEffect(() => {",
      "  const handleResize = () => setWindowWidth(window.innerWidth);",
      "  window.addEventListener(\"resize\", handleResize);",
      "  // Quên return hàm cleanup hủy lắng nghe sự kiện",
      "}, []);"
    ],
    "buggyLine": 4,
    "options": [
      "Thêm \"return () => window.removeEventListener('resize', handleResize);\"",
      "Đổi useEffect thành useMemo",
      "Xóa mảng phụ thuộc []",
      "Chuyển handleResize ra ngoài component"
    ],
    "correctOption": 0,
    "explanation": "Không gỡ bỏ event listener khi unmount component khiến handler vẫn bị lưu trữ trong memory window, giữ tham chiếu đến component và gây rò rỉ bộ nhớ (memory leak) nghiêm trọng trong SPA."
  },
  {
    "id": 6,
    "lang": "python",
    "title": "Mutable Default Argument gây xung đột dữ liệu giữa các request",
    "desc": "Giỏ hàng của khách hàng B bị dính chung các mặt hàng do khách hàng A đã thêm trước đó!",
    "code": [
      "def create_cart(user_id: int, items: list = []):",
      "    items.append({\"item\": \"welcome_gift\"})",
      "    return {\"user\": user_id, \"cart\": items}"
    ],
    "buggyLine": 1,
    "options": [
      "Dùng items: list = None và bên trong hàm gán items = [] nếu items is None",
      "Đổi list thành tuple",
      "Thêm từ khóa global items",
      "Đổi tên tham số items thành shopping_cart"
    ],
    "correctOption": 0,
    "explanation": "Trong Python, giá trị mặc định của tham số hàm chỉ được khởi tạo một lần duy nhất khi định nghĩa hàm. Vì list là mutable, mọi lần gọi hàm không truyền items đều dùng chung một mảng bộ nhớ!"
  },
  {
    "id": 7,
    "lang": "devops",
    "title": "Lỗ hổng bảo mật nghiêm trọng trong Dockerfile Container",
    "desc": "Hacker có thể khai thác container breakout và chiếm quyền root trực tiếp trên máy chủ host.",
    "code": [
      "FROM mcr.microsoft.com/dotnet/aspnet:8.0",
      "WORKDIR /app",
      "COPY ./publish .",
      "# Container đang chạy mặc định với user ROOT",
      "EXPOSE 8080",
      "ENTRYPOINT [\"dotnet\", \"MyApi.dll\"]"
    ],
    "buggyLine": 4,
    "options": [
      "Thêm lệnh \"USER app\" hoặc \"USER 1000:1000\" để chạy dưới quyền non-root user an toàn",
      "Xóa dòng WORKDIR",
      "Đổi EXPOSE 8080 thành port 80",
      "Dùng alpine image"
    ],
    "correctOption": 0,
    "explanation": "Mặc định container chạy bằng tài khoản root. Nếu ứng dụng có lỗ hổng RCE, kẻ tấn công sẽ có đặc quyền tối cao. Best practice là chuyển sang user hạn chế đặc quyền (USER app trong .NET 8)."
  }
];

    this.currentIndex = 0;
    this.score = 0;
    this.streak = 0;
    this.selectedLine = null;
    this.isPaused = false;
    this.soundEnabled = true;

    this.init();
  }

  initAudio() {
    if (!this.audioCtx) {
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        this.audioCtx = new AudioCtx();
      } catch (e) {}
    }
  }

  playBeep(freq, type = 'sine', duration = 0.08) {
    if (!this.soundEnabled) return;
    this.initAudio();
    if (!this.audioCtx) return;
    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
      gain.gain.setValueAtTime(0.08, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + duration);
    } catch (e) {}
  }

  init() {
    if (!this.container) return;
    this.container.innerHTML = `
      <div id="bugHunterRoot" class="w-full h-full flex flex-col justify-between bg-slate-950/80 text-slate-100 font-sans rounded-2xl border border-rose-500/30 p-3 sm:p-5 select-none relative overflow-hidden shadow-2xl backdrop-blur-md">
        
        <!-- Header -->
        <div class="flex flex-wrap items-center justify-between pb-3 border-b border-rose-500/20 gap-2 shrink-0">
          <div class="flex items-center gap-2.5">
            <span class="p-1.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/40 shadow-sm shadow-rose-500/30 animate-pulse">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
            </span>
            <span class="text-xs font-bold tracking-widest text-rose-300 drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]">
              CODE BUG HUNTER - SĂN LỖI PRODUCTION
            </span>
          </div>

          <div class="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
            <div class="bg-slate-900/90 px-3 py-1 rounded-xl border border-amber-500/30 shadow-inner flex items-center gap-2">
              <span class="text-slate-400 text-[10px] font-bold">ĐIỂM:</span>
              <strong id="hunterScore" class="digital-lcd text-amber-300 font-bold text-base tracking-wider">0</strong>
            </div>
            <div class="bg-slate-900/90 px-3 py-1 rounded-xl border border-emerald-500/30 shadow-inner flex items-center gap-2">
              <span class="text-slate-400 text-[10px] font-bold">CHUỖI:</span>
              <strong id="hunterStreak" class="digital-lcd text-emerald-300 font-bold text-base tracking-wider">0</strong>
            </div>
            <div class="bg-slate-900/90 px-3 py-1 rounded-xl border border-cyan-500/30 shadow-inner flex items-center gap-2">
              <span class="text-slate-400 text-[10px] font-bold">VỤ ÁN:</span>
              <strong id="hunterProgress" class="digital-lcd text-cyan-300 font-bold text-base tracking-wider">1/7</strong>
            </div>
          </div>
        </div>

        <!-- Problem Description -->
        <div class="bg-slate-900/80 p-3.5 rounded-2xl border border-rose-500/20 mt-2.5 shrink-0 shadow-inner">
          <div class="flex items-center gap-2 mb-1.5">
            <span id="hunterLangBadge" class="px-2.5 py-0.5 rounded-lg text-[11px] font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm">C# / .NET</span>
            <h3 id="hunterTitle" class="text-sm font-bold text-white tracking-wide">Title</h3>
          </div>
          <p id="hunterDesc" class="text-xs text-slate-300 leading-relaxed font-sans">Desc</p>
        </div>

        <!-- Code Inspection View (Interactive Clickable Lines with Corner Brackets & Scanlines) -->
        <div class="my-3 flex-1 flex flex-col min-h-0 bg-slate-950/90 rounded-2xl border border-rose-500/30 overflow-hidden font-mono text-xs sm:text-sm relative shadow-2xl group">
          <div class="corner-bracket corner-bracket-tl border-rose-400"></div>
          <div class="corner-bracket corner-bracket-tr border-rose-400"></div>
          <div class="corner-bracket corner-bracket-bl border-rose-400"></div>
          <div class="corner-bracket corner-bracket-br border-rose-400"></div>
          <div class="scanline-overlay pointer-events-none rounded-2xl"></div>

          <div class="bg-slate-950 px-4 py-2 text-[11px] text-slate-400 border-b border-rose-500/20 flex justify-between items-center relative z-10">
            <span class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
              <span>👇 Bấm chọn trực tiếp vào dòng code gây lỗi:</span>
            </span>
            <span id="hunterSelectedLineHint" class="text-cyan-400 font-semibold">Chưa chọn dòng nào</span>
          </div>
          <div id="hunterCodeLines" class="flex-1 overflow-y-auto p-3 space-y-1.5 relative z-10">
            <!-- Rendered code lines -->
          </div>
        </div>

        <!-- Fix Solution Selection -->
        <div id="hunterFixSection" class="shrink-0 space-y-2">
          <div class="text-xs font-bold text-slate-300 flex items-center justify-between">
            <span class="flex items-center gap-1.5 text-cyan-300">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              Phương án kiến trúc / Code fix chuẩn:
            </span>
            <span id="hunterStatusMsg" class="text-xs font-bold"></span>
          </div>
          <div id="hunterOptions" class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <!-- Options buttons -->
          </div>
        </div>

        <!-- Explanation Modal / Box -->
        <div id="hunterExplanation" class="bg-emerald-950/60 border border-emerald-500/50 p-3.5 rounded-xl text-xs mt-2.5 hidden text-emerald-200 shadow-lg shadow-emerald-950/50 leading-relaxed font-sans">
          <!-- Rendered explanation -->
        </div>

        <!-- Footer -->
        <div class="flex items-center justify-between pt-3 border-t border-rose-500/20 mt-2 text-xs shrink-0">
          <span class="text-slate-400 hidden sm:inline">Mục tiêu: Tìm dòng lỗi & giải pháp chuẩn để bảo vệ hệ thống</span>
          <div class="flex items-center gap-2 ml-auto sm:ml-0">
            <button id="hunterNextBtn" class="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold hover:from-cyan-500 hover:to-blue-500 transition-all hidden shadow-lg shadow-cyan-600/30">
              Vụ án tiếp theo ➔
            </button>
            <button id="hunterResetBtn" class="px-3.5 py-2 rounded-xl bg-slate-800/90 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700 transition-all font-medium">
              Chơi lại ↻
            </button>
          </div>
        </div>

        <!-- Pause Overlay -->
        <div id="hunterPauseOverlay" class="absolute inset-0 bg-slate-950/90 backdrop-blur-md z-20 flex flex-col items-center justify-center gap-4 hidden">
          <div class="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 shadow-lg shadow-amber-500/20">${getIconSvg('pause', 'w-6 h-6 text-amber-300')}</div>
          <div class="text-xl font-bold text-amber-300 tracking-wider">HỆ THỐNG TẠM DỪNG</div>
          <button id="hunterResumeBtn" class="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-orange-600 text-white font-bold text-xs hover:from-rose-500 hover:to-orange-500 transition-all shadow-lg shadow-rose-600/30 flex items-center gap-2">
            ${getIconSvg('play', 'w-3.5 h-3.5')} TIẾP TỤC NGAY
          </button>
        </div>

      </div>
    `;

    this.bindEvents();
    this.renderCurrentScenario();
  }

  bindEvents() {
    const nextBtn = document.getElementById('hunterNextBtn');
    const resetBtn = document.getElementById('hunterResetBtn');
    const resumeBtn = document.getElementById('hunterResumeBtn');

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        this.currentIndex = (this.currentIndex + 1) % this.scenarios.length;
        this.selectedLine = null;
        this.renderCurrentScenario();
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', () => this.reset());
    }

    if (resumeBtn) {
      resumeBtn.addEventListener('click', () => this.resume());
    }
  }

  renderCurrentScenario() {
    const sc = this.scenarios[this.currentIndex];
    if (!sc) return;

    document.getElementById('hunterProgress').innerText = `${this.currentIndex + 1}/${this.scenarios.length}`;
    document.getElementById('hunterScore').innerText = this.score;
    document.getElementById('hunterStreak').innerText = this.streak;
    document.getElementById('hunterTitle').innerText = sc.title;
    document.getElementById('hunterDesc').innerText = sc.desc;
    
    const langBadges = {
      csharp: { text: '.NET / C#', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
      sql: { text: 'SQL SERVER', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
      ts: { text: 'TS / REACT', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
      python: { text: 'PYTHON', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
      devops: { text: 'DOCKER / LINUX', color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' }
    };
    const b = langBadges[sc.lang] || { text: 'CODE', color: 'bg-slate-700 text-slate-200' };
    const badgeEl = document.getElementById('hunterLangBadge');
    badgeEl.className = `px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider border ${b.color}`;
    badgeEl.innerText = b.text;

    document.getElementById('hunterSelectedLineHint').innerText = 'Chưa chọn dòng nào';
    document.getElementById('hunterStatusMsg').innerText = '';
    document.getElementById('hunterExplanation').classList.add('hidden');
    document.getElementById('hunterNextBtn').classList.add('hidden');

    // Render code lines
    const linesContainer = document.getElementById('hunterCodeLines');
    linesContainer.innerHTML = '';
    sc.code.forEach((lineText, idx) => {
      const lineNum = idx + 1;
      const lineRow = document.createElement('div');
      lineRow.className = 'group flex items-center gap-3 px-3 py-1.5 rounded-xl cursor-pointer hover:bg-slate-900/90 hover:border-cyan-500/40 transition-all border border-transparent select-none';
      lineRow.dataset.line = lineNum;

      lineRow.innerHTML = `
        <span class="text-slate-500 font-mono text-xs select-none w-6 text-right shrink-0">${lineNum}</span>
        <span class="text-slate-300 font-mono flex-1 text-xs leading-relaxed">${lineText}</span>
        <span class="text-[10px] text-cyan-400 font-sans font-bold opacity-0 group-hover:opacity-100 transition-opacity bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30">Chọn dòng này</span>
      `;

      lineRow.addEventListener('click', () => {
        if (this.isPaused) return;
        this.selectLine(lineNum, lineRow);
      });

      linesContainer.appendChild(lineRow);
    });

    // Render Fix Options
    const optContainer = document.getElementById('hunterOptions');
    optContainer.innerHTML = '';
    sc.options.forEach((optText, optIdx) => {
      const btn = document.createElement('button');
      btn.className = 'hunter-opt-btn text-left p-3 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-cyan-400/60 hover:bg-slate-800/80 hover:shadow-md transition-all flex items-start gap-2.5 text-slate-300 group';
      btn.innerHTML = `
        <span class="w-5 h-5 rounded-lg bg-slate-800 text-slate-400 group-hover:bg-cyan-500/20 group-hover:text-cyan-300 group-hover:border-cyan-500/40 border border-slate-700 flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5 transition-all">${String.fromCharCode(65 + optIdx)}</span>
        <span class="leading-relaxed text-xs">${optText}</span>
      `;

      btn.addEventListener('click', () => {
        if (this.isPaused) return;
        this.submitSolution(optIdx, btn);
      });

      optContainer.appendChild(btn);
    });
  }

  selectLine(lineNum, lineRow) {
    this.selectedLine = lineNum;
    this.playBeep(480, 'sine', 0.04);
    
    // Highlight selected row
    const allRows = document.getElementById('hunterCodeLines').children;
    for (let r of allRows) {
      r.classList.remove('bg-rose-950/70', 'border-rose-500/80', 'text-rose-200', 'shadow-[0_0_12px_rgba(244,63,94,0.3)]');
    }
    lineRow.classList.add('bg-rose-950/70', 'border-rose-500/80', 'text-rose-200', 'shadow-[0_0_12px_rgba(244,63,94,0.3)]');
    document.getElementById('hunterSelectedLineHint').innerHTML = `<span class="text-rose-400 font-bold drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]">🎯 Đã khoanh vùng Dòng ${lineNum}</span>`;
  }

  submitSolution(optIdx, btn) {
    const sc = this.scenarios[this.currentIndex];
    const statusMsg = document.getElementById('hunterStatusMsg');
    const explBox = document.getElementById('hunterExplanation');
    const nextBtn = document.getElementById('hunterNextBtn');

    if (!this.selectedLine) {
      statusMsg.innerHTML = '<span class="text-amber-400 font-bold">⚠️ Vui lòng click chọn 1 dòng code bị lỗi trước!</span>';
      this.playBeep(200, 'sawtooth', 0.1);
      return;
    }

    const isLineCorrect = this.selectedLine === sc.buggyLine;
    const isOptionCorrect = optIdx === sc.correctOption;

    // Disable option buttons
    const allBtns = document.querySelectorAll('.hunter-opt-btn');
    allBtns.forEach(b => b.disabled = true);

    if (isLineCorrect && isOptionCorrect) {
      this.score += 250;
      this.streak++;
      this.playBeep(587.33, 'triangle', 0.1);
      setTimeout(() => this.playBeep(880, 'triangle', 0.15), 100);

      btn.classList.add('bg-emerald-950/80', 'border-emerald-500', 'text-emerald-300');
      statusMsg.innerHTML = '<span class="text-emerald-400 font-bold">🎯 CHÍNH XÁC TUYỆT ĐỐI! Bug đã bị tiêu diệt!</span>';
    } else {
      this.streak = 0;
      this.playBeep(180, 'sawtooth', 0.15);

      btn.classList.add('bg-rose-950/80', 'border-rose-500', 'text-rose-300');
      allBtns[sc.correctOption]?.classList.add('bg-emerald-950/50', 'border-emerald-500/80', 'text-emerald-300');

      let errMsg = '';
      if (!isLineCorrect) errMsg += `Dòng lỗi đúng phải là dòng ${sc.buggyLine}. `;
      if (!isOptionCorrect) errMsg += 'Phương án sửa chưa tối ưu.';
      statusMsg.innerHTML = `<span class="text-rose-400 font-semibold">❌ Chưa chuẩn! ${errMsg}</span>`;
    }

    document.getElementById('hunterScore').innerText = this.score;
    document.getElementById('hunterStreak').innerText = this.streak;

    // Show explanation
    explBox.innerHTML = `<strong>💡 Giải thích chuyên sâu:</strong> ${sc.explanation}`;
    explBox.classList.remove('hidden');
    nextBtn.classList.remove('hidden');
  }

  pause() {
    this.isPaused = true;
    document.getElementById('hunterPauseOverlay')?.classList.remove('hidden');
  }

  resume() {
    this.isPaused = false;
    document.getElementById('hunterPauseOverlay')?.classList.add('hidden');
  }

  reset() {
    this.currentIndex = 0;
    this.score = 0;
    this.streak = 0;
    this.selectedLine = null;
    this.isPaused = false;
    document.getElementById('hunterPauseOverlay')?.classList.add('hidden');
    this.renderCurrentScenario();
  }

  getStatus() {
    return {
      score: this.score,
      streak: this.streak,
      current: this.currentIndex + 1,
      total: this.scenarios.length
    };
  }

  destroy() {}
}
