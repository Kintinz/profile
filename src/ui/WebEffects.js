/**
 * WebEffects.js - Advanced Web Interaction & Motion Effects Suite
 * Bao gồm:
 * 1. Spotlight Glow (Linear / Vercel cursor border glow)
 * 2. Scroll Progress Laser Bar
 * 3. 3D Tilt Effect on hover
 * 4. Cyber Hacker Typewriter with matrix flicker
 * 5. Animated Number Counter-Up
 * 6. Section Scroll Reveal
 */

export class WebEffects {
  constructor() {
    this.initScrollProgress();
    this.initSpotlight();
    this.init3DTilt();
    this.initCyberTypewriter();
    this.initCounterUp();
    this.initScrollReveal();
  }

  /**
   * 1. Thanh Laser Neon đo tiến độ cuộn trang ở đỉnh màn hình
   */
  initScrollProgress() {
    let progressBar = document.getElementById('scroll-progress');
    if (!progressBar) {
      progressBar = document.createElement('div');
      progressBar.id = 'scroll-progress';
      progressBar.className = 'fixed top-0 left-0 h-[2.5px] z-50 pointer-events-none transition-all duration-75';
      progressBar.style.background = 'linear-gradient(90deg, #06b6d4, #10b981, #a855f7, #ec4899)';
      progressBar.style.boxShadow = '0 0 12px rgba(6, 182, 212, 0.8), 0 0 20px rgba(168, 85, 247, 0.4)';
      progressBar.style.width = '0%';
      document.body.appendChild(progressBar);
    }

    const updateProgress = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
    };

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  }

  /**
   * 2. Hiệu ứng Spotlight viền đèn pin theo con trỏ chuột (Linear/Raycast style)
   */
  initSpotlight() {
    document.addEventListener('pointermove', (e) => {
      const cards = document.querySelectorAll('.cyber-spotlight');
      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (
          e.clientX >= rect.left - 50 &&
          e.clientX <= rect.right + 50 &&
          e.clientY >= rect.top - 50 &&
          e.clientY <= rect.bottom + 50
        ) {
          card.style.setProperty('--mouse-x', `${x}px`);
          card.style.setProperty('--mouse-y', `${y}px`);
          card.style.setProperty('--spotlight-opacity', '1');
        } else {
          card.style.setProperty('--spotlight-opacity', '0');
        }
      });
    }, { passive: true });
  }

  /**
   * 3. Hiệu ứng nghiêng 3D (Perspective 3D Tilt) khi rê chuột vào thẻ
   */
  init3DTilt() {
    const tiltCards = document.querySelectorAll('.tilt-card');
    tiltCards.forEach((card) => {
      let bounds = null;

      const onMouseEnter = () => {
        bounds = card.getBoundingClientRect();
      };

      const onMouseMove = (e) => {
        if (!bounds) bounds = card.getBoundingClientRect();
        const mouseX = e.clientX - bounds.left;
        const mouseY = e.clientY - bounds.top;

        const xPct = mouseX / bounds.width - 0.5;
        const yPct = mouseY / bounds.height - 0.5;

        const rotateX = (-yPct * 10).toFixed(2);
        const rotateY = (xPct * 10).toFixed(2);

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.015, 1.015, 1.015)`;
        card.style.transition = 'transform 0.1s ease-out';
      };

      const onMouseLeave = () => {
        bounds = null;
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        card.style.transition = 'transform 0.5s ease-out';
      };

      card.addEventListener('mouseenter', onMouseEnter);
      card.addEventListener('mousemove', onMouseMove, { passive: true });
      card.addEventListener('mouseleave', onMouseLeave);
    });
  }

  /**
   * 4. Hiệu ứng Cyber Hacker Typewriter luân chuyển chức danh công nghệ
   */
  initCyberTypewriter() {
    const el = document.getElementById('hero-typewriter-role');
    if (!el) return;

    const phrases = [
      'ASP.NET Core & Angular Ecosystem',
      'High-Performance HRM & BPM Architect',
      'SQL Server Query & Index Optimization',
      'Realtime SignalR & Electron POS System',
      'Scalable Microservices & Clean Architecture'
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 70;

    const glitchChars = '!<>-_\\/[]{}—=+*^?#________';

    const typeLoop = () => {
      const currentPhrase = phrases[phraseIndex];

      if (isDeleting) {
        charIndex--;
        el.textContent = currentPhrase.substring(0, charIndex);
        typingSpeed = 30;
      } else {
        charIndex++;
        if (Math.random() < 0.08 && charIndex < currentPhrase.length) {
          const randChar = glitchChars[Math.floor(Math.random() * glitchChars.length)];
          el.textContent = currentPhrase.substring(0, charIndex - 1) + randChar;
        } else {
          el.textContent = currentPhrase.substring(0, charIndex);
        }
        typingSpeed = 65 + Math.random() * 35;
      }

      if (!isDeleting && charIndex === currentPhrase.length) {
        typingSpeed = 2400;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typingSpeed = 400;
      }

      setTimeout(typeLoop, typingSpeed);
    };

    setTimeout(typeLoop, 800);
  }

  /**
   * 5. Hiệu ứng đếm số tăng dần mượt mà khi cuộn tới vị trí (Animated Counter-Up)
   */
  initCounterUp() {
    const counterElements = document.querySelectorAll('.counter-val');
    if (!counterElements.length) return;

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          obs.unobserve(el);

          const target = parseFloat(el.getAttribute('data-target')) || 0;
          const prefix = el.getAttribute('data-prefix') || '';
          const suffix = el.getAttribute('data-suffix') || '';
          const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
          const duration = 1500;
          const startTime = performance.now();

          const animateCount = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            const currentVal = (target * easeProgress).toFixed(decimals);

            el.textContent = `${prefix}${currentVal}${suffix}`;

            if (progress < 1) {
              requestAnimationFrame(animateCount);
            } else {
              el.textContent = `${prefix}${target}${suffix}`;
            }
          };

          requestAnimationFrame(animateCount);
        }
      });
    }, { threshold: 0.2 });

    counterElements.forEach(el => observer.observe(el));
  }

  /**
   * 6. Hiệu ứng cuộn xuất hiện mượt mà (Scroll Reveal)
   */
  initScrollReveal() {
    const revealElements = document.querySelectorAll('.scroll-reveal');
    if (!revealElements.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach(el => observer.observe(el));
  }
}
