/**
 * NeonRunner - 3D Perspective Cyber Hovercar Endless Runner
 * Điều khiển xe bay lướt trên đường cao tốc neon 3 làn, né chướng ngại vật,
 * nhặt năng lượng Nitro và tính điểm theo quãng đường.
 */
export class NeonRunner {
  constructor(canvas, soundManager, onScoreUpdate, onGameOver) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.sound = soundManager;
    this.onScoreUpdate = onScoreUpdate;
    this.onGameOver = onGameOver;

    this.isPlaying = false;
    this.isPaused = false;
    this.score = 0;
    this.highScore = parseInt(localStorage.getItem('neon_runner_high') || '0', 10);
    this.difficulty = 'normal';
    this.baseSpeed = 8.5;
    this.nitroSpeed = 16;
    this.spawnInterval = 38;
    this.scoreMultiplier = 1.5;
    this.speed = 8.5;
    this.distance = 0;
    this.nitro = 100;

    // 3 Làn đường: -1 (trái), 0 (giữa), 1 (phải)
    this.currentLane = 0;
    this.targetLane = 0;
    this.playerX = 0;

    this.obstacles = [];
    this.orbs = [];
    this.particles = [];
    this.roadOffset = 0;

    this.initEvents();
  }

  resize() {
    this.width = this.canvas.width = this.canvas.clientWidth || 700;
    this.height = this.canvas.height = this.canvas.clientHeight || 450;
  }

  initEvents() {
    window.addEventListener('keydown', (e) => {
      if (!this.isPlaying) return;
      if (e.key === 'ArrowLeft' || e.key === 'a') this.changeLane(-1);
      if (e.key === 'ArrowRight' || e.key === 'd') this.changeLane(1);
      if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w') this.activateNitro();
    });

    this.canvas.addEventListener('click', (e) => {
      if (!this.isPlaying) return;
      const rect = this.canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      if (clickX < this.width / 2) this.changeLane(-1);
      else this.changeLane(1);
    });
  }

  changeLane(dir) {
    const nextLane = Math.max(-1, Math.min(1, this.currentLane + dir));
    if (nextLane !== this.currentLane) {
      this.sound.playClick(580);
      this.currentLane = nextLane;
    }
  }

  setDifficulty(level) {
    this.difficulty = level || 'normal';
    if (this.difficulty === 'easy') {
      this.baseSpeed = 6;
      this.nitroSpeed = 12;
      this.spawnInterval = 55;
      this.scoreMultiplier = 1.0;
    } else if (this.difficulty === 'hard') {
      this.baseSpeed = 12;
      this.nitroSpeed = 20;
      this.spawnInterval = 28;
      this.scoreMultiplier = 2.5;
    } else { // normal
      this.baseSpeed = 8.5;
      this.nitroSpeed = 16;
      this.spawnInterval = 38;
      this.scoreMultiplier = 1.5;
    }
    this.speed = this.baseSpeed;
  }

  activateNitro() {
    if (this.nitro >= 20) {
      this.sound.playLaser();
      this.nitro -= 20;
      this.speed = this.nitroSpeed || 16;
      setTimeout(() => { this.speed = this.baseSpeed || 8.5; }, 1200);
    }
  }

  start() {
    this.resize();
    this.isPlaying = true;
    this.score = 0;
    this.distance = 0;
    this.setDifficulty(this.difficulty);
    this.nitro = 100;
    this.currentLane = 0;
    this.playerX = 0;
    this.obstacles = [];
    this.orbs = [];
    this.particles = [];
    this.spawnTimer = 0;

    if (this.onScoreUpdate) this.onScoreUpdate(this.score, this.highScore, this.nitro);
    this.loop();
  }

  stop() {
    this.isPlaying = false;
  }

  spawnEntities() {
    this.spawnTimer++;
    if (this.spawnTimer % (this.spawnInterval || 38) === 0) {
      const lane = Math.floor(Math.random() * 3) - 1;
      const isOrb = Math.random() > 0.45;

      if (isOrb) {
        this.orbs.push({ lane, z: 1.0, size: 14 });
      } else {
        this.obstacles.push({ lane, z: 1.0, type: Math.random() > 0.5 ? 'barrier' : 'drone' });
      }
    }
  }

  update() {
    this.distance += this.speed * 0.1;
    this.score = Math.floor(this.distance * 10 * (this.scoreMultiplier || 1.5));
    this.nitro = Math.min(100, this.nitro + 0.1);

    if (this.score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem('neon_runner_high', this.highScore.toString());
    }

    if (this.onScoreUpdate) this.onScoreUpdate(this.score, this.highScore, Math.floor(this.nitro));

    // Smooth chuyển làn
    const targetX = this.currentLane * 140;
    this.playerX += (targetX - this.playerX) * 0.2;

    this.spawnEntities();
    this.roadOffset = (this.roadOffset + this.speed * 0.05) % 1.0;

    // Cập nhật chướng ngại vật
    for (let i = this.obstacles.length - 1; i >= 0; i--) {
      const obs = this.obstacles[i];
      obs.z -= this.speed * 0.0018;

      // Kiểm tra va chạm ở z gần người chơi (z < 0.12 và z > 0.02)
      if (obs.z < 0.14 && obs.z > 0.02) {
        if (obs.lane === this.currentLane) {
          this.sound.playExplosion();
          this.gameOver();
          return;
        }
      }

      if (obs.z <= 0) this.obstacles.splice(i, 1);
    }

    // Cập nhật ngọc năng lượng
    for (let i = this.orbs.length - 1; i >= 0; i--) {
      const orb = this.orbs[i];
      orb.z -= this.speed * 0.0018;

      if (orb.z < 0.14 && orb.z > 0.02 && orb.lane === this.currentLane) {
        this.sound.playSuccess();
        this.distance += 15;
        this.nitro = Math.min(100, this.nitro + 25);
        this.orbs.splice(i, 1);
        continue;
      }

      if (orb.z <= 0) this.orbs.splice(i, 1);
    }
  }

  draw() {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;
    const horizonY = h * 0.42;

    // Bầu trời Synthwave
    const skyGrad = ctx.createLinearGradient(0, 0, 0, horizonY);
    skyGrad.addColorStop(0, '#030712');
    skyGrad.addColorStop(1, '#3b0764');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, w, horizonY);

    // Mặt trời Neon Synthwave
    ctx.fillStyle = '#f43f5e';
    ctx.beginPath();
    ctx.arc(w / 2, horizonY - 10, 50, Math.PI, 0);
    ctx.fill();

    // Sọc ngang mặt trời
    ctx.fillStyle = '#030712';
    for (let s = 0; s < 5; s++) {
      ctx.fillRect(w / 2 - 52, horizonY - 12 - s * 8, 104, 2.5);
    }

    // Đường đua phối cảnh 3D
    const roadGrad = ctx.createLinearGradient(0, horizonY, 0, h);
    roadGrad.addColorStop(0, '#0f172a');
    roadGrad.addColorStop(1, '#020617');
    ctx.fillStyle = roadGrad;
    ctx.fillRect(0, horizonY, w, h - horizonY);

    // Lưới phối cảnh neon (Grid Lines)
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 1.5;

    // 4 Vạch chia làn chính
    const laneWidths = [-220, -70, 70, 220];
    for (const lw of laneWidths) {
      ctx.beginPath();
      ctx.moveTo(w / 2, horizonY);
      ctx.lineTo(w / 2 + lw, h);
      ctx.stroke();
    }

    // Vạch ngang đường đua
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.35)';
    for (let i = 0; i < 12; i++) {
      const p = (i / 12 + this.roadOffset) % 1.0;
      const y = horizonY + Math.pow(p, 2.5) * (h - horizonY);
      const span = 40 + Math.pow(p, 2.5) * (w * 0.8);
      ctx.beginPath();
      ctx.moveTo(w / 2 - span / 2, y);
      ctx.lineTo(w / 2 + span / 2, y);
      ctx.stroke();
    }

    // Hàm chuyển đổi z sang tọa độ màn hình
    const project = (lane, z) => {
      const p = 1.0 - z;
      const y = horizonY + Math.pow(p, 2.5) * (h - horizonY);
      const scale = Math.pow(p, 2.0);
      const laneOffset = lane * (50 + scale * 120);
      const x = w / 2 + laneOffset;
      return { x, y, scale };
    };

    // Vẽ Orbs năng lượng
    for (const orb of this.orbs) {
      const { x, y, scale } = project(orb.lane, orb.z);
      const r = Math.max(3, 16 * scale);
      ctx.fillStyle = '#38bdf8';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // Vẽ Chướng ngại vật
    for (const obs of this.obstacles) {
      const { x, y, scale } = project(obs.lane, obs.z);
      const ow = Math.max(8, 44 * scale);
      const oh = Math.max(6, 26 * scale);

      ctx.fillStyle = obs.type === 'barrier' ? '#ef4444' : '#a855f7';
      ctx.strokeStyle = '#fee2e2';
      ctx.lineWidth = 1.5;
      ctx.fillRect(x - ow / 2, y - oh, ow, oh);
      ctx.strokeRect(x - ow / 2, y - oh, ow, oh);
    }

    // Vẽ Xe Hovercar người chơi
    const carY = h - 65;
    const carX = w / 2 + this.playerX;

    // Đốm lửa phản lực
    ctx.fillStyle = this.speed > 10 ? '#f59e0b' : '#06b6d4';
    ctx.beginPath();
    ctx.moveTo(carX - 10, carY + 12);
    ctx.lineTo(carX, carY + 26 + Math.random() * 8);
    ctx.lineTo(carX + 10, carY + 12);
    ctx.closePath();
    ctx.fill();

    // Thân xe Cyber Hovercar
    ctx.fillStyle = '#0284c7';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(carX - 26, carY + 10);
    ctx.lineTo(carX - 18, carY - 14);
    ctx.lineTo(carX + 18, carY - 14);
    ctx.lineTo(carX + 26, carY + 10);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Kính chắn gió
    ctx.fillStyle = '#06b6d4';
    ctx.fillRect(carX - 12, carY - 10, 24, 8);
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

  gameOver() {
    this.isPlaying = false;
    if (this.onGameOver) this.onGameOver(this.score, this.highScore);
  }

  loop() {
    if (!this.isPlaying || this.isPaused) return;
    this.update();
    this.draw();
    requestAnimationFrame(this.loop.bind(this));
  }
}
