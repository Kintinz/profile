import { useEffect, useRef } from "react";
import gsap from "gsap";
import * as THREE from "three";

type Theme = "dark" | "light";

type BackdropSceneProps = {
  theme: Theme;
};

type Rig = {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  galaxyGroup: THREE.Group;
  sunGroup: THREE.Group;
  galaxyCloud: THREE.Points;
  halo: THREE.Points;
  core: THREE.Points;
  outerGlow: THREE.Sprite;
  warmGlow: THREE.Sprite;
  starField: THREE.Group;
  nebulaGroup: THREE.Group;
  sunCore: THREE.Sprite;
  sunCorona: THREE.Sprite;
  sunHalo: THREE.Sprite;
  sunRayGroup: THREE.Group;
  starSprites: THREE.Sprite[];
  nebulaSprites: THREE.Sprite[];
  sunSparkles: THREE.Sprite[];
  sunRays: THREE.Mesh[];
  rayGeometry: THREE.BufferGeometry;
  textures: THREE.Texture[];
  background: THREE.Color;
};

type TransitionState = {
  value: number;
};

const DARK_BG = new THREE.Color(0x04050d);
const LIGHT_BG = new THREE.Color(0xf8eedf);
const SUN_PATH_DURATION = 52;

const PALETTES: Record<
  Theme,
  {
    core: THREE.ColorRepresentation;
    dust: THREE.ColorRepresentation;
    sunCore: THREE.ColorRepresentation;
    sunCorona: THREE.ColorRepresentation;
    sunRays: THREE.ColorRepresentation;
    star: THREE.ColorRepresentation;
  }
> = {
  dark: {
    core: 0xfff4d8,
    dust: 0x4a2b77,
    sunCore: 0xfff4d8,
    sunCorona: 0xffc86a,
    sunRays: 0xffb149,
    star: 0xffffff,
  },
  light: {
    core: 0xfff0c4,
    dust: 0xc9a66b,
    sunCore: 0xfff8df,
    sunCorona: 0xffcb67,
    sunRays: 0xffa521,
    star: 0xffffff,
  },
};

const lerp = THREE.MathUtils.lerp;

export function BackdropScene({ theme }: BackdropSceneProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const rigRef = useRef<Rig | null>(null);
  const themeRef = useRef<Theme>(theme);
  const transitionRef = useRef<TransitionState>({
    value: theme === "light" ? 1 : 0,
  });
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    const mount = mountRef.current;

    if (!mount) {
      return;
    }

    const initialMix = theme === "light" ? 1 : 0;
    themeRef.current = theme;
    transitionRef.current.value = initialMix;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 4000);
    camera.position.z = 780;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const background = new THREE.Color()
      .copy(DARK_BG)
      .lerp(LIGHT_BG, initialMix);
    scene.background = background;

    const palette = PALETTES[theme];

    const galaxyGroup = new THREE.Group();
    const sunGroup = new THREE.Group();
    const starField = new THREE.Group();
    const nebulaGroup = new THREE.Group();
    scene.add(galaxyGroup);
    scene.add(sunGroup);
    scene.add(starField);
    scene.add(nebulaGroup);

    const createSprite = (stops: Array<[number, string]>, size = 128) => {
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const context = canvas.getContext("2d");

      if (!context) {
        return new THREE.Texture();
      }

      const gradient = context.createRadialGradient(
        size / 2,
        size / 2,
        0,
        size / 2,
        size / 2,
        size / 2,
      );

      stops.forEach(([offset, color]) => gradient.addColorStop(offset, color));
      context.fillStyle = gradient;
      context.fillRect(0, 0, size, size);

      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;
      return texture;
    };

    const createRayTexture = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 256;
      canvas.height = 64;
      const context = canvas.getContext("2d");

      if (!context) {
        return new THREE.Texture();
      }

      const gradient = context.createLinearGradient(0, 0, 256, 0);
      gradient.addColorStop(0, "rgba(255,255,255,0)");
      gradient.addColorStop(0.42, "rgba(255,255,255,0.12)");
      gradient.addColorStop(0.5, "rgba(255,246,216,0.95)");
      gradient.addColorStop(0.58, "rgba(255,255,255,0.14)");
      gradient.addColorStop(1, "rgba(255,255,255,0)");

      context.fillStyle = gradient;
      context.fillRect(0, 0, 256, 64);

      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;
      return texture;
    };

    const starTexture = createSprite([
      [0, "rgba(255,255,255,1)"],
      [0.18, "rgba(255,255,255,0.96)"],
      [0.36, "rgba(255,244,214,0.8)"],
      [0.7, "rgba(255,244,214,0.2)"],
      [1, "rgba(255,244,214,0)"],
    ]);

    const coreTexture = createSprite(
      [
        [0, "rgba(255,255,255,1)"],
        [0.18, "rgba(255,248,228,0.98)"],
        [0.36, "rgba(255,220,140,0.85)"],
        [0.62, "rgba(203,169,255,0.38)"],
        [1, "rgba(203,169,255,0)"],
      ],
      256,
    );

    const dustTexture = createSprite([
      [0, "rgba(255,255,255,0.48)"],
      [0.2, "rgba(147,197,253,0.18)"],
      [0.55, "rgba(139,92,246,0.12)"],
      [1, "rgba(139,92,246,0)"],
    ]);

    const buildGalaxyCloud = () => {
      const particleCount = 5400;
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);
      const sizes = new Float32Array(particleCount);
      const color = new THREE.Color();
      const armColors = [palette.core, 0xb59cff, 0x83d8ff, 0xffffff];

      for (let index = 0; index < particleCount; index += 1) {
        const armIndex = index % armColors.length;
        const armAngle = (armIndex / armColors.length) * Math.PI * 2;
        const radiusSeed = Math.pow(Math.random(), 0.48);
        const radius = 620 * radiusSeed;
        const twist = radius * 0.013 + armIndex * 0.1;
        const jitter = (1 - radiusSeed) * 120;
        const angle = armAngle + twist + (Math.random() - 0.5) * 0.65;
        const height =
          (Math.random() - 0.5) * 100 * (1 - radiusSeed) +
          Math.sin(radius * 0.012) * 18;

        positions[index * 3] =
          Math.cos(angle) * radius + (Math.random() - 0.5) * jitter;
        positions[index * 3 + 1] =
          Math.sin(angle) * radius * 0.42 +
          (Math.random() - 0.5) * jitter * 0.5;
        positions[index * 3 + 2] = height;

        color.set(armColors[armIndex]);
        const brightness = 0.48 + (1 - radiusSeed) * 0.82;
        colors[index * 3] = color.r * brightness;
        colors[index * 3 + 1] = color.g * brightness;
        colors[index * 3 + 2] = color.b * brightness;
        sizes[index] = 6 + (1 - radiusSeed) * 20 + Math.random() * 8;
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3),
      );
      geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
      geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

      const material = new THREE.PointsMaterial({
        size: 10,
        map: starTexture,
        transparent: true,
        opacity: 0.9,
        vertexColors: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
      });

      return new THREE.Points(geometry, material);
    };

    const buildDustHalo = () => {
      const count = 1800;
      const positions = new Float32Array(count * 3);
      const colors = new Float32Array(count * 3);
      const sizes = new Float32Array(count);
      const color = new THREE.Color(palette.dust);

      for (let index = 0; index < count; index += 1) {
        const radiusSeed = 220 + Math.random() * 700;
        const angle = Math.random() * Math.PI * 2;
        const spread = 140 + Math.random() * 120;

        positions[index * 3] =
          Math.cos(angle) * radiusSeed + (Math.random() - 0.5) * spread;
        positions[index * 3 + 1] =
          Math.sin(angle) * radiusSeed * 0.46 +
          (Math.random() - 0.5) * spread * 0.35;
        positions[index * 3 + 2] = (Math.random() - 0.5) * 250;

        const fade = 0.1 + Math.random() * 0.32;
        colors[index * 3] = color.r * fade;
        colors[index * 3 + 1] = color.g * fade;
        colors[index * 3 + 2] = color.b * fade;
        sizes[index] = 12 + Math.random() * 24;
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3),
      );
      geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
      geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

      const material = new THREE.PointsMaterial({
        size: 18,
        map: dustTexture,
        transparent: true,
        opacity: 0.48,
        vertexColors: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
      });

      return new THREE.Points(geometry, material);
    };

    const starSprites: THREE.Sprite[] = [];
    for (let index = 0; index < 320; index += 1) {
      const star = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: starTexture,
          color: palette.star,
          transparent: true,
          opacity: 0.4 + Math.random() * 0.6,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        }),
      );
      const spread = 1800;
      star.position.set(
        (Math.random() - 0.5) * spread,
        (Math.random() - 0.5) * spread * 0.58,
        -120 - Math.random() * 600,
      );
      const size = 10 + Math.random() * 26;
      star.scale.set(size, size, 1);
      starField.add(star);
      starSprites.push(star);
    }

    const nebulaSprites: THREE.Sprite[] = [];
    [
      { x: -500, y: -120, size: 420, color: "rgba(110,75,255,0.24)" },
      { x: 420, y: -180, size: 360, color: "rgba(92,165,255,0.16)" },
      { x: -120, y: 260, size: 260, color: "rgba(251,191,36,0.09)" },
      { x: 640, y: 180, size: 380, color: "rgba(203,153,255,0.14)" },
    ].forEach(({ x, y, size, color: glowColor }) => {
      const sprite = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: createSprite(
            [
              [0, glowColor],
              [0.36, glowColor],
              [1, "rgba(0,0,0,0)"],
            ],
            256,
          ),
          transparent: true,
          opacity: 0.85,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        }),
      );
      sprite.position.set(x, y, -120);
      sprite.scale.set(size, size, 1);
      nebulaGroup.add(sprite);
      nebulaSprites.push(sprite);
    });

    const galaxyCloud = buildGalaxyCloud();
    const halo = buildDustHalo();
    galaxyGroup.add(galaxyCloud);
    galaxyGroup.add(halo);

    const coreGeometry = new THREE.BufferGeometry();
    coreGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(
        [0, 0, 0, 24, 12, 0, -18, -12, 0, 10, -22, 0],
        3,
      ),
    );

    const coreMaterial = new THREE.PointsMaterial({
      size: 64,
      map: coreTexture,
      transparent: true,
      opacity: 1,
      color: palette.core,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });

    const core = new THREE.Points(coreGeometry, coreMaterial);
    galaxyGroup.add(core);

    const outerGlow = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: createSprite(
          [
            [0, "rgba(255,255,255,0.5)"],
            [0.2, "rgba(255,231,180,0.42)"],
            [0.45, "rgba(168,85,247,0.18)"],
            [1, "rgba(168,85,247,0)"],
          ],
          256,
        ),
        color: palette.core,
        transparent: true,
        opacity: 0.75,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    );
    outerGlow.scale.set(800, 800, 1);
    galaxyGroup.add(outerGlow);

    const warmGlow = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: createSprite(
          [
            [0, "rgba(255,255,255,0.6)"],
            [0.18, "rgba(255,205,92,0.4)"],
            [0.46, "rgba(255,145,0,0.14)"],
            [1, "rgba(255,145,0,0)"],
          ],
          256,
        ),
        color: palette.core,
        transparent: true,
        opacity: 0.72,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    );
    warmGlow.scale.set(520, 520, 1);
    warmGlow.position.set(120, -30, 0);
    galaxyGroup.add(warmGlow);

    const sunTextures = {
      core: createSprite(
        [
          [0, "rgba(255,255,255,1)"],
          [0.16, "rgba(255,252,235,0.98)"],
          [0.34, "rgba(255,224,150,0.92)"],
          [0.58, "rgba(255,171,59,0.64)"],
          [1, "rgba(255,171,59,0)"],
        ],
        320,
      ),
      corona: createSprite(
        [
          [0, "rgba(255,255,255,0.74)"],
          [0.18, "rgba(255,236,184,0.56)"],
          [0.38, "rgba(255,201,92,0.42)"],
          [0.64, "rgba(255,140,0,0.22)"],
          [1, "rgba(255,140,0,0)"],
        ],
        512,
      ),
      glow: createSprite(
        [
          [0, "rgba(255,255,255,0.36)"],
          [0.22, "rgba(255,236,183,0.32)"],
          [0.48, "rgba(255,201,92,0.18)"],
          [1, "rgba(255,201,92,0)"],
        ],
        512,
      ),
      ray: createRayTexture(),
    };

    const sunCore = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: sunTextures.core,
        color: palette.sunCore,
        transparent: true,
        opacity: 1,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    );
    sunGroup.add(sunCore);

    const sunCorona = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: sunTextures.corona,
        color: palette.sunCorona,
        transparent: true,
        opacity: 0.92,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    );
    sunGroup.add(sunCorona);

    const sunHalo = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: sunTextures.glow,
        color: palette.sunCorona,
        transparent: true,
        opacity: 0.75,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    );
    sunGroup.add(sunHalo);

    const sunRayGroup = new THREE.Group();
    const sunRays: THREE.Mesh[] = [];
    const rayGeometry = new THREE.PlaneGeometry(560, 52);
    for (let index = 0; index < 10; index += 1) {
      const ray = new THREE.Mesh(
        rayGeometry,
        new THREE.MeshBasicMaterial({
          map: sunTextures.ray,
          color: palette.sunRays,
          transparent: true,
          opacity: 0.1,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        }),
      );
      ray.rotation.z = (index / 10) * Math.PI;
      ray.scale.set(1, 0.6 + (index % 2) * 0.12, 1);
      sunRayGroup.add(ray);
      sunRays.push(ray);
    }
    const crossRay = new THREE.Mesh(
      new THREE.PlaneGeometry(640, 96),
      new THREE.MeshBasicMaterial({
        map: sunTextures.ray,
        color: palette.sunCore,
        transparent: true,
        opacity: 0.12,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    );
    sunRayGroup.add(crossRay);
    sunRays.push(crossRay);
    sunGroup.add(sunRayGroup);

    const sunSparkles: THREE.Sprite[] = [];
    for (let index = 0; index < 24; index += 1) {
      const sparkle = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: starTexture,
          color: index % 3 === 0 ? palette.sunCore : palette.star,
          transparent: true,
          opacity: 0.2,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        }),
      );
      const angle = (index / 24) * Math.PI * 2;
      const radius = 280 + Math.random() * 140;
      sparkle.position.set(
        Math.cos(angle) * radius,
        Math.sin(angle) * radius * 0.72,
        0,
      );
      const size = 8 + Math.random() * 14;
      sparkle.scale.set(size, size, 1);
      sunGroup.add(sparkle);
      sunSparkles.push(sparkle);
    }

    const rig: Rig = {
      scene,
      camera,
      renderer,
      galaxyGroup,
      sunGroup,
      galaxyCloud,
      halo,
      core,
      outerGlow,
      warmGlow,
      starField,
      nebulaGroup,
      sunCore,
      sunCorona,
      sunHalo,
      sunRayGroup,
      starSprites,
      nebulaSprites,
      sunSparkles,
      sunRays,
      rayGeometry,
      textures: [
        starTexture,
        coreTexture,
        dustTexture,
        sunTextures.core,
        sunTextures.corona,
        sunTextures.glow,
        sunTextures.ray,
      ],
      background,
    };
    rigRef.current = rig;

    const resize = () => {
      const width = mount.clientWidth || window.innerWidth;
      const height = mount.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const applyFrame = (mix: number) => {
      const targetIsLight = themeRef.current === "light";
      const sweepFront = targetIsLight
        ? lerp(2.2, -2.2, mix)
        : lerp(-2.2, 2.2, 1 - mix);
      const revealAt = (xValue: number) =>
        smoothstep(xValue, sweepFront - 0.34, sweepFront + 0.34);
      background.copy(DARK_BG).lerp(LIGHT_BG, mix);
      scene.background = background;

      galaxyGroup.position.set(lerp(0, 8, mix), lerp(0, 12, mix), 0);
      galaxyGroup.scale.setScalar(lerp(1.04, 0.94, mix));
      const galaxyAlpha = 1 - revealAt(0);
      galaxyGroup.visible = galaxyAlpha > 0.01;
      galaxyCloud.material.opacity = 0.92 * galaxyAlpha;
      halo.material.opacity = 0.48 * galaxyAlpha;
      core.material.opacity = 1 * galaxyAlpha;
      outerGlow.material.opacity = 0.75 * galaxyAlpha;
      warmGlow.material.opacity = 0.72 * galaxyAlpha;

      starSprites.forEach((sprite, index) => {
        const base = 0.38 + (index % 7) * 0.05;
        const spriteReveal = revealAt(sprite.position.x / 1100);
        sprite.material.opacity = base * (1 - spriteReveal) * 0.95;
      });

      nebulaSprites.forEach((sprite, index) => {
        const base = 0.62 + (index % 3) * 0.08;
        const spriteReveal = revealAt(sprite.position.x / 1100);
        sprite.material.opacity = base * (1 - spriteReveal) * 0.88;
      });

      starField.visible = galaxyAlpha > 0.002;
      nebulaGroup.visible = galaxyAlpha > 0.002;

      sunGroup.position.set(lerp(620, 560, mix), lerp(-260, -44, mix), 0);
      sunGroup.scale.setScalar(lerp(0.72, 1, mix));
      const sunReveal = revealAt(sunGroup.position.x / 1100);
      sunCore.material.opacity = sunReveal;
      sunCorona.material.opacity = 0.92 * sunReveal;
      sunHalo.material.opacity = 0.72 * sunReveal;
      sunRays.forEach((ray, index) => {
        const base = index === sunRays.length - 1 ? 0.12 : 0.14 + index * 0.02;
        (ray.material as THREE.Material & { opacity: number }).opacity =
          sunReveal * base;
      });
      sunSparkles.forEach((sparkle, index) => {
        const base = 0.12 + (index % 4) * 0.04;
        sparkle.material.opacity = sunReveal * base;
      });

      sunGroup.visible = sunReveal > 0.01;
    };

    applyFrame(initialMix);
    resize();
    window.addEventListener("resize", resize);

    let frame = 0;
    let pointerX = 0;
    let pointerY = 0;
    let animationFrameId = 0;

    const handlePointerMove = (event: PointerEvent) => {
      pointerX = (event.clientX / window.innerWidth) * 2 - 1;
      pointerY = (event.clientY / window.innerHeight) * 2 - 1;
    };

    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });

    const animate = () => {
      const mix = transitionRef.current.value;
      frame += 0.003;
      applyFrame(mix);

      galaxyGroup.rotation.z = 0.08 + frame * 0.14;
      galaxyGroup.rotation.x =
        Math.sin(frame * 0.6) * (0.03 * (1 - mix * 0.35));
      halo.rotation.z = -frame * 0.08;
      starField.rotation.z = -frame * 0.018;
      nebulaGroup.rotation.z = frame * 0.01;
      sunGroup.rotation.z = -0.16 + Math.sin(frame * 0.5) * 0.015;
      sunRayGroup.rotation.z = Math.PI * 0.08 + frame * 0.18;

      const sunPulse = 1 + Math.sin(frame * 2.2) * 0.02;
      sunCore.scale.setScalar((220 + 120 * mix) * sunPulse);
      sunCorona.scale.setScalar(
        (520 + 260 * mix) * (1 + Math.sin(frame * 1.7) * 0.012),
      );
      sunHalo.scale.setScalar(
        (860 + 320 * mix) * (1 + Math.sin(frame * 1.3) * 0.01),
      );

      const galaxyOffsetX = pointerX * 18;
      const galaxyOffsetY = -pointerY * 10;
      galaxyGroup.position.x = lerp(
        galaxyGroup.position.x,
        lerp(0, 8, mix) + galaxyOffsetX,
        0.08,
      );
      galaxyGroup.position.y = lerp(
        galaxyGroup.position.y,
        lerp(0, 12, mix) + galaxyOffsetY,
        0.08,
      );

      const sunPathProgress = (frame / SUN_PATH_DURATION) % 1;
      const sunDriftX = lerp(240, -260, sunPathProgress);
      const sunDriftY = lerp(-220, 160, sunPathProgress);
      const sunOffsetX = pointerX * 16;
      const sunOffsetY = -pointerY * 12;
      sunGroup.position.x = lerp(
        sunGroup.position.x,
        lerp(620, 560, mix) + sunDriftX + sunOffsetX,
        0.08,
      );
      sunGroup.position.y = lerp(
        sunGroup.position.y,
        lerp(-260, -44, mix) + sunDriftY + sunOffsetY,
        0.08,
      );

      renderer.render(scene, camera);

      if (!reduceMotion.matches) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    if (reduceMotion.matches) {
      renderer.render(scene, camera);
    } else {
      animationFrameId = requestAnimationFrame(animate);
    }

    const onMotionChange = () => {
      if (reduceMotion.matches) {
        cancelAnimationFrame(animationFrameId);
        renderer.render(scene, camera);
      } else {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    reduceMotion.addEventListener("change", onMotionChange);

    return () => {
      cancelAnimationFrame(animationFrameId);
      tweenRef.current?.kill();
      reduceMotion.removeEventListener("change", onMotionChange);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handlePointerMove);
      geometryDispose(galaxyCloud.geometry);
      geometryDispose(halo.geometry);
      geometryDispose(core.geometry);
      geometryDispose(rayGeometry);
      starSprites.forEach((sprite) => sprite.material.dispose());
      nebulaSprites.forEach((sprite) => sprite.material.dispose());
      sunSparkles.forEach((sprite) => sprite.material.dispose());
      rig.sunRays.forEach((ray) => {
        (ray.material as THREE.Material).dispose();
      });
      galaxyCloud.material.dispose();
      halo.material.dispose();
      core.material.dispose();
      outerGlow.material.dispose();
      warmGlow.material.dispose();
      sunCore.material.dispose();
      sunCorona.material.dispose();
      sunHalo.material.dispose();
      sunRayGroup.children.forEach((child) => {
        if (child instanceof THREE.Mesh) {
          child.material.dispose();
        }
      });
      texturesDispose(rig.textures);
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  useEffect(() => {
    const rig = rigRef.current;

    if (!rig) {
      return;
    }

    themeRef.current = theme;

    const target = theme === "light" ? 1 : 0;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    tweenRef.current?.kill();

    if (reduceMotion) {
      transitionRef.current.value = target;
      return;
    }

    tweenRef.current = gsap.to(transitionRef.current, {
      value: target,
      duration: 1.75,
      ease: "power3.inOut",
      onUpdate: () => {
        // The animation loop reads this value each frame.
        rig.renderer.render(rig.scene, rig.camera);
      },
    });
  }, [theme]);

  return <div ref={mountRef} className="cosmic-backdrop" aria-hidden="true" />;
}

function geometryDispose(geometry: THREE.BufferGeometry) {
  geometry.dispose();
}

function texturesDispose(textures: THREE.Texture[]) {
  textures.forEach((texture) => texture.dispose());
}

function smoothstep(value: number, min: number, max: number) {
  if (min === max) {
    return value >= max ? 1 : 0;
  }

  const clamped = THREE.MathUtils.clamp((value - min) / (max - min), 0, 1);
  return clamped * clamped * (3 - 2 * clamped);
}
