/* ══════════════════════════════════════════════
   SVR — JS
   ══════════════════════════════════════════════ */

/* ── 1. WOLF COLOR SHIFT ─────────────────────── */
(function wolfColorShift() {
  const wolf  = document.getElementById('wolfHero');
  const glow  = document.getElementById('wolfGlow');
  const nav   = document.getElementById('navWolf');
  const footer= document.getElementById('footerWolf');
  if (!wolf) return;

  const colors = [
    { filter: 'hue-rotate(0deg) saturate(1.2)',         glow: 'rgba(232,101,10,.18)' },   // original orange
    { filter: 'hue-rotate(60deg) saturate(1.5)',         glow: 'rgba(200,255,0,.18)' },    // lime
    { filter: 'hue-rotate(180deg) saturate(1.3)',        glow: 'rgba(0,200,255,.15)' },    // cyan
    { filter: 'hue-rotate(270deg) saturate(1.2)',        glow: 'rgba(200,0,255,.12)' },    // purple
    { filter: 'hue-rotate(0deg) saturate(0) brightness(1.8)', glow: 'rgba(255,255,255,.12)' }, // white
  ];

  let idx = 0;
  function shift() {
    idx = (idx + 1) % colors.length;
    const c = colors[idx];
    [wolf, nav, footer].forEach(el => {
      if (el) el.style.filter = c.filter;
    });
    if (glow) {
      glow.style.background = `radial-gradient(circle, ${c.glow} 0%, transparent 70%)`;
    }
  }

  setInterval(shift, 3000);
})();

/* ── 2. MOBILE MENU ──────────────────────────── */
(function mobileNav() {
  const btn  = document.getElementById('hamburger');
  const menu = document.getElementById('mobMenu');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    btn.classList.toggle('open');
    document.body.style.overflow = open ? 'hidden' : '';
  });

  menu.querySelectorAll('.mob-lnk').forEach(l => {
    l.addEventListener('click', () => {
      menu.classList.remove('open');
      btn.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
})();

/* ── 3. WORK ROW EXPAND ──────────────────────── */
(function workExpand() {
  document.querySelectorAll('.work-row').forEach(row => {
    const body = row.querySelector('.wr-body');
    if (!body) return;
    body.style.maxHeight = '0';
    body.style.opacity   = '0';
    body.style.overflow  = 'hidden';
    body.style.transition = 'max-height .5s ease, opacity .4s ease';

    row.addEventListener('mouseenter', () => {
      body.style.maxHeight = body.scrollHeight + 'px';
      body.style.opacity   = '1';
    });
    row.addEventListener('mouseleave', () => {
      body.style.maxHeight = '0';
      body.style.opacity   = '0';
    });
  });
})();

/* ── 4. SCROLL REVEAL ────────────────────────── */
(function scrollReveal() {
  const els = document.querySelectorAll(
    '.about-big, .about-detail-col, .sk-cell, .work-row, .clink, .contact-h, .stat-band, .award-strip'
  );
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity   = '1';
        e.target.style.transform = 'translateY(0)';
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.06 });

  els.forEach((el, i) => {
    el.style.opacity    = '0';
    el.style.transform  = 'translateY(28px)';
    el.style.transition = `opacity .7s ease ${(i % 6) * 0.08}s, transform .7s ease ${(i % 6) * 0.08}s`;
    io.observe(el);
  });
})();

/* ── 5. NAV ACTIVE LINK ──────────────────────── */
(function navActive() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-links a');

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        links.forEach(l => l.style.borderBottomColor = 'transparent');
        const a = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
        if (a) a.style.borderBottomColor = 'var(--black)';
      }
    });
  }, { threshold: 0.35 });

  sections.forEach(s => io.observe(s));
})();

/* ── 6. HERO TEXT STAGGER ────────────────────── */
(function heroStagger() {
  document.querySelector('.hero-sub') && (() => {
    const sub  = document.querySelector('.hero-sub');
    const lines = document.querySelectorAll('.hero-h1 br + *,.hero-h1');
    const acts  = document.querySelector('.hero-actions');

    [sub].forEach((el, i) => {
      if (!el) return;
      el.style.opacity = '0';
      el.style.transform = 'translateY(16px)';
      el.style.transition = `opacity .7s ease ${i * .15}s, transform .7s ease ${i * .15}s`;
      setTimeout(() => { el.style.opacity = '1'; el.style.transform = 'translateY(0)'; }, 100);
    });
  })();
})();
