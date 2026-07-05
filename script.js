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

/* ── 5a. CAPABILITY RADAR — pure-SVG animated chart ── */
(function radarChart() {
  const svg = document.getElementById('radarChart');
  if (!svg) return;
  const NS = 'http://www.w3.org/2000/svg';
  const CX = 210, CY = 210, R = 150;
  const data = [
    { label: 'DATA ENG',   value: 0.95, color: '#F26A1B' },
    { label: 'POWER BI',   value: 0.92, color: '#B600A8' },
    { label: 'AI / AUTO',  value: 0.86, color: '#7621B0' },
    { label: 'SQL / DB',   value: 0.90, color: '#2FD4C6' },
    { label: 'CLOUD',      value: 0.80, color: '#BBCCD7' },
    { label: 'PYTHON',     value: 0.83, color: '#F2B01B' },
  ];
  const n = data.length;
  const angle = i => (-Math.PI / 2) + (i * 2 * Math.PI / n);
  const pt = (i, r) => [CX + Math.cos(angle(i)) * r, CY + Math.sin(angle(i)) * r];
  const el = (name, attrs, cls) => {
    const e = document.createElementNS(NS, name);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (cls) e.setAttribute('class', cls);
    return e;
  };

  // gradient fill
  const defs = el('defs', {});
  defs.innerHTML = `<radialGradient id="radarFill" cx="50%" cy="50%" r="50%">
    <stop offset="0%" stop-color="rgba(242,106,27,0.45)"/>
    <stop offset="100%" stop-color="rgba(182,0,168,0.12)"/></radialGradient>`;
  svg.appendChild(defs);

  // concentric grid rings (4)
  for (let ring = 1; ring <= 4; ring++) {
    const r = (R * ring) / 4;
    const pts = data.map((_, i) => pt(i, r).join(',')).join(' ');
    svg.appendChild(el('polygon', { points: pts }, 'r-grid'));
  }
  // spokes + labels
  data.forEach((d, i) => {
    const [x, y] = pt(i, R);
    svg.appendChild(el('line', { x1: CX, y1: CY, x2: x, y2: y }, 'r-axis'));
    const [lx, ly] = pt(i, R + 24);
    const t = el('text', { x: lx, y: ly, 'text-anchor': lx < CX - 5 ? 'end' : lx > CX + 5 ? 'start' : 'middle', 'dominant-baseline': 'middle' }, 'r-label');
    t.textContent = d.label;
    svg.appendChild(t);
  });

  // data polygon (animated) + dots
  const area = el('polygon', { points: data.map(() => `${CX},${CY}`).join(' ') }, 'r-area');
  svg.appendChild(area);
  const dots = data.map(() => { const c = el('circle', { r: 4, cx: CX, cy: CY }, 'r-dot'); svg.appendChild(c); return c; });

  // legend
  const legend = document.getElementById('radarLegend');
  if (legend) legend.innerHTML = data.map(d =>
    `<li><span class="dot" style="background:${d.color};color:${d.color}"></span>${d.label}<span class="val">${Math.round(d.value*100)}</span></li>`
  ).join('');

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function render(p) {
    const pts = data.map((d, i) => pt(i, R * d.value * p));
    area.setAttribute('points', pts.map(a => a.join(',')).join(' '));
    dots.forEach((c, i) => { c.setAttribute('cx', pts[i][0]); c.setAttribute('cy', pts[i][1]); });
  }
  function animate() {
    if (reduce) { render(1); return; }
    const dur = 1100, t0 = performance.now();
    (function step(now) {
      const p = Math.min(1, (now - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 3); // expo-ish ease-out
      render(eased);
      if (p < 1) requestAnimationFrame(step);
    })(performance.now());
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { animate(); io.disconnect(); } });
  }, { threshold: 0.4 });
  io.observe(svg);
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

/* ── 5c. AMBIENT AUDIO — generated pad + audio-reactive morph ── */
(function ambientAudio() {
  const btn = document.getElementById('soundToggle');
  if (!btn) return;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) { btn.style.display = 'none'; return; }

  let ctx, master, analyser, lfo, filter, voices = [], bellTimer, rafId, playing = false, data;
  const CHORD = [110, 164.81, 220, 277.18]; // A2 E3 A3 C#4 — warm suspended pad
  const root = document.documentElement;

  function build() {
    ctx = new AC();
    master = ctx.createGain(); master.gain.value = 0;
    filter = ctx.createBiquadFilter(); filter.type = 'lowpass';
    filter.frequency.value = 700; filter.Q.value = 6;
    analyser = ctx.createAnalyser(); analyser.fftSize = 256;
    data = new Uint8Array(analyser.frequencyBinCount);

    filter.connect(master); master.connect(analyser); analyser.connect(ctx.destination);

    // slow filter-sweep LFO → gives the pad movement
    lfo = ctx.createOscillator(); const lfoGain = ctx.createGain();
    lfo.frequency.value = 0.06; lfoGain.gain.value = 380;
    lfo.connect(lfoGain); lfoGain.connect(filter.frequency); lfo.start();

    // detuned oscillator pad
    voices = CHORD.map((f, i) => {
      const o = ctx.createOscillator(); o.type = i % 2 ? 'sine' : 'triangle';
      o.frequency.value = f; o.detune.value = (i - 1.5) * 6;
      const g = ctx.createGain(); g.gain.value = 0.16 / CHORD.length;
      o.connect(g); g.connect(filter); o.start();
      return o;
    });
    scheduleBell();
  }

  // occasional soft bell for life
  function scheduleBell() {
    bellTimer = setTimeout(() => {
      if (playing) {
        const notes = [523.25, 659.25, 783.99, 987.77];
        const f = notes[Math.floor(Math.random() * notes.length)];
        const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = f;
        const g = ctx.createGain(); g.gain.value = 0;
        o.connect(g); g.connect(filter);
        const t = ctx.currentTime;
        g.gain.linearRampToValueAtTime(0.05, t + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 2.4);
        o.start(t); o.stop(t + 2.5);
      }
      scheduleBell();
    }, 3500 + Math.random() * 4000);
  }

  // drive --amp on the aurora from live amplitude
  function reactLoop() {
    analyser.getByteFrequencyData(data);
    let sum = 0; for (let i = 0; i < data.length; i++) sum += data[i];
    const avg = sum / data.length / 255;            // 0..1
    const amp = (1 + avg * 0.35).toFixed(3);         // 1 .. ~1.35
    root.style.setProperty('--amp', amp);
    rafId = requestAnimationFrame(reactLoop);
  }

  async function start() {
    if (!ctx) build();
    await ctx.resume();
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.linearRampToValueAtTime(0.9, ctx.currentTime + 1.4);
    reactLoop();
    playing = true;
    btn.classList.add('playing'); btn.setAttribute('aria-pressed', 'true');
    btn.setAttribute('aria-label', 'Mute ambient sound');
  }
  function stop() {
    playing = false;
    if (master) master.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.6);
    cancelAnimationFrame(rafId);
    root.style.setProperty('--amp', '1');
    btn.classList.remove('playing'); btn.setAttribute('aria-pressed', 'false');
    btn.setAttribute('aria-label', 'Play ambient sound');
  }
  btn.addEventListener('click', () => { playing ? stop() : start(); });
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
