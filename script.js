/* ==========================================================================
   Mohammed Numaan Ali — Portfolio
   script.js  ·  Vanilla JavaScript (ES6+)
   ========================================================================== */

(() => {
  'use strict';

  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* -------------------------------------------------------------------------
     1. Loading Screen
  ------------------------------------------------------------------------- */
  window.addEventListener('load', () => {
    const loader = $('#loader');
    if (!loader) return;
    setTimeout(() => {
      loader.classList.add('is-hidden');
      setTimeout(() => loader.remove(), 900);
    }, 600);
  });

  /* -------------------------------------------------------------------------
     2. Year
  ------------------------------------------------------------------------- */
  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();

  /* -------------------------------------------------------------------------
     3. Custom Cursor
  ------------------------------------------------------------------------- */
  const cursor = $('#cursor');
  const cursorDot = $('#cursorDot');
  if (cursor && cursorDot && matchMedia('(hover:hover)').matches) {
    let mx = 0, my = 0, cx = 0, cy = 0;
    window.addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; cursorDot.style.transform = `translate(${mx}px, ${my}px) translate(-50%,-50%)`; });
    const raf = () => {
      cx += (mx - cx) * 0.18; cy += (my - cy) * 0.18;
      cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%,-50%)`;
      requestAnimationFrame(raf);
    };
    raf();
    const hovers = 'a, button, .pill, .chip-btn, .project, .cert, input, textarea, [data-preview]';
    document.addEventListener('mouseover', (e) => { if (e.target.closest(hovers)) cursor.classList.add('is-hover'); });
    document.addEventListener('mouseout',  (e) => { if (e.target.closest(hovers)) cursor.classList.remove('is-hover'); });
    document.addEventListener('mouseleave', () => { cursor.style.opacity = 0; cursorDot.style.opacity = 0; });
    document.addEventListener('mouseenter', () => { cursor.style.opacity = 1; cursorDot.style.opacity = 1; });
  }

  /* -------------------------------------------------------------------------
     4. Mouse Glow
  ------------------------------------------------------------------------- */
  const glow = $('#mouseGlow');
  if (glow && !prefersReduced) {
    window.addEventListener('mousemove', (e) => {
      glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
    });
  }

  /* -------------------------------------------------------------------------
     5. Navigation — scroll effect, mobile toggle, active link
  ------------------------------------------------------------------------- */
  const nav = $('#nav');
  const toggle = $('#navToggle');
  const menu = $('#navMenu');

  const onScroll = () => {
    nav?.classList.toggle('is-scrolled', window.scrollY > 30);
    $('#toTop')?.classList.toggle('is-visible', window.scrollY > 500);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  toggle?.addEventListener('click', () => {
    const open = menu.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  menu?.addEventListener('click', (e) => {
    if (e.target.matches('.nav__link')) {
      menu.classList.remove('is-open');
      toggle?.setAttribute('aria-expanded', 'false');
    }
  });

  // Active section highlighting
  const sections = $$('main section[id]');
  const links = $$('.nav__link');
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          links.forEach((l) => l.classList.toggle('is-active', l.getAttribute('href') === `#${id}`));
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    sections.forEach((s) => obs.observe(s));
  }

  // Back to top
  $('#toTop')?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* -------------------------------------------------------------------------
     6. Typing animation
  ------------------------------------------------------------------------- */
  const typed = $('#typed');
  if (typed) {
    const words = ['learn.', 'reason.', 'automate.', 'delight.', 'ship.'];
    let wi = 0, ci = 0, deleting = false;
    const tick = () => {
      const w = words[wi];
      typed.textContent = deleting ? w.slice(0, --ci) : w.slice(0, ++ci);
      let delay = deleting ? 45 : 90;
      if (!deleting && ci === w.length) { delay = 1500; deleting = true; }
      else if (deleting && ci === 0) { deleting = false; wi = (wi + 1) % words.length; delay = 300; }
      setTimeout(tick, delay);
    };
    tick();
  }

  /* -------------------------------------------------------------------------
     7. Reveal on scroll
  ------------------------------------------------------------------------- */
  const reveals = $$('.reveal');
  if ('IntersectionObserver' in window && !prefersReduced) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); obs.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    reveals.forEach((el) => obs.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('is-in'));
  }

  /* -------------------------------------------------------------------------
     8. Counter animation
  ------------------------------------------------------------------------- */
  const counters = $$('[data-counter]');
  const runCounter = (el) => {
    const end = parseInt(el.dataset.counter, 10);
    const dur = 1600;
    const start = performance.now();
    const step = (t) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.floor(end * eased).toString();
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = end.toString();
    };
    requestAnimationFrame(step);
  };
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { runCounter(e.target); obs.unobserve(e.target); } });
    }, { threshold: 0.5 });
    counters.forEach((el) => obs.observe(el));
  } else counters.forEach(runCounter);

  /* -------------------------------------------------------------------------
     9. Skill bars & rings
  ------------------------------------------------------------------------- */
  const skillBars = $$('.skill');
  const ringEls = $$('.ring');

  if ('IntersectionObserver' in window) {
    const barObs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          const level = parseInt(e.target.dataset.level, 10);
          const bar = $('.skill__bar span', e.target);
          if (bar) bar.style.width = level + '%';
          barObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.3 });
    skillBars.forEach((el) => barObs.observe(el));

    const RADIUS = 52;
    const CIRC = 2 * Math.PI * RADIUS; // ~326.7
    const ringObs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          const val = parseInt(e.target.dataset.value, 10);
          const fill = $('.ring__fill', e.target);
          if (fill) {
            fill.style.strokeDasharray = CIRC;
            fill.style.strokeDashoffset = CIRC - (CIRC * val) / 100;
            // Provide a gradient stroke via SVG
            fill.setAttribute('stroke', 'url(#ringGrad)');
          }
          ringObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.3 });
    ringEls.forEach((el) => ringObs.observe(el));

    // Inject a shared gradient defs (once)
    if (!document.getElementById('ringGradDefs')) {
      const svgNS = 'http://www.w3.org/2000/svg';
      const svg = document.createElementNS(svgNS, 'svg');
      svg.setAttribute('id', 'ringGradDefs');
      svg.setAttribute('width', '0'); svg.setAttribute('height', '0');
      svg.style.position = 'absolute';
      svg.innerHTML = `<defs><linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#3B82F6"/>
        <stop offset=".55" stop-color="#8B5CF6"/>
        <stop offset="1" stop-color="#06B6D4"/>
      </linearGradient></defs>`;
      document.body.appendChild(svg);
    }
  }

  /* -------------------------------------------------------------------------
     10. Project tilt effect
  ------------------------------------------------------------------------- */
  if (!prefersReduced && matchMedia('(hover:hover)').matches) {
    $$('.tilt').forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.setProperty('--tiltX', `${x * 8}deg`);
        card.style.setProperty('--tiltY', `${-y * 8}deg`);
      });
      card.addEventListener('mouseleave', () => {
        card.style.setProperty('--tiltX', `0deg`);
        card.style.setProperty('--tiltY', `0deg`);
      });
    });
  }

  /* -------------------------------------------------------------------------
     11. Magnetic buttons
  ------------------------------------------------------------------------- */
  if (!prefersReduced && matchMedia('(hover:hover)').matches) {
    $$('.magnetic').forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        btn.style.transform = `translate(${x * 0.2}px, ${y * 0.3}px)`;
      });
      btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
    });
  }

  /* -------------------------------------------------------------------------
     12. Certificates: search + filter
  ------------------------------------------------------------------------- */
  const certSearch = $('#certSearch');
  const filterBtns = $$('#certFilters .chip-btn');
  const certs = $$('#certsGrid .cert');
  let activeFilter = 'all';
  let query = '';

  const applyFilter = () => {
    certs.forEach((c) => {
      const okOrg = activeFilter === 'all' || c.dataset.org === activeFilter;
      const okQ = !query || c.dataset.name.toLowerCase().includes(query);
      c.classList.toggle('is-hidden', !(okOrg && okQ));
    });
  };
  filterBtns.forEach((b) => b.addEventListener('click', () => {
    filterBtns.forEach((x) => { x.classList.remove('is-active'); x.setAttribute('aria-selected', 'false'); });
    b.classList.add('is-active'); b.setAttribute('aria-selected', 'true');
    activeFilter = b.dataset.filter;
    applyFilter();
  }));
  certSearch?.addEventListener('input', (e) => { query = e.target.value.trim().toLowerCase(); applyFilter(); });

  /* -------------------------------------------------------------------------
     13. Certificate Modal
  ------------------------------------------------------------------------- */
  const modal = $('#certModal');
  const openModal = (title, org) => {
    if (!modal) return;
    $('#certModalTitle').textContent = title;
    $('#certModalOrg').textContent = org;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
  };
  const closeModal = () => { if (!modal) return; modal.hidden = true; document.body.style.overflow = ''; };

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-preview]');
    if (btn) {
      const card = btn.closest('.cert');
      openModal(card.dataset.name || 'Certificate', card.querySelector('.cert__meta')?.textContent || '');
    }
    if (e.target.matches('[data-close]')) closeModal();
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

  /* -------------------------------------------------------------------------
     14. Contact form (client-side)
  ------------------------------------------------------------------------- */
  const form = $('#contactForm');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    const note = $('#contactNote');
    if (!data.name || !data.email || !data.message) { note.textContent = 'Please fill in name, email, and message.'; note.style.color = '#f87171'; return; }
    note.style.color = '';
    // Open user's mail client with a pre-filled message
    const subject = encodeURIComponent(data.subject || `Portfolio message from ${data.name}`);
    const body = encodeURIComponent(`${data.message}\n\n— ${data.name} (${data.email})`);
    window.location.href = `mailto:numaan.ali.mustafa143@gmail.com?subject=${subject}&body=${body}`;
    note.textContent = 'Opening your email client…';
    form.reset();
  });

  /* -------------------------------------------------------------------------
     15. Particles background
  ------------------------------------------------------------------------- */
  const canvas = $('#particles');
  if (canvas && !prefersReduced) {
    const ctx = canvas.getContext('2d');
    let W, H, particles = [];
    const COLORS = ['#3B82F6', '#06B6D4', '#8B5CF6', '#14F195'];
    const DENSITY = 0.00008;

    const resize = () => {
      W = canvas.width = innerWidth * devicePixelRatio;
      H = canvas.height = innerHeight * devicePixelRatio;
      canvas.style.width = innerWidth + 'px';
      canvas.style.height = innerHeight + 'px';
      const count = Math.min(120, Math.floor(innerWidth * innerHeight * DENSITY));
      particles = new Array(count).fill(0).map(() => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.35 * devicePixelRatio,
        vy: (Math.random() - 0.5) * 0.35 * devicePixelRatio,
        r: (Math.random() * 1.6 + 0.4) * devicePixelRatio,
        c: COLORS[Math.floor(Math.random() * COLORS.length)]
      }));
    };
    resize();
    window.addEventListener('resize', resize);

    const LINK_DIST = 130 * devicePixelRatio;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
        ctx.beginPath();
        ctx.fillStyle = p.c;
        ctx.globalAlpha = 0.7;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x, dy = p.y - q.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < LINK_DIST * LINK_DIST) {
            const a = 1 - Math.sqrt(d2) / LINK_DIST;
            ctx.strokeStyle = p.c;
            ctx.globalAlpha = a * 0.15;
            ctx.lineWidth = devicePixelRatio * 0.6;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;
      requestAnimationFrame(draw);
    };
    draw();
  }
})();
