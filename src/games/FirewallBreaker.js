/**
 * FirewallBreaker - Cyber Arkanoid Brick Breaker 2.0
 * Phá vỡ các tầng tường lửa bảo mật bằng quả cầu lượng tử,
 * nhặt vật phẩm Multi-ball, Laser blasters và thanh hứng mở rộng.
 */
export class FirewallBreaker {
  constructor(canvas, soundManager, onScoreUpdate, onGameOver) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.sound = soundManager;
    this.onScoreUpdate = onScoreUpdate;
    this.onGameOver = onGameOver;

    this.isPlaying = false;
    this.isPaused = false;
    this.score = 0;
    this.highScore = parseInt(localStorage.getItem('firewall_breaker_high') || '0', 10);
    this.difficulty = 'normal';
    this.defaultPaddleW = 96;
    this.defaultLives = 3;
    this.ballSpeedMultiplier = 1.0;
    this.scoreMultiplier = 1.5;
    this.lives = 3;

    this.paddle = {
      x: 0,
      y: 0,
      w: 96,
      h: 14,
      color: '#06b6d4'
    };

    this.balls = [];
    this.bricks = [];
    this.particles = [];
    this.powerups = [];
    this.floatingTexts = [];
    this.keys = {};

    this.initEvents();
  }

  resize() {
    this.width = this.canvas.width = this.canvas.clientWidth || 700;
    this.height = this.canvas.height = this.canvas.clientHeight || 450;
    this.paddle.x = this.width / 2 - this.paddle.w / 2;
    this.paddle.y = this.height - 35;
  }

  initEvents() {
    // Di chuyển chuột với tỉ lệ chính xác
    this.canvas.addEventListener('mousemove', (e) => {
      if (!this.isPlaying || this.isPaused) return;
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.width / rect.width;
      const mouseX = (e.clientX - rect.left) * scaleX;
      this.paddle.x = Math.max(0, Math.min(this.width - this.paddle.w, mouseX - this.paddle.w / 2));
    });

    // Hỗ trợ cảm ứng trên thiết bị di động
    this.canvas.addEventListener('touchmove', (e) => {
      if (!this.isPlaying || this.isPaused) return;
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.width / rect.width;
      const touch = e.touches[0];
      if (touch) {
        const mouseX = (touch.clientX - rect.left) * scaleX;
        this.paddle.x = Math.max(0, Math.min(this.width - this.paddle.w, mouseX - this.paddle.w / 2));
      }
    }, { passive: true });

    // Hỗ trợ bàn phím điều khiển thanh hứng
    window.addEventListener('keydown', (e) => {
      this.keys[e.key] = true;
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.key] = false;
    });
  }

  setDifficulty(level) {
    this.difficulty = level || 'normal';
    if (this.difficulty === 'easy') {
      this.defaultPaddleW = 120;
      this.defaultLives = 5;
      this.ballSpeedMultiplier = 0.82;
      this.scoreMultiplier = 1.0;
    } else if (this.difficulty === 'hard') {
      this.defaultPaddleW = 72;
      this.defaultLives = 2;
      this.ballSpeedMultiplier = 1.35;
      this.scoreMultiplier = 2.5;
    } else { // normal
      this.defaultPaddleW = 96;
      this.defaultLives = 3;
      this.ballSpeedMultiplier = 1.0;
      this.scoreMultiplier = 1.5;
    }
    this.paddle.w = this.defaultPaddleW;
  }

  start() {
    this.resize();
    this.isPlaying = true;
    this.isPaused = false;
    this.score = 0;
    this.setDifficulty(this.difficulty);
    this.lives = this.defaultLives;
    this.paddle.w = this.defaultPaddleW;
    this.particles = [];
    this.powerups = [];
    this.floatingTexts = [];

    // Tạo bóng chính lượng tử với vận tốc theo độ khó
    const speedMult = this.ballSpeedMultiplier || 1.0;
    this.balls = [{
      x: this.width / 2,
      y: this.paddle.y - 15,
      vx: 4.5 * speedMult * (Math.random() > 0.5 ? 1 : -1),
      vy: -5.5 * speedMult,
      r: 6.5,
      trail: []
    }];

    this.buildBricks();

    // Thứ tự tham số chuẩn: (score, lives, ballsCount)
    if (this.onScoreUpdate) {
      this.onScoreUpdate(this.score, this.lives, this.balls.length);
    }
    this.loop();
  }

  pause() {
    if (!this.isPlaying || this.isPaused) return false;
    this.isPaused = true;
    return true;
  }

  resume() {
    if (!this.isPlaying || !this.isPaused) return false;
    this.isPaused = false;
    this.loop();
    return true;
  }

  togglePause() {
    if (!this.isPlaying) return false;
    this.isPaused = !this.isPaused;
    if (!this.isPaused) {
      this.loop();
    }
    return this.isPaused;
  }

  reset() {
    this.isPaused = false;
    this.start();
  }

  buildBricks() {
    this.bricks = [];
    const rows = 5;
    const cols = 9;
    const brickW = (this.width - 40) / cols;
    const brickH = 22;

    const rowColors = ['#f43f5e', '#ec4899', '#a855f7', '#06b6d4', '#10b981'];
    const rowNames = ['ROOT', 'KERNEL', 'GATEWAY', 'CRYPTO', 'PACKET'];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        this.bricks.push({
          x: 20 + c * brickW + 2,
          y: 45 + r * (brickH + 5),
          w: brickW - 4,
          h: brickH,
          color: rowColors[r],
          label: rowNames[r],
          hp: r === 0 ? 2 : 1,
          maxHp: r === 0 ? 2 : 1,
          pts: (rows - r) * 30
        });
      }
    }
  }

  stop() {
    this.isPlaying = false;
  }

  addFloatingText(text, x, y, color = '#38bdf8') {
    this.floatingTexts.push({
      text,
      x,
      y,
      vy: -1.2,
      life: 1.0,
      decay: 0.025,
      color
    });
  }

  update() {
    // Điều khiển bàn phím (A/D hoặc Mũi tên Trái/Phải)
    const paddleSpeed = 8.5;
    if (this.keys['ArrowLeft'] || this.keys['a'] || this.keys['A']) {
      this.paddle.x = Math.max(0, this.paddle.x - paddleSpeed);
    }
    if (this.keys['ArrowRight'] || this.keys['d'] || this.keys['D']) {
      this.paddle.x = Math.min(this.width - this.paddle.w, this.paddle.x + paddleSpeed);
    }

    // Cập nhật từng quả bóng
    for (let i = this.balls.length - 1; i >= 0; i--) {
      const b = this.balls[i];

      // Lưu vệt bóng (trail)
      if (!b.trail) b.trail = [];
      b.trail.push({ x: b.x, y: b.y });
      if (b.trail.length > 5) b.trail.shift();

      b.x += b.vx;
      b.y += b.vy;

      // Va chạm tường trái
      if (b.x < b.r) {
        b.x = b.r;
        b.vx = Math.abs(b.vx);
        this.sound.playClick(450);
      }
      // Va chạm tường phải
      if (b.x > this.width - b.r) {
        b.x = this.width - b.r;
        b.vx = -Math.abs(b.vx);
        this.sound.playClick(450);
      }

      // Va chạm trần
      if (b.y < b.r) {
        b.y = b.r;
        b.vy = Math.abs(b.vy);
        this.sound.playClick(450);
      }

      // Va chạm thanh hứng paddle
      if (
        b.y + b.r >= this.paddle.y &&
        b.y - b.r <= this.paddle.y + this.paddle.h &&
        b.x >= this.paddle.x - b.r &&
        b.x <= this.paddle.x + this.paddle.w + b.r
      ) {
        this.sound.playClick(600);
        b.vy = -Math.abs(b.vy);
        b.y = this.paddle.y - b.r - 1;

        // Tính góc nảy dựa trên vị trí chạm paddle
        const hitOffset = (b.x - (this.paddle.x + this.paddle.w / 2)) / (this.paddle.w / 2);
        b.vx = hitOffset * 6.5;

        // Tránh bóng bay ngang quá phẳng
        if (Math.abs(b.vy) < 2.5) {
          b.vy = -4;
        }

        // Hạt tia lửa khi chạm paddle
        for (let p = 0; p < 4; p++) {
          this.particles.push({
            x: b.x, y: this.paddle.y,
            vx: (Math.random() - 0.5) * 4,
            vy: -Math.random() * 3 - 1,
            life: 0.5, decay: 0.05, color: '#06b6d4'
          });
        }
      }

      // Va chạm với gạch tường lửa (AABB chính xác)
      for (let j = this.bricks.length - 1; j >= 0; j--) {
        const br = this.bricks[j];
        if (
          b.x + b.r > br.x &&
          b.x - b.r < br.x + br.w &&
          b.y + b.r > br.y &&
          b.y - b.r < br.y + br.h
        ) {
          // Xác định chiều va chạm
          const overlapLeft = (b.x + b.r) - br.x;
          const overlapRight = (br.x + br.w) - (b.x - b.r);
          const overlapTop = (b.y + b.r) - br.y;
          const overlapBottom = (br.y + br.h) - (b.y - b.r);
          const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);

          if (minOverlap === overlapLeft || minOverlap === overlapRight) {
            b.vx *= -1;
          } else {
            b.vy *= -1;
          }

          // Tránh bóng bay nằm ngang
          if (Math.abs(b.vy) < 2) {
            b.vy = b.vy < 0 ? -3.5 : 3.5;
          }

          this.sound.playSuccess();
          br.hp--;

          // Hạt văng neon
          for (let p = 0; p < 7; p++) {
            this.particles.push({
              x: b.x, y: b.y,
              vx: (Math.random() - 0.5) * 5,
              vy: (Math.random() - 0.5) * 5,
              life: 0.6, decay: 0.04, color: br.color
            });
          }

          if (br.hp <= 0) {
            const pts = Math.round(br.pts * (this.scoreMultiplier || 1.5));
            this.score += pts;
            this.addFloatingText('+' + pts, br.x + br.w / 2 - 12, br.y, br.color);

            if (this.score > this.highScore) {
              this.highScore = this.score;
              localStorage.setItem('firewall_breaker_high', this.highScore.toString());
            }

            // Tỉ lệ rơi vật phẩm Power-up (25%)
            if (Math.random() < 0.25) {
              const types = ['multi', 'wide', 'life'];
              const chosenType = types[Math.floor(Math.random() * types.length)];
              this.powerups.push({
                x: br.x + br.w / 2,
                y: br.y + br.h,
                type: chosenType,
                vy: 2.2
              });
            }

            this.bricks.splice(j, 1);
            if (this.onScoreUpdate) {
              this.onScoreUpdate(this.score, this.lives, this.balls.length);
            }

            // Phá sạch các khối => Tái tạo tường lửa tầng mới
            if (this.bricks.length === 0) {
              this.addFloatingText('🔥 FIREWALL OVERCLOCKED! +500 PTS', this.width / 2 - 120, this.height / 2, '#ec4899');
              this.score += 500;
              this.buildBricks();
              if (this.onScoreUpdate) {
                this.onScoreUpdate(this.score, this.lives, this.balls.length);
              }
            }
          }
          break;
        }
      }

      // Bóng rơi xuống đáy vực
      if (b.y > this.height + 25) {
        this.balls.splice(i, 1);
      }
    }

    // Nếu hết bóng trên sân => Mất 1 mạng
    if (this.balls.length === 0) {
      this.lives--;
      this.sound.playExplosion();

      if (this.onScoreUpdate) {
        this.onScoreUpdate(this.score, this.lives, 0);
      }

      if (this.lives <= 0) {
        this.gameOver();
        return;
      } else {
        // Hồi sinh bóng mới
        this.balls.push({
          x: this.paddle.x + this.paddle.w / 2,
          y: this.paddle.y - 15,
          vx: 4.5 * (Math.random() > 0.5 ? 1 : -1),
          vy: -5.5,
          r: 6.5,
          trail: []
        });
        if (this.onScoreUpdate) {
          this.onScoreUpdate(this.score, this.lives, this.balls.length);
        }
      }
    }

    // Cập nhật powerup rơi
    for (let i = this.powerups.length - 1; i >= 0; i--) {
      const p = this.powerups[i];
      p.y += p.vy;

      // Va chạm thanh hứng paddle
      if (
        p.y >= this.paddle.y &&
        p.y <= this.paddle.y + this.paddle.h + 5 &&
        p.x >= this.paddle.x &&
        p.x <= this.paddle.x + this.paddle.w
      ) {
        this.sound.playSuccess();
        if (p.type === 'wide') {
          this.paddle.w = Math.min(160, this.paddle.w + 35);
          this.addFloatingText('↔️ WIDE PADDLE!', p.x, p.y - 10, '#f59e0b');
          setTimeout(() => { this.paddle.w = 96; }, 9000);
        } else if (p.type === 'multi') {
          const mainBall = this.balls[0] || { x: this.width / 2, y: this.paddle.y - 20 };
          this.balls.push(
            { x: mainBall.x, y: mainBall.y, vx: -4.5, vy: -5, r: 6.5, trail: [] },
            { x: mainBall.x, y: mainBall.y, vx: 4.5, vy: -5, r: 6.5, trail: [] }
          );
          this.addFloatingText('⚡ MULTI-BALL x3!', p.x, p.y - 10, '#10b981');
        } else if (p.type === 'life') {
          this.lives = Math.min(5, this.lives + 1);
          this.addFloatingText('❤️ EXTRA LIFE!', p.x, p.y - 10, '#ef4444');
        }

        if (this.onScoreUpdate) {
          this.onScoreUpdate(this.score, this.lives, this.balls.length);
        }

        this.powerups.splice(i, 1);
        continue;
      }

      if (p.y > this.height) {
        this.powerups.splice(i, 1);
      }
    }

    // Cập nhật hạt bụi
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const pt = this.particles[i];
      pt.x += pt.vx;
      pt.y += pt.vy;
      pt.life -= pt.decay;
      if (pt.life <= 0) this.particles.splice(i, 1);
    }

    // Cập nhật text bay
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const ft = this.floatingTexts[i];
      ft.y += ft.vy;
      ft.life -= ft.decay;
      if (ft.life <= 0) this.floatingTexts.splice(i, 1);
    }
  }

  draw() {
    const ctx = this.ctx;

    // Nền Dark Cyberpunk
    ctx.fillStyle = '#030712';
    ctx.fillRect(0, 0, this.width, this.height);

    // Lưới Cyber Grid mờ ảo
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.05)';
    ctx.lineWidth = 1;
    for (let x = 0; x < this.width; x += 30) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, this.height);
      ctx.stroke();
    }
    for (let y = 0; y < this.height; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(this.width, y);
      ctx.stroke();
    }

    // Vẽ từng khối gạch Firewall
    for (const br of this.bricks) {
      ctx.save();
      ctx.fillStyle = br.color;
      ctx.shadowColor = br.color;
      ctx.shadowBlur = br.hp > 1 ? 10 : 4;

      // Bo góc nhẹ
      ctx.beginPath();
      ctx.roundRect(br.x, br.y, br.w, br.h, 4);
      ctx.fill();

      // Viền sáng
      ctx.strokeStyle = br.hp > 1 ? '#ffffff' : 'rgba(255,255,255,0.4)';
      ctx.lineWidth = br.hp > 1 ? 2 : 1;
      ctx.stroke();

      // Label nhỏ trên từng viên gạch
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 9px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowBlur = 0;
      ctx.fillText(br.label || 'DATA', br.x + br.w / 2, br.y + br.h / 2);

      ctx.restore();
    }

    // Vẽ thanh hứng Paddle Neon
    ctx.save();
    const paddleGrad = ctx.createLinearGradient(this.paddle.x, 0, this.paddle.x + this.paddle.w, 0);
    paddleGrad.addColorStop(0, '#06b6d4');
    paddleGrad.addColorStop(0.5, '#38bdf8');
    paddleGrad.addColorStop(1, '#06b6d4');

    ctx.fillStyle = paddleGrad;
    ctx.shadowColor = '#06b6d4';
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.roundRect(this.paddle.x, this.paddle.y, this.paddle.w, this.paddle.h, 7);
    ctx.fill();

    // Điểm nhấn công nghệ trên thanh hứng
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(this.paddle.x + this.paddle.w / 2, this.paddle.y + this.paddle.h / 2, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Vẽ bóng và vệt trail năng lượng
    for (const b of this.balls) {
      // Vệt trail
      if (b.trail) {
        for (let t = 0; t < b.trail.length; t++) {
          const pt = b.trail[t];
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, b.r * (t / b.trail.length) * 0.8, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(56, 189, 248, ' + ((t + 1) * 0.1) + ')';
          ctx.fill();
        }
      }

      // Quả cầu năng lượng
      ctx.save();
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 14;
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Vẽ Powerups rơi
    for (const p of this.powerups) {
      ctx.save();
      ctx.fillStyle = p.type === 'wide' ? '#f59e0b' : p.type === 'multi' ? '#10b981' : '#ef4444';
      ctx.shadowColor = ctx.fillStyle;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.roundRect(p.x - 14, p.y - 7, 28, 14, 7);
      ctx.fill();

      // Icon biểu tượng
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 9px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowBlur = 0;
      const symbol = p.type === 'wide' ? '↔️' : p.type === 'multi' ? '⚡' : '❤️';
      ctx.fillText(symbol, p.x, p.y);
      ctx.restore();
    }

    // Vẽ hạt văng
    for (const pt of this.particles) {
      ctx.save();
      ctx.fillStyle = pt.color;
      ctx.globalAlpha = Math.max(0, pt.life);
      ctx.fillRect(pt.x, pt.y, 3, 3);
      ctx.restore();
    }

    // Vẽ floating texts
    for (const ft of this.floatingTexts) {
      ctx.save();
      ctx.font = 'bold 11px "JetBrains Mono", monospace';
      ctx.fillStyle = ft.color;
      ctx.globalAlpha = Math.max(0, ft.life);
      ctx.shadowColor = ft.color;
      ctx.shadowBlur = 8;
      ctx.fillText(ft.text, ft.x, ft.y);
      ctx.restore();
    }
  }

  gameOver() {
    this.isPlaying = false;
    if (this.onGameOver) this.onGameOver(this.score, false);
  }

  loop() {
    if (!this.isPlaying || this.isPaused) return;
    this.update();
    this.draw();
    requestAnimationFrame(this.loop.bind(this));
  }
}
