(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const money = n => '$' + n.toFixed(2);

  // Fee calculator (illustration: card 2.9% + $0.30)
  const price = $('#price'), founding = $('#founding');
  function calc() {
    const g = Math.max(0, parseFloat(price.value) || 0);
    const card = g ? g * 0.029 + 0.30 : 0;
    const fee = g * (founding.checked ? 0.05 : 0.10);
    $('#cGross').textContent = money(g);
    $('#cCard').textContent = '-' + money(card);
    $('#cFee').textContent = '-' + money(fee);
    $('#cNet').textContent = money(Math.max(0, g - card - fee));
  }
  price.addEventListener('input', calc); founding.addEventListener('change', calc); calc();

  // Sign up (demo only)
  $('#signupForm').addEventListener('submit', e => {
    e.preventDefault();
    const f = e.target, msg = $('#signupMsg');
    if (!f.name.value.trim() || !f.email.validity.valid || !f.email.value || !f.rights.checked) {
      msg.hidden = false; msg.style.background = '#F6E1D6'; msg.style.color = '#8A3B12';
      msg.textContent = 'Please add your name, a valid email, and confirm you own the rights.'; return;
    }
    msg.hidden = false; msg.style.background = ''; msg.style.color = '';
    msg.textContent = 'Application received (demo). Next: read and sign the agreement below.';
    $('#agreement').scrollIntoView({ behavior: 'smooth' });
  });

  // Agreement signing
  const chk = $('#agreeChk'), sig = $('#sigName'), btn = $('#signBtn');
  const gate = () => { btn.disabled = !(chk.checked && sig.value.trim().length > 2); };
  chk.addEventListener('change', gate); sig.addEventListener('input', gate);
  $('#signForm').addEventListener('submit', e => {
    e.preventDefault();
    const m = $('#signMsg'); m.hidden = false;
    m.textContent = 'Signed (demo) by ' + sig.value.trim() + ' on ' + new Date().toLocaleDateString() + '. Your dashboard is ready below.';
    $('#dashboard').scrollIntoView({ behavior: 'smooth' });
  });

  // Dashboard demo
  const books = [['The Salt Orchard', 6.99], ['The Salt Orchard', 6.99], ['Paper Lanterns', 5.49], ['Long Way Round', 6.49], ['A Small Weather', 5.99]];
  const state = { pend: 0, avail: 0, paid: 1344.25, news: 38, paper: 21 };
  const body = $('#salesBody');
  const ledger = [];
  let seq = 1000;
  function row(time, title, g, status, isNew) {
    const card = g * 0.029 + 0.30, fee = g * 0.10, net = g - card - fee;
    const rec = { event_id: 'evt_' + (++seq), type: 'sale.created', occurred_at: '2026-' + (time.startsWith('Nov') ? '11' : '10') + '-' + time.split(' ')[1].padStart(2, '0') + 'T' + time.split(' ')[2] + ':00Z', seller_id: 'sel_demo01', author_id: 'aut_marisol_vane', book_id: 'bk_' + title.toLowerCase().replace(/[^a-z]+/g, '_'), sale_id: 'sale_' + seq, currency: 'USD', gross_cents: Math.round(g * 100), tax_cents: 0, card_fee_cents: Math.round(card * 100), platform_fee_cents: Math.round(fee * 100), status: status.toLowerCase(), channel: 'sell_through' };
    rec.net_cents = rec.gross_cents - rec.tax_cents - rec.card_fee_cents - rec.platform_fee_cents; ledger.push(rec);
    if (isNew) pbEvent(rec);
    const tr = document.createElement('tr'); if (isNew) tr.className = 'new';
    tr.innerHTML = `<td>${time}</td><td>${title}</td><td>${money(g)}</td><td>-${money(card)}</td><td>-${money(fee)}</td><td><b>${money(net)}</b></td><td><span class="tag ${status === 'Available' ? 'avail' : ''}">${status}</span></td>`;
    body.prepend(tr);
    return net;
  }
  const seed = [['Nov 4 09:12', 0, 'Available'], ['Nov 4 14:40', 2, 'Available'], ['Nov 5 08:03', 1, 'Pending'], ['Nov 5 19:27', 3, 'Pending'], ['Nov 6 07:51', 4, 'Pending']];
  seed.forEach(([t, i, s]) => { const net = row(t, books[i][0], books[i][1], s, false); s === 'Available' ? state.avail += net : state.pend += net; });
  state.avail += 310.2; state.pend += 96.4; // earlier sales not listed
  const render = () => {
    $('#sPend').textContent = money(state.pend); $('#sAvail').textContent = money(state.avail); $('#sPaid').textContent = money(state.paid);
    $('#kNews').textContent = state.news; $('#kPaper').textContent = state.paper;
  };
  render();
  $('#simSale').addEventListener('click', () => {
    const b = books[Math.floor(Math.random() * books.length)];
    const d = new Date(), t = 'Nov 6 ' + String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
    state.pend += row(t, b[0], b[1], 'Pending', true);
    if (Math.random() > .5) state.news++; if (Math.random() > .6) state.paper++;
    render();
  });

  // Plotted Balance (demo)
  let pbOn = false;
  const pbLog = $('#pbLog');
  function pbEvent(rec) {
    if (!pbOn) return;
    const li = document.createElement('li'); li.textContent = rec.type + ' ' + rec.sale_id + ' -> Plotted Balance (' + (rec.net_cents / 100).toFixed(2) + ' net)';
    pbLog.prepend(li);
  }
  $('#pbConnect').addEventListener('click', e => {
    pbOn = !pbOn;
    e.target.textContent = pbOn ? 'Disconnect Plotted Balance' : 'Connect Plotted Balance';
    $('#pbTag').textContent = pbOn ? 'Connected (demo)' : 'Not connected'; $('#pbTag').classList.toggle('on', pbOn);
    pbLog.innerHTML = pbOn ? '<li>connected: sending sale, refund, payout and referral-fee events</li>' : '';
  });
  const dl = (name, text, type) => { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([text], { type })); a.download = name; a.click(); URL.revokeObjectURL(a.href); };
  const cols = ['event_id', 'type', 'occurred_at', 'seller_id', 'author_id', 'book_id', 'sale_id', 'currency', 'gross_cents', 'tax_cents', 'card_fee_cents', 'platform_fee_cents', 'net_cents', 'status', 'channel'];
  $('#pbCsv').addEventListener('click', () => dl('open-shelf-ledger.csv', cols.join(',') + '\n' + ledger.map(r => cols.map(c => r[c]).join(',')).join('\n') + '\n', 'text/csv'));
  $('#pbJson').addEventListener('click', () => dl('open-shelf-ledger.json', JSON.stringify({ version: 1, events: ledger }, null, 2), 'application/json'));

  // Bars
  const days = [4,6,3,8,5,7,9,4,6,12,8,5,7,6,9,11,7,5,8,10,6,9,12,8,7,9,13,10,8,11];
  const mx = Math.max(...days);
  $('#bars').innerHTML = days.map(v => `<i style="height:${v / mx * 100}%" title="${v} sales"></i>`).join('');

  // CSV download (client side, sample data)
  $$('[data-csv]').forEach(b => b.addEventListener('click', () => {
    const csv = 'date,book,gross,card_fee,platform_fee,net,status\n2026-' + (b.dataset.csv === 'Sep' ? '09' : '10') + '-03,The Salt Orchard,6.99,0.50,0.70,5.79,Paid\n';
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = 'statement-' + b.dataset.csv + '.csv'; a.click(); URL.revokeObjectURL(a.href);
  }));
})();
