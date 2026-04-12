/* ══════════════════════════════════════════════
   SVR PORTFOLIO — JS
   ══════════════════════════════════════════════ */

/* ── 1. NAV SCROLL BEHAVIOUR ────────────────── */
(function () {
  const nav = document.querySelector('.nav');
  window.addEventListener('scroll', () => {
    nav.style.borderBottomWidth = window.scrollY > 10 ? '2px' : '2px';
  }, { passive: true });
})();

/* ── 2. MOBILE MENU ─────────────────────────── */
(function () {
  const btn  = document.getElementById('hamburger');
  const menu = document.getElementById('mobMenu');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    btn.classList.toggle('open');
    document.body.style.overflow = open ? 'hidden' : '';
  });

  menu.querySelectorAll('.mob-lnk').forEach(lnk => {
    lnk.addEventListener('click', () => {
      menu.classList.remove('open');
      btn.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
})();

/* ── 3. SCROLL REVEAL ───────────────────────── */
(function () {
  const targets = document.querySelectorAll(
    '.work-item, .skill-col, .about-statement, .about-side, .contact-left, .contact-right, .stat-row, .award-card, .edu-mini'
  );

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity    = '1';
        e.target.style.transform  = 'translateY(0)';
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });

  targets.forEach(el => {
    el.style.opacity    = '0';
    el.style.transform  = 'translateY(28px)';
    el.style.transition = 'opacity .6s ease, transform .6s ease';
    io.observe(el);
  });
})();

/* ── 4. HERO H1 LINE STAGGER ────────────────── */
(function () {
  const lines = document.querySelectorAll('.h1-line');
  lines.forEach((line, i) => {
    line.style.opacity   = '0';
    line.style.transform = 'translateY(24px)';
    line.style.transition = `opacity .7s ease ${i * 0.12}s, transform .7s ease ${i * 0.12}s`;
    setTimeout(() => {
      line.style.opacity   = '1';
      line.style.transform = 'translateY(0)';
    }, 80 + i * 120);
  });
})();

/* ── 5. WORK ITEM — expand on hover ─────────── */
(function () {
  document.querySelectorAll('.work-item').forEach(item => {
    const body = item.querySelector('.work-body');
    if (!body) return;
    body.style.maxHeight = '0';
    body.style.overflow  = 'hidden';
    body.style.transition = 'max-height .4s ease';

    item.addEventListener('mouseenter', () => {
      body.style.maxHeight = body.scrollHeight + 'px';
    });
    item.addEventListener('mouseleave', () => {
      body.style.maxHeight = '0';
    });
  });
})();

/* ── 6. ACTIVE NAV HIGHLIGHT ────────────────── */
(function () {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-center a');

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        links.forEach(l => l.style.borderBottomColor = 'transparent');
        const active = document.querySelector(`.nav-center a[href="#${e.target.id}"]`);
        if (active) active.style.borderBottomColor = 'var(--black)';
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => io.observe(s));
})();
