import { initIcons, getIconSvg } from './utils/icons.js';
import { CyberBackground } from './scene/CyberBackground.js';
import { CyberSound } from './audio/CyberSound.js';

// 6 Dev & Command Arenas
import { DevQuizArena } from './games/DevQuizArena.js';
import { TerminalSpeedTyper } from './games/TerminalSpeedTyper.js';
import { CodeBugHunter } from './games/CodeBugHunter.js';
import { SqlQueryForge } from './games/SqlQueryForge.js';
import { GitBranchMaster } from './games/GitBranchMaster.js';
import { MemoryMatrix } from './games/MemoryMatrix.js';

// 10 Casual & Arcade Games
import { CyberSnake } from './games/CyberSnake.js';
import { CyberDefender } from './games/CyberDefender.js';
import { FirewallBreaker } from './games/FirewallBreaker.js';
import { NeonRunner } from './games/NeonRunner.js';
import { FlappyDrone } from './games/FlappyDrone.js';
import { Cyber2048 } from './games/Cyber2048.js';
import { CyberPong } from './games/CyberPong.js';
import { WhackABug } from './games/WhackABug.js';
import { TetrisMatrix } from './games/TetrisMatrix.js';
import { CyberMinesweeper } from './games/CyberMinesweeper.js';

import { CipherLab } from './ciphers/CipherLab.js';
import { HackerTerminal } from './ciphers/HackerTerminal.js';
import { Achievements } from './ui/Achievements.js';
import { KonamiCode } from './ui/KonamiCode.js';
import { showGameGuideModal, getInlineGuideCardHtml } from './ui/GameGuideModal.js';
import { WebEffects } from './ui/WebEffects.js';
import { ThemeSwitcher } from './ui/ThemeSwitcher.js';
import { ProjectDetailModal } from './ui/ProjectDetailModal.js';
import { ResumeModal } from './ui/ResumeModal.js';
import { CommandPalette } from './ui/CommandPalette.js';
import { ContactDispatcher } from './ui/ContactDispatcher.js';
import { SystemTelemetry } from './ui/SystemTelemetry.js';
import { DevIdCardModal } from './ui/DevIdCardModal.js';
import { ProjectFilter } from './ui/ProjectFilter.js';

class App {
  constructor() {
    this.activeCategory = 'casual'; // 'casual' | 'dev'
    this.activeGame = 'snake'; // Default casual game
    this.activeDevGame = 'quiz'; // Default dev game
    this.init();
  }

  init() {
    this.sound = new CyberSound();
    this.achievements = new Achievements(this.sound);
    this.konami = new KonamiCode(this.achievements, this.sound);
    this.webEffects = new WebEffects();
    this.themeSwitcher = new ThemeSwitcher(this.sound);
    this.projectModal = new ProjectDetailModal(this.sound);
    this.resumeModal = new ResumeModal(this.sound);
    this.devIdModal = new DevIdCardModal(this.sound, this.achievements);
    this.commandPalette = new CommandPalette(this);
    this.telemetry = new SystemTelemetry(this.sound);
    this.contactDispatcher = new ContactDispatcher('contact-dispatcher-root', this.sound, this.achievements);
    this.projectFilter = new ProjectFilter(this.sound);
    this.bindBackToTop();

    setTimeout(() => {
      this.achievements.unlock('first_contact', 'First Contact', 'Chào mừng bạn đã gia nhập mạng lưới Nexus Matrix!', 'zap');
    }, 1200);

    const bgContainer = document.getElementById('three-canvas-container');
    if (bgContainer) {
      this.background3D = new CyberBackground(bgContainer);
    }

    // Initialize Casual Games
    this.initCasualGames();

    // Initialize Dev Games
    this.initDevGames();

    // Technical Labs
    this.initCipherLab();
    this.initTerminal();

    // Event Binders
    this.bindAudioControls();
    this.bindCategorySwitcher();
    this.bindCasualTabSwitch();
    this.bindDevTabSwitch();
    this.bindGlobalControls();
    this.initGameGuides();

    setTimeout(() => initIcons(), 100);
  }

  // ==========================================
  // CASUAL GAMES INITIALIZATION
  // ==========================================
  initCasualGames() {
    // 1. Cyber Snake
    const snakeCanvas = document.getElementById('canvas-snake');
    if (snakeCanvas) {
      const scoreEl = document.getElementById('snake-score-display');
      const bestEl = document.getElementById('snake-best-display');
      this.snake = new CyberSnake(
        snakeCanvas,
        this.sound,
        (score, high) => {
          if (scoreEl) scoreEl.innerText = score;
          if (bestEl) bestEl.innerText = high;
        },
        (score) => {
          if (score >= 100) {
            this.achievements.unlock('snake_master', 'Cyber Snake Master', 'Đạt 100 điểm trong Rắn Săn Mồi Neon!', 'activity');
          }
        }
      );

      document.getElementById('snake-diff-select')?.addEventListener('change', (e) => {
        this.snake.setDifficulty(e.target.value);
        this.snake.reset();
      });

      document.getElementById('btn-snake-pause')?.addEventListener('click', (e) => {
        const paused = this.snake.togglePause();
        e.target.innerText = paused ? 'Tiếp Tục' : 'Tạm Dừng';
      });
      document.getElementById('btn-snake-restart')?.addEventListener('click', () => {
        this.snake.reset();
        const pauseBtn = document.getElementById('btn-snake-pause');
        if (pauseBtn) pauseBtn.innerText = 'Tạm Dừng';
      });

      // Mobile D-pad
      document.getElementById('btn-snake-up')?.addEventListener('click', () => {
        if (this.snake.dir.y === 0) this.snake.nextDir = { x: 0, y: -1 };
      });
      document.getElementById('btn-snake-down')?.addEventListener('click', () => {
        if (this.snake.dir.y === 0) this.snake.nextDir = { x: 0, y: 1 };
      });
      document.getElementById('btn-snake-left')?.addEventListener('click', () => {
        if (this.snake.dir.x === 0) this.snake.nextDir = { x: -1, y: 0 };
      });
      document.getElementById('btn-snake-right')?.addEventListener('click', () => {
        if (this.snake.dir.x === 0) this.snake.nextDir = { x: 1, y: 0 };
      });

      // Start default game
      this.snake.start();
    }

    // 2. Cyber Defender
    const defenderCanvas = document.getElementById('canvas-defender');
    if (defenderCanvas) {
      const scoreEl = document.getElementById('defender-score-display');
      const hpEl = document.getElementById('defender-hp-display');
      this.defender = new CyberDefender(
        defenderCanvas,
        this.sound,
        (score, high, health) => {
          if (scoreEl) scoreEl.innerText = score;
          if (hpEl) hpEl.innerText = `${health}%`;
        },
        (score) => {
          if (score >= 1500) {
            this.achievements.unlock('galaxy_guardian', 'Space Guardian', 'Bắn hạ hạm đội virus vũ trụ xuất sắc!', 'rocket');
          }
        }
      );

      document.getElementById('defender-diff-select')?.addEventListener('change', (e) => {
        this.defender.setDifficulty(e.target.value);
        this.defender.reset();
        const pauseBtn = document.getElementById('btn-defender-pause');
        if (pauseBtn) pauseBtn.innerText = 'Tạm Dừng';
      });
      document.getElementById('btn-defender-pause')?.addEventListener('click', (e) => {
        const paused = this.defender.togglePause();
        e.target.innerText = paused ? 'Tiếp Tục' : 'Tạm Dừng';
      });
      document.getElementById('btn-defender-restart')?.addEventListener('click', () => {
        this.defender.reset();
        const pauseBtn = document.getElementById('btn-defender-pause');
        if (pauseBtn) pauseBtn.innerText = 'Tạm Dừng';
      });
    }

    // 3. Firewall Breaker
    const breakerCanvas = document.getElementById('canvas-breaker');
    if (breakerCanvas) {
      const scoreEl = document.getElementById('breaker-score-display');
      const livesEl = document.getElementById('breaker-lives-display');
      this.breaker = new FirewallBreaker(
        breakerCanvas,
        this.sound,
        (score, lives) => {
          if (scoreEl) scoreEl.innerText = score;
          if (livesEl) livesEl.innerText = lives;
        },
        (score) => {
          if (score >= 2000) {
            this.achievements.unlock('brick_destroyer', 'Firewall Breaker', 'Phá tan hàng rào tường lửa cấp cao!', 'boxes');
          }
        }
      );

      document.getElementById('breaker-diff-select')?.addEventListener('change', (e) => {
        this.breaker.setDifficulty(e.target.value);
        this.breaker.reset();
        const pauseBtn = document.getElementById('btn-breaker-pause');
        if (pauseBtn) pauseBtn.innerText = 'Tạm Dừng';
      });
      document.getElementById('btn-breaker-pause')?.addEventListener('click', (e) => {
        const paused = this.breaker.togglePause();
        e.target.innerText = paused ? 'Tiếp Tục' : 'Tạm Dừng';
      });
      document.getElementById('btn-breaker-restart')?.addEventListener('click', () => {
        this.breaker.reset();
        const pauseBtn = document.getElementById('btn-breaker-pause');
        if (pauseBtn) pauseBtn.innerText = 'Tạm Dừng';
      });
    }

    // 4. Neon Runner 3D
    const runnerCanvas = document.getElementById('canvas-runner');
    if (runnerCanvas) {
      const distEl = document.getElementById('runner-dist-display');
      const nitroEl = document.getElementById('runner-nitro-display');
      this.runner = new NeonRunner(
        runnerCanvas,
        this.sound,
        (dist, high, nitro) => {
          if (distEl) distEl.innerText = `${dist}m`;
          if (nitroEl) nitroEl.innerText = `${nitro}%`;
        },
        (dist) => {
          if (dist >= 1000) {
            this.achievements.unlock('speed_demon', 'Hyperspeed Runner', 'Lướt hơn 1000m trên cao tốc ánh sáng!', 'gauge');
          }
        }
      );

      document.getElementById('runner-diff-select')?.addEventListener('change', (e) => {
        this.runner.setDifficulty(e.target.value);
        this.runner.reset();
      });
      document.getElementById('btn-runner-restart')?.addEventListener('click', () => {
        this.runner.reset();
      });
    }

    // 5. Flappy Drone
    const flappyCanvas = document.getElementById('canvas-flappy');
    if (flappyCanvas) {
      const scoreEl = document.getElementById('flappy-score-display');
      const bestEl = document.getElementById('flappy-best-display');
      this.flappy = new FlappyDrone(
        flappyCanvas,
        this.sound,
        (score, high) => {
          if (scoreEl) scoreEl.innerText = score;
          if (bestEl) bestEl.innerText = high;
        },
        (score) => {
          if (score >= 15) {
            this.achievements.unlock('drone_pilot', 'Elite Drone Pilot', 'Vượt qua 15 cổng laser bảo mật!', 'navigation');
          }
        }
      );

      document.getElementById('flappy-diff-select')?.addEventListener('change', (e) => {
        this.flappy.setDifficulty(e.target.value);
        this.flappy.reset();
        const pauseBtn = document.getElementById('btn-flappy-pause');
        if (pauseBtn) pauseBtn.innerText = 'Tạm Dừng';
      });
      document.getElementById('btn-flappy-pause')?.addEventListener('click', (e) => {
        const paused = this.flappy.togglePause();
        e.target.innerText = paused ? 'Tiếp Tục' : 'Tạm Dừng';
      });
      document.getElementById('btn-flappy-restart')?.addEventListener('click', () => {
        this.flappy.reset();
        const pauseBtn = document.getElementById('btn-flappy-pause');
        if (pauseBtn) pauseBtn.innerText = 'Tạm Dừng';
      });
    }

    // 6. Matrix 2048
    const root2048 = document.getElementById('game-2048-root');
    if (root2048) {
      this.cyber2048 = new Cyber2048(root2048, this.sound, null, (score) => {
        if (score >= 2048) {
          this.achievements.unlock('matrix_2048', 'Quantum Fusion', 'Hợp nhất thành công khối dữ liệu 2048TB!', 'binary');
        }
      });
    }

    // 7. Cyber Pong
    const pongCanvas = document.getElementById('canvas-pong');
    if (pongCanvas) {
      const pScoreEl = document.getElementById('pong-player-score');
      const aiScoreEl = document.getElementById('pong-ai-score');
      this.pong = new CyberPong(
        pongCanvas,
        this.sound,
        (pScore, aiScore) => {
          if (pScoreEl) pScoreEl.innerText = pScore;
          if (aiScoreEl) aiScoreEl.innerText = aiScore;
        },
        (pScore, aiScore, won) => {
          if (won) {
            this.achievements.unlock('pong_champion', 'Cyber Pong Champion', 'Chiến thắng vang dội trước AI trong bóng bàn neon!', 'circle-dot');
          }
        }
      );

      document.getElementById('pong-diff-select')?.addEventListener('change', (e) => {
        this.pong.setDifficulty(e.target.value);
        this.pong.reset();
      });

      document.getElementById('btn-pong-pause')?.addEventListener('click', (e) => {
        const paused = this.pong.togglePause();
        e.target.innerText = paused ? 'Tiếp Tục' : 'Tạm Dừng';
      });
      document.getElementById('btn-pong-restart')?.addEventListener('click', () => {
        this.pong.reset();
        const pauseBtn = document.getElementById('btn-pong-pause');
        if (pauseBtn) pauseBtn.innerText = 'Tạm Dừng';
      });
    }

    // 8. Whack-A-Bug
    const rootWhack = document.getElementById('game-whack-root');
    if (rootWhack) {
      this.whack = new WhackABug(rootWhack, this.sound, null, (score) => {
        if (score >= 3000) {
          this.achievements.unlock('bug_terminator', 'Bug Terminator', 'Đạt trên 3000 điểm diệt bọ máy chủ!', 'target');
        }
      });
    }

    // 9. Tetris Matrix
    const tetrisCanvas = document.getElementById('canvas-tetris');
    if (tetrisCanvas) {
      const scoreEl = document.getElementById('tetris-score-display');
      const linesEl = document.getElementById('tetris-lines-display');
      const bestEl = document.getElementById('tetris-best-display');
      this.tetris = new TetrisMatrix(
        tetrisCanvas,
        this.sound,
        (score, high, lines, level) => {
          if (scoreEl) scoreEl.innerText = score;
          if (linesEl) linesEl.innerText = lines;
          if (bestEl) bestEl.innerText = high;
        },
        (score) => {
          if (score >= 2000) {
            this.achievements.unlock('tetris_god', 'Neon Tetris Grandmaster', 'Đạt trên 2000 điểm xếp gạch Neon!', 'shapes');
          }
        }
      );

      document.getElementById('tetris-diff-select')?.addEventListener('change', (e) => {
        this.tetris.setDifficulty(e.target.value);
        this.tetris.reset();
        const pauseBtn = document.getElementById('btn-tetris-pause');
        if (pauseBtn) pauseBtn.innerText = 'Tạm Dừng';
      });
      document.getElementById('btn-tetris-pause')?.addEventListener('click', (e) => {
        const paused = this.tetris.togglePause();
        e.target.innerText = paused ? 'Tiếp Tục' : 'Tạm Dừng';
      });
      document.getElementById('btn-tetris-restart')?.addEventListener('click', () => {
        this.tetris.reset();
        const pauseBtn = document.getElementById('btn-tetris-pause');
        if (pauseBtn) pauseBtn.innerText = 'Tạm Dừng';
      });

      // Mobile Tetris buttons
      document.getElementById('btn-tetris-left')?.addEventListener('click', () => this.tetris.move(-1));
      document.getElementById('btn-tetris-right')?.addEventListener('click', () => this.tetris.move(1));
      document.getElementById('btn-tetris-rotate')?.addEventListener('click', () => this.tetris.rotate());
      document.getElementById('btn-tetris-drop')?.addEventListener('click', () => this.tetris.drop());
      document.getElementById('btn-tetris-hard')?.addEventListener('click', () => this.tetris.hardDrop());
    }

    // 10. Cyber Minesweeper
    const rootMines = document.getElementById('game-mines-root');
    if (rootMines) {
      this.mines = new CyberMinesweeper(rootMines, this.sound, null, (won) => {
        if (won) {
          this.achievements.unlock('mine_defuser', 'Quantum Defuser', 'Gỡ bom lõi lượng tử an toàn 100%!', 'shield-alert');
        }
      });
    }
  }

  // ==========================================
  // DEV GAMES INITIALIZATION
  // ==========================================
  initDevGames() {
    // 1. Dev Quiz Arena
    const quizRoot = document.getElementById('quiz-arena-root');
    if (quizRoot) {
      this.devQuiz = new DevQuizArena(quizRoot, this.sound, (finalScore) => {
        if (finalScore >= 500) {
          this.achievements.unlock('git_grandmaster', 'Git & Architecture Master', 'Đạt điểm số xuất sắc trong Đấu Trí Lập Trình!', 'terminal');
        }
      });
    }

    // 2. Terminal Speed Typer
    const canvasTyper = document.getElementById('canvas-typer');
    if (canvasTyper) {
      this.speedTyper = new TerminalSpeedTyper('canvas-typer');
    }

    // 3. Code Bug Hunter
    const canvasHunter = document.getElementById('canvas-hunter');
    if (canvasHunter) {
      this.bugHunter = new CodeBugHunter('canvas-hunter');
    }

    // 4. SQL Query Forge
    const canvasSql = document.getElementById('canvas-sql');
    if (canvasSql) {
      this.sqlForge = new SqlQueryForge('canvas-sql');
    }

    // 5. Git Branch Master
    const canvasGit = document.getElementById('canvas-git');
    if (canvasGit) {
      this.gitMaster = new GitBranchMaster('canvas-git');
    }

    // 6. Memory Matrix
    const matrixRoot = document.getElementById('memory-matrix-root');
    if (matrixRoot) {
      this.memoryMatrix = new MemoryMatrix(matrixRoot, this.sound, (moves) => {
        this.achievements.unlock('matrix_mind', 'Quantum Memory', `Hoàn thành Neon Memory Matrix trong ${moves} bước!`, 'brain');
      });
    }
  }

  // ==========================================
  // TECHNICAL LABS INITIALIZATION
  // ==========================================
  initCipherLab() {
    const container = document.getElementById('cipher-lab-root');
    if (!container) return;

    this.cipherLab = new CipherLab(container, this.sound, (type, count) => {
      this.achievements.unlock('code_breaker', 'Cipher Specialist', `Giải mã thành công công cụ: ${type.toUpperCase()}!`, 'lock');
      if (count >= 3) {
        this.achievements.unlock('quantum_master', 'The Grand Cryptographer', 'Thao tác thành công tất cả công cụ phòng lab!', 'trophy');
      }
    });
  }

  initTerminal() {
    const container = document.getElementById('hacker-terminal-root');
    if (!container) return;

    let commandCount = 0;
    this.terminal = new HackerTerminal(container, this.sound, () => {
      commandCount++;
      if (commandCount >= 3) {
        this.achievements.unlock('terminal_hacker', 'Console Infiltrator', 'Đã thao tác thành thạo trên Hacker Terminal CLI!', 'terminal');
      }
    });
  }

  // ==========================================
  // CATEGORY & TAB SWITCHING LOGIC
  // ==========================================
  bindCategorySwitcher() {
    const btnCasual = document.getElementById('btn-cat-casual');
    const btnDev = document.getElementById('btn-cat-dev');
    const casualTabs = document.getElementById('casual-tabs-wrapper');
    const devTabs = document.getElementById('dev-tabs-wrapper');

    if (!btnCasual || !btnDev) return;

    btnCasual.addEventListener('click', () => {
      if (this.activeCategory === 'casual') return;
      this.activeCategory = 'casual';
      this.sound.playClick(600);

      btnCasual.className = 'px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-400 to-emerald-400 text-slate-950 font-black text-xs code-font shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all inline-flex items-center gap-2';
      btnDev.className = 'px-5 py-2.5 rounded-xl text-slate-400 hover:text-white font-bold text-xs code-font transition-all inline-flex items-center gap-2 hover:bg-white/5';

      casualTabs?.classList.remove('hidden');
      casualTabs?.classList.add('flex');
      devTabs?.classList.add('hidden');
      devTabs?.classList.remove('flex');

      // Tạm dừng game dev đang chạy và kích hoạt game giải trí
      this.pauseAllGames();
      this.switchCasualGame(this.activeGame);
    });

    btnDev.addEventListener('click', () => {
      if (this.activeCategory === 'dev') return;
      this.activeCategory = 'dev';
      this.sound.playClick(600);

      btnDev.className = 'px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-400 text-slate-950 font-black text-xs code-font shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all inline-flex items-center gap-2';
      btnCasual.className = 'px-5 py-2.5 rounded-xl text-slate-400 hover:text-white font-bold text-xs code-font transition-all inline-flex items-center gap-2 hover:bg-white/5';

      casualTabs?.classList.add('hidden');
      casualTabs?.classList.remove('flex');
      devTabs?.classList.remove('hidden');
      devTabs?.classList.add('flex');

      this.pauseAllGames();
      this.switchDevGame(this.activeDevGame);
    });
  }

  bindCasualTabSwitch() {
    const casualKeys = ['snake', 'defender', 'breaker', 'runner', 'flappy', '2048', 'pong', 'whack', 'tetris', 'mines'];

    casualKeys.forEach(key => {
      const btn = document.getElementById(`tab-btn-${key}`);
      btn?.addEventListener('click', () => {
        this.switchCasualGame(key);
      });
    });
  }

  switchCasualGame(key) {
    this.pauseAllGames();
    this.activeGame = key;
    this.sound.playClick(540);

    const casualKeys = ['snake', 'defender', 'breaker', 'runner', 'flappy', '2048', 'pong', 'whack', 'tetris', 'mines'];

    // Ẩn tất cả view
    casualKeys.forEach(k => {
      const btn = document.getElementById(`tab-btn-${k}`);
      const view = document.getElementById(`game-${k}-view`);
      if (btn) {
        btn.className = 'px-3.5 py-2 rounded-xl bg-slate-950/80 border border-white/10 text-slate-300 hover:text-white hover:border-cyan-500/30 hover:bg-slate-900 font-bold transition-all inline-flex items-center gap-2 hover:scale-105';
      }
      if (view) view.classList.add('hidden');
    });

    // Ẩn view của các dev game
    ['quiz', 'typer', 'hunter', 'sql', 'git', 'matrix'].forEach(k => {
      document.getElementById(`game-${k}-view`)?.classList.add('hidden');
    });

    // Bật view được chọn với màu neon riêng biệt
    const activeBtn = document.getElementById(`tab-btn-${key}`);
    const activeView = document.getElementById(`game-${key}-view`);

    const activeColors = {
      snake: 'bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.4)]',
      defender: 'bg-gradient-to-r from-sky-500 to-cyan-400 text-slate-950 shadow-[0_0_20px_rgba(14,165,233,0.4)]',
      breaker: 'bg-gradient-to-r from-teal-500 to-emerald-400 text-slate-950 shadow-[0_0_20px_rgba(20,184,166,0.4)]',
      runner: 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.4)]',
      flappy: 'bg-gradient-to-r from-cyan-400 to-sky-300 text-slate-950 shadow-[0_0_20px_rgba(34,211,238,0.4)]',
      '2048': 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]',
      pong: 'bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-[0_0_20px_rgba(236,72,153,0.4)]',
      whack: 'bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-[0_0_20px_rgba(244,63,94,0.4)]',
      tetris: 'bg-gradient-to-r from-amber-500 to-orange-400 text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.4)]',
      mines: 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 shadow-[0_0_20px_rgba(5,150,105,0.4)]'
    };

    if (activeBtn) {
      const col = activeColors[key] || 'bg-cyan-500 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.4)]';
      activeBtn.className = `px-3.5 py-2 rounded-xl ${col} font-black transition-all inline-flex items-center gap-2 scale-105`;
    }
    if (activeView) {
      activeView.classList.remove('hidden');
    }

    // Kích hoạt lại hoặc resize game được chọn
    setTimeout(() => {
      if (key === 'snake' && this.snake) {
        if (!this.snake.isRunning) this.snake.start(); else this.snake.resize();
      } else if (key === 'defender' && this.defender) {
        if (!this.defender.isPlaying) this.defender.start(); else this.defender.resize();
      } else if (key === 'breaker' && this.breaker) {
        if (!this.breaker.isPlaying) this.breaker.start(); else this.breaker.resize();
      } else if (key === 'runner' && this.runner) {
        if (!this.runner.isPlaying) this.runner.start(); else this.runner.resize();
      } else if (key === 'flappy' && this.flappy) {
        if (!this.flappy.isPlaying) this.flappy.start(); else this.flappy.resize();
      } else if (key === '2048' && this.cyber2048) {
        this.cyber2048.resume();
      } else if (key === 'pong' && this.pong) {
        if (!this.pong.isPlaying) this.pong.start(); else this.pong.resize();
      } else if (key === 'whack' && this.whack) {
        this.whack.resume();
      } else if (key === 'tetris' && this.tetris) {
        if (!this.tetris.isPlaying) this.tetris.start(); else this.tetris.resize();
      } else if (key === 'mines' && this.mines) {
        this.mines.resume();
      }
      initIcons();
    }, 60);
  }

  bindDevTabSwitch() {
    const devKeys = ['quiz', 'typer', 'hunter', 'sql', 'git', 'matrix'];

    devKeys.forEach(key => {
      const btn = document.getElementById(`tab-btn-${key}`);
      btn?.addEventListener('click', () => {
        this.switchDevGame(key);
      });
    });
  }

  switchDevGame(key) {
    this.pauseAllGames();
    this.activeDevGame = key;
    this.sound.playClick(540);

    const devKeys = ['quiz', 'typer', 'hunter', 'sql', 'git', 'matrix'];

    // Ẩn tất cả view casual
    ['snake', 'defender', 'breaker', 'runner', 'flappy', '2048', 'pong', 'whack', 'tetris', 'mines'].forEach(k => {
      document.getElementById(`game-${k}-view`)?.classList.add('hidden');
    });

    devKeys.forEach(k => {
      const btn = document.getElementById(`tab-btn-${k}`);
      const view = document.getElementById(`game-${k}-view`);
      if (btn) {
        btn.className = 'px-4 py-2 rounded-xl bg-slate-950/80 border border-white/10 text-slate-300 hover:text-white hover:border-amber-500/30 hover:bg-slate-900 font-bold transition-all inline-flex items-center gap-2 hover:scale-105';
      }
      if (view) view.classList.add('hidden');
    });

    const activeBtn = document.getElementById(`tab-btn-${key}`);
    const activeView = document.getElementById(`game-${key}-view`);

    const devColors = {
      quiz: 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.4)]',
      typer: 'bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.4)]',
      hunter: 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-[0_0_20px_rgba(244,63,94,0.4)]',
      sql: 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.4)]',
      git: 'bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 shadow-[0_0_20px_rgba(249,115,22,0.4)]',
      matrix: 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]'
    };

    if (activeBtn) {
      const col = devColors[key] || 'bg-amber-500 text-slate-950';
      activeBtn.className = `px-4 py-2 rounded-xl ${col} font-black transition-all inline-flex items-center gap-2 scale-105`;
    }
    if (activeView) {
      activeView.classList.remove('hidden');
    }

    if (key === 'typer') {
      const input = document.getElementById('typerInput');
      setTimeout(() => input?.focus(), 100);
    }

    setTimeout(() => initIcons(), 50);
  }

  pauseAllGames() {
    this.snake?.pause();
    this.defender?.pause();
    this.breaker?.togglePause && this.breaker.isPaused === false && this.breaker.togglePause();
    this.runner?.stop();
    this.flappy?.pause();
    this.cyber2048?.pause();
    this.pong?.pause();
    this.whack?.pause();
    this.tetris?.pause();
    this.mines?.pause();

    this.speedTyper?.pause();
    this.bugHunter?.pause();
    this.sqlForge?.pause();
    this.gitMaster?.pause();
  }

  bindGlobalControls() {
    window.addEventListener('keydown', (e) => {
      const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
      if (activeTag === 'input' || activeTag === 'textarea') return;

      if (e.key === 'p' || e.key === 'P') {
        if (this.activeCategory === 'casual') {
          if (this.activeGame === 'snake') this.snake?.togglePause();
          else if (this.activeGame === 'defender') this.defender?.togglePause();
          else if (this.activeGame === 'breaker') this.breaker?.togglePause();
          else if (this.activeGame === 'flappy') this.flappy?.togglePause();
          else if (this.activeGame === '2048') this.cyber2048?.togglePause();
          else if (this.activeGame === 'pong') this.pong?.togglePause();
          else if (this.activeGame === 'whack') this.whack?.togglePause();
          else if (this.activeGame === 'tetris') this.tetris?.togglePause();
          else if (this.activeGame === 'mines') this.mines?.togglePause();
        } else {
          if (this.activeDevGame === 'quiz') this.devQuiz?.togglePause();
          else if (this.activeDevGame === 'typer') this.speedTyper?.isPaused ? this.speedTyper.resume() : this.speedTyper?.pause();
          else if (this.activeDevGame === 'hunter') this.bugHunter?.isPaused ? this.bugHunter.resume() : this.bugHunter?.pause();
          else if (this.activeDevGame === 'sql') this.sqlForge?.isPaused ? this.sqlForge.resume() : this.sqlForge?.pause();
          else if (this.activeDevGame === 'git') this.gitMaster?.isPaused ? this.gitMaster.resume() : this.gitMaster?.pause();
          else if (this.activeDevGame === 'matrix') this.memoryMatrix?.togglePause();
        }
      }
    });
  }

  bindAudioControls() {
    // Top Bar BGM Toggle
    const bgmBtn = document.getElementById('btn-toggle-bgm');
    const bgmLabel = document.getElementById('bgm-label');
    const bgmIcon = document.getElementById('bgm-icon');

    if (bgmBtn) {
      bgmBtn.addEventListener('click', () => {
        const isPlaying = this.sound.toggleBGM();
        if (bgmLabel) {
          bgmLabel.innerText = isPlaying ? 'BGM: Bật' : 'BGM: Tắt';
        }
        if (bgmIcon) {
          bgmIcon.innerHTML = isPlaying
            ? getIconSvg('music', 'w-3.5 h-3.5 text-emerald-400')
            : getIconSvg('music-2', 'w-3.5 h-3.5 text-slate-400');
        }
      });
    }

    // SFX Sound Effects Toggle
    const sfxBtn = document.getElementById('btn-toggle-sfx');
    const sfxIcon = document.getElementById('sfx-icon');

    if (sfxBtn) {
      sfxBtn.addEventListener('click', () => {
        const isMuted = this.sound.toggleMute();
        if (sfxIcon) {
          sfxIcon.innerHTML = isMuted
            ? getIconSvg('volume-x', 'w-3.5 h-3.5 text-rose-400')
            : getIconSvg('volume-2', 'w-3.5 h-3.5 text-cyan-400');
        }
      });
    }

    // Legacy mute button support
    const muteBtn = document.getElementById('btn-mute');
    if (muteBtn) {
      muteBtn.addEventListener('click', () => {
        const muted = this.sound.toggleMute();
        muteBtn.innerHTML = muted
          ? `<span class="flex items-center gap-1">${getIconSvg('volume-x', 'w-4 h-4')} <span>BẬT ÂM</span></span>`
          : `<span class="flex items-center gap-1">${getIconSvg('volume-2', 'w-4 h-4')} <span>TẮT ÂM</span></span>`;
      });
    }

    // Mobile navigation toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenuBtn && mobileMenu) {
      mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
      });
      mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          mobileMenu.classList.add('hidden');
        });
      });
    }
  }

  bindBackToTop() {
    const backToTopBtn = document.getElementById('btn-back-to-top');
    if (backToTopBtn) {
      window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
          backToTopBtn.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-4');
          backToTopBtn.classList.add('opacity-100', 'translate-y-0');
        } else {
          backToTopBtn.classList.add('opacity-0', 'pointer-events-none', 'translate-y-4');
          backToTopBtn.classList.remove('opacity-100', 'translate-y-0');
        }
      });

      backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        if (this.sound && this.sound.playClick) this.sound.playClick(600);
      });
    }
  }

  // ==========================================
  // HỆ THỐNG HƯỚNG DẪN CHI TIẾT 16 TRÒ CHƠI
  // ==========================================
  initGameGuides() {
    const allGameKeys = [
      'snake', 'defender', 'breaker', 'runner', 'flappy',
      '2048', 'pong', 'whack', 'tetris', 'mines',
      'quiz', 'typer', 'hunter', 'sql', 'git', 'matrix'
    ];

    // 1. Chèn Inline Guide Card vào từng game view
    allGameKeys.forEach(key => {
      const container = document.getElementById(`guide-container-${key}`);
      if (container) {
        container.innerHTML = getInlineGuideCardHtml(key);
      }
    });

    // 2. Lắng nghe sự kiện click mở Modal Hướng Dẫn Hologram
    document.addEventListener('click', (e) => {
      const guideBtn = e.target.closest('.btn-open-guide');
      if (guideBtn) {
        const gameKey = guideBtn.getAttribute('data-game');
        if (gameKey) {
          showGameGuideModal(gameKey, this.sound);
        }
      }

      // 3. Lắng nghe sự kiện toggle đóng/mở Inline Guide Card
      const toggleInline = e.target.closest('.toggle-inline-guide');
      if (toggleInline) {
        const targetId = toggleInline.getAttribute('data-guide-target');
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          const isHidden = targetEl.classList.toggle('hidden');
          const arrowEl = toggleInline.querySelector('.guide-toggle-icon');
          if (arrowEl) {
            arrowEl.innerHTML = isHidden ? getIconSvg('chevron-down', 'w-3.5 h-3.5') : getIconSvg('chevron-up', 'w-3.5 h-3.5');
          }
          if (this.sound && this.sound.playClick) this.sound.playClick(480);
        }
      }
    });
  }
}

// Start application
window.addEventListener('DOMContentLoaded', () => {
  new App();
});
