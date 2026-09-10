export class CyberSnake {
  constructor(canvas, soundManager, onScoreUpdate, onGameOver) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.sound = soundManager;
    this.onScoreUpdate = onScoreUpdate;
    this.onGameOver = onGameOver;

    this.gridSize = 20;
    this.tileCountX = 30;
    this.tileCountY = 20;

    this.snake = [];
    this.dir = { x: 1, y: 0 };
    this.nextDir = { x: 1, y: 0 };
    this.food = { x: 5, y: 5, type: 'byte' };
    this.particles = [];
    this.score = 0;
    this.highScore = parseInt(localStorage.getItem('cyber_snake_high') || '0', 10);
    this.difficulty = 'normal';
    this.baseSpeed = 100;
    this.minSpeed = 55;
    this.scoreMultiplier = 1.5;
    this.speed = 100; // ms per step
    this.lastTime = 0;
    this.isRunning = false;
    this.isPaused = false;
    this.animationId = null;
    this.combo = 1;

    this.setDifficulty('normal');
    this.initInput();
    this.resize();
  }

  resize() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.canvas.width = rect.width || 600;
    this.canvas.height = rect.height || 380;
    this.tileCountX = Math.floor(this.canvas.width / this.gridSize);
    this.tileCountY = Math.floor(this.canvas.height / this.gridSize);
    if (!this.isRunning) this.drawStatic();
  }

  initInput() {
    window.addEventListener('keydown', (e) => {
      if (!this.isRunning) return;
      const key = e.key.toLowerCase();
      if ((key === 'arrowup' || key === 'w') && this.dir.y === 0) {
        this.nextDir = { x: 0, y: -1 };
        e.preventDefault();
      } else if ((key === 'arrowdown' || key === 's') && this.dir.y === 0) {
        this.nextDir = { x: 0, y: 1 };
        e.preventDefault();
      } else if ((key === 'arrowleft' || key === 'a') && this.dir.x === 0) {
        this.nextDir = { x: -1, y: 0 };
        e.preventDefault();
      } else if ((key === 'arrowright' || key === 'd') && this.dir.x === 0) {
        this.nextDir = { x: 1, y: 0 };
        e.preventDefault();
      }
    });
  }

  setDifficulty(level) {
    this.difficulty = level || 'normal';
    if (this.difficulty === 'easy') {
      this.baseSpeed = 135;
      this.minSpeed = 75;
      this.scoreMultiplier = 1;
    } else if (this.difficulty === 'hard') {
      this.baseSpeed = 65;
      this.minSpeed = 40;
      this.scoreMultiplier = 2.5;
    } else { // normal
      this.baseSpeed = 100;
      this.minSpeed = 55;
      this.scoreMultiplier = 1.5;
    }
    this.speed = this.baseSpeed;
  }

  start() {
    this.resize();
    this.snake = [
      { x: 5, y: 10 },
      { x: 4, y: 10 },
      { x: 3, y: 10 }
    ];
    this.dir = { x: 1, y: 0 };
    this.nextDir = { x: 1, y: 0 };
    this.score = 0;
    this.combo = 1;
    this.setDifficulty(this.difficulty);
    this.particles = [];
    this.spawnFood();
    this.isRunning = true;
    this.lastTime = performance.now();

    if (this.onScoreUpdate) this.onScoreUpdate(this.score, this.highScore, this.snake.length);
    this.loop(performance.now());
  }

  stop() {
    this.isRunning = false;
    this.isPaused = false;
    if (this.animationId) cancelAnimationFrame(this.animationId);
  }

  pause() {
    if (!this.isRunning || this.isPaused) return false;
    this.isPaused = true;
    if (this.animationId) cancelAnimationFrame(this.animationId);
    return true;
  }

  resume() {
    if (!this.isRunning || !this.isPaused) return false;
    this.isPaused = false;
    this.lastTime = performance.now();
    this.loop(performance.now());
    return true;
  }

  togglePause() {
    if (this.isPaused) {
      this.resume();
      return false;
    } else {
      this.pause();
      return true;
    }
  }

  reset() {
    this.stop();
    this.isPaused = false;
    this.start();
  }


  spawnFood() {
    const isSpecial = Math.random() < 0.25;
    this.food = {
      x: Math.floor(Math.random() * (this.tileCountX - 2)) + 1,
      y: Math.floor(Math.random() * (this.tileCountY - 2)) + 1,
      type: isSpecial ? 'crypto' : 'byte',
      pulse: 0
    };
  }

  loop(currentTime) {
    if (!this.isRunning || this.isPaused) return;
    this.animationId = requestAnimationFrame((t) => this.loop(t));

    const elapsed = currentTime - this.lastTime;
    if (elapsed > this.speed) {
      this.lastTime = currentTime;
      this.update();
    }
    this.draw();
  }

  update() {
    this.dir = { ...this.nextDir };
    const head = {
      x: this.snake[0].x + this.dir.x,
      y: this.snake[0].y + this.dir.y
    };

    // Wrap around screen boundaries for smooth cyber snake flow
    if (head.x < 0) head.x = this.tileCountX - 1;
    if (head.x >= this.tileCountX) head.x = 0;
    if (head.y < 0) head.y = this.tileCountY - 1;
    if (head.y >= this.tileCountY) head.y = 0;

    // Self collision
    for (let i = 0; i < this.snake.length; i++) {
      if (head.x === this.snake[i].x && head.y === this.snake[i].y) {
        this.gameOver();
        return;
      }
    }

    this.snake.unshift(head);

    // Food collision
    if (head.x === this.food.x && head.y === this.food.y) {
      const isCrypto = this.food.type === 'crypto';
      const basePts = isCrypto ? 50 : 15;
      const pts = Math.round(basePts * this.combo * (this.scoreMultiplier || 1.5));
      this.score += pts;
      this.combo++;
      if (this.score > this.highScore) {
        this.highScore = this.score;
        localStorage.setItem('cyber_snake_high', this.highScore.toString());
      }
      this.speed = Math.max(this.minSpeed || 55, (this.baseSpeed || 100) - Math.floor(this.snake.length * 1.5));

      this.sound.playClick(isCrypto ? 880 : 580);
      this.createParticles(
        head.x * this.gridSize + this.gridSize / 2,
        head.y * this.gridSize + this.gridSize / 2,
        isCrypto ? '#f59e0b' : '#06b6d4',
        16
      );
      this.spawnFood();

      if (this.onScoreUpdate) this.onScoreUpdate(this.score, this.highScore, this.snake.length);
    } else {
      this.snake.pop();
    }
  }

  createParticles(x, y, color, count = 10) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const spd = Math.random() * 4 + 1;
      this.particles.push({
        x, y,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd,
        color,
        size: Math.random() * 3 + 2,
        life: 1
      });
    }
  }

  gameOver() {
    this.sound.playExplosion();
    this.isRunning = false;
    const head = this.snake[0] || { x: 5, y: 5 };
    this.createParticles(
      head.x * this.gridSize + this.gridSize / 2,
      head.y * this.gridSize + this.gridSize / 2,
      '#ef4444',
      30
    );
    if (this.onGameOver) this.onGameOver(this.score, this.highScore);
  }

  draw() {
    this.ctx.fillStyle = '#030712';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw Cyber Grid
    this.ctx.strokeStyle = 'rgba(6, 182, 212, 0.06)';
    this.ctx.lineWidth = 1;
    for (let x = 0; x < this.canvas.width; x += this.gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.canvas.height);
      this.ctx.stroke();
    }
    for (let y = 0; y < this.canvas.height; y += this.gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.canvas.width, y);
      this.ctx.stroke();
    }

    // Draw Food
    const fx = this.food.x * this.gridSize + this.gridSize / 2;
    const fy = this.food.y * this.gridSize + this.gridSize / 2;
    const isCrypto = this.food.type === 'crypto';

    this.ctx.save();
    this.ctx.shadowBlur = 15;
    this.ctx.shadowColor = isCrypto ? '#f59e0b' : '#06b6d4';
    this.ctx.fillStyle = isCrypto ? '#fbbf24' : '#22d3ee';
    this.ctx.beginPath();
    this.ctx.arc(fx, fy, (this.gridSize / 2) - 3, 0, Math.PI * 2);
    this.ctx.fill();

    // Food inner shine
    this.ctx.fillStyle = '#ffffff';
    this.ctx.beginPath();
    this.ctx.arc(fx - 2, fy - 2, 2, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.restore();

    // Draw Snake
    for (let i = this.snake.length - 1; i >= 0; i--) {
      const part = this.snake[i];
      const px = part.x * this.gridSize + 2;
      const py = part.y * this.gridSize + 2;
      const sz = this.gridSize - 4;
      const progress = i / Math.max(1, this.snake.length);

      this.ctx.save();
      if (i === 0) {
        // Snake Head
        this.ctx.shadowBlur = 16;
        this.ctx.shadowColor = '#06b6d4';
        this.ctx.fillStyle = '#22d3ee';
        this.roundRect(px, py, sz, sz, 6);
        this.ctx.fill();

        // Eyes
        this.ctx.fillStyle = '#ffffff';
        const eyeOffset = 4;
        if (this.dir.x === 1) {
          this.ctx.fillRect(px + sz - 5, py + eyeOffset, 3, 3);
          this.ctx.fillRect(px + sz - 5, py + sz - eyeOffset - 3, 3, 3);
        } else if (this.dir.x === -1) {
          this.ctx.fillRect(px + 2, py + eyeOffset, 3, 3);
          this.ctx.fillRect(px + 2, py + sz - eyeOffset - 3, 3, 3);
        } else if (this.dir.y === 1) {
          this.ctx.fillRect(px + eyeOffset, py + sz - 5, 3, 3);
          this.ctx.fillRect(px + sz - eyeOffset - 3, py + sz - 5, 3, 3);
        } else {
          this.ctx.fillRect(px + eyeOffset, py + 2, 3, 3);
          this.ctx.fillRect(px + sz - eyeOffset - 3, py + 2, 3, 3);
        }
      } else {
        // Snake Body Gradient
        const r = Math.floor(6 + progress * 16);
        const g = Math.floor(182 - progress * 80);
        const b = Math.floor(212 - progress * 100);
        this.ctx.shadowBlur = 8;
        this.ctx.shadowColor = `rgba(${r}, ${g}, ${b}, 0.5)`;
        this.ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        this.roundRect(px, py, sz, sz, 4);
        this.ctx.fill();
      }
      this.ctx.restore();
    }

    // Draw Particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.03;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }
      this.ctx.save();
      this.ctx.globalAlpha = p.life;
      this.ctx.fillStyle = p.color;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }
  }

  roundRect(x, y, w, h, r) {
    this.ctx.beginPath();
    this.ctx.moveTo(x + r, y);
    this.ctx.arcTo(x + w, y, x + w, y + h, r);
    this.ctx.arcTo(x + w, y + h, x, y + h, r);
    this.ctx.arcTo(x, y + h, x, y, r);
    this.ctx.arcTo(x, y, x + w, y, r);
    this.ctx.closePath();
  }

  drawStatic() {
    this.ctx.fillStyle = '#030712';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }
}
