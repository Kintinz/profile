/**
 * CyberDefender - Visual Upgrade Edition
 * Đồ họa phi thuyền đa tầng, đốm lửa phản lực hạt, rung màn hình (Screen Shake),
 * vòng sóng xung kích (Shockwaves), chữ nổi điểm số bay (Floating Text),
 * boss khổng lồ và kẻ địch chi tiết.
 */
export class CyberDefender {
  constructor(canvas, soundManager, onScoreUpdate, onGameOver) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.sound = soundManager;
    this.onScoreUpdate = onScoreUpdate;
    this.onGameOver = onGameOver;

    this.isPlaying = false;
    this.isPaused = false;
    this.score = 0;
    this.highScore = parseInt(localStorage.getItem('cyber_defender_high') || '0', 10);
    this.difficulty = 'normal';
    this.maxHealth = 100;
    this.health = 100;
    this.wave = 1;
    this.spawnRateMultiplier = 1.0;
    this.enemySpeedMultiplier = 1.0;
    this.scoreMultiplier = 1.5;

    this.player = {
      x: 0,
      y: 0,
      size: 26,
      speed: 7.5,
      shield: 0,
      weaponLevel: 1,
      tilt: 0
    };

    this.bullets = [];
    this.enemies = [];
    this.particles = [];
    this.powerups = [];
    this.floatingTexts = [];
    this.shockwaves = [];

    this.keys = {};
    this.mousePos = { x: 0, y: 0 };
    this.lastShotTime = 0;
    this.spawnTimer = 0;
    this.shakeDuration = 0;
    this.shakeIntensity = 0;

    this.initEvents();
  }

  resize() {
    this.width = this.canvas.width = this.canvas.clientWidth || 700;
    this.height = this.canvas.height = this.canvas.clientHeight || 450;
    this.player.x = this.width / 2;
    this.player.y = this.height - 60;
  }

  initEvents() {
    window.addEventListener('keydown', (e) => {
      this.keys[e.key] = true;
      if (e.key === ' ' && this.isPlaying) {
        this.shoot();
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.key] = false;
    });

    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const newX = e.clientX - rect.left;
      this.mousePos.x = newX;
      this.mousePos.y = e.clientY - rect.top;

      if (this.isPlaying) {
        const dx = newX - this.player.x;
        this.player.tilt = Math.max(-0.4, Math.min(0.4, dx * 0.03));
        this.player.x = Math.max(25, Math.min(this.width - 25, newX));
      }
    });

    this.canvas.addEventListener('mousedown', () => {
      if (this.isPlaying) this.shoot();
    });
  }

  setDifficulty(level) {
    this.difficulty = level || 'normal';
    if (this.difficulty === 'easy') {
      this.maxHealth = 150;
      this.spawnRateMultiplier = 1.35;
      this.enemySpeedMultiplier = 0.82;
      this.scoreMultiplier = 1.0;
    } else if (this.difficulty === 'hard') {
      this.maxHealth = 80;
      this.spawnRateMultiplier = 0.7;
      this.enemySpeedMultiplier = 1.35;
      this.scoreMultiplier = 2.5;
    } else { // normal
      this.maxHealth = 100;
      this.spawnRateMultiplier = 1.0;
      this.enemySpeedMultiplier = 1.0;
      this.scoreMultiplier = 1.5;
    }
  }

  start() {
    this.resize();
    this.isPlaying = true;
    this.score = 0;
    this.setDifficulty(this.difficulty);
    this.health = this.maxHealth;
    this.wave = 1;
    this.player.weaponLevel = 1;
    this.player.shield = 0;
    this.bullets = [];
    this.enemies = [];
    this.particles = [];
    this.powerups = [];
    this.floatingTexts = [];
    this.shockwaves = [];
    this.shakeDuration = 0;

    if (this.onScoreUpdate) this.onScoreUpdate(this.score, this.highScore, this.health);
    this.loop();
  }

  stop() {
    this.isPlaying = false;
    this.isPaused = false;
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


  addScreenShake(intensity = 6, duration = 12) {
    this.shakeIntensity = intensity;
    this.shakeDuration = duration;
  }

  addFloatingText(text, x, y, color = '#38bdf8') {
    this.floatingTexts.push({
      text, x, y,
      vy: -1.2,
      alpha: 1.0,
      color
    });
  }

  addShockwave(x, y, maxR = 40, color = '#38bdf8') {
    this.shockwaves.push({
      x, y, r: 5, maxR,
      alpha: 1.0,
      color
    });
  }

  shoot() {
    const now = performance.now();
    if (now - this.lastShotTime < 120) return;
    this.lastShotTime = now;

    this.sound.playLaser();
    const px = this.player.x;
    const py = this.player.y;

    if (this.player.weaponLevel === 1) {
      this.bullets.push({ x: px, y: py - 20, vx: 0, vy: -14, size: 4.5, color: '#06b6d4', glow: '#38bdf8' });
    } else if (this.player.weaponLevel === 2) {
      this.bullets.push(
        { x: px - 12, y: py - 16, vx: 0, vy: -14, size: 4.5, color: '#38bdf8', glow: '#06b6d4' },
        { x: px + 12, y: py - 16, vx: 0, vy: -14, size: 4.5, color: '#38bdf8', glow: '#06b6d4' }
      );
    } else {
      this.bullets.push(
        { x: px, y: py - 24, vx: 0, vy: -15, size: 5.5, color: '#f59e0b', glow: '#fbbf24' },
        { x: px - 16, y: py - 14, vx: -2.5, vy: -14, size: 4.5, color: '#06b6d4', glow: '#38bdf8' },
        { x: px + 16, y: py - 14, vx: 2.5, vy: -14, size: 4.5, color: '#06b6d4', glow: '#38bdf8' }
      );
    }
  }

  createExplosion(x, y, color = '#f97316', count = 24) {
    this.sound.playExplosion();
    this.addScreenShake(7, 14);
    this.addShockwave(x, y, 45, color);

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 6 + 1.5;
      this.particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1.0,
        decay: Math.random() * 0.03 + 0.015,
        size: Math.random() * 4 + 2,
        color: color
      });
    }
  }

  spawnEnemy() {
    const r = Math.random();
    const isBoss = (this.score > 800 && r < 0.12 && !this.enemies.some(e => e.isBoss));
    const isDrone = r < 0.5;

    let size, hp, color, type;
    if (isBoss) {
      size = 38;
      hp = 18;
      color = '#e11d48';
      type = 'boss';
    } else if (isDrone) {
      size = 20;
      hp = 3;
      color = '#ef4444';
      type = 'drone';
    } else {
      size = 18;
      hp = 1;
      color = '#a855f7';
      type = 'asteroid';
    }

    this.enemies.push({
      x: Math.random() * (this.width - size * 2) + size,
      y: -size - 10,
      size: size,
      vx: (Math.random() - 0.5) * (isBoss ? 0.8 : 2.0),
      vy: (isBoss ? 0.9 : (Math.random() * 2.0 + 1.2 + this.wave * 0.2)) * (this.enemySpeedMultiplier || 1.0),
      hp: hp,
      maxHp: hp,
      type: type,
      isBoss: isBoss,
      color: color,
      rot: 0,
      rotSpeed: (Math.random() - 0.5) * 0.06
    });
  }

  update() {
    if (this.keys['ArrowLeft'] || this.keys['a']) {
      this.player.x -= this.player.speed;
      this.player.tilt = -0.3;
    } else if (this.keys['ArrowRight'] || this.keys['d']) {
      this.player.x += this.player.speed;
      this.player.tilt = 0.3;
    } else {
      this.player.tilt *= 0.8;
    }

    this.player.x = Math.max(25, Math.min(this.width - 25, this.player.x));

    if (this.keys[' ']) this.shoot();

    // Engine exhaust particles
    if (Math.random() < 0.8) {
      this.particles.push({
        x: this.player.x + (Math.random() - 0.5) * 8,
        y: this.player.y + 16,
        vx: (Math.random() - 0.5) * 1.5,
        vy: Math.random() * 3 + 4,
        life: 0.8,
        decay: 0.05,
        size: Math.random() * 3 + 2,
        color: Math.random() > 0.5 ? '#06b6d4' : '#38bdf8'
      });
    }

    // Spawn kẻ địch
    this.spawnTimer++;
    const baseSpawnRate = Math.max(22, 60 - this.wave * 5);
    const spawnRate = Math.max(14, Math.round(baseSpawnRate * (this.spawnRateMultiplier || 1.0)));
    if (this.spawnTimer % spawnRate === 0) {
      this.spawnEnemy();
    }

    this.wave = Math.floor(this.score / 600) + 1;

    // Cập nhật đạn
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const b = this.bullets[i];
      b.x += b.vx;
      b.y += b.vy;
      if (b.y < -20 || b.x < 0 || b.x > this.width) {
        this.bullets.splice(i, 1);
      }
    }

    // Cập nhật kẻ địch
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const e = this.enemies[i];
      e.x += e.vx;
      e.y += e.vy;
      e.rot += e.rotSpeed;

      // Đảo chiều nếu chạm mép
      if (e.x < e.size || e.x > this.width - e.size) e.vx *= -1;

      // Va chạm đạn với kẻ địch
      for (let j = this.bullets.length - 1; j >= 0; j--) {
        const b = this.bullets[j];
        const dist = Math.hypot(b.x - e.x, b.y - e.y);
        if (dist < e.size + b.size) {
          this.bullets.splice(j, 1);
          e.hp--;

          // Spark particle
          this.particles.push({
            x: b.x, y: b.y,
            vx: (Math.random() - 0.5) * 4, vy: (Math.random() - 0.5) * 4,
            life: 0.5, decay: 0.08, size: 3, color: '#fef08a'
          });

          if (e.hp <= 0) {
            this.createExplosion(e.x, e.y, e.color, e.isBoss ? 45 : 20);
            const basePts = e.isBoss ? 600 : (e.type === 'drone' ? 160 : 90);
            const pts = Math.round(basePts * (this.scoreMultiplier || 1.5));
            this.score += pts;
            this.addFloatingText('+' + pts, e.x, e.y - 10, e.color);

            // Rơi vật phẩm
            if (Math.random() < 0.22 || e.isBoss) {
              const types = ['shield', 'weapon', 'health'];
              this.powerups.push({
                x: e.x, y: e.y,
                type: types[Math.floor(Math.random() * types.length)],
                vy: 2.2
              });
            }

            this.enemies.splice(i, 1);
            if (this.score > this.highScore) {
              this.highScore = this.score;
              localStorage.setItem('cyber_defender_high', this.highScore.toString());
            }
            if (this.onScoreUpdate) this.onScoreUpdate(this.score, this.highScore, this.health);
            break;
          }
        }
      }

      // Va chạm phi thuyền
      if (this.enemies[i]) {
        const pDist = Math.hypot(this.player.x - e.x, this.player.y - e.y);
        if (pDist < this.player.size + e.size * 0.75) {
          this.createExplosion(e.x, e.y, '#ef4444', 30);
          this.enemies.splice(i, 1);

          if (this.player.shield > 0) {
            this.player.shield--;
            this.addFloatingText('SHIELD BLOCKED!', this.player.x, this.player.y - 25, '#10b981');
          } else {
            this.health -= 25;
            this.addFloatingText('-25 HP', this.player.x, this.player.y - 25, '#ef4444');
            if (this.health <= 0) {
              this.health = 0;
              this.gameOver();
              return;
            }
          }
          if (this.onScoreUpdate) this.onScoreUpdate(this.score, this.highScore, this.health);
          continue;
        }

        if (e.y > this.height + 40) {
          this.enemies.splice(i, 1);
        }
      }
    }

    // Cập nhật powerup
    for (let i = this.powerups.length - 1; i >= 0; i--) {
      const p = this.powerups[i];
      p.y += p.vy;
      const dist = Math.hypot(this.player.x - p.x, this.player.y - p.y);
      if (dist < this.player.size + 16) {
        this.sound.playSuccess();
        if (p.type === 'shield') {
          this.player.shield = 2;
          this.addFloatingText('SHIELD UP!', p.x, p.y, '#10b981');
        }
        if (p.type === 'weapon') {
          this.player.weaponLevel = Math.min(3, this.player.weaponLevel + 1);
          this.addFloatingText('WEAPON UPGRADE!', p.x, p.y, '#f59e0b');
        }
        if (p.type === 'health') {
          this.health = Math.min(100, this.health + 30);
          this.addFloatingText('+30 HP', p.x, p.y, '#ec4899');
        }
        this.powerups.splice(i, 1);
        if (this.onScoreUpdate) this.onScoreUpdate(this.score, this.highScore, this.health);
        continue;
      }
      if (p.y > this.height + 20) this.powerups.splice(i, 1);
    }

    // Cập nhật shockwaves
    for (let i = this.shockwaves.length - 1; i >= 0; i--) {
      const sw = this.shockwaves[i];
      sw.r += 3.5;
      sw.alpha -= 0.05;
      if (sw.alpha <= 0) this.shockwaves.splice(i, 1);
    }

    // Cập nhật floating texts
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const ft = this.floatingTexts[i];
      ft.y += ft.vy;
      ft.alpha -= 0.025;
      if (ft.alpha <= 0) this.floatingTexts.splice(i, 1);
    }

    // Cập nhật hạt
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const pt = this.particles[i];
      pt.x += pt.vx;
      pt.y += pt.vy;
      pt.life -= pt.decay;
      if (pt.life <= 0) this.particles.splice(i, 1);
    }
  }

  draw() {
    this.ctx.save();

    // Screen Shake Offset
    if (this.shakeDuration > 0) {
      const rx = (Math.random() - 0.5) * this.shakeIntensity;
      const ry = (Math.random() - 0.5) * this.shakeIntensity;
      this.ctx.translate(rx, ry);
      this.shakeDuration--;
    }

    // Nền vũ trụ sâu thẳm
    this.ctx.fillStyle = '#050814';
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Mạng lưới sao di chuyển
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    const t = Date.now() * 0.003;
    for (let i = 0; i < 35; i++) {
      const sx = ((i * 137) % this.width);
      const sy = ((i * 353 + t * 50) % this.height);
      this.ctx.fillRect(sx, sy, 1.5, 1.5);
    }

    // Vẽ Shockwaves
    for (const sw of this.shockwaves) {
      this.ctx.strokeStyle = sw.color;
      this.ctx.globalAlpha = sw.alpha;
      this.ctx.lineWidth = 2.5;
      this.ctx.beginPath();
      this.ctx.arc(sw.x, sw.y, sw.r, 0, Math.PI * 2);
      this.ctx.stroke();
    }
    this.ctx.globalAlpha = 1.0;

    // 1. Vẽ Phi Thuyền Cyber Fighter (Đồ họa đa tầng sắc nét)
    const px = this.player.x;
    const py = this.player.y;

    this.ctx.save();
    this.ctx.translate(px, py);
    this.ctx.rotate(this.player.tilt);

    // Thân cánh ngoài (Glow metallic wings)
    this.ctx.fillStyle = '#0f172a';
    this.ctx.strokeStyle = '#06b6d4';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(0, -26);
    this.ctx.lineTo(24, 16);
    this.ctx.lineTo(12, 12);
    this.ctx.lineTo(0, 18);
    this.ctx.lineTo(-12, 12);
    this.ctx.lineTo(-24, 16);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();

    // Vỏ khoang lái chính (Cyber cockpit)
    this.ctx.fillStyle = '#0284c7';
    this.ctx.beginPath();
    this.ctx.moveTo(0, -22);
    this.ctx.lineTo(8, 6);
    this.ctx.lineTo(-8, 6);
    this.ctx.closePath();
    this.ctx.fill();

    // Kính buồng lái phát sáng neon
    this.ctx.fillStyle = '#38bdf8';
    this.ctx.shadowColor = '#38bdf8';
    this.ctx.shadowBlur = 8;
    this.ctx.beginPath();
    this.ctx.arc(0, -6, 4, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.shadowBlur = 0;

    // Khiên năng lượng lục giác nếu có
    if (this.player.shield > 0) {
      this.ctx.strokeStyle = '#10b981';
      this.ctx.lineWidth = 2;
      this.ctx.shadowColor = '#10b981';
      this.ctx.shadowBlur = 10;
      this.ctx.beginPath();
      for (let s = 0; s < 6; s++) {
        const ang = (s * Math.PI) / 3;
        const hx = Math.cos(ang) * 34;
        const hy = Math.sin(ang) * 34;
        if (s === 0) this.ctx.moveTo(hx, hy);
        else this.ctx.lineTo(hx, hy);
      }
      this.ctx.closePath();
      this.ctx.stroke();
      this.ctx.shadowBlur = 0;
    }

    this.ctx.restore();

    // 2. Vẽ Đạn Laser (Đổ bóng phát quang)
    for (const b of this.bullets) {
      this.ctx.fillStyle = b.color;
      this.ctx.shadowColor = b.glow;
      this.ctx.shadowBlur = 10;
      this.ctx.beginPath();
      this.ctx.arc(b.x, b.y, b.size, 0, Math.PI * 2);
      this.ctx.fill();
    }
    this.ctx.shadowBlur = 0;

    // 3. Vẽ Kẻ Địch Chi Tiết
    for (const e of this.enemies) {
      this.ctx.save();
      this.ctx.translate(e.x, e.y);
      this.ctx.rotate(e.rot);

      if (e.isBoss) {
        // Giga Boss Mothership
        this.ctx.fillStyle = '#881337';
        this.ctx.strokeStyle = '#f43f5e';
        this.ctx.lineWidth = 2.5;
        this.ctx.beginPath();
        this.ctx.moveTo(0, e.size);
        this.ctx.lineTo(e.size * 1.2, -e.size * 0.6);
        this.ctx.lineTo(0, -e.size * 0.2);
        this.ctx.lineTo(-e.size * 1.2, -e.size * 0.6);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();

        // Boss Core
        this.ctx.fillStyle = '#fb7185';
        this.ctx.beginPath();
        this.ctx.arc(0, 0, 8, 0, Math.PI * 2);
        this.ctx.fill();

        // Thanh máu Boss
        this.ctx.restore();
        const hpPercent = e.hp / e.maxHp;
        this.ctx.fillStyle = 'rgba(0,0,0,0.6)';
        this.ctx.fillRect(e.x - 30, e.y - e.size - 12, 60, 5);
        this.ctx.fillStyle = '#f43f5e';
        this.ctx.fillRect(e.x - 30, e.y - e.size - 12, 60 * hpPercent, 5);
        continue;
      } else if (e.type === 'drone') {
        // Crimson Stealth Drone
        this.ctx.fillStyle = '#1e1b4b';
        this.ctx.strokeStyle = '#ef4444';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(0, e.size);
        this.ctx.lineTo(e.size * 0.8, -e.size * 0.7);
        this.ctx.lineTo(-e.size * 0.8, -e.size * 0.7);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();

        // Drone Eye
        this.ctx.fillStyle = '#ef4444';
        this.ctx.beginPath();
        this.ctx.arc(0, 0, 3.5, 0, Math.PI * 2);
        this.ctx.fill();
      } else {
        // Thiên thạch tím nứt nẻ
        this.ctx.fillStyle = '#581c87';
        this.ctx.strokeStyle = '#c084fc';
        this.ctx.lineWidth = 1.5;
        this.ctx.beginPath();
        for (let a = 0; a < 7; a++) {
          const angle = (a * Math.PI * 2) / 7;
          const r = e.size * (0.8 + Math.sin(a * 3) * 0.2);
          const ex = Math.cos(angle) * r;
          const ey = Math.sin(angle) * r;
          if (a === 0) this.ctx.moveTo(ex, ey);
          else this.ctx.lineTo(ex, ey);
        }
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
      }
      this.ctx.restore();
    }

    // 4. Vẽ Powerups
    for (const p of this.powerups) {
      const col = p.type === 'shield' ? '#10b981' : (p.type === 'weapon' ? '#f59e0b' : '#ec4899');
      this.ctx.fillStyle = col;
      this.ctx.shadowColor = col;
      this.ctx.shadowBlur = 10;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, 12, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.shadowBlur = 0;

      this.ctx.fillStyle = '#ffffff';
      this.ctx.font = 'bold 11px monospace';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(p.type === 'shield' ? '🛡️' : (p.type === 'weapon' ? '⚡' : '+'), p.x, p.y + 4);
    }

    // 5. Vẽ Hạt hiệu ứng
    for (const pt of this.particles) {
      this.ctx.fillStyle = pt.color;
      this.ctx.globalAlpha = Math.max(0, pt.life);
      this.ctx.fillRect(pt.x - pt.size / 2, pt.y - pt.size / 2, pt.size, pt.size);
    }

    // 6. Vẽ Floating text điểm số
    this.ctx.font = 'bold 12px monospace';
    this.ctx.textAlign = 'center';
    for (const ft of this.floatingTexts) {
      this.ctx.fillStyle = ft.color;
      this.ctx.globalAlpha = Math.max(0, ft.alpha);
      this.ctx.fillText(ft.text, ft.x, ft.y);
    }

    this.ctx.globalAlpha = 1.0;
    this.ctx.restore();
  }

  gameOver() {
    this.isPlaying = false;
    this.createExplosion(this.player.x, this.player.y, '#ef4444', 45);
    if (this.onGameOver) this.onGameOver(this.score, this.highScore);
  }

  loop() {
    if (!this.isPlaying || this.isPaused) return;
    this.update();
    this.draw();
    requestAnimationFrame(this.loop.bind(this));
  }
}
