/* ╔══════════════════════════════════════════════════════════════════╗
   ║   DÜNYAMIZ — Enhancement Layer                              ║
   ║   Aurora particles · Theme toggle · GSAP motion · 3D tilt    ║
   ║   Does NOT touch app logic (script.js). Design only.         ║
   ╚══════════════════════════════════════════════════════════════════╝ */
(function () {
  'use strict';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(hover: none)').matches;
  const root = document.documentElement;

  /* ═══════════════════════════════════════════════════════════════
     1. THEME TOGGLE (light / dark, persisted)
     ═════════════════════════════════════════════════════════════ */
  const THEME_KEY = 'dunyam-theme';
  const themeBtn = document.getElementById('themeToggle');

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    if (themeBtn) {
      const icon = themeBtn.querySelector('i');
      if (icon) {
        icon.className = theme === 'light' ? 'fas fa-sun' : 'fas fa-moon';
      }
    }
  }

  (function initTheme() {
    let saved = null;
    try { saved = localStorage.getItem(THEME_KEY); } catch (e) {}
    const theme = saved || 'dark';
    applyTheme(theme);
  })();

  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      applyTheme(next);
      try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
      if (window.gsap && !prefersReduced) {
        gsap.fromTo(themeBtn, { scale: 0.8, rotate: -30 }, { scale: 1, rotate: 0, duration: 0.5, ease: 'back.out(2)' });
      }
    });
  }

  /* ═══════════════════════════════════════════════════════════════
     2. AURORA PARTICLE FIELD (Canvas 2D)
     ═════════════════════════════════════════════════════════════ */
  const canvas = document.getElementById('aurora-canvas');
  if (canvas && !prefersReduced) {
    const ctx = canvas.getContext('2d');
    let W = 0, H = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
    let particles = [];
    const pointer = { x: -9999, y: -9999, active: false };

    const PALETTE = ['255,77,141', '255,110,199', '181,108,255', '123,92,255', '255,158,199'];

    function sizeCanvas() {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = W + 'px';
      canvas.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function makeParticles() {
      const area = W * H;
      let count = Math.round(area / 22000);
      count = Math.max(28, Math.min(isTouch ? 46 : 96, count));
      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * W,
          y: Math.random() * H,
          r: Math.random() * 2.2 + 0.6,
          vx: (Math.random() - 0.5) * 0.25,
          vy: -(Math.random() * 0.35 + 0.1),
          a: Math.random() * 0.5 + 0.25,
          tw: Math.random() * Math.PI * 2,
          color: PALETTE[(Math.random() * PALETTE.length) | 0]
        });
      }
    }

    function step() {
      ctx.clearRect(0, 0, W, H);
      for (let p of particles) {
        // pointer repulsion
        if (pointer.active) {
          const dx = p.x - pointer.x;
          const dy = p.y - pointer.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 15000) {
            const f = (15000 - d2) / 15000;
            const d = Math.sqrt(d2) || 1;
            p.x += (dx / d) * f * 1.6;
            p.y += (dy / d) * f * 1.6;
          }
        }
        p.x += p.vx;
        p.y += p.vy;
        p.tw += 0.02;
        if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W; }
        if (p.x < -10) p.x = W + 10;
        if (p.x > W + 10) p.x = -10;

        const flick = 0.6 + Math.sin(p.tw) * 0.4;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + p.color + ',' + (p.a * flick).toFixed(3) + ')';
        ctx.shadowBlur = 8;
        ctx.shadowColor = 'rgba(' + p.color + ',0.8)';
        ctx.fill();
      }
      ctx.shadowBlur = 0;
      raf = requestAnimationFrame(step);
    }

    let raf;
    sizeCanvas();
    makeParticles();
    step();

    window.addEventListener('resize', function () {
      sizeCanvas();
      makeParticles();
    });

    if (!isTouch) {
      window.addEventListener('pointermove', function (e) {
        pointer.x = e.clientX; pointer.y = e.clientY; pointer.active = true;
      });
      window.addEventListener('pointerleave', function () { pointer.active = false; });
    }

    // Pause when tab hidden (perf)
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) { cancelAnimationFrame(raf); }
      else { raf = requestAnimationFrame(step); }
    });
  }

  /* ═══════════════════════════════════════════════════════════════
     3. GSAP — SECTION TRANSITION STAGGER
     ═════════════════════════════════════════════════════════════ */
  const canGSAP = !!window.gsap && !prefersReduced;
  if (canGSAP) {
    gsap.registerPlugin(ScrollTrigger);
  }

  function animateSection(section) {
    if (!section || !canGSAP) return;
    const items = section.querySelectorAll(
      '.stagger-item, .stat-card, .gallery-item, .music-track-item, .letter-card-item, .surprise-card, .counter-item'
    );
    if (!items.length) return;
    gsap.fromTo(
      items,
      { opacity: 0, y: 26, scale: 0.96 },
      { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'power3.out', stagger: 0.05, clearProps: 'transform,opacity' }
    );
  }

  // Hook into navigation (buttons present in DOM)
  function watchNav(btn) {
    if (!btn) return;
    btn.addEventListener('click', function () {
      setTimeout(function () {
        const active = document.querySelector('.page-section.active');
        animateSection(active);
      }, 60);
    });
  }
  document.querySelectorAll('.nav-item').forEach(watchNav);
  ['surpriseButton', 'backFromSurprises'].forEach(function (id) {
    watchNav(document.getElementById(id));
  });

  // Animate home on first reveal
  window.addEventListener('load', function () {
    setTimeout(function () {
      animateSection(document.querySelector('.page-section.active'));
    }, 400);
  });

  /* ═══════════════════════════════════════════════════════════════
     4. 3D TILT (gallery + surprise cards, incl. dynamic)
     ═════════════════════════════════════════════════════════════ */
  if (!isTouch && !prefersReduced) {
    let lastTilt = null;
    document.addEventListener('pointermove', function (e) {
      const t = e.target;
      const el = t && t.closest ? t.closest('.gallery-item, .surprise-card') : null;
      if (el !== lastTilt) {
        if (lastTilt) lastTilt.style.transform = '';
        lastTilt = el;
      }
      if (el) {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform =
          'perspective(900px) rotateY(' + (px * 9).toFixed(2) + 'deg) rotateX(' + (-py * 9).toFixed(2) + 'deg) translateY(-4px)';
      }
    });
    document.addEventListener('pointerleave', function () {
      if (lastTilt) { lastTilt.style.transform = ''; lastTilt = null; }
    });
  }

  /* ═══════════════════════════════════════════════════════════════
     5. HERO HEART BURST
     ═════════════════════════════════════════════════════════════ */
  const heroHeart = document.getElementById('heroHeart');
  if (heroHeart && canGSAP) {
    heroHeart.addEventListener('click', function () {
      gsap.fromTo(heroHeart, { scale: 1 }, { scale: 1.35, duration: 0.3, yoyo: true, repeat: 1, ease: 'power2.out' });
    });
  }
})();
