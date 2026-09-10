/**
 * TetrisMatrix.js - Cyberpunk Neon Tetris
 * Xếp gạch Tetromino neon rực rỡ với bóng chiếu chân (Ghost Piece), xoay linh hoạt,
 * thả rơi tức thì (Hard Drop), giữ khối (Hold Piece), xoá hàng nổ hạt và tăng tốc theo cấp.
 */
export class TetrisMatrix {
  constructor(canvas, soundManager, onScoreUpdate, onGameOver) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.sound = soundManager;
    this.onScoreUpdate = onScoreUpdate;
    this.onGameOver = onGameOver;

    this.cols = 10;
    this.rows = 20;
    this.blockSize = 22;

    this.grid = [];
    this.currentPiece = null;
    this.nextPiece = null;
    this.holdPiece = null;
    this.canHold = true;

    this.score = 0;
    this.lines = 0;
    this.level = 1;
    this.highScore = parseInt(localStorage.getItem('tetris_matrix_high') || '0', 10);
    this.difficulty = 'normal';
    this.startLevel = 3;
    this.baseDropInterval = 620;
    this.scoreMultiplier = 1.5;

    this.dropCounter = 0;
    this.dropInterval = 620; // ms
    this.lastTime = 0;
    this.isPlaying = false;
    this.isPaused = false;
    this.animationId = null;
    this.particles = [];
    this.shake = 0;

    // 7 Hình khối Tetromino chuẩn
    this.shapes = {
      I: { matrix: [[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]], color: '#06b6d4', shadow: '#22d3ee' },
      J: { matrix: [[1,0,0],[1,1,1],[0,0,0]], color: '#3b82f6', shadow: '#60a5fa' },
      L: { matrix: [[0,0,1],[1,1,1],[0,0,0]], color: '#f97316', shadow: '#fb923c' },
      O: { matrix: [[1,1],[1,1]], color: '#eab308', shadow: '#fde047' },
      S: { matrix: [[0,1,1],[1,1,0],[0,0,0]], color: '#10b981', shadow: '#34d399' },
      T: { matrix: [[0,1,0],[1,1,1],[0,0,0]], color: '#a855f7', shadow: '#c084fc' },
      Z: { matrix: [[1,1,0],[0,1,1],[0,0,0]], color: '#f43f5e', shadow: '#fb7185' }
    };
    this.shapeKeys = Object.keys(this.shapes);

    this.initEvents();
    this.resize();
  }

  resize() {
    const rect = this.canvas.parentElement ? this.canvas.parentElement.getBoundingClientRect() : null;
    const parentW = (rect && rect.width) ? rect.width : 500;
    // Cố định tỉ lệ vừa vặn
    this.canvas.width = Math.min(480, parentW);
    this.canvas.height = 460;

    // Tính toán kích thước ô dựa theo chiều cao
    this.blockSize = Math.floor((this.canvas.height - 20) / this.rows);
    this.boardWidth = this.cols * this.blockSize;
    this.boardHeight = this.rows * this.blockSize;
    this.boardX = 14;
    this.boardY = 10;

    if (!this.isPlaying) this.drawIdle();
  }

  initEvents() {
    window.addEventListener('keydown', (e) => {
      if (!this.isPlaying || this.isPaused) return;

      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        this.move(-1);
        e.preventDefault();
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        this.move(1);
        e.preventDefault();
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        this.drop();
        e.preventDefault();
      } else if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        this.rotate();
        e.preventDefault();
      } else if (e.code === 'Space') {
        this.hardDrop();
        e.preventDefault();
      } else if (e.key === 'c' || e.key === 'C' || e.key === 'Shift') {
        this.hold();
        e.preventDefault();
      }
    });
  }

  createPiece(type) {
    const key = type || this.shapeKeys[Math.floor(Math.random() * this.shapeKeys.length)];
    const shape = this.shapes[key];
    return {
      type: key,
      matrix: shape.matrix.map(row => [...row]),
      color: shape.color,
      shadow: shape.shadow,
      x: Math.floor(this.cols / 2) - Math.floor(shape.matrix[0].length / 2),
      y: 0
    };
  }

  setDifficulty(level) {
    this.difficulty = level || 'normal';
    if (this.difficulty === 'easy') {
      this.startLevel = 1;
      this.baseDropInterval = 900;
      this.scoreMultiplier = 1.0;
    } else if (this.difficulty === 'hard') {
      this.startLevel = 6;
      this.baseDropInterval = 340;
      this.scoreMultiplier = 2.5;
    } else { // normal
      this.startLevel = 3;
      this.baseDropInterval = 620;
      this.scoreMultiplier = 1.5;
    }
  }

  start() {
    this.resize();
    this.grid = Array(this.rows).fill(null).map(() => Array(this.cols).fill(0));
    this.score = 0;
    this.lines = 0;
    this.setDifficulty(this.difficulty);
    this.level = this.startLevel || 3;
    this.dropInterval = this.baseDropInterval || 620;
    this.dropCounter = 0;
    this.lastTime = performance.now();
    this.isPlaying = true;
    this.isPaused = false;
    this.particles = [];
    this.shake = 0;

    this.nextPiece = this.createPiece();
    this.holdPiece = null;
    this.canHold = true;
    this.spawnPiece();

    if (this.onScoreUpdate) {
      this.onScoreUpdate(this.score, this.highScore, this.lines, this.level);
    }

    if (this.animationId) cancelAnimationFrame(this.animationId);
    this.loop(performance.now());
  }

  stop() {
    this.isPlaying = false;
    this.isPaused = false;
    if (this.animationId) cancelAnimationFrame(this.animationId);
  }

  pause() {
    if (!this.isPlaying || this.isPaused) return false;
    this.isPaused = true;
    if (this.animationId) cancelAnimationFrame(this.animationId);
    this.drawPaused();
    return true;
  }

  resume() {
    if (!this.isPlaying || !this.isPaused) return false;
    this.isPaused = false;
    this.lastTime = performance.now();
    this.loop(performance.now());
    return true;
  }

  togglePause() {
    if (this.isPaused) return this.resume();
    else return this.pause();
  }

  reset() {
    this.stop();
    this.start();
  }

  spawnPiece() {
    this.currentPiece = this.nextPiece;
    this.nextPiece = this.createPiece();
    this.canHold = true;

    // Kiểm tra tràn khối (Game Over)
    if (this.collide(this.currentPiece)) {
      this.triggerGameOver();
    }
  }

  collide(piece) {
    const { matrix, x, y } = piece;
    for (let r = 0; r < matrix.length; r++) {
      for (let c = 0; c < matrix[r].length; c++) {
        if (matrix[r][c] !== 0) {
          const newX = x + c;
          const newY = y + r;
          if (newX < 0 || newX >= this.cols || newY >= this.rows) return true;
          if (newY >= 0 && this.grid[newY][newX] !== 0) return true;
        }
      }
    }
    return false;
  }

  move(dir) {
    this.currentPiece.x += dir;
    if (this.collide(this.currentPiece)) {
      this.currentPiece.x -= dir;
      return false;
    }
    if (this.sound && this.sound.playClick) this.sound.playClick(460);
    return true;
  }

  rotate() {
    const matrix = this.currentPiece.matrix;
    const n = matrix.length;
    const rotated = matrix[0].map((_, colIdx) => matrix.map(row => row[colIdx]).reverse());

    const originalMatrix = this.currentPiece.matrix;
    this.currentPiece.matrix = rotated;

    // Wall kick cơ bản
    let offset = 0;
    if (this.collide(this.currentPiece)) {
      offset = 1;
      this.currentPiece.x += offset;
      if (this.collide(this.currentPiece)) {
        this.currentPiece.x -= offset * 2;
        if (this.collide(this.currentPiece)) {
          this.currentPiece.x += offset;
          this.currentPiece.matrix = originalMatrix;
          return;
        }
      }
    }

    if (this.sound && this.sound.playClick) this.sound.playClick(580);
  }

  drop() {
    this.currentPiece.y++;
    if (this.collide(this.currentPiece)) {
      this.currentPiece.y--;
      this.lockPiece();
      return false;
    }
    this.score += 1;
    this.dropCounter = 0;
    return true;
  }

  hardDrop() {
    let droppedLines = 0;
    while (!this.collide(this.currentPiece)) {
      this.currentPiece.y++;
      droppedLines++;
    }
    this.currentPiece.y--;
    droppedLines--;

    this.score += droppedLines * 2;
    this.shake = 6;
    if (this.sound && this.sound.playBounce) this.sound.playBounce(780);
    this.lockPiece();
  }

  hold() {
    if (!this.canHold) return;
    this.canHold = false;

    const currentType = this.currentPiece.type;
    if (this.holdPiece) {
      const tempType = this.holdPiece.type;
      this.holdPiece = { type: currentType, color: this.shapes[currentType].color, matrix: this.shapes[currentType].matrix };
      this.currentPiece = this.createPiece(tempType);
    } else {
      this.holdPiece = { type: currentType, color: this.shapes[currentType].color, matrix: this.shapes[currentType].matrix };
      this.spawnPiece();
    }

    if (this.sound && this.sound.playClick) this.sound.playClick(620);
  }

  lockPiece() {
    const { matrix, x, y, color } = this.currentPiece;
    matrix.forEach((row, r) => {
      row.forEach((val, c) => {
        if (val !== 0 && y + r >= 0) {
          this.grid[y + r][x + c] = color;
        }
      });
    });

    this.clearLines();
    this.spawnPiece();
  }

  clearLines() {
    let cleared = 0;
    for (let r = this.rows - 1; r >= 0; r--) {
      if (this.grid[r].every(cell => cell !== 0)) {
        cleared++;
        // Tạo hạt nổ tại hàng bị xoá
        for (let c = 0; c < this.cols; c++) {
          for (let p = 0; p < 3; p++) {
            this.particles.push({
              x: this.boardX + c * this.blockSize + this.blockSize / 2,
              y: this.boardY + r * this.blockSize + this.blockSize / 2,
              vx: (Math.random() - 0.5) * 6,
              vy: (Math.random() - 0.5) * 6,
              color: this.grid[r][c],
              size: Math.random() * 3 + 1.5,
              life: 1.0
            });
          }
        }
        this.grid.splice(r, 1);
        this.grid.unshift(Array(this.cols).fill(0));
        r++; // Kiểm tra lại dòng vừa tụt xuống
      }
    }

    if (cleared > 0) {
      const lineScores = [0, 100, 300, 500, 800];
      const basePts = (lineScores[cleared] || 100) * this.level;
      this.score += Math.round(basePts * (this.scoreMultiplier || 1.5));
      this.lines += cleared;
      this.level = (this.startLevel || 3) + Math.floor(this.lines / 10);
      this.dropInterval = Math.max(90, (this.baseDropInterval || 620) - Math.floor(this.lines / 10) * 55);

      if (cleared === 4) {
        this.shake = 10;
        if (this.sound && this.sound.playSuccess) this.sound.playSuccess();
      } else {
        if (this.sound && this.sound.playPop) this.sound.playPop(520 + cleared * 100);
      }

      if (this.score > this.highScore) {
        this.highScore = this.score;
        localStorage.setItem('tetris_matrix_high', this.highScore.toString());
      }

      if (this.onScoreUpdate) {
        this.onScoreUpdate(this.score, this.highScore, this.lines, this.level);
      }
    }
  }

  getGhostPosition() {
    if (!this.currentPiece) return null;
    const ghost = {
      matrix: this.currentPiece.matrix,
      x: this.currentPiece.x,
      y: this.currentPiece.y
    };
    while (!this.collide(ghost)) {
      ghost.y++;
    }
    ghost.y--;
    return ghost;
  }

  loop(currentTime) {
    if (!this.isPlaying || this.isPaused) return;

    const delta = currentTime - this.lastTime;
    this.lastTime = currentTime;
    this.dropCounter += delta;

    if (this.dropCounter > this.dropInterval) {
      this.drop();
      this.dropCounter = 0;
    }

    // Cập nhật hạt
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.04;
      if (p.life <= 0) this.particles.splice(i, 1);
    }

    if (this.shake > 0) this.shake -= 0.4;

    this.draw();
    this.animationId = requestAnimationFrame((t) => this.loop(t));
  }

  triggerGameOver() {
    this.isPlaying = false;
    if (this.sound && this.sound.playFail) this.sound.playFail();
    this.drawGameOver();
    if (this.onGameOver) this.onGameOver(this.score, this.highScore);
  }

  draw() {
    const ctx = this.ctx;
    ctx.save();

    if (this.shake > 0) {
      ctx.translate((Math.random() - 0.5) * this.shake, (Math.random() - 0.5) * this.shake);
    }

    // Nền canvas
    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Khung bảng chơi (Board Frame)
    ctx.fillStyle = '#050b18';
    ctx.fillRect(this.boardX, this.boardY, this.boardWidth, this.boardHeight);

    // Lưới ô ma trận
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 1;
    for (let c = 0; c <= this.cols; c++) {
      ctx.beginPath();
      ctx.moveTo(this.boardX + c * this.blockSize, this.boardY);
      ctx.lineTo(this.boardX + c * this.blockSize, this.boardY + this.boardHeight);
      ctx.stroke();
    }
    for (let r = 0; r <= this.rows; r++) {
      ctx.beginPath();
      ctx.moveTo(this.boardX, this.boardY + r * this.blockSize);
      ctx.lineTo(this.boardX + this.boardWidth, this.boardY + r * this.blockSize);
      ctx.stroke();
    }

    // Viền phát sáng cho bảng chơi
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
    ctx.lineWidth = 2;
    ctx.strokeRect(this.boardX, this.boardY, this.boardWidth, this.boardHeight);

    // Vẽ các ô gạch đã hạ cánh (Grid blocks)
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const color = this.grid[r][c];
        if (color !== 0) {
          this.drawBlock(this.boardX + c * this.blockSize, this.boardY + r * this.blockSize, color);
        }
      }
    }

    // Vẽ bóng chiếu chân khối (Ghost Piece)
    const ghost = this.getGhostPosition();
    if (ghost && this.isPlaying) {
      ctx.save();
      ctx.globalAlpha = 0.22;
      ghost.matrix.forEach((row, r) => {
        row.forEach((val, c) => {
          if (val !== 0 && ghost.y + r >= 0) {
            this.drawBlock(
              this.boardX + (ghost.x + c) * this.blockSize,
              this.boardY + (ghost.y + r) * this.blockSize,
              this.currentPiece.color,
              true
            );
          }
        });
      });
      ctx.restore();
    }

    // Vẽ khối đang rơi (Current Piece)
    if (this.currentPiece && this.isPlaying) {
      this.currentPiece.matrix.forEach((row, r) => {
        row.forEach((val, c) => {
          if (val !== 0 && this.currentPiece.y + r >= 0) {
            this.drawBlock(
              this.boardX + (this.currentPiece.x + c) * this.blockSize,
              this.boardY + (this.currentPiece.y + r) * this.blockSize,
              this.currentPiece.color
            );
          }
        });
      });
    }

    // Vẽ các hạt nổ
    this.particles.forEach(p => {
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // Vẽ Sidebar HUD bên phải (Next piece, Hold piece, Scores)
    this.drawSidebar();

    ctx.restore();
  }

  drawBlock(x, y, color, isGhost = false) {
    const ctx = this.ctx;
    const s = this.blockSize;

    ctx.save();
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = isGhost ? 0 : 8;

    ctx.fillRect(x + 1, y + 1, s - 2, s - 2);

    // Điểm nhấn sáng góc trên
    if (!isGhost) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.fillRect(x + 2, y + 2, s - 4, 3);
      ctx.fillRect(x + 2, y + 2, 3, s - 4);
    }

    ctx.restore();
  }

  drawSidebar() {
    const ctx = this.ctx;
    const hudX = this.boardX + this.boardWidth + 18;

    ctx.font = 'bold 10px ui-monospace, monospace';
    ctx.fillStyle = '#38bdf8';
    ctx.textAlign = 'left';

    // Khối tiếp theo (Next piece)
    ctx.fillText('NEXT MATRIX', hudX, 26);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.strokeRect(hudX, 32, 90, 75);

    if (this.nextPiece) {
      const m = this.nextPiece.matrix;
      const offsetX = hudX + (90 - m[0].length * 16) / 2;
      const offsetY = 32 + (75 - m.length * 16) / 2;
      m.forEach((row, r) => {
        row.forEach((val, c) => {
          if (val !== 0) {
            ctx.fillStyle = this.nextPiece.color;
            ctx.fillRect(offsetX + c * 16, offsetY + r * 16, 14, 14);
          }
        });
      });
    }

    // Khối giữ (Hold piece)
    ctx.fillStyle = '#a855f7';
    ctx.fillText('HOLD [C/SHIFT]', hudX, 130);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.strokeRect(hudX, 136, 90, 75);

    if (this.holdPiece) {
      const m = this.holdPiece.matrix;
      const offsetX = hudX + (90 - m[0].length * 16) / 2;
      const offsetY = 136 + (75 - m.length * 16) / 2;
      m.forEach((row, r) => {
        row.forEach((val, c) => {
          if (val !== 0) {
            ctx.fillStyle = this.holdPiece.color;
            ctx.fillRect(offsetX + c * 16, offsetY + r * 16, 14, 14);
          }
        });
      });
    }

    // Chỉ số điểm & Level
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('SCORE', hudX, 235);
    ctx.font = 'black 16px ui-monospace, monospace';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText(this.score.toString(), hudX, 255);

    ctx.font = 'bold 10px ui-monospace, monospace';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('LINES / LEVEL', hudX, 280);
    ctx.font = 'black 14px ui-monospace, monospace';
    ctx.fillStyle = '#10b981';
    ctx.fillText(`${this.lines} / Lv.${this.level}`, hudX, 298);

    ctx.font = 'bold 10px ui-monospace, monospace';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('BEST SCORE', hudX, 325);
    ctx.font = 'black 14px ui-monospace, monospace';
    ctx.fillStyle = '#f59e0b';
    ctx.fillText(this.highScore.toString(), hudX, 343);
  }

  drawIdle() {
    const ctx = this.ctx;
    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.font = 'bold 20px ui-monospace, monospace';
    ctx.fillStyle = '#06b6d4';
    ctx.textAlign = 'center';
    ctx.fillText('🧩 TETRIS MATRIX NEON', this.canvas.width / 2, this.canvas.height / 2 - 20);

    ctx.font = '12px system-ui, sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('Dùng phím Mũi tên để di chuyển/xoay, Space thả nhanh', this.canvas.width / 2, this.canvas.height / 2 + 10);
  }

  drawPaused() {
    const ctx = this.ctx;
    ctx.save();
    ctx.fillStyle = 'rgba(2, 6, 23, 0.75)';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.font = 'bold 20px ui-monospace, monospace';
    ctx.fillStyle = '#f59e0b';
    ctx.textAlign = 'center';
    ctx.fillText('⏸ ĐÃ TẠM DỪNG (PAUSED)', this.canvas.width / 2, this.canvas.height / 2);
    ctx.restore();
  }

  drawGameOver() {
    const ctx = this.ctx;
    ctx.save();
    ctx.fillStyle = 'rgba(2, 6, 23, 0.85)';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.font = 'black 28px ui-monospace, monospace';
    ctx.fillStyle = '#f43f5e';
    ctx.shadowColor = '#e11d48';
    ctx.shadowBlur = 14;
    ctx.textAlign = 'center';
    ctx.fillText('TRÀN MA TRẬN!', this.canvas.width / 2, this.canvas.height / 2 - 25);

    ctx.shadowBlur = 0;
    ctx.font = '14px ui-monospace, monospace';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText(`ĐIỂM SỐ: ${this.score}`, this.canvas.width / 2, this.canvas.height / 2 + 10);

    ctx.font = '12px system-ui, sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('Nhấn nút Chơi Lại để thử ván mới', this.canvas.width / 2, this.canvas.height / 2 + 40);
    ctx.restore();
  }
}
