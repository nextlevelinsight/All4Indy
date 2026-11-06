(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const ease = t => t * t * (3 - 2 * t);

  // Fictional sample shelf. Clearly labelled as samples on the page.
  const books = [
    { t: 'The Salt Orchard', a: 'Marisol Vane', c: '#2E4A3F', ink: '#F1E9D8', url: 'marisolvane.example', art: 'circle' },
    { t: 'Night Bus to Lisbon', a: 'T. K. Adeyemi', c: '#B9482A', ink: '#FFF7EC', url: 'tkadeyemi.example', art: 'tri' },
    { t: 'A Small Weather', a: 'Ines Okafor', c: '#D9A441', ink: '#1F1A16', url: 'inesokafor.example', art: 'lines' },
    { t: 'The Quiet Cartographer', a: 'Jun Hollis', c: '#3C4F76', ink: '#F4EDE0', url: 'junhollis.example', art: 'circle' },
    { t: 'Recipes for Staying', a: 'Dalia Brandt', c: '#C98A8A', ink: '#2A1A1A', url: 'daliabrandt.example', art: 'lines' },
    { t: 'Paper Lanterns', a: 'Rowan Pike', c: '#6F7F63', ink: '#F8F3E6', url: 'rowanpike.example', art: 'tri' },
    { t: 'Long Way Round', a: 'Ottilie Grey', c: '#1F2E27', ink: '#F1E9D8', url: 'ottiliegrey.example', art: 'circle' },
    { t: 'Everything Is Borrowed', a: 'Samir Castellan', c: '#8B5E3C', ink: '#FBF1DF', url: 'samircastellan.example', art: 'lines' }
  ];
  const art = {
    circle: '<svg class="art" viewBox="0 0 40 40"><circle cx="20" cy="20" r="16" fill="none" stroke="currentColor" stroke-width="3"/><circle cx="20" cy="20" r="6" fill="currentColor"/></svg>',
    tri: '<svg class="art" viewBox="0 0 40 40"><path d="M20 5 L36 34 H4 Z" fill="none" stroke="currentColor" stroke-width="3"/></svg>',
    lines: '<svg class="art" viewBox="0 0 40 40"><path d="M4 10 H36 M4 20 H36 M4 30 H24" stroke="currentColor" stroke-width="3" fill="none"/></svg>'
  };

  const track = document.getElementById('track');
  books.forEach((b, i) => {
    const el = document.createElement('button');
    el.className = 'book';
    el.type = 'button';
    el.style.setProperty('--c', b.c);
    el.style.setProperty('--c-ink', b.ink);
    el.style.marginBottom = (i % 2 ? 18 : 0) + 'px';
    el.setAttribute('aria-label', `${b.t} by ${b.a}. Opens a slip, then the author's own page.`);
    el.innerHTML = `${art[b.art]}<span class="t">${b.t}</span><span class="a">${b.a}</span>`;
    el.addEventListener('click', () => openSlip(b, el));
    track.appendChild(el);
  });

  // Hero shelf books
  const palette = ['#2E4A3F', '#B9482A', '#D9A441', '#3C4F76', '#C98A8A', '#6F7F63', '#8B5E3C', '#1F2E27', '#E0B96B'];
  document.querySelectorAll('.shelf-row').forEach((row, r) => {
    let n = 0;
    while (n < 40) {
      const i = document.createElement('i');
      i.style.height = (62 + ((n * 37 + r * 17) % 38)) + '%';
      i.style.width = (18 + ((n * 13 + r * 7) % 18)) + 'px';
      i.style.background = palette[(n * 5 + r * 3) % palette.length];
      row.appendChild(i);
      n++;
    }
  });

  // Hero parallax: pointer + scroll
  const layers = [...document.querySelectorAll('.hero .layer')];
  let px = 0, py = 0, tx = 0, ty = 0;
  if (!reduce) addEventListener('pointermove', e => { tx = e.clientX / innerWidth - .5; ty = e.clientY / innerHeight - .5; });

  // Section progress
  const rooms = [...document.querySelectorAll('[data-room]')];
  const lines = [...document.querySelectorAll('[data-line]')];
  const steps = [...document.querySelectorAll('.step')];
  const nodes = [...document.querySelectorAll('.node')];
  const main = document.getElementById('main'), back = document.getElementById('back');
  const mainLen = main.getTotalLength(), backLen = back.getTotalLength();
  main.style.setProperty('--len', mainLen); back.style.setProperty('--len', backLen);
  const tilt = document.getElementById('tilt');
  const progress = el => {
    const r = el.getBoundingClientRect();
    return clamp(-r.top / Math.max(1, r.height - innerHeight));
  };

  function frame() {
    px += (tx - px) * .08; py += (ty - py) * .08;
    const y = scrollY;
    layers.forEach(l => {
      const d = +l.dataset.depth;
      const x = reduce ? 0 : -px * 40 * d;
      const yy = reduce ? 0 : -py * 20 * d - y * .12 * d;
      l.style.transform = `translate3d(${x}px,${yy}px,0)`;
    });

    // idea: lines cross-fade in sequence
    const pi = progress(document.getElementById('idea'));
    lines.forEach((l, i) => {
      const seg = 1 / lines.length, s = i * seg, t = clamp((pi - s) / seg);
      const inn = ease(clamp(t * 3)), out = i === lines.length - 1 ? 0 : ease(clamp((t - .75) * 4));
      l.style.opacity = reduce ? (i === lines.length - 1 ? 1 : 0) : clamp(inn - out);
      l.style.transform = `translateY(${(1 - inn) * 22 - 50}%)`;
    });

    // shelf: lateral pan
    const ps = progress(document.getElementById('shelf'));
    const max = Math.max(0, track.scrollWidth - innerWidth + 80);
    track.style.transform = `translate3d(${-ps * max}px,0,0)`;

    // money: draw line, light nodes, swap steps
    const pm = progress(document.getElementById('money'));
    main.style.strokeDashoffset = mainLen * (1 - clamp(pm * 2.2 - .1));
    back.style.strokeDashoffset = backLen * (1 - clamp((pm - .6) * 3));
    const idx = Math.min(3, Math.floor(pm * 4));
    steps.forEach((s, i) => { s.style.opacity = i === idx ? 1 : 0; s.style.transform = `translateY(${i === idx ? 0 : 18}px)`; });
    nodes.forEach((n, i) => n.classList.toggle('on', i <= idx));

    // authors: circular reveal
    const pa = progress(document.getElementById('authors'));
    document.querySelector('.reveal-panel').style.setProperty('--r', (reduce ? 150 : ease(clamp(pa * 1.8)) * 150) + '%');

    // close: pointer tilt
    if (!reduce) tilt.style.setProperty('--ry', (-14 + px * 40) + 'deg'), tilt.style.setProperty('--rx', (4 - py * 30) + 'deg');
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  // Library slip: the signature move
  const wrap = document.getElementById('slipWrap');
  const go = wrap.querySelector('.slip-go');
  let opener = null;
  function openSlip(b, el) {
    opener = el;
    wrap.querySelector('#slipTitle').textContent = b.t;
    wrap.querySelector('.slip-by').textContent = 'by ' + b.a;
    wrap.querySelector('.slip-url').textContent = b.url;
    go.href = 'https://' + b.url; // fictional sample domains; real listings link to the author's own site
    wrap.hidden = false;
    go.focus();
  }
  function closeSlip() { wrap.hidden = true; if (opener) opener.focus(); }
  wrap.querySelector('.slip-close').addEventListener('click', closeSlip);
  wrap.addEventListener('click', e => { if (e.target === wrap) closeSlip(); });
  addEventListener('keydown', e => { if (e.key === 'Escape' && !wrap.hidden) closeSlip(); });
})();
