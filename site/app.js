(() => {
  let calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const ease = t => t * t * (3 - 2 * t);
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  // Fictional sample ebooks. Labelled as samples on the page.
  const books = [
    { t: 'The Salt Orchard', a: 'Marisol Vane', c: '#1F3D36', c2: '#E8B04C', ci: '#F6EFDD', k: 'k1', p: '$6.99' },
    { t: 'Night Bus to Lisbon', a: 'T. K. Adeyemi', c: '#B8431F', c2: '#F4D6A0', ci: '#FFF4E4', k: 'k2', p: '$4.99' },
    { t: 'A Small Weather', a: 'Ines Okafor', c: '#E9C46A', c2: '#2A3D66', ci: '#1A1A2E', k: 'k3', p: '$5.99' },
    { t: 'The Quiet Cartographer', a: 'Jun Hollis', c: '#2B3A67', c2: '#F2B5A0', ci: '#F7F1E3', k: 'k4', p: '$7.99' },
    { t: 'Recipes for Staying', a: 'Dalia Brandt', c: '#D98C8C', c2: '#FBE9D0', ci: '#3A1717', k: 'k5', p: '$3.99' },
    { t: 'Paper Lanterns', a: 'Rowan Pike', c: '#5E7355', c2: '#F3E3B4', ci: '#FAF4E4', k: 'k6', p: '$5.49' },
    { t: 'Long Way Round', a: 'Ottilie Grey', c: '#16192F', c2: '#7C6FD0', ci: '#EDE9FA', k: 'k1', p: '$6.49' },
    { t: 'Everything Is Borrowed', a: 'Samir Castellan', c: '#7A4B2B', c2: '#E6C9A0', ci: '#FBF1DF', k: 'k3', p: '$4.49' }
  ];
  const coverHTML = b => `<span class="cv ${b.k}" style="--c:${b.c};--c2:${b.c2};--ci:${b.ci}"><span class="t">${b.t}</span><span class="a">${b.a}</span></span>`;

  // Shelf
  const track = $('#track');
  books.forEach((b, i) => {
    const el = document.createElement('button');
    el.type = 'button'; el.className = 'ebook';
    el.style.setProperty('--d', (-i * 0.9) + 's');
    el.style.setProperty('--r', ((i % 3) - 1) * 3 + 'deg');
    el.style.setProperty('--lift', (i % 2 ? 70 : 0));
    el.setAttribute('aria-label', `${b.t} by ${b.a}, ${b.p}. Opens the checkout pass.`);
    el.innerHTML = coverHTML(b) + `<span class="price">${b.p}</span>`;
    el.addEventListener('click', () => openPass(b, el));
    track.appendChild(el);
  });

  // Gate + loader
  const gate = $('#gate'), load = $('#gateLoad');
  const vids = [$('#vidDawn'), $('#vidDay')];
  document.body.classList.add('locked');
  function ready() {
    const v = vids.map(x => x.readyState >= 3 || x.buffered.length && x.buffered.end(0) >= x.duration - .1);
    return v.every(Boolean);
  }
  const wait = setInterval(() => {
    const pct = Math.round(vids.reduce((s, x) => s + (x.duration ? (x.buffered.length ? x.buffered.end(0) / x.duration : 0) : 0), 0) / vids.length * 100);
    load.textContent = ready() ? 'The shop is open' : `Turning on the lamps ${pct}%`;
    if (ready()) clearInterval(wait);
  }, 250);
  function enter(c) {
    if (c) { calm = true; document.body.classList.add('calm'); }
    gate.classList.add('gone');
    document.body.classList.remove('locked');
    setTimeout(() => { gate.hidden = true; }, 1300);
  }
  $('#enter').addEventListener('click', () => enter(false));
  $('#enterCalm').addEventListener('click', () => enter(true));
  if (calm) document.body.classList.add('calm');

  // State
  let px = 0, py = 0, tx = 0, ty = 0;
  addEventListener('pointermove', e => { tx = e.clientX / innerWidth - .5; ty = e.clientY / innerHeight - .5; });
  const rooms = $$('[data-room]');
  const progress = el => { const r = el.getBoundingClientRect(); return clamp(-r.top / Math.max(1, r.height - innerHeight)); };
  const room = id => document.getElementById(id);

  // Video scrub with smoothing
  const scrub = (v, p, k) => {
    if (calm || !v.duration) return;
    const target = p * (v.duration - .05);
    k.t += (target - k.t) * .12;
    if (Math.abs(v.currentTime - k.t) > .02) v.currentTime = k.t;
  };
  const k1 = { t: 0 }, k2 = { t: 0 };

  const beats = $$('.beat'), promises = $$('[data-promise]'), msteps = $$('.mstep');
  const gaugeItems = $$('.gauge i');
    const plates = $$('.plate');
  const split = $('.split');
  const dusk = $('.dusk-reveal');
  const bookPlate = $('#bookPlate');

  // Dust motes in lamp light
  const cv = $('#stars'), ctx = cv.getContext('2d');
  let stars = [];
  function sizeStars() {
    cv.width = cv.clientWidth * devicePixelRatio; cv.height = cv.clientHeight * devicePixelRatio;
    stars = Array.from({ length: 90 }, () => ({ x: Math.random(), y: Math.random(), z: Math.random(), s: Math.random() * 6 }));
  }
  sizeStars(); addEventListener('resize', sizeStars);
  function drawStars(t, p) {
    ctx.clearRect(0, 0, cv.width, cv.height);
    stars.forEach(s => {
      const tw = calm ? .8 : .5 + .5 * Math.sin(t / 700 + s.s);
      const rise = calm ? 0 : (t / 90000 * (.4 + s.z)) % 1;
      const x = (s.x - px * .04 * s.z + Math.sin(t / 2600 + s.s) * .004) * cv.width, y = (((s.y - rise - (1 - p) * .06 * s.z) % 1 + 1) % 1) * cv.height;
      ctx.globalAlpha = (.15 + .5 * s.z) * tw;
      ctx.fillStyle = '#FFD9A0';
      ctx.beginPath(); ctx.arc(x, y, (.6 + s.z * 1.4) * devicePixelRatio, 0, 6.3); ctx.fill();
    });
  }

  const tones = { hero: 'dark', idea: 'dark', shelf: 'dark', money: 'dark', authors: 'dark', close: 'dark' };
  let lastRoom = '';

  function frame(t) {
    px += (tx - px) * .07; py += (ty - py) * .07;
    if (calm) { px = py = 0; }

    // which room is under the middle of the viewport (for tone + gauge)
    let cur = rooms[0];
    rooms.forEach(r => { const b = r.getBoundingClientRect(); if (b.top <= innerHeight * .45) cur = r; });
    if (cur.id !== lastRoom) {
      lastRoom = cur.id; document.body.dataset.tone = tones[cur.id];
      gaugeItems.forEach(g => g.classList.toggle('on', g.dataset.g === cur.id));
    }

    // hero: scrub + beats + floaters
    const ph = progress(room('hero'));
    scrub(vids[0], ph, k1);
    const win = (p, a, b) => { // 0..1..0 bump between a and b with soft edges
      const m = (a + b) / 2, h = (b - a) / 2;
      return clamp(1 - Math.abs(p - m) / h * 1.0) ;
    };
    beats.forEach((el, i) => {
      const a = [0, .33, .68][i], b = [.34, .68, 1.0][i];
      let o = i === 0 ? clamp((.3 - ph) / .08) : i === 2 ? clamp((ph - .72) / .08) : clamp(Math.min((ph - .34) / .05, (.66 - ph) / .05));
      el.style.opacity = i === 0 && ph < .02 ? 1 : o;
      const off = i === 0 ? -ph * 60 : i === 2 ? (1 - clamp((ph - .72) / .1)) * 40 : (.5 - ph) * 40;
      el.style.transform = (i === 1 ? 'translate(-50%,-50%) ' : i === 0 ? 'translateY(-60%) ' : '') + `translateY(${off}px)`;
    });

    // idea: promises in sequence
    const pi = progress(room('idea'));
    promises.forEach((el, i) => {
      const seg = 1 / promises.length, t0 = i * seg, tt = clamp((pi - t0) / seg);
      const inn = ease(clamp(tt * 4)), out = i === promises.length - 1 ? 0 : ease(clamp((tt - .78) * 5));
      el.style.opacity = clamp(inn - out);
      el.style.transform = `translateY(calc(-50% + ${(1 - inn) * 40 - out * 30}px))`;
    });

    // shelf: pan
    const ps = progress(room('shelf'));
    const max = Math.max(0, track.scrollWidth - innerWidth);
    track.style.transform = `translate3d(${-ps * max}px,0,0)`;

    // money: scrub + steps + split
    const pm = progress(room('money'));
    scrub(vids[1], pm, k2);
    const idx = Math.min(3, Math.floor(pm * 4.0));
    msteps.forEach((s, i) => { s.style.opacity = i === idx ? 1 : 0; s.style.transform = `translateY(${i === idx ? 0 : 16}px)`; });
    split.style.setProperty('--a', (idx >= 3 ? 82 : idx >= 2 ? 100 : 100) + '%');
    split.style.setProperty('--a', idx >= 3 ? '84%' : '100%');

    // authors: circular dusk reveal
    const pa = progress(room('authors'));
    dusk.style.setProperty('--r', (calm ? 150 : ease(clamp(pa * 2.4)) * 150) + '%');

    // plates: slow parallax drift by room progress
    plates.forEach(pl => {
      const sec = pl.closest('[data-room]'); if (!sec) return;
      const p = progress(sec);
      if (pl === bookPlate) { pl.style.transform = calm ? 'scale(1.1)' : `scale(${1.08 + ease(p) * .42}) translate3d(${-px * 18}px,${-py * 10}px,0)`; return; }
      if (!calm) pl.style.transform = `scale(1.18) translate3d(${-px * 24}px,${(p - .5) * -60 - py * 14}px,0)`;
    });

    // close: lantern + stars
    const pc = progress(room('close'));
    drawStars(t, pc);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  // Boarding pass (signature move)
  const wrap = $('#passWrap'), pass = $('.pass', wrap);
  const opt = $('#optIn'), state = $('#passState'), goBtn = $('#passGo');
  let opener = null, cur = null;
  function describe() { state.textContent = opt.checked ? 'The author receives: the sale, and your email.' : 'The author receives: the sale only.'; }
  opt.addEventListener('change', describe);
  function openPass(b, el) {
    opener = el; cur = b;
    $('#passTitle').textContent = b.t; $('#passBy').textContent = 'by ' + b.a;
    const c = $('#passCover'); c.style.setProperty('--c', b.c); c.innerHTML = coverHTML(b);
    c.firstChild.style.cssText += ';position:absolute;inset:0;border-radius:0;box-shadow:none';
    $('#passPaper').href = 'https://example.com/' + b.t.toLowerCase().replace(/[^a-z]+/g, '-'); $('#passPaper').setAttribute('aria-label', 'Order the paperback of ' + b.t + ' from ' + b.a + "'s own site, opens in a new tab");
    opt.checked = false; describe(); pass.classList.remove('sent'); goBtn.textContent = 'Get the ebook (' + b.p + ')';
    wrap.hidden = false; goBtn.focus();
  }
  function closePass() { wrap.hidden = true; if (opener) opener.focus(); }
  goBtn.addEventListener('click', () => {
    pass.classList.add('sent');
    state.textContent = opt.checked ? 'Sent to your inbox. The author can now write to you.' : 'Sent to your inbox. The author stays anonymous to you.';
  });
  $('#passClose').addEventListener('click', closePass);
  wrap.addEventListener('click', e => { if (e.target === wrap) closePass(); });
  addEventListener('keydown', e => { if (e.key === 'Escape' && !wrap.hidden) closePass(); });

  // Anchor links (scroll positions are inside tall pinned rooms)
  $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1); if (!id || id === 'top') return;
    const target = id === 'shelf' ? room('shelf') : room(id);
    if (!target) return; e.preventDefault();
    const off = id === 'authors' ? target.offsetHeight * .55 : id === 'shelf' ? 0 : 0;
    scrollTo({ top: target.offsetTop + off, behavior: calm ? 'auto' : 'smooth' });
  }));
})();
