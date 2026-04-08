/* ══════════════════════════════════════════════
   SUUJITH VATHSAA RAMESH — PORTFOLIO JS
   ══════════════════════════════════════════════ */

gsap.registerPlugin(ScrollTrigger);

/* ── 1. LOADER ──────────────────────────────── */
(function initLoader() {
  const bar    = document.getElementById('loaderBar');
  const loader = document.getElementById('loader');
  let pct = 0;

  const tick = setInterval(() => {
    pct += Math.random() * 18;
    if (pct >= 100) {
      pct = 100;
      clearInterval(tick);
      bar.style.width = '100%';

      setTimeout(() => {
        gsap.to('#loader', {
          yPercent: -100,
          duration: 0.85,
          ease: 'power3.inOut',
          onComplete() {
            loader.style.display = 'none';
            document.body.classList.remove('is-loading');
            heroEntrance();
          }
        });
      }, 350);
    } else {
      bar.style.width = pct + '%';
    }
  }, 70);
})();

/* ── 2. CURSOR ──────────────────────────────── */
(function initCursor() {
  const dot  = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;

  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    gsap.to(dot, { x: mx, y: my, duration: 0.06, ease: 'none' });
  });

  (function lerpRing() {
    rx += (mx - rx) * 0.1;
    ry += (my - ry) * 0.1;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(lerpRing);
  })();

  document.querySelectorAll('a, button, .exp-item, .skill-block').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
  });
})();

/* ── 3. PARTICLE CANVAS ─────────────────────── */
(function initParticles() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H;
  const COUNT    = 65;
  const MAX_DIST = 130;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  class Dot {
    constructor() { this.reset(); }
    reset() {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      this.vx = (Math.random() - 0.5) * 0.35;
      this.vy = (Math.random() - 0.5) * 0.35;
      this.r  = Math.random() * 1.4 + 0.4;
      this.a  = Math.random() * 0.4 + 0.08;
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      if (this.x < 0 || this.x > W) this.vx *= -1;
      if (this.y < 0 || this.y > H) this.vy *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(232,101,10,${this.a})`;
      ctx.fill();
    }
  }

  resize();
  window.addEventListener('resize', resize);
  const dots = Array.from({ length: COUNT }, () => new Dot());

  (function loop() {
    ctx.clearRect(0, 0, W, H);
    dots.forEach(d => { d.update(); d.draw(); });

    for (let i = 0; i < dots.length; i++) {
      for (let j = i + 1; j < dots.length; j++) {
        const dx = dots[i].x - dots[j].x;
        const dy = dots[i].y - dots[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < MAX_DIST) {
          ctx.beginPath();
          ctx.moveTo(dots[i].x, dots[i].y);
          ctx.lineTo(dots[j].x, dots[j].y);
          ctx.strokeStyle = `rgba(232,101,10,${(1 - d / MAX_DIST) * 0.12})`;
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(loop);
  })();
})();

/* ── 4. HERO ENTRANCE ───────────────────────── */
function heroEntrance() {
  gsap.fromTo('#heroEyebrow',
    { opacity: 0, y: -12 },
    { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' });

  gsap.fromTo('.hn-row span',
    { y: '110%' },
    { y: '0%', duration: 1, ease: 'power3.out', stagger: 0.12, delay: 0.25 });

  gsap.fromTo('#heroRole',
    { opacity: 0 },
    { opacity: 1, duration: 0.7, delay: 0.65, ease: 'power3.out',
      onComplete: initTicker });

  gsap.fromTo('#heroTagline',
    { opacity: 0, y: 14 },
    { opacity: 1, y: 0, duration: 0.7, delay: 0.8, ease: 'power3.out' });

  gsap.fromTo('#heroCta',
    { opacity: 0, y: 14 },
    { opacity: 1, y: 0, duration: 0.7, delay: 0.95, ease: 'power3.out' });

  gsap.fromTo('#heroStats',
    { opacity: 0 },
    { opacity: 1, duration: 0.7, delay: 1.1, ease: 'power3.out' });

  gsap.fromTo('#scrollCue',
    { opacity: 0 },
    { opacity: 1, duration: 0.7, delay: 1.3, ease: 'power3.out' });
}

/* ── 5. ROLE TICKER ─────────────────────────── */
function initTicker() {
  const items = document.querySelectorAll('.role-item');
  if (!items.length) return;
  let cur = 0;

  // Show first
  gsap.set(items[0], { opacity: 1, y: 0 });

  setInterval(() => {
    // Exit current
    gsap.to(items[cur], { opacity: 0, y: -14, duration: 0.4, ease: 'power2.in' });
    cur = (cur + 1) % items.length;
    // Enter next
    gsap.fromTo(items[cur],
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out', delay: 0.15 });
  }, 3200);
}

/* ── 6. COUNTERS ────────────────────────────── */
function animateCount(el) {
  const target = parseInt(el.dataset.target, 10);
  const start  = performance.now();
  const dur    = 1400;

  (function step(now) {
    const p = Math.min((now - start) / dur, 1);
    el.textContent = Math.floor((1 - Math.pow(1 - p, 3)) * target);
    if (p < 1) requestAnimationFrame(step);
    else el.textContent = target;
  })(start);
}

document.querySelectorAll('.js-count').forEach(el => {
  let fired = false;
  ScrollTrigger.create({
    trigger: el,
    start: 'top 88%',
    onEnter() {
      if (!fired) { fired = true; animateCount(el); }
    }
  });
});

/* ── 7. SCROLL REVEALS ──────────────────────── */
gsap.utils.toArray('.js-reveal').forEach(el => {
  gsap.fromTo(el,
    { opacity: 0, y: 38 },
    {
      opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 86%', toggleActions: 'play none none none' }
    }
  );
});

/* ── 8. NAV SCROLL ──────────────────────────── */
(function initNav() {
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
})();

/* ── 9. MOBILE NAV ──────────────────────────── */
(function initMobileNav() {
  const toggle = document.getElementById('navToggle');
  const mob    = document.getElementById('mobNav');

  toggle.addEventListener('click', () => {
    const open = mob.classList.toggle('open');
    toggle.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  mob.querySelectorAll('.mob-lnk').forEach(lnk => {
    lnk.addEventListener('click', () => {
      mob.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
})();
