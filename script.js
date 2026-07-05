/* ══════════════════════════════════════════════
   SVR — JS (dark / Kanit redesign)
   ══════════════════════════════════════════════ */

/* ── 1. SCROLL REVEAL ─────────────────────────── */
(function scrollReveal() {
  const els = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in-view');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });
  els.forEach((el, i) => {
    el.style.transitionDelay = `${(i % 6) * 0.08}s`;
    io.observe(el);
  });
})();

/* ── 4. MARQUEE — build rows + scroll-driven shift ── */
(function marquee() {
  const row1 = document.getElementById('marqueeRow1');
  const row2 = document.getElementById('marqueeRow2');
  if (!row1 || !row2) return;

  const set1 = [
    ['Power BI', 'Dashboards'], ['Azure Databricks', 'Data Engineering'],
    ['Microsoft Fabric', 'Lakehouse'], ['Oracle SQL', 'Databases'],
    ['Python', 'Pandas · scikit-learn'], ['PySpark', 'Big Data'],
    ['DAX', 'Modelling'], ['IFS WISE', 'AI Scheduling'],
    ['Power Automate', 'Workflows'], ['REST APIs', 'Integration'],
    ['n8n', 'Automation'],
  ];
  const set2 = [
    ['SQL', 'Querying'], ['VBA', 'Automation'],
    ['Workday', 'HR Systems'], ['SAP Fieldglass', 'HR Systems'],
    ['Cognos', 'Reporting'], ['Excel', 'Modelling'],
    ['JIRA', 'Agile'], ['Copilot', 'AI Assist'],
    ['Azure', 'Cloud'], ['Power Query', 'M Syntax'],
  ];

  function fill(track, items) {
    const tripled = [...items, ...items, ...items];
    track.innerHTML = tripled.map(([name, tag]) => `
      <div class="marquee-tile">
        <strong>${name}</strong>
        <small>${tag}</small>
      </div>
    `).join('');
  }
  fill(row1, set1);
  fill(row2, set2);

  const section = document.querySelector('.marquee-section');
  let ticking = false;

  function update() {
    const rect = section.getBoundingClientRect();
    const sectionTop = rect.top + window.scrollY;
    const offset = (window.scrollY - sectionTop + window.innerHeight) * 0.3;
    row1.style.transform = `translateX(${offset - 200}px)`;
    row2.style.transform = `translateX(${-(offset - 200)}px)`;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });

  update();
})();

/* ── 5. ABOUT TEXT — character reveal on scroll ── */
(function aboutTextReveal() {
  const p = document.getElementById('aboutText');
  if (!p) return;

  const text = p.textContent;
  p.textContent = '';
  const chars = [...text].map(ch => {
    const span = document.createElement('span');
    span.textContent = ch === ' ' ? ' ' : ch;
    p.appendChild(span);
    return span;
  });

  let ticking = false;
  function update() {
    const rect = p.getBoundingClientRect();
    const start = window.innerHeight * 0.85;
    const end = window.innerHeight * 0.35;
    const progress = Math.min(1, Math.max(0, (start - rect.top) / (start - end)));
    const total = chars.length;
    chars.forEach((span, i) => {
      const charProgress = Math.min(1, Math.max(0, (progress * total - i) ));
      span.style.opacity = (0.2 + charProgress * 0.8).toFixed(2);
    });
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });

  update();
})();

/* ── 5b. SPATIAL TILT — build cards follow the cursor ── */
(function spatialTilt() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.matchMedia('(hover: none)').matches) return; // skip on touch
  const cards = document.querySelectorAll('.build-card');
  const MAX = 7; // degrees

  cards.forEach(card => {
    card.addEventListener('pointermove', e => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform =
        `translateY(-6px) rotateX(${(-py * MAX).toFixed(2)}deg) rotateY(${(px * MAX).toFixed(2)}deg) scale(1.02)`;
    });
    card.addEventListener('pointerleave', () => {
      card.style.transform = '';
    });
  });
})();

/* ── 6. STICKY PROJECT CARDS — scale on stack ──── */
(function projectCards() {
  const cards = document.querySelectorAll('.project-card');
  if (!cards.length) return;

  let ticking = false;
  function update() {
    cards.forEach((card, i) => {
      const next = cards[i + 1];
      if (!next) return;
      const cardRect = card.getBoundingClientRect();
      const nextRect = next.getBoundingClientRect();
      const overlap = Math.max(0, cardRect.bottom - nextRect.top);
      const progress = Math.min(1, overlap / cardRect.height);
      const scale = 1 - progress * 0.05;
      card.style.transform = `scale(${scale})`;
    });
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });

  update();
})();
