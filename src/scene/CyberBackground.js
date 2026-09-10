import * as THREE from 'three';

export class CyberBackground {
  constructor(container) {
    this.container = container;
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.init();
  }

  init() {
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x050814, 0.025);

    const width = window.innerWidth;
    const height = window.innerHeight;

    this.camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    this.camera.position.z = 24;

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.container.appendChild(this.renderer.domElement);

    this.createGrid();
    this.createParticles();
    this.createHoloCore();

    window.addEventListener('resize', this.onResize.bind(this));
    window.addEventListener('pointermove', this.onMouseMove.bind(this));

    this.animate();
  }

  createGrid() {
    // Lưới Cyber Grid màu xanh Cyan neon ở phía dưới
    const gridHelper = new THREE.GridHelper(80, 40, 0x06b6d4, 0x1e293b);
    gridHelper.position.y = -10;
    gridHelper.position.z = -10;
    this.scene.add(gridHelper);
    this.grid = gridHelper;
  }

  createParticles() {
    const particleCount = 1200;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const colorChoices = [
      new THREE.Color(0x06b6d4), // Cyan
      new THREE.Color(0xa855f7), // Purple
      new THREE.Color(0x3b82f6), // Blue
      new THREE.Color(0x10b981)  // Emerald
    ];

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 60;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 40;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 40;

      const col = colorChoices[Math.floor(Math.random() * colorChoices.length)];
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Particle texture canvas
    const canvas = document.createElement('canvas');
    canvas.width = 32; canvas.height = 32;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.4, 'rgba(6,182,212,0.8)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 32, 32);

    const texture = new THREE.CanvasTexture(canvas);

    const material = new THREE.PointsMaterial({
      size: 0.65,
      map: texture,
      transparent: true,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }

  createHoloCore() {
    this.holoGroup = new THREE.Group();

    // Vòng lõi năng lượng phát sáng
    const knotGeo = new THREE.TorusKnotGeometry(2.8, 0.45, 100, 16);
    const knotMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      wireframe: true,
      transparent: true,
      opacity: 0.55
    });
    this.knot = new THREE.Mesh(knotGeo, knotMat);
    this.holoGroup.add(this.knot);

    // Vòng ngoài bảo vệ
    const ringGeo = new THREE.RingGeometry(4.2, 4.4, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xa855f7,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.4
    });
    this.ring = new THREE.Mesh(ringGeo, ringMat);
    this.holoGroup.add(this.ring);

    this.holoGroup.position.set(9, 2, 0);
    this.scene.add(this.holoGroup);
  }

  onMouseMove(e) {
    this.mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
    this.mouse.targetY = -(e.clientY / window.innerHeight - 0.5) * 2;
  }

  onResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));

    // Smooth camera mouse parallax
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;

    this.camera.position.x = this.mouse.x * 2.5;
    this.camera.position.y = this.mouse.y * 1.8;
    this.camera.lookAt(0, 0, 0);

    // Xoay particles và holo core
    if (this.particles) {
      this.particles.rotation.y += 0.0008;
      this.particles.rotation.x += 0.0004;
    }

    if (this.holoGroup) {
      this.knot.rotation.x += 0.008;
      this.knot.rotation.y += 0.012;
      this.ring.rotation.z -= 0.005;
    }

    // Grid lướt nhẹ
    if (this.grid) {
      this.grid.position.z = ((Date.now() * 0.004) % 2) - 10;
    }

    this.renderer.render(this.scene, this.camera);
  }
}
