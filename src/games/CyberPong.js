/**
 * CyberPong.js - Neon Quantum Pong Battle
 * Bóng bàn lượng tử siêu tốc đối đầu AI điều khiển mạng nơ-ron (3 cấp độ).
 * Hỗ trợ cảm ứng vuốt màn hình, chuột, phím W/S & Mũi tên, vệt đuôi neon và rung chấn bàn chơi.
 */
export class CyberPong {
  constructor(canvas, soundManager, onScoreUpdate, onGameOver) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.sound = soundManager;
    this.onScoreUpdate = onScoreUpdate;
    this.onGameOver = onGameOver;

    this.isPlaying = false;
    this.isPaused = false;
    this.difficulty = 'normal'; // 'normal', 'hard', 'god'
    this.playerScore = 0;
    this.aiScore = 0;
    this.targetScore = 7;
    this.animationId = null;

    this.paddleWidth = 14;
    this.paddleHeight = 85;

    this.player = {
      x: 25,
      y: 150,
      vy: 0,
      score: 0,
      color: '#06b6d4'
    };

    this.ai = {
      x: 0,
      y: 150,
      vy: 0,
      speed: 4.8,
      score: 0,
      color: '#ec4899'
    };

    this.ball = {
      x: 350,
      y: 200,
      vx: 6,
      vy: 2.5,
      radius: 7,
      speed: 6.5,
      trail: []
    };

    this.particles = [];
    this.keys = {};
    this.shake = 0;

    this.initEvents();
    this.resize();
  }

  resize() {
    const rect = this.canvas.parentElement ? this.canvas.parentElement.getBoundingClientRect() : null;
    this.width = this.canvas.width = (rect && rect.width) ? rect.width : 700;
    this.height = this.canvas.height = (rect && rect.height) ? rect.height : 420;

    this.player.x = 25;
    this.ai.x = this.width - 25 - this.paddleWidth;
    if (!this.isPlaying) this.drawIdle();
  }

  initEvents() {
    // Phím điều khiển
    window.addEventListener('keydown', (e) => {
      this.keys[e.key] = true;
      if (['ArrowUp', 'ArrowDown', 'w', 's', 'W', 'S'].includes(e.key) && this.isPlaying) {
        e.preventDefault();
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.key] = false;
    });

    // Điều khiển chuột
    this.canvas.addEventListener('mousemove', (e) => {
      if (!this.isPlaying || this.isPaused) return;
      const rect = this.canvas.getBoundingClientRect();
      const scaleY = this.height / rect.height;
      const mouseY = (e.clientY - rect.top) * scaleY;
      this.player.y = Math.max(0, Math.min(this.height - this.paddleHeight, mouseY - this.paddleHeight / 2));
    });

    // Điều khiển cảm ứng trên điện thoại
    this.canvas.addEventListener('touchmove', (e) => {
      if (!this.isPlaying || this.isPaused) return;
      const rect = this.canvas.getBoundingClientRect();
      const scaleY = this.height / rect.height;
      const touch = e.touches[0];
      if (touch) {
        const touchY = (touch.clientY - rect.top) * scaleY;
        this.player.y = Math.max(0, Math.min(this.height - this.paddleHeight, touchY - this.paddleHeight / 2));
      }
    }, { passive: true });
  }

  setDifficulty(level) {
    this.difficulty = level;
    if (level === 'normal') this.ai.speed = 4.8;
    else if (level === 'hard') this.ai.speed = 6.8;
    else if (level === 'god') this.ai.speed = 9.2;
  }

  start() {
    this.resize();
    this.isPlaying = true;
    this.isPaused = false;
    this.playerScore = 0;
    this.aiScore = 0;
    this.player.y = this.height / 2 - this.paddleHeight / 2;
    this.ai.y = this.height / 2 - this.paddleHeight / 2;
    this.particles = [];
    this.setDifficulty(this.difficulty);
    this.resetBall(1);

    if (this.onScoreUpdate) {
      this.onScoreUpdate(this.playerScore, this.aiScore);
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
    if (this.isPaused) return this.resume();
    else return this.pause();
  }

  reset() {
    this.stop();
    this.start();
  }

  resetBall(direction = 1) {
    this.ball.x = this.width / 2;
    this.ball.y = this.height / 2;
    this.ball.speed = 6.2;
    const angle = (Math.random() * 0.8 - 0.4); // Góc nghiêng vừa phải
    this.ball.vx = Math.cos(angle) * this.ball.speed * direction;
    this.ball.vy = Math.sin(angle) * this.ball.speed;
    this.ball.trail = [];
  }

  loop() {
    if (!this.isPlaying || this.isPaused) return;

    this.update();
    this.draw();

    this.animationId = requestAnimationFrame(() => this.loop());
  }

  update() {
    // Điều khiển bàn phím cho người chơi
    const keySpeed = 7.5;
    if (this.keys['ArrowUp'] || this.keys['w'] || this.keys['W']) {
      this.player.y = Math.max(0, this.player.y - keySpeed);
    }
    if (this.keys['ArrowDown'] || this.keys['s'] || this.keys['S']) {
      this.player.y = Math.min(this.height - this.paddleHeight, this.player.y + keySpeed);
    }

    // AI Di chuyển thông minh
    const targetY = this.ball.y - this.paddleHeight / 2;
    // Thêm sai số nếu độ khó thấp
    let aiLag = this.difficulty === 'normal' ? 18 : (this.difficulty === 'hard' ? 8 : 0);
    if (this.ball.vx > 0) { // Bóng bay về phía AI
      if (Math.abs(this.ai.y - targetY) > aiLag) {
        if (this.ai.y < targetY) {
          this.ai.y = Math.min(this.height - this.paddleHeight, this.ai.y + this.ai.speed);
        } else {
          this.ai.y = Math.max(0, this.ai.y - this.ai.speed);
        }
      }
    } else { // Về vị trí giữa khi bóng xa
      const mid = this.height / 2 - this.paddleHeight / 2;
      if (Math.abs(this.ai.y - mid) > 20) {
        this.ai.y += (mid - this.ai.y) * 0.03;
      }
    }

    // Cập nhật vệt đuôi bóng
    this.ball.trail.push({ x: this.ball.x, y: this.ball.y });
    if (this.ball.trail.length > 9) this.ball.trail.shift();

    // Di chuyển bóng
    this.ball.x += this.ball.vx;
    this.ball.y += this.ball.vy;

    // Va chạm tường trên và dưới
    if (this.ball.y - this.ball.radius <= 0) {
      this.ball.y = this.ball.radius;
      this.ball.vy = -this.ball.vy;
      this.spawnBounceParticles(this.ball.x, this.ball.y, '#38bdf8');
      if (this.sound && this.sound.playBounce) this.sound.playBounce(380);
    } else if (this.ball.y + this.ball.radius >= this.height) {
      this.ball.y = this.height - this.ball.radius;
      this.ball.vy = -this.ball.vy;
      this.spawnBounceParticles(this.ball.x, this.ball.y, '#38bdf8');
      if (this.sound && this.sound.playBounce) this.sound.playBounce(380);
    }

    // Va chạm thanh hứng người chơi (Player)
    if (
      this.ball.x - this.ball.radius <= this.player.x + this.paddleWidth &&
      this.ball.x + this.ball.radius >= this.player.x &&
      this.ball.y >= this.player.y &&
      this.ball.y <= this.player.y + this.paddleHeight &&
      this.ball.vx < 0
    ) {
      const hitPoint = (this.ball.y - (this.player.y + this.paddleHeight / 2)) / (this.paddleHeight / 2);
      const angle = hitPoint * (Math.PI / 3.2); // Tối đa ~55 độ
      this.ball.speed = Math.min(14, this.ball.speed + 0.35);
      this.ball.vx = Math.cos(angle) * this.ball.speed;
      this.ball.vy = Math.sin(angle) * this.ball.speed;
      this.ball.x = this.player.x + this.paddleWidth + this.ball.radius;

      this.spawnBounceParticles(this.ball.x, this.ball.y, '#06b6d4', 12);
      this.shake = 4;
      if (this.sound && this.sound.playBounce) this.sound.playBounce(640);
    }

    // Va chạm thanh hứng AI
    if (
      this.ball.x + this.ball.radius >= this.ai.x &&
      this.ball.x - this.ball.radius <= this.ai.x + this.paddleWidth &&
      this.ball.y >= this.ai.y &&
      this.ball.y <= this.ai.y + this.paddleHeight &&
      this.ball.vx > 0
    ) {
      const hitPoint = (this.ball.y - (this.ai.y + this.paddleHeight / 2)) / (this.paddleHeight / 2);
      const angle = hitPoint * (Math.PI / 3.2);
      this.ball.speed = Math.min(14, this.ball.speed + 0.35);
      this.ball.vx = -Math.cos(angle) * this.ball.speed;
      this.ball.vy = Math.sin(angle) * this.ball.speed;
      this.ball.x = this.ai.x - this.ball.radius;

      this.spawnBounceParticles(this.ball.x, this.ball.y, '#ec4899', 12);
      this.shake = 4;
      if (this.sound && this.sound.playBounce) this.sound.playBounce(580);
    }

    // Người chơi ghi điểm
    if (this.ball.x > this.width + 20) {
      this.playerScore++;
      if (this.sound && this.sound.playScore) this.sound.playScore();
      if (this.onScoreUpdate) this.onScoreUpdate(this.playerScore, this.aiScore);

      if (this.playerScore >= this.targetScore) {
        this.triggerMatchOver(true);
        return;
      }
      this.resetBall(-1);
    }

    // AI ghi điểm
    if (this.ball.x < -20) {
      this.aiScore++;
      if (this.sound && this.sound.playFail) this.sound.playFail();
      if (this.onScoreUpdate) this.onScoreUpdate(this.playerScore, this.aiScore);

      if (this.aiScore >= this.targetScore) {
        this.triggerMatchOver(false);
        return;
      }
      this.resetBall(1);
    }

    // Cập nhật hạt
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.05;
      if (p.life <= 0) this.particles.splice(i, 1);
    }

    if (this.shake > 0) this.shake -= 0.5;
  }

  spawnBounceParticles(x, y, color, count = 6) {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 6,
        vy: (Math.random() - 0.5) * 6,
        size: Math.random() * 3 + 2,
        color,
        life: 1.0
      });
    }
  }

  triggerMatchOver(playerWon) {
    this.isPlaying = false;
    if (playerWon) {
      if (this.sound && this.sound.playSuccess) this.sound.playSuccess();
    } else {
      if (this.sound && this.sound.playFail) this.sound.playFail();
    }

    this.drawMatchOver(playerWon);
    if (this.onGameOver) this.onGameOver(this.playerScore, this.aiScore, playerWon);
  }

  draw() {
    const ctx = this.ctx;
    ctx.save();

    if (this.shake > 0) {
      ctx.translate((Math.random() - 0.5) * this.shake, (Math.random() - 0.5) * this.shake);
    }

    // Nền sân đấu Cyber Table
    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, this.width, this.height);

    // Đường kẻ giữa sân
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 8]);
    ctx.beginPath();
    ctx.moveTo(this.width / 2, 0);
    ctx.lineTo(this.width / 2, this.height);
    ctx.stroke();
    ctx.setLineDash([]);

    // Vòng tròn trung tâm
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.12)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(this.width / 2, this.height / 2, 55, 0, Math.PI * 2);
    ctx.stroke();

    // Điểm số HUD to trên bàn đấu
    ctx.font = 'black 48px ui-monospace, monospace';
    ctx.fillStyle = 'rgba(6, 182, 212, 0.25)';
    ctx.textAlign = 'right';
    ctx.fillText(this.playerScore.toString(), this.width / 2 - 35, 70);

    ctx.fillStyle = 'rgba(236, 72, 153, 0.25)';
    ctx.textAlign = 'left';
    ctx.fillText(this.aiScore.toString(), this.width / 2 + 35, 70);

    // Tên bên chơi
    ctx.font = 'bold 11px ui-monospace, monospace';
    ctx.fillStyle = '#38bdf8';
    ctx.textAlign = 'left';
    ctx.fillText('PLAYER (YOU)', 30, 25);

    ctx.fillStyle = '#f472b6';
    ctx.textAlign = 'right';
    ctx.fillText(`NEURAL AI [${this.difficulty.toUpperCase()}]`, this.width - 30, 25);

    // Vẽ thanh người chơi (Player Paddle)
    ctx.save();
    ctx.fillStyle = this.player.color;
    ctx.shadowColor = this.player.color;
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.roundRect(this.player.x, this.player.y, this.paddleWidth, this.paddleHeight, 6);
    ctx.fill();
    ctx.restore();

    // Vẽ thanh AI (AI Paddle)
    ctx.save();
    ctx.fillStyle = this.ai.color;
    ctx.shadowColor = this.ai.color;
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.roundRect(this.ai.x, this.ai.y, this.paddleWidth, this.paddleHeight, 6);
    ctx.fill();
    ctx.restore();

    // Vẽ vệt đuôi bóng (Ball trail)
    this.ball.trail.forEach((pt, i) => {
      ctx.save();
      ctx.globalAlpha = (i + 1) / this.ball.trail.length * 0.45;
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, this.ball.radius * ((i + 1) / this.ball.trail.length), 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // Vẽ quả bóng lượng tử (Ball)
    ctx.save();
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 16;
    ctx.beginPath();
    ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Vẽ các hạt nảy
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

    ctx.restore();
  }

  drawIdle() {
    const ctx = this.ctx;
    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, this.width, this.height);

    ctx.font = 'bold 22px ui-monospace, monospace';
    ctx.fillStyle = '#06b6d4';
    ctx.textAlign = 'center';
    ctx.fillText('🏓 CYBER PONG BATTLE', this.width / 2, this.height / 2 - 20);

    ctx.font = '13px system-ui, sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('Di chuột, vuốt màn hình hoặc dùng phím W/S & Mũi tên', this.width / 2, this.height / 2 + 15);
  }

  drawPaused() {
    const ctx = this.ctx;
    ctx.save();
    ctx.fillStyle = 'rgba(2, 6, 23, 0.75)';
    ctx.fillRect(0, 0, this.width, this.height);

    ctx.font = 'bold 20px ui-monospace, monospace';
    ctx.fillStyle = '#f59e0b';
    ctx.textAlign = 'center';
    ctx.fillText('⏸ ĐÃ TẠM DỪNG (PAUSED)', this.width / 2, this.height / 2);
    ctx.restore();
  }

  drawMatchOver(playerWon) {
    const ctx = this.ctx;
    ctx.save();
    ctx.fillStyle = 'rgba(2, 6, 23, 0.85)';
    ctx.fillRect(0, 0, this.width, this.height);

    ctx.textAlign = 'center';
    if (playerWon) {
      ctx.font = 'black 32px ui-monospace, monospace';
      ctx.fillStyle = '#10b981';
      ctx.shadowColor = '#059669';
      ctx.shadowBlur = 15;
      ctx.fillText('CHIẾN THẮNG ÁP ĐẢO!', this.width / 2, this.height / 2 - 20);
    } else {
      ctx.font = 'black 32px ui-monospace, monospace';
      ctx.fillStyle = '#f43f5e';
      ctx.shadowColor = '#e11d48';
      ctx.shadowBlur = 15;
      ctx.fillText('AI ĐÃ CHIẾN THẮNG!', this.width / 2, this.height / 2 - 20);
    }

    ctx.shadowBlur = 0;
    ctx.font = '14px ui-monospace, monospace';
    ctx.fillStyle = '#cbd5e1';
    ctx.fillText(`TỶ SỐ CUỐI: ${this.playerScore} - ${this.aiScore}`, this.width / 2, this.height / 2 + 20);

    ctx.font = '12px system-ui, sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('Nhấn Chơi Lại để bắt đầu ván mới', this.width / 2, this.height / 2 + 50);
    ctx.restore();
  }
}
