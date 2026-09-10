/**
 * FlappyDrone.js - Cyber Drone Laser Infiltration
 * Điều khiển drone lượng tử bay luồn qua các trụ laser bảo mật đa tầng,
 * hiệu ứng khói hạt phản lực neon, rung màn hình và âm thanh sống động.
 */
export class FlappyDrone {
  constructor(canvas, soundManager, onScoreUpdate, onGameOver) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.sound = soundManager;
    this.onScoreUpdate = onScoreUpdate;
    this.onGameOver = onGameOver;

    this.isPlaying = false;
    this.isPaused = false;
    this.score = 0;
    this.highScore = parseInt(localStorage.getItem('flappy_drone_high') || '0', 10);

    this.drone = {
      x: 80,
      y: 180,
      radius: 14,
      velocity: 0,
      gravity: 0.38,
      jump: -6.5,
      tilt: 0
    };

    this.difficulty = 'normal';
    this.baseGap = 135;
    this.baseSpeed = 2.8;
    this.scoreMultiplier = 1.5;

    this.pipes = [];
    this.particles = [];
    this.pipeTimer = 0;
    this.pipeInterval = 98;
    this.speed = 2.8;
    this.shake = 0;
    this.animationId = null;

    this.initEvents();
    this.resize();
  }

  resize() {
    const rect = this.canvas.parentElement ? this.canvas.parentElement.getBoundingClientRect() : null;
    this.width = this.canvas.width = (rect && rect.width) ? rect.width : 700;
    this.height = this.canvas.height = (rect && rect.height) ? rect.height : 450;
    if (!this.isPlaying) {
      this.drawIdle();
    }
  }

  initEvents() {
    const handleFlap = (e) => {
      if (!this.isPlaying) return;
      if (this.isPaused) return;
      this.flap();
      if (e && e.type === 'keydown' && e.code === 'Space') {
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space' || e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        handleFlap(e);
      }
    });

    this.canvas.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      handleFlap(e);
    });
  }

  flap() {
    this.drone.velocity = this.drone.jump;
    this.drone.tilt = -0.45;
    if (this.sound && this.sound.playJump) {
      this.sound.playJump();
    }
    // Hạt phản lực neon
    for (let i = 0; i < 6; i++) {
      this.particles.push({
        x: this.drone.x - 12,
        y: this.drone.y + (Math.random() * 8 - 4),
        vx: -(Math.random() * 3 + 2),
        vy: (Math.random() * 2 - 1),
        size: Math.random() * 3 + 2,
        color: Math.random() > 0.4 ? '#06b6d4' : '#a855f7',
        life: 1.0,
        decay: 0.05
      });
    }
  }

  setDifficulty(level) {
    this.difficulty = level || 'normal';
    if (this.difficulty === 'easy') {
      this.baseGap = 165;
      this.baseSpeed = 2.2;
      this.pipeInterval = 115;
      this.scoreMultiplier = 1;
    } else if (this.difficulty === 'hard') {
      this.baseGap = 100;
      this.baseSpeed = 3.8;
      this.pipeInterval = 80;
      this.scoreMultiplier = 2.5;
    } else { // normal
      this.baseGap = 135;
      this.baseSpeed = 2.8;
      this.pipeInterval = 98;
      this.scoreMultiplier = 1.5;
    }
    this.speed = this.baseSpeed;
  }

  start() {
    this.resize();
    this.isPlaying = true;
    this.isPaused = false;
    this.score = 0;
    this.drone.y = this.height / 2;
    this.drone.velocity = 0;
    this.drone.tilt = 0;
    this.pipes = [];
    this.particles = [];
    this.pipeTimer = 0;
    this.setDifficulty(this.difficulty);
    this.shake = 0;

    if (this.onScoreUpdate) {
      this.onScoreUpdate(this.score, this.highScore);
    }

    if (this.animationId) cancelAnimationFrame(this.animationId);
    this.loop();
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
    this.loop();
    return true;
  }

  togglePause() {
    if (this.isPaused) {
      return this.resume();
    } else {
      return this.pause();
    }
  }

  reset() {
    this.stop();
    this.start();
  }

  spawnPipe() {
    const baseG = this.baseGap || 135;
    const gap = Math.max(90, baseG - Math.min(25, this.score * 1.2));
    const minHeight = 45;
    const maxHeight = this.height - gap - minHeight;
    const topHeight = Math.floor(Math.random() * (maxHeight - minHeight)) + minHeight;

    this.pipes.push({
      x: this.width + 20,
      width: 48,
      top: topHeight,
      bottom: this.height - (topHeight + gap),
      gap: gap,
      passed: false,
      color: this.score % 10 >= 5 ? '#f43f5e' : '#06b6d4',
      phase: Math.random() * Math.PI * 2
    });
  }

  loop() {
    if (!this.isPlaying || this.isPaused) return;

    this.update();
    this.draw();

    this.animationId = requestAnimationFrame(() => this.loop());
  }

  update() {
    // Trọng lực & vận tốc drone
    this.drone.velocity += this.drone.gravity;
    this.drone.y += this.drone.velocity;
    this.drone.tilt = Math.min(0.7, Math.max(-0.5, this.drone.tilt + 0.035));

    // Đốm hạt phản lực tự nhiên
    if (Math.random() < 0.6) {
      this.particles.push({
        x: this.drone.x - 12,
        y: this.drone.y,
        vx: -(Math.random() * 2 + 1),
        vy: (Math.random() * 1.5 - 0.75),
        size: Math.random() * 2.5 + 1.5,
        color: '#38bdf8',
        life: 0.8,
        decay: 0.06
      });
    }

    // Sinh cột laser
    this.pipeTimer++;
    if (this.pipeTimer >= this.pipeInterval) {
      this.pipeTimer = 0;
      this.spawnPipe();
      if (this.score > 8 && this.speed < 4.2) {
        this.speed += 0.05;
      }
    }

    // Di chuyển và kiểm tra va chạm cột laser
    for (let i = this.pipes.length - 1; i >= 0; i--) {
      const p = this.pipes[i];
      p.x -= this.speed;

      // Tính điểm khi vượt qua
      if (!p.passed && p.x + p.width < this.drone.x) {
        p.passed = true;
        this.score++;
        if (this.score > this.highScore) {
          this.highScore = this.score;
          localStorage.setItem('flappy_drone_high', this.highScore.toString());
        }
        if (this.sound && this.sound.playScore) this.sound.playScore();
        if (this.onScoreUpdate) this.onScoreUpdate(this.score, this.highScore);
      }

      // Kiểm tra va chạm hộp (AABB) với cột trên và dưới
      const dX = this.drone.x;
      const dY = this.drone.y;
      const r = this.drone.radius - 2;

      // Cột trên
      const hitTop = (dX + r > p.x && dX - r < p.x + p.width && dY - r < p.top);
      // Cột dưới
      const hitBottom = (dX + r > p.x && dX - r < p.x + p.width && dY + r > this.height - p.bottom);

      if (hitTop || hitBottom) {
        this.triggerGameOver();
        return;
      }

      // Xóa cột đã trôi ra ngoài màn hình
      if (p.x + p.width < -30) {
        this.pipes.splice(i, 1);
      }
    }

    // Rơi đáy hoặc chạm trần
    if (this.drone.y + this.drone.radius >= this.height - 10 || this.drone.y - this.drone.radius <= 10) {
      this.triggerGameOver();
      return;
    }

    // Cập nhật hạt
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const pt = this.particles[i];
      pt.x += pt.vx;
      pt.y += pt.vy;
      pt.life -= pt.decay;
      if (pt.life <= 0) {
        this.particles.splice(i, 1);
      }
    }

    if (this.shake > 0) this.shake -= 0.5;
  }

  triggerGameOver() {
    this.isPlaying = false;
    this.shake = 12;
    if (this.sound) {
      if (this.sound.playExplosion) this.sound.playExplosion();
      if (this.sound.playFail) this.sound.playFail();
    }

    // Vụ nổ mảnh vỡ drone
    for (let i = 0; i < 35; i++) {
      const ang = Math.random() * Math.PI * 2;
      const spd = Math.random() * 6 + 2;
      this.particles.push({
        x: this.drone.x,
        y: this.drone.y,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd,
        size: Math.random() * 4 + 2,
        color: ['#06b6d4', '#ec4899', '#f59e0b', '#ffffff'][Math.floor(Math.random() * 4)],
        life: 1.0,
        decay: 0.03
      });
    }

    this.draw();
    if (this.onGameOver) {
      this.onGameOver(this.score, this.highScore);
    }
  }

  draw() {
    const ctx = this.ctx;
    ctx.save();

    // Rung màn hình khi va chạm
    if (this.shake > 0) {
      const sx = (Math.random() - 0.5) * this.shake * 2;
      const sy = (Math.random() - 0.5) * this.shake * 2;
      ctx.translate(sx, sy);
    }

    // Background gradient cyber grid
    const bgGrad = ctx.createLinearGradient(0, 0, 0, this.height);
    bgGrad.addColorStop(0, '#020617');
    bgGrad.addColorStop(0.5, '#050b1d');
    bgGrad.addColorStop(1, '#09152e');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, this.width, this.height);

    // Lưới neon nền
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.07)';
    ctx.lineWidth = 1;
    for (let x = 0; x < this.width; x += 36) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, this.height);
      ctx.stroke();
    }
    for (let y = 0; y < this.height; y += 36) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(this.width, y);
      ctx.stroke();
    }

    // Vẽ các cột laser (Pipes)
    this.pipes.forEach(p => {
      // Cột trên
      const topGrad = ctx.createLinearGradient(p.x, 0, p.x + p.width, 0);
      topGrad.addColorStop(0, '#0f172a');
      topGrad.addColorStop(0.5, p.color);
      topGrad.addColorStop(1, '#0f172a');
      ctx.fillStyle = topGrad;
      ctx.fillRect(p.x, 0, p.width, p.top);

      // Đỉnh cột trên
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(p.x - 3, p.top - 8, p.width + 6, 8);
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 12;
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x - 2, p.top - 7, p.width + 4, 6);
      ctx.shadowBlur = 0;

      // Cột dưới
      const botY = this.height - p.bottom;
      ctx.fillStyle = topGrad;
      ctx.fillRect(p.x, botY, p.width, p.bottom);

      // Đỉnh cột dưới
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(p.x - 3, botY, p.width + 6, 8);
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 12;
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x - 2, botY + 1, p.width + 4, 6);
      ctx.shadowBlur = 0;

      // Tia laser quét giữa khe
      ctx.strokeStyle = p.color;
      ctx.globalAlpha = 0.25 + 0.15 * Math.sin(Date.now() * 0.008 + p.phase);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(p.x + p.width / 2, p.top);
      ctx.lineTo(p.x + p.width / 2, botY);
      ctx.stroke();
      ctx.globalAlpha = 1.0;
    });

    // Vẽ các hạt particles
    this.particles.forEach(pt => {
      ctx.save();
      ctx.globalAlpha = Math.max(0, pt.life);
      ctx.fillStyle = pt.color;
      ctx.shadowColor = pt.color;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // Vẽ Drone
    if (this.isPlaying || this.shake > 0) {
      ctx.save();
      ctx.translate(this.drone.x, this.drone.y);
      ctx.rotate(this.drone.tilt);

      // Thân phi cơ drone
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 14;

      // Vỏ phi thuyền
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.ellipse(0, 0, 16, 11, 0, 0, Math.PI * 2);
      ctx.fill();

      // Viền neon
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.2;
      ctx.stroke();

      // Mũi phi cơ / buồng lái lượng tử
      ctx.fillStyle = '#06b6d4';
      ctx.beginPath();
      ctx.ellipse(6, 0, 7, 5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Cánh trên dưới
      ctx.fillStyle = '#a855f7';
      ctx.fillRect(-8, -14, 4, 5);
      ctx.fillRect(-8, 9, 4, 5);

      // Đèn cảnh báo
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(10, 0, 2.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    // Vẽ sàn & trần cảnh báo nguy hiểm
    ctx.fillStyle = 'rgba(239, 68, 68, 0.2)';
    ctx.fillRect(0, 0, this.width, 6);
    ctx.fillRect(0, this.height - 6, this.width, 6);

    // Điểm số HUD góc trên
    ctx.font = 'bold 22px ui-monospace, monospace';
    ctx.fillStyle = '#38bdf8';
    ctx.shadowColor = '#0284c7';
    ctx.shadowBlur = 10;
    ctx.fillText(`SCORE: ${this.score}`, 20, 36);

    ctx.font = '13px ui-monospace, monospace';
    ctx.fillStyle = '#94a3b8';
    ctx.shadowBlur = 0;
    ctx.fillText(`BEST: ${this.highScore}`, 20, 56);

    ctx.restore();
  }

  drawIdle() {
    const ctx = this.ctx;
    ctx.fillStyle = '#030712';
    ctx.fillRect(0, 0, this.width, this.height);

    ctx.font = 'bold 20px ui-monospace, monospace';
    ctx.fillStyle = '#06b6d4';
    ctx.textAlign = 'center';
    ctx.fillText('🛸 FLAPPY CYBER DRONE', this.width / 2, this.height / 2 - 25);

    ctx.font = '13px system-ui, sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('Nhấn Space, Click chuột hoặc chạm màn hình để bay', this.width / 2, this.height / 2 + 10);

    ctx.font = '11px ui-monospace, monospace';
    ctx.fillStyle = '#f59e0b';
    ctx.fillText(`KỶ LỤC HIỆN TẠI: ${this.highScore}`, this.width / 2, this.height / 2 + 40);
  }

  drawPaused() {
    const ctx = this.ctx;
    ctx.save();
    ctx.fillStyle = 'rgba(2, 6, 23, 0.75)';
    ctx.fillRect(0, 0, this.width, this.height);

    ctx.font = 'bold 22px ui-monospace, monospace';
    ctx.fillStyle = '#f59e0b';
    ctx.textAlign = 'center';
    ctx.fillText('⏸ ĐÃ TẠM DỪNG (PAUSED)', this.width / 2, this.height / 2);

    ctx.font = '13px system-ui, sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('Nhấn Resume hoặc phím P để tiếp tục', this.width / 2, this.height / 2 + 30);
    ctx.restore();
  }
}
