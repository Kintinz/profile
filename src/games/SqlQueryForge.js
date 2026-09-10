// SqlQueryForge.js - Đấu trường Xây Dựng & Tối Ưu Truy Vấn SQL Server
import { getIconSvg } from '../utils/icons.js';

export class SqlQueryForge {
  constructor(canvasId) {
    this.canvasId = canvasId;
    this.container = document.getElementById(canvasId)?.parentElement;
    this.audioCtx = null;

    this.challenges = [
  {
    "id": 1,
    "title": "Top 1 Nhân viên lương cao nhất từng phòng ban (Window Functions)",
    "desc": "Truy vấn nhân viên có mức lương cao nhất trong từng Department mà không dùng Subquery chậm chạp.",
    "schema": "Employees (Id, FullName, DepartmentId, Salary)",
    "template": "WITH RankedStaff AS (\n  SELECT Id, FullName, DepartmentId, Salary,\n    [BLANK_1] AS RankNum\n  FROM Employees\n)\nSELECT Id, FullName, DepartmentId, Salary\nFROM RankedStaff\nWHERE [BLANK_2];",
    "blanks": [
      {
        "id": 1,
        "label": "[BLANK_1]",
        "options": [
          "ROW_NUMBER() OVER(PARTITION BY DepartmentId ORDER BY Salary DESC)",
          "RANK() OVER(ORDER BY Salary DESC)",
          "COUNT(*) OVER(PARTITION BY DepartmentId)",
          "DENSE_RANK() OVER(GROUP BY DepartmentId)"
        ],
        "correct": 0
      },
      {
        "id": 2,
        "label": "[BLANK_2]",
        "options": [
          "RankNum = 1",
          "RankNum <= 10",
          "Salary > 1000",
          "DepartmentId IS NOT NULL"
        ],
        "correct": 0
      }
    ],
    "resultColumns": [
      "Id",
      "FullName",
      "DepartmentId",
      "Salary",
      "RankNum"
    ],
    "resultRows": [
      [
        "101",
        "Nguyễn Văn An",
        "Phòng CNTT",
        "35,000,000 đ",
        "1"
      ],
      [
        "105",
        "Trần Thị Bình",
        "Phòng Tài Chính",
        "28,000,000 đ",
        "1"
      ],
      [
        "112",
        "Lê Hoàng Cường",
        "Phòng Marketing",
        "24,000,000 đ",
        "1"
      ]
    ],
    "executionPlan": "Index Seek (Clustered) -> Segment -> Sequence Project -> Filter (Cost 2%)"
  },
  {
    "id": 2,
    "title": "Tối ưu phân trang triệu bản ghi chuẩn High-Performance",
    "desc": "Thay thế TOP/Subquery cổ điển bằng cú pháp chuẩn OFFSET-FETCH có hỗ trợ Index Seek.",
    "schema": "Orders (OrderId, CustomerId, OrderDate, TotalAmount)",
    "template": "SELECT OrderId, CustomerId, OrderDate, TotalAmount\nFROM Orders WITH (NOLOCK)\nWHERE Status = 'Completed'\n[BLANK_1]\n[BLANK_2];",
    "blanks": [
      {
        "id": 1,
        "label": "[BLANK_1]",
        "options": [
          "ORDER BY OrderDate DESC",
          "GROUP BY CustomerId",
          "HAVING OrderId > 0",
          "WHERE OrderId IS NOT NULL"
        ],
        "correct": 0
      },
      {
        "id": 2,
        "label": "[BLANK_2]",
        "options": [
          "OFFSET @Offset ROWS FETCH NEXT @PageSize ROWS ONLY",
          "LIMIT @PageSize OFFSET @Offset",
          "TAKE @PageSize SKIP @Offset",
          "ROWS BETWEEN @Offset AND @PageSize"
        ],
        "correct": 0
      }
    ],
    "resultColumns": [
      "OrderId",
      "CustomerId",
      "OrderDate",
      "TotalAmount"
    ],
    "resultRows": [
      [
        "ORD-9991",
        "CUST-082",
        "2024-03-15",
        "12,500,000 đ"
      ],
      [
        "ORD-9990",
        "CUST-144",
        "2024-03-15",
        "4,200,000 đ"
      ],
      [
        "ORD-9989",
        "CUST-009",
        "2024-03-14",
        "18,900,000 đ"
      ]
    ],
    "executionPlan": "Index Seek on IX_Orders_Status_OrderDate (Top 20 rows, Execution time: 2ms)"
  },
  {
    "id": 3,
    "title": "Tạo Covering Index xóa bỏ hoàn toàn Key Lookup",
    "desc": "Tạo chỉ mục tối ưu cho câu lệnh: SELECT FullName, Phone FROM Users WHERE Email = @Email",
    "schema": "Users (UserId, Email, FullName, Phone, CreatedAt)",
    "template": "CREATE NONCLUSTERED INDEX IX_Users_Email\nON Users(Email)\n[BLANK_1];",
    "blanks": [
      {
        "id": 1,
        "label": "[BLANK_1]",
        "options": [
          "INCLUDE (FullName, Phone)",
          "WITH (ONLINE = ON, FILLFACTOR = 90)",
          "WHERE FullName IS NOT NULL",
          "ORDER BY FullName ASC"
        ],
        "correct": 0
      }
    ],
    "resultColumns": [
      "Metric",
      "Trước khi tối ưu",
      "Sau khi dùng Covering Index"
    ],
    "resultRows": [
      [
        "Physical Reads",
        "14,280 pages (Key Lookup)",
        "3 pages (Index Seek)"
      ],
      [
        "CPU Time",
        "285 ms",
        "1 ms"
      ],
      [
        "Memory Buffer",
        "110 MB",
        "24 KB"
      ]
    ],
    "executionPlan": "Covering Non-Clustered Index Seek. 0 Key Lookup overhead. 100% Cache hit."
  },
  {
    "id": 4,
    "title": "Truy vấn đệ quy cây phòng ban phân cấp (Recursive CTE)",
    "desc": "Liệt kê toàn bộ nhân sự cấp dưới theo mọi tầng quản lý từ Giám đốc điều hành.",
    "schema": "Staff (Id, Name, ManagerId, Title)",
    "template": "WITH StaffTree AS (\n  -- Anchor Member\n  SELECT Id, Name, ManagerId, 0 AS Level\n  FROM Staff WHERE ManagerId IS NULL\n  [BLANK_1]\n  -- Recursive Member\n  SELECT s.Id, s.Name, s.ManagerId, t.Level + 1\n  FROM Staff s INNER JOIN StaffTree t ON [BLANK_2]\n)\nSELECT * FROM StaffTree ORDER BY Level, Id;",
    "blanks": [
      {
        "id": 1,
        "label": "[BLANK_1]",
        "options": [
          "UNION ALL",
          "UNION",
          "INTERSECT",
          "JOIN"
        ],
        "correct": 0
      },
      {
        "id": 2,
        "label": "[BLANK_2]",
        "options": [
          "s.ManagerId = t.Id",
          "s.Id = t.ManagerId",
          "s.Level = t.Level",
          "s.Name = t.Name"
        ],
        "correct": 0
      }
    ],
    "resultColumns": [
      "Id",
      "Name",
      "ManagerId",
      "Level",
      "Title"
    ],
    "resultRows": [
      [
        "1",
        "Trần Giám Đốc",
        "NULL",
        "0",
        "CEO"
      ],
      [
        "2",
        "Phạm Trưởng Phòng",
        "1",
        "1",
        "Head of Tech"
      ],
      [
        "7",
        "Đỗ Lập Trình Viên",
        "2",
        "2",
        "Senior .NET Developer"
      ]
    ],
    "executionPlan": "Recursive Index Spool -> Concatenation -> Clustered Index Seek"
  }
];

    this.currentIndex = 0;
    this.selectedAnswers = {};
    this.score = 0;
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
      <div id="sqlForgeRoot" class="w-full h-full flex flex-col justify-between bg-slate-950/80 text-slate-100 font-sans rounded-2xl border border-emerald-500/30 p-3 sm:p-5 select-none relative overflow-hidden shadow-2xl backdrop-blur-md">
        
        <!-- Header -->
        <div class="flex flex-wrap items-center justify-between pb-3 border-b border-emerald-500/20 gap-2 shrink-0">
          <div class="flex items-center gap-2.5">
            <span class="p-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm shadow-emerald-500/30 animate-pulse">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"/></svg>
            </span>
            <span class="text-xs font-bold tracking-widest text-emerald-300 drop-shadow-[0_0_8px_rgba(16,185,129,0.6)]">
              SQL QUERY FORGE - TỐI ƯU CƠ SỞ DỮ LIỆU
            </span>
          </div>

          <div class="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
            <div class="bg-slate-900/90 px-3 py-1 rounded-xl border border-amber-500/30 shadow-inner flex items-center gap-2">
              <span class="text-slate-400 text-[10px] font-bold">ĐIỂM TỐI ƯU:</span>
              <strong id="sqlScore" class="digital-lcd text-amber-300 font-bold text-base tracking-wider">0</strong>
            </div>
            <div class="bg-slate-900/90 px-3 py-1 rounded-xl border border-emerald-500/30 shadow-inner flex items-center gap-2">
              <span class="text-slate-400 text-[10px] font-bold">THỬ THÁCH:</span>
              <strong id="sqlProgress" class="digital-lcd text-emerald-300 font-bold text-base tracking-wider">1/4</strong>
            </div>
          </div>
        </div>

        <!-- Problem Description & Schema -->
        <div class="bg-slate-900/80 p-3.5 rounded-2xl border border-emerald-500/20 mt-2.5 shrink-0 space-y-1.5 shadow-inner">
          <div class="flex items-center justify-between">
            <h3 id="sqlTitle" class="text-sm font-bold text-white tracking-wide">Title</h3>
            <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">SQL SERVER 2022</span>
          </div>
          <p id="sqlDesc" class="text-xs text-slate-300 leading-relaxed font-sans">Desc</p>
          <div class="text-[11px] text-emerald-400 font-mono pt-1 flex items-center gap-2">
            <span class="text-slate-400 font-bold">SCHEMA:</span>
            <code id="sqlSchema" class="bg-slate-950 px-2.5 py-0.5 rounded-lg border border-emerald-500/30 text-emerald-300 shadow-inner">schema</code>
          </div>
        </div>

        <!-- SQL Template View with Corner Brackets & Scanlines -->
        <div class="my-2.5 bg-slate-950/90 rounded-2xl border border-emerald-500/30 p-4 font-mono text-xs sm:text-sm overflow-x-auto shrink-0 shadow-2xl relative group">
          <div class="corner-bracket corner-bracket-tl border-emerald-400"></div>
          <div class="corner-bracket corner-bracket-tr border-emerald-400"></div>
          <div class="corner-bracket corner-bracket-bl border-emerald-400"></div>
          <div class="corner-bracket corner-bracket-br border-emerald-400"></div>
          <div class="scanline-overlay pointer-events-none rounded-2xl"></div>

          <div class="text-[11px] text-slate-400 mb-2 pb-1.5 border-b border-emerald-500/20 flex justify-between items-center relative z-10">
            <span class="text-emerald-400 font-bold flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-ping"></span>
              -- T-SQL QUERY TEMPLATE (ĐIỀN VÀO CHỖ TRỐNG):
            </span>
            <span class="text-slate-500 text-[10px]">TRANSACT-SQL ENGINE</span>
          </div>
          <pre id="sqlCodePreview" class="text-slate-200 leading-relaxed whitespace-pre-wrap select-none relative z-10 py-1 font-mono text-xs sm:text-sm"></pre>
        </div>

        <!-- Slot Options Picker -->
        <div id="sqlSlotsArea" class="flex-1 overflow-y-auto space-y-2.5 my-1 pr-1">
          <!-- Rendered blanks and their selectable buttons -->
        </div>

        <!-- Execution Result Preview -->
        <div id="sqlResultBox" class="bg-slate-900/95 border border-emerald-500/50 rounded-2xl p-3.5 shrink-0 hidden text-xs font-mono space-y-2 shadow-2xl shadow-emerald-950/60">
          <div class="flex items-center justify-between text-[11px]">
            <span class="text-emerald-300 font-bold flex items-center gap-2">
              <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
              KẾT QUẢ THỰC THI TRUY VẤN (QUERY RESULT):
            </span>
            <span id="sqlExecMetric" class="text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30 font-bold">Execution Plan</span>
          </div>
          <div class="overflow-x-auto max-h-28 border border-slate-800 rounded-xl bg-slate-950/80 shadow-inner">
            <table id="sqlResultTable" class="w-full text-left border-collapse text-[11px]">
              <!-- Generated table rows -->
            </table>
          </div>
        </div>

        <!-- Footer -->
        <div class="flex items-center justify-between pt-3 border-t border-emerald-500/20 mt-2 text-xs shrink-0">
          <div id="sqlStatusMsg" class="text-xs font-bold"></div>
          <div class="flex items-center gap-2 ml-auto">
            <button id="sqlExecuteBtn" class="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold hover:from-emerald-500 hover:to-teal-500 transition-all flex items-center gap-1.5 shadow-lg shadow-emerald-600/30">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              Thực thi & Benchmark
            </button>
            <button id="sqlNextBtn" class="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold hover:from-cyan-500 hover:to-blue-500 transition-all hidden shadow-lg shadow-cyan-600/30">
              Câu tiếp ➔
            </button>
            <button id="sqlResetBtn" class="px-3.5 py-2 rounded-xl bg-slate-800/90 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700 transition-all font-medium">
              Làm lại ↻
            </button>
          </div>
        </div>

        <!-- Pause Overlay -->
        <div id="sqlPauseOverlay" class="absolute inset-0 bg-slate-950/90 backdrop-blur-md z-20 flex flex-col items-center justify-center gap-4 hidden">
          <div class="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 shadow-lg shadow-amber-500/20">${getIconSvg('pause', 'w-6 h-6 text-amber-300')}</div>
          <div class="text-xl font-bold text-amber-300 tracking-wider">HỆ THỐNG TẠM DỪNG</div>
          <button id="sqlResumeBtn" class="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs hover:from-emerald-500 hover:to-teal-500 transition-all shadow-lg shadow-emerald-600/30 flex items-center gap-2">
            ${getIconSvg('play', 'w-3.5 h-3.5')} TIẾP TỤC NGAY
          </button>
        </div>

      </div>
    `;

    this.bindEvents();
    this.renderCurrentChallenge();
  }

  bindEvents() {
    const execBtn = document.getElementById('sqlExecuteBtn');
    const nextBtn = document.getElementById('sqlNextBtn');
    const resetBtn = document.getElementById('sqlResetBtn');
    const resumeBtn = document.getElementById('sqlResumeBtn');

    if (execBtn) {
      execBtn.addEventListener('click', () => {
        if (!this.isPaused) this.executeSql();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        this.currentIndex = (this.currentIndex + 1) % this.challenges.length;
        this.selectedAnswers = {};
        this.renderCurrentChallenge();
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', () => this.reset());
    }

    if (resumeBtn) {
      resumeBtn.addEventListener('click', () => this.resume());
    }
  }

  renderCurrentChallenge() {
    const ch = this.challenges[this.currentIndex];
    if (!ch) return;

    document.getElementById('sqlProgress').innerText = `${this.currentIndex + 1}/${this.challenges.length}`;
    document.getElementById('sqlScore').innerText = this.score;
    document.getElementById('sqlTitle').innerText = ch.title;
    document.getElementById('sqlDesc').innerText = ch.desc;
    document.getElementById('sqlSchema').innerText = ch.schema;
    document.getElementById('sqlStatusMsg').innerText = '';
    document.getElementById('sqlResultBox').classList.add('hidden');
    document.getElementById('sqlNextBtn').classList.add('hidden');
    document.getElementById('sqlExecuteBtn').classList.remove('hidden');

    this.updateQueryPreview();

    // Render Blank Options
    const slotsArea = document.getElementById('sqlSlotsArea');
    slotsArea.innerHTML = '';

    ch.blanks.forEach(b => {
      const blankCard = document.createElement('div');
      blankCard.className = 'bg-slate-900/80 p-3 rounded-2xl border border-slate-800 space-y-2 shadow-inner';

      blankCard.innerHTML = `
        <div class="text-xs font-bold text-amber-300 font-mono flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-amber-400 inline-block animate-pulse"></span>
          <span>CHỌN MỆNH ĐỀ CHO <span class="text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded-md border border-cyan-500/40">${b.label}</span>:</span>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2" id="blankOpts_${b.id}"></div>
      `;

      const optsContainer = blankCard.querySelector(`#blankOpts_${b.id}`);
      b.options.forEach((optStr, optIdx) => {
        const btn = document.createElement('button');
        btn.className = 'sql-opt-btn text-left p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-emerald-400 hover:bg-slate-900/80 text-slate-300 font-mono text-xs transition-all shadow-sm';
        btn.innerText = optStr;

        btn.addEventListener('click', () => {
          if (this.isPaused) return;
          this.selectedAnswers[b.id] = optIdx;
          this.playBeep(440, 'sine', 0.04);
          
          optsContainer.querySelectorAll('.sql-opt-btn').forEach(btnEl => {
            btnEl.className = 'sql-opt-btn text-left p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-400 font-mono text-xs transition-all';
          });
          btn.className = 'sql-opt-btn text-left p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-400 text-emerald-300 font-bold font-mono text-xs shadow-[0_0_12px_rgba(16,185,129,0.3)] transition-all';

          this.updateQueryPreview();
        });

        optsContainer.appendChild(btn);
      });

      slotsArea.appendChild(blankCard);
    });
  }

  updateQueryPreview() {
    const ch = this.challenges[this.currentIndex];
    let preview = ch.template;

    ch.blanks.forEach(b => {
      const chosenIdx = this.selectedAnswers[b.id];
      if (chosenIdx !== undefined) {
        preview = preview.replace(b.label, `/* ${b.options[chosenIdx]} */`);
      } else {
        preview = preview.replace(b.label, `[${b.label}: CHƯA CHỌN]`);
      }
    });

    const codeEl = document.getElementById('sqlCodePreview');
    if (codeEl) codeEl.innerText = preview;
  }

  executeSql() {
    const ch = this.challenges[this.currentIndex];
    const statusMsg = document.getElementById('sqlStatusMsg');
    const resultBox = document.getElementById('sqlResultBox');
    const nextBtn = document.getElementById('sqlNextBtn');
    const execBtn = document.getElementById('sqlExecuteBtn');

    for (let b of ch.blanks) {
      if (this.selectedAnswers[b.id] === undefined) {
        statusMsg.innerHTML = `<span class="text-amber-400 flex items-center justify-center gap-1.5">${getIconSvg('alert-triangle', 'w-4 h-4')} Vui lòng chọn đáp án cho ${b.label}!</span>`;
        this.playBeep(220, 'sawtooth', 0.1);
        return;
      }
    }

    let allCorrect = true;
    for (let b of ch.blanks) {
      if (this.selectedAnswers[b.id] !== b.correct) {
        allCorrect = false;
        break;
      }
    }

    if (allCorrect) {
      this.score += 300;
      this.playBeep(523.25, 'triangle', 0.1);
      setTimeout(() => this.playBeep(783.99, 'triangle', 0.15), 100);

      statusMsg.innerHTML = `<span class="text-emerald-400 font-bold flex items-center justify-center gap-1.5">${getIconSvg('check-circle', 'w-4 h-4')} THỰC THI THÀNH CÔNG! Index Seek tối ưu 100%!</span>`;
      document.getElementById('sqlScore').innerText = this.score;

      this.renderResultTable(ch);
      resultBox.classList.remove('hidden');
      execBtn.classList.add('hidden');
      nextBtn.classList.remove('hidden');
    } else {
      this.playBeep(180, 'sawtooth', 0.15);
      statusMsg.innerHTML = `<span class="text-rose-400 font-semibold flex items-center justify-center gap-1.5">${getIconSvg('alert-triangle', 'w-4 h-4')} Cú pháp chưa tối ưu hoặc sai logic! Vui lòng chọn lại.</span>`;
    }
  }

  renderResultTable(ch) {
    document.getElementById('sqlExecMetric').innerText = `Kế hoạch: ${ch.executionPlan}`;
    const table = document.getElementById('sqlResultTable');
    table.innerHTML = '';

    const thead = document.createElement('thead');
    thead.className = 'bg-slate-950 text-slate-400 border-b border-slate-800';
    let headerHtml = '<tr>';
    ch.resultColumns.forEach(c => {
      headerHtml += `<th class="px-2.5 py-1.5 font-semibold">${c}</th>`;
    });
    headerHtml += '</tr>';
    thead.innerHTML = headerHtml;
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    tbody.className = 'divide-y divide-slate-800/60 bg-slate-950/40 text-slate-300';
    ch.resultRows.forEach(row => {
      let rowHtml = '<tr class="hover:bg-slate-800/30">';
      row.forEach(cell => {
        rowHtml += `<td class="px-2.5 py-1.5">${cell}</td>`;
      });
      rowHtml += '</tr>';
      tbody.innerHTML += rowHtml;
    });
    table.appendChild(tbody);
  }

  pause() {
    this.isPaused = true;
    document.getElementById('sqlPauseOverlay')?.classList.remove('hidden');
  }

  resume() {
    this.isPaused = false;
    document.getElementById('sqlPauseOverlay')?.classList.add('hidden');
  }

  reset() {
    this.currentIndex = 0;
    this.selectedAnswers = {};
    this.score = 0;
    this.isPaused = false;
    document.getElementById('sqlPauseOverlay')?.classList.add('hidden');
    this.renderCurrentChallenge();
  }

  getStatus() {
    return {
      score: this.score,
      current: this.currentIndex + 1,
      total: this.challenges.length
    };
  }

  destroy() {}
}
