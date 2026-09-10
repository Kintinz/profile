// GitBranchMaster.js - Mô phỏng & Giải Cứu Nhánh Git Trực Quan
import { getIconSvg } from '../utils/icons.js';

export class GitBranchMaster {
  constructor(canvasId) {
    this.canvasId = canvasId;
    this.container = document.getElementById(canvasId)?.parentElement;
    this.audioCtx = null;

    this.scenarios = [
      {
        id: 1,
        title: 'Bốc lẻ commit quan trọng (git cherry-pick)',
        desc: 'Nhánh main cần gấp bản vá bảo mật (commit C3 - fix: xss token) từ nhánh feature/exp mà KHÔNG muốn merge toàn bộ các commit dang dở khác.',
        goal: 'Chạy lệnh cherry-pick đưa commit C3 vào nhánh main',
        initialGraph: [
          { id: 'C1', branch: 'main', msg: 'init commit', parent: null },
          { id: 'C2', branch: 'main', msg: 'setup webapi', parent: 'C1' },
          { id: 'C3', branch: 'feature/exp', msg: 'fix: xss token', parent: 'C2' },
          { id: 'C4', branch: 'feature/exp', msg: 'wip: new experiment', parent: 'C3' }
        ],
        currentBranch: 'main',
        options: [
          'git cherry-pick C3',
          'git merge feature/exp',
          'git rebase feature/exp',
          'git reset --hard C3'
        ],
        correctOption: 0,
        resultGraph: [
          { id: 'C1', branch: 'main', msg: 'init commit', parent: null },
          { id: 'C2', branch: 'main', msg: 'setup webapi', parent: 'C1' },
          { id: 'C3', branch: 'feature/exp', msg: 'fix: xss token', parent: 'C2' },
          { id: 'C4', branch: 'feature/exp', msg: 'wip: new experiment', parent: 'C3' },
          { id: "C3'", branch: 'main [HEAD]', msg: 'fix: xss token (picked)', parent: 'C2' }
        ],
        lesson: 'git cherry-pick sao chép chính xác một commit từ nhánh bất kỳ và áp dụng vào nhánh hiện tại mà không làm thay đổi cấu trúc của các nhánh khác.'
      },
      {
        id: 2,
        title: 'Cứu hộ commit vô tình bị xóa (git reflog)',
        desc: 'Lập trình viên lỡ tay gõ "git reset --hard HEAD~2" làm mất sạch 2 commit quan trọng chứa mã nguồn 3 ngày làm việc!',
        goal: 'Tìm lại commit SHA bị lạc trôi và đưa HEAD về lại trạng thái trước khi reset',
        initialGraph: [
          { id: 'C1', branch: 'main', msg: 'initial', parent: null },
          { id: 'C2', branch: 'main [HEAD]', msg: 'base setup', parent: 'C1' },
          { id: 'C3 (LOST)', branch: 'unreachable', msg: 'feat: payment logic', parent: 'C2', isGhost: true },
          { id: 'C4 (LOST)', branch: 'unreachable', msg: 'feat: webhook integration', parent: 'C3', isGhost: true }
        ],
        currentBranch: 'main',
        options: [
          'git reflog xem lại nhật ký HEAD rồi gõ: git reset --hard HEAD@{1}',
          'git push --force origin main',
          'git checkout -b new-branch',
          'git stash clear'
        ],
        correctOption: 0,
        resultGraph: [
          { id: 'C1', branch: 'main', msg: 'initial', parent: null },
          { id: 'C2', branch: 'main', msg: 'base setup', parent: 'C1' },
          { id: 'C3', branch: 'main', msg: 'feat: payment logic', parent: 'C2' },
          { id: 'C4', branch: 'main [HEAD]', msg: 'feat: webhook integration (RESTORED!)', parent: 'C3' }
        ],
        lesson: 'Git không bao giờ xóa ngay dữ liệu khi reset. "git reflog" lưu vết từng cú dịch chuyển của HEAD trong 30-90 ngày, giúp hồi sinh mọi commit mồ côi.'
      },
      {
        id: 3,
        title: 'Gom gộp commit gọn gàng trước khi tạo Pull Request',
        desc: 'Trước khi merge vào main, nhánh feature đang có 4 commit vụn vặt ("fix typo", "fix again", "wip"). Cần nén lại thành 1 commit duy nhất chuẩn đẹp.',
        goal: 'Dùng Interactive Rebase để squash các commit',
        initialGraph: [
          { id: 'C1', branch: 'main', msg: 'base app', parent: null },
          { id: 'C2', branch: 'feature', msg: 'add login ui', parent: 'C1' },
          { id: 'C3', branch: 'feature', msg: 'fix typo css', parent: 'C2' },
          { id: 'C4', branch: 'feature', msg: 'fix again', parent: 'C3' }
        ],
        currentBranch: 'feature',
        options: [
          'git rebase -i HEAD~3 rồi đổi "pick" thành "squash" cho 2 commit sau',
          'git merge --no-ff main',
          'git branch -D feature',
          'git revert HEAD'
        ],
        correctOption: 0,
        resultGraph: [
          { id: 'C1', branch: 'main', msg: 'base app', parent: null },
          { id: 'C_Clean', branch: 'feature [HEAD]', msg: 'feat: complete login module (squashed)', parent: 'C1' }
        ],
        lesson: '"git rebase -i" cho phép gộp (squash), sửa message (reword), bỏ (drop) hoặc chia nhỏ commit để giữ Git History của dự án luôn sạch sẽ và chuyên nghiệp.'
      },
      {
        id: 4,
        title: 'Chuyển nhánh khẩn cấp khi đang sửa dở dang (git stash)',
        desc: 'Bạn đang code dở thì sếp yêu cầu checkout gấp sang nhánh hotfix/prod để sửa lỗi. Git báo không cho checkout vì có uncommitted changes.',
        goal: 'Cất tạm mã nguồn an toàn mà không cần commit bừa bãi',
        initialGraph: [
          { id: 'C1', branch: 'main', msg: 'production release', parent: null },
          { id: 'WIP', branch: 'feature (dirty)', msg: '5 files modified, uncommitted', parent: 'C1', isGhost: true }
        ],
        currentBranch: 'feature',
        options: [
          'git stash push -m "wip feature" rồi git checkout hotfix/prod',
          'git reset --hard HEAD',
          'git clean -fd',
          'git push -f'
        ],
        correctOption: 0,
        resultGraph: [
          { id: 'C1', branch: 'hotfix/prod [HEAD]', msg: 'checked out cleanly', parent: null },
          { id: 'Stash@{0}', branch: 'stash stack', msg: 'wip feature saved safely', parent: 'C1' }
        ],
        lesson: '"git stash" lưu toàn bộ thay đổi trong working directory và index vào ngăn xếp nội bộ của Git. Sau khi hotfix xong, chỉ cần gõ "git stash pop" để tiếp tục công việc.'
      }
    ];

    this.currentIndex = 0;
    this.score = 0;
    this.streak = 0;
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
      <div id="gitMasterRoot" class="w-full h-full flex flex-col justify-between bg-slate-950/80 text-slate-100 font-sans rounded-2xl border border-orange-500/30 p-3 sm:p-5 select-none relative overflow-hidden shadow-2xl backdrop-blur-md">
        
        <!-- Header -->
        <div class="flex flex-wrap items-center justify-between pb-3 border-b border-orange-500/20 gap-2 shrink-0">
          <div class="flex items-center gap-2.5">
            <span class="p-1.5 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/40 shadow-sm shadow-orange-500/30 animate-pulse">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"/></svg>
            </span>
            <span class="text-xs font-bold tracking-widest text-orange-300 drop-shadow-[0_0_8px_rgba(249,115,22,0.6)]">
              GIT BRANCH MASTER - ĐIỀU HƯỚNG NHÁNH TRỰC QUAN
            </span>
          </div>

          <div class="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
            <div class="bg-slate-900/90 px-3 py-1 rounded-xl border border-amber-500/30 shadow-inner flex items-center gap-2">
              <span class="text-slate-400 text-[10px] font-bold">ĐIỂM:</span>
              <strong id="gitScore" class="digital-lcd text-amber-300 font-bold text-base tracking-wider">0</strong>
            </div>
            <div class="bg-slate-900/90 px-3 py-1 rounded-xl border border-emerald-500/30 shadow-inner flex items-center gap-2">
              <span class="text-slate-400 text-[10px] font-bold">CHUỖI:</span>
              <strong id="gitStreak" class="digital-lcd text-emerald-300 font-bold text-base tracking-wider">0</strong>
            </div>
            <div class="bg-slate-900/90 px-3 py-1 rounded-xl border border-orange-500/30 shadow-inner flex items-center gap-2">
              <span class="text-slate-400 text-[10px] font-bold">TÌNH HUỐNG:</span>
              <strong id="gitProgress" class="digital-lcd text-orange-300 font-bold text-base tracking-wider">1/4</strong>
            </div>
          </div>
        </div>

        <!-- Description & Goal -->
        <div class="bg-slate-900/80 p-3.5 rounded-2xl border border-orange-500/20 mt-2.5 shrink-0 space-y-1.5 shadow-inner">
          <h3 id="gitTitle" class="text-sm font-bold text-white tracking-wide">Title</h3>
          <p id="gitDesc" class="text-xs text-slate-300 leading-relaxed font-sans">Desc</p>
          <div class="text-xs text-amber-300 font-medium pt-1 flex items-center gap-2 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/30">
            <strong class="text-amber-400">🎯 MỤC TIÊU:</strong>
            <span id="gitGoal" class="text-slate-200">Goal</span>
          </div>
        </div>

        <!-- Interactive Visual Git Graph with Corner Brackets & Scanlines -->
        <div class="my-3 bg-slate-950/90 rounded-2xl border border-orange-500/30 p-4 shrink-0 overflow-x-auto relative shadow-2xl group">
          <div class="corner-bracket corner-bracket-tl border-orange-400"></div>
          <div class="corner-bracket corner-bracket-tr border-orange-400"></div>
          <div class="corner-bracket corner-bracket-bl border-orange-400"></div>
          <div class="corner-bracket corner-bracket-br border-orange-400"></div>
          <div class="scanline-overlay pointer-events-none rounded-2xl"></div>

          <div class="text-[11px] text-slate-400 mb-2 pb-1.5 border-b border-orange-500/20 flex justify-between items-center relative z-10">
            <span class="text-orange-400 font-bold flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-orange-400 inline-block animate-ping"></span>
              SƠ ĐỒ CÂY COMMIT & NHÁNH (GIT GRAPH):
            </span>
            <span class="text-orange-300 bg-orange-500/10 px-2.5 py-0.5 rounded-md border border-orange-500/30 font-mono text-[10px]">
              Active: <strong id="gitActiveBranch" class="text-white">main</strong>
            </span>
          </div>
          <div id="gitGraphCanvas" class="flex items-center gap-3 min-h-[95px] overflow-x-auto py-2 relative z-10">
            <!-- Rendered commit circles & arrows -->
          </div>
        </div>

        <!-- Options: Terminal Command Selection -->
        <div class="shrink-0 space-y-2">
          <div class="text-xs font-bold text-slate-300 flex items-center justify-between">
            <span class="flex items-center gap-1.5 text-orange-300">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
              Chọn câu lệnh Git CLI chính xác:
            </span>
            <span id="gitStatusMsg" class="text-xs font-bold"></span>
          </div>
          <div id="gitOptions" class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
            <!-- Command buttons -->
          </div>
        </div>

        <!-- Explanation box -->
        <div id="gitLessonBox" class="bg-emerald-950/60 border border-emerald-500/50 p-3.5 rounded-xl text-xs mt-2.5 hidden text-emerald-200 shadow-lg shadow-emerald-950/50 leading-relaxed font-sans"></div>

        <!-- Footer -->
        <div class="flex items-center justify-between pt-3 border-t border-orange-500/20 mt-2 text-xs shrink-0">
          <span class="text-slate-400 hidden sm:inline">Thành thạo Git CLI giải cứu mã nguồn production</span>
          <div class="flex items-center gap-2 ml-auto sm:ml-0">
            <button id="gitNextBtn" class="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 text-white font-bold hover:from-orange-500 hover:to-amber-500 transition-all hidden shadow-lg shadow-orange-600/30">
              Tình huống tiếp theo ➔
            </button>
            <button id="gitResetBtn" class="px-3.5 py-2 rounded-xl bg-slate-800/90 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700 transition-all font-medium">
              Làm lại ↻
            </button>
          </div>
        </div>

        <!-- Pause Overlay -->
        <div id="gitPauseOverlay" class="absolute inset-0 bg-slate-950/90 backdrop-blur-md z-20 flex flex-col items-center justify-center gap-4 hidden">
          <div class="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 shadow-lg shadow-amber-500/20">${getIconSvg('pause', 'w-6 h-6 text-amber-300')}</div>
          <div class="text-xl font-bold text-amber-300 tracking-wider">HỆ THỐNG TẠM DỪNG</div>
          <button id="gitResumeBtn" class="px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 text-white font-bold text-xs hover:from-orange-500 hover:to-amber-500 transition-all shadow-lg shadow-orange-600/30 flex items-center gap-2">
            ${getIconSvg('play', 'w-3.5 h-3.5')} TIẾP TỤC NGAY
          </button>
        </div>

      </div>
    `;

    this.bindEvents();
    this.renderCurrentScenario();
  }

  bindEvents() {
    const nextBtn = document.getElementById('gitNextBtn');
    const resetBtn = document.getElementById('gitResetBtn');
    const resumeBtn = document.getElementById('gitResumeBtn');

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        this.currentIndex = (this.currentIndex + 1) % this.scenarios.length;
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

  renderCurrentScenario(showResult = false) {
    const sc = this.scenarios[this.currentIndex];
    if (!sc) return;

    document.getElementById('gitProgress').innerText = `${this.currentIndex + 1}/${this.scenarios.length}`;
    document.getElementById('gitScore').innerText = this.score;
    document.getElementById('gitStreak').innerText = this.streak;
    document.getElementById('gitTitle').innerText = sc.title;
    document.getElementById('gitDesc').innerText = sc.desc;
    document.getElementById('gitGoal').innerText = sc.goal;
    document.getElementById('gitActiveBranch').innerText = sc.currentBranch;

    if (!showResult) {
      document.getElementById('gitStatusMsg').innerText = '';
      document.getElementById('gitLessonBox').classList.add('hidden');
      document.getElementById('gitNextBtn').classList.add('hidden');
    }

    // Render Graph Nodes
    const graphNodes = showResult ? sc.resultGraph : sc.initialGraph;
    const canvas = document.getElementById('gitGraphCanvas');
    canvas.innerHTML = '';

    graphNodes.forEach((node, idx) => {
      const nodeEl = document.createElement('div');
      nodeEl.className = 'flex items-center gap-2 shrink-0';

      const isGhost = node.isGhost;
      const isPick = node.id.includes("'");
      const isRestored = node.msg.includes('RESTORED');
      
      let borderCol = 'border-cyan-500/40 bg-slate-900';
      let textCol = 'text-cyan-400';
      if (isGhost) {
        borderCol = 'border-dashed border-rose-500/50 bg-rose-950/20';
        textCol = 'text-rose-400';
      } else if (isPick || isRestored) {
        borderCol = 'border-emerald-500 bg-emerald-950/60 shadow-lg shadow-emerald-500/20 animate-pulse';
        textCol = 'text-emerald-300';
      }

      nodeEl.innerHTML = `
        <div class="flex flex-col items-center">
          <span class="text-[10px] font-mono font-bold text-slate-400 mb-1 px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800">
            ${node.branch}
          </span>
          <div class="w-12 h-12 rounded-full ${borderCol} border-2 flex items-center justify-center font-mono font-bold text-xs ${textCol}">
            ${node.id}
          </div>
          <span class="text-[10px] text-slate-400 mt-1 max-w-[100px] truncate text-center" title="${node.msg}">
            ${node.msg}
          </span>
        </div>
      `;

      canvas.appendChild(nodeEl);

      // Add arrow connecting to next node
      if (idx < graphNodes.length - 1) {
        const arrow = document.createElement('div');
        arrow.className = 'text-slate-600 text-base font-bold shrink-0 select-none pb-4';
        arrow.innerHTML = '➔';
        canvas.appendChild(arrow);
      }
    });

    // Render Command Options
    if (!showResult) {
      const optContainer = document.getElementById('gitOptions');
      optContainer.innerHTML = '';

      sc.options.forEach((cmdText, optIdx) => {
        const btn = document.createElement('button');
        btn.className = 'git-cmd-btn text-left p-3 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-orange-400 hover:bg-slate-800/80 hover:shadow-md text-slate-200 transition-all flex items-center gap-2.5 group';
        btn.innerHTML = `
          <span class="w-6 h-6 rounded-lg bg-orange-500/10 border border-orange-500/30 text-orange-400 font-bold flex items-center justify-center text-xs group-hover:bg-orange-500/20 transition-all">$</span>
          <span class="font-mono text-xs text-slate-200 group-hover:text-white transition-colors">${cmdText}</span>
        `;

        btn.addEventListener('click', () => {
          if (this.isPaused) return;
          this.submitGitCmd(optIdx, btn);
        });

        optContainer.appendChild(btn);
      });
    }
  }

  submitGitCmd(optIdx, btn) {
    const sc = this.scenarios[this.currentIndex];
    const statusMsg = document.getElementById('gitStatusMsg');
    const lessonBox = document.getElementById('gitLessonBox');
    const nextBtn = document.getElementById('gitNextBtn');

    const allBtns = document.querySelectorAll('.git-cmd-btn');
    allBtns.forEach(b => b.disabled = true);

    if (optIdx === sc.correctOption) {
      this.score += 250;
      this.streak++;
      this.playBeep(523.25, 'triangle', 0.1);
      setTimeout(() => this.playBeep(783.99, 'triangle', 0.15), 100);

      btn.classList.add('bg-emerald-950/80', 'border-emerald-500', 'text-emerald-300');
      statusMsg.innerHTML = `<span class="text-emerald-400 font-bold flex items-center justify-center gap-1.5">${getIconSvg('check-circle', 'w-4 h-4')} THÀNH CÔNG! Graph đã được cập nhật chuẩn xác!</span>`;
      
      // Update graph to result view
      this.renderCurrentScenario(true);
    } else {
      this.streak = 0;
      this.playBeep(180, 'sawtooth', 0.15);

      btn.classList.add('bg-rose-950/80', 'border-rose-500', 'text-rose-300');
      allBtns[sc.correctOption]?.classList.add('bg-emerald-950/50', 'border-emerald-500', 'text-emerald-300');
      statusMsg.innerHTML = `<span class="text-rose-400 font-semibold flex items-center justify-center gap-1.5">${getIconSvg('alert-triangle', 'w-4 h-4')} Lệnh sai hoặc phá vỡ cấu trúc Git tree!</span>`;
    }

    document.getElementById('gitScore').innerText = this.score;
    document.getElementById('gitStreak').innerText = this.streak;

    lessonBox.innerHTML = `<strong>📖 Bài học Git:</strong> ${sc.lesson}`;
    lessonBox.classList.remove('hidden');
    nextBtn.classList.remove('hidden');
  }

  pause() {
    this.isPaused = true;
    document.getElementById('gitPauseOverlay')?.classList.remove('hidden');
  }

  resume() {
    this.isPaused = false;
    document.getElementById('gitPauseOverlay')?.classList.add('hidden');
  }

  reset() {
    this.currentIndex = 0;
    this.score = 0;
    this.streak = 0;
    this.isPaused = false;
    document.getElementById('gitPauseOverlay')?.classList.add('hidden');
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
