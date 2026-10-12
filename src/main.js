import './style.css';
import config from './config.js';
import { buildMap, chestSVG, slotXY } from './map.js';
import { mountPuzzle, imgSrc } from './puzzles.js';
import { sound, confetti, isMuted, setMuted } from './fx.js';

// ── State ────────────────────────────────────────────────────────────────

const KEY = 'bobia-state-v1';
const TOTAL = config.zones.length + 1; // treasure zones + castle
const CASTLE = TOTAL; // slot index of the castle

const fresh = () => ({ started: false, solved: 0, gems: config.startGems, hints: {}, done: false });

let state = fresh();
try {
  state = { ...fresh(), ...JSON.parse(localStorage.getItem(KEY) || '{}') };
} catch {}

const params = new URLSearchParams(location.search);
if (params.has('reset')) state = fresh();
if (params.has('skip')) {
  // Testing shortcut: ?skip=3 marks the first 3 chests as opened.
  state.started = true;
  state.solved = Math.min(TOTAL - 1, Math.max(0, +params.get('skip') || 0));
  state.done = false;
}
if (params.has('reset') || params.has('skip')) history.replaceState(null, '', location.pathname);

const save = () => {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {}
};
save();

// ── Helpers ──────────────────────────────────────────────────────────────

const $ = (sel, root = document) => root.querySelector(sel);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const names = ['Camp', ...config.zones.map((z) => z.name), config.castle.name];
const zoneAt = (i) => (i === CASTLE ? config.castle : config.zones[i - 1]);
const clueFor = (i) => (i === 1 ? config.intro.firstClue : config.zones[i - 2].treasure.clue);
const current = () => Math.min(state.solved + 1, CASTLE);
const runes = () => config.zones.map((z) => z.treasure.rune);

const GEM = `<svg class="gem" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h12l4 6-10 12L2 9z" fill="#E84A7F" stroke="#3B2414" stroke-width="2" stroke-linejoin="round"/><path d="M2 9h20M9 3 7 9l5 12 5-12-2-6" fill="none" stroke="#3B2414" stroke-width="1.5" stroke-linejoin="round"/><path d="M7 5.5 9 4" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg>`;
const SCROLL = `<svg viewBox="0 0 32 32" aria-hidden="true"><rect x="6" y="5" width="20" height="22" rx="3" fill="#FBEBC8" stroke="#3B2414" stroke-width="2.5"/><path d="M10 11h12M10 16h12M10 21h8" stroke="#A8743A" stroke-width="2.5" stroke-linecap="round"/><rect x="3" y="3" width="26" height="5" rx="2.5" fill="#D9A55B" stroke="#3B2414" stroke-width="2.5"/><rect x="3" y="24" width="26" height="5" rx="2.5" fill="#D9A55B" stroke="#3B2414" stroke-width="2.5"/></svg>`;
const CHEST_ICON = `<svg viewBox="-46 -80 92 92" aria-hidden="true">${chestSVG(false)}</svg>`;

function toast(msg) {
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  document.body.append(t);
  setTimeout(() => t.classList.add('out'), 2600);
  setTimeout(() => t.remove(), 3100);
}

// ── Modal ────────────────────────────────────────────────────────────────

let modalClose = null;
function openModal(html, { cls = '', onClose, dismissable = true } = {}) {
  closeModal(true);
  const wrap = document.createElement('div');
  wrap.className = `modal ${cls}`;
  wrap.innerHTML = `<div class="backdrop"></div><div class="modal-inner" role="dialog" aria-modal="true">${html}</div>`;
  document.body.append(wrap);
  requestAnimationFrame(() => wrap.classList.add('in'));
  const close = () => {
    wrap.classList.remove('in');
    setTimeout(() => wrap.remove(), 220);
    modalClose = null;
    onClose && onClose();
  };
  modalClose = close;
  modalClose.wrap = wrap;
  if (dismissable) {
    wrap.querySelector('.backdrop').addEventListener('click', close);
    wrap.querySelectorAll('[data-close]').forEach((b) => b.addEventListener('click', close));
  }
  return { el: wrap, close };
}
function closeModal(silent) {
  if (!modalClose) return;
  const c = modalClose;
  modalClose = null;
  if (silent) c.wrap.remove();
  else c();
}
document.addEventListener('keydown', (e) => e.key === 'Escape' && $('.modal [data-close]') && modalClose && modalClose());

const panel = (title, body, { closeBtn = true, cls = '' } = {}) => `
  <section class="panel ${cls}">
    <header class="panel-head"><h2>${title}</h2>${closeBtn ? '<button class="x" data-close aria-label="Close">✕</button>' : ''}</header>
    <div class="panel-body">${body}</div>
  </section>`;

const clueCard = (clue, label = 'Your clue') => `
  <div class="clue-card">
    <span class="clue-label">${label}</span>
    ${clue.image ? `<img src="${esc(clue.image)}" alt="Clue picture"/>` : ''}
    <p>${esc(clue.text)}</p>
  </div>`;

// ── App shell ────────────────────────────────────────────────────────────

const app = $('#app');

function renderTitle() {
  app.innerHTML = `
    <main class="title-screen">
      <div class="title-sea"></div>
      <div class="title-card">
        <div class="title-badge">${config.endLevel}</div>
        <h1 class="title">${esc(config.intro.title)}</h1>
        <p class="subtitle">${esc(config.intro.subtitle)}</p>
        <button class="btn big" id="start">${state.started ? 'Continue the hunt' : 'Start the hunt'}</button>
      </div>
    </main>`;
  $('#start').addEventListener('click', () => {
    sound('tap');
    if (state.started) return renderGame();
    state.started = true;
    save();
    renderGame();
    showWelcome(true);
  });
}

function showWelcome(first = false) {
  const body = `
    <div class="letter-text">${config.intro.letter.map((p) => `<p>${esc(p)}</p>`).join('')}</div>
    ${clueCard(config.intro.firstClue, 'Your first clue')}
    <button class="btn" data-close>${first ? 'Set off to ' + esc(names[1]) : 'Close'}</button>`;
  openModal(panel('Welcome, Chief', body, { cls: 'parchment' }), {
    onClose: () => first && map.focus(1, true),
  });
}

// ── Game screen ──────────────────────────────────────────────────────────

let map;

function renderGame() {
  app.innerHTML = `
    <div class="game">
      <header class="hud">
        <div class="lvl">
          <div class="lvl-star"><span id="lvl-num"></span></div>
          <div class="lvl-info">
            <div class="lvl-name">${esc(config.herName)}</div>
            <div class="xp"><i id="xp-fill"></i><span id="xp-text"></span></div>
          </div>
        </div>
        <div class="hud-right">
          <div class="pill">${GEM}<span id="gems"></span></div>
          <button class="icon-btn" id="mute" aria-label="Sound"></button>
        </div>
      </header>
      <div class="map-scroll" id="map-scroll"><div class="map-frame">${buildMap(names)}</div></div>
      <footer class="dock">
        <button class="quest" id="quest">${SCROLL}<span id="quest-text"></span></button>
        <button class="vault-btn" id="vault">${CHEST_ICON}<span>Vault</span><b id="vault-count"></b></button>
      </footer>
    </div>`;

  map = createMap();
  $('#quest').addEventListener('click', showQuest);
  $('#vault').addEventListener('click', showVault);
  $('#mute').addEventListener('click', () => {
    setMuted(!isMuted());
    updateHud();
  });
  updateHud();
  map.update();
  requestAnimationFrame(() => map.focus(current(), false));
}

function updateHud() {
  const lvl = state.done ? config.endLevel : config.startLevel;
  $('#lvl-num').textContent = lvl;
  const pct = Math.round((Math.min(state.solved, TOTAL) / TOTAL) * 100);
  $('#xp-fill').style.width = pct + '%';
  $('#xp-text').textContent = state.done ? 'Max level' : `${state.solved} / ${TOTAL} treasures`;
  $('#gems').textContent = state.gems;
  $('#mute').innerHTML = isMuted() ? '<span aria-hidden="true">♪</span><s></s>' : '<span aria-hidden="true">♪</span>';
  $('#mute').setAttribute('aria-pressed', String(!isMuted()));
  $('#vault-count').textContent = Math.min(state.solved, config.zones.length);
  const qt = $('#quest-text');
  if (state.done) qt.textContent = 'Your letter is waiting at the castle';
  else qt.textContent = clueFor(current()).text;
}

function createMap() {
  const svg = $('#map-svg');
  const scroller = $('#map-scroll');

  svg.addEventListener('click', (e) => {
    const cloud = e.target.closest('.cloud');
    if (cloud) {
      sound('tap');
      return toast(`Clouds still cover this land. Open the chest at ${names[current()]} first.`);
    }
    const zone = e.target.closest('.zone');
    if (!zone) return;
    onZone(+zone.dataset.zone);
  });

  function update(revealing = null) {
    const cur = current();
    svg.querySelectorAll('.zone').forEach((z) => {
      const i = +z.dataset.zone;
      const revealed = i <= state.solved + 1 && i !== revealing;
      const solved = i === 0 || i <= state.solved;
      z.classList.toggle('revealed', revealed || i === 0);
      z.classList.toggle('solved', solved);
      z.classList.toggle('current', i === cur && !state.done && i !== revealing);
      const art = z.querySelector('.chest-art');
      if (art) art.innerHTML = chestSVG(solved);
    });
    svg.querySelectorAll('.cloud').forEach((c) => {
      const k = +c.dataset.cloud;
      c.classList.toggle('cleared', k <= state.solved + 1 && k !== revealing);
    });
    svg.querySelectorAll('.trail').forEach((t) => {
      const k = +t.dataset.trail;
      t.classList.toggle('shown', k <= state.solved + 1 && k !== revealing);
    });
    svg.classList.toggle('finished', state.done);
  }

  function focus(i, smooth = true) {
    const [fx, fy] = slotXY(i);
    const left = svg.offsetLeft + svg.clientWidth * fx - scroller.clientWidth / 2;
    const top = svg.offsetTop + svg.clientHeight * fy - scroller.clientHeight / 2;
    scroller.scrollTo({ left: Math.max(0, left), top: Math.max(0, top), behavior: smooth ? 'smooth' : 'auto' });
  }

  async function reveal(i) {
    update(i);
    focus(i, true);
    await wait(700);
    sound('reveal');
    svg.querySelector(`.cloud[data-cloud="${i}"]`)?.classList.add('cleared');
    svg.querySelector(`.trail[data-trail="${i}"]`)?.classList.add('shown');
    await wait(900);
    update();
    toast(i === CASTLE ? `${names[i]} rises from the clouds` : `The clouds over ${names[i]} cleared`);
  }

  // first paint: no cloud transitions
  svg.classList.add('instant');
  update();
  requestAnimationFrame(() => requestAnimationFrame(() => svg.classList.remove('instant')));

  return { update, focus, reveal };
}

function onZone(i) {
  sound('tap');
  if (i === 0) return showWelcome();
  if (i > state.solved + 1) return toast(`Clouds still cover this land. Open the chest at ${names[current()]} first.`);
  if (i === CASTLE && state.done) return showLetter();
  if (i <= state.solved) return showTreasure(i);
  showPuzzle(i);
}

// ── Puzzle ───────────────────────────────────────────────────────────────

const WRONG = [
  'Not quite. Read your clue again.',
  'The lock does not budge. Try again.',
  'Close, maybe. The wizard can help if you are stuck.',
];

function showPuzzle(i) {
  const zone = zoneAt(i);
  const p = zone.puzzle;
  const body = `
    ${clueCard(clueFor(i))}
    <p class="prompt">${esc(p.prompt)}</p>
    <div class="puzzle-root"></div>
    <p class="feedback" aria-live="polite"></p>
    <div class="hints"></div>
    <button class="btn small purple" id="wizard">Ask the wizard <span class="cost">${config.hintCost}${GEM}</span></button>`;
  const { el, close } = openModal(panel(esc(zone.name), body), { cls: 'puzzle-modal' });
  const fb = $('.feedback', el);
  const hintsBox = $('.hints', el);
  const used = () => state.hints[i] || 0;

  const drawHints = () => {
    hintsBox.innerHTML = (p.hints || [])
      .slice(0, used())
      .map((t) => `<p class="hint"><b>Wizard:</b> ${esc(t)}</p>`)
      .join('');
    const btn = $('#wizard', el);
    const left = (p.hints || []).length - used();
    btn.hidden = left <= 0;
  };
  drawHints();

  $('#wizard', el).addEventListener('click', () => {
    let msg = '';
    if (state.gems >= config.hintCost) state.gems -= config.hintCost;
    else msg = 'You are out of gems. The wizard lets it slide, since it is your birthday.';
    state.hints[i] = used() + 1;
    save();
    sound('hint');
    drawHints();
    updateHud();
    if (msg) fb.textContent = msg;
  });

  let wrongs = 0;
  mountPuzzle(
    $('.puzzle-root', el),
    p,
    {
      onWrong: () => {
        sound('wrong');
        fb.textContent = WRONG[wrongs++ % WRONG.length];
        const pnl = $('.panel', el);
        pnl.classList.remove('shake');
        void pnl.offsetWidth;
        pnl.classList.add('shake');
      },
      onSolve: () => {
        state.solved = Math.max(state.solved, i);
        if (i === CASTLE) state.done = true;
        save();
        close();
        updateHud();
        i === CASTLE ? finale() : openChest(i);
      },
    },
    { runes: runes() },
  );
}

// ── Treasure ─────────────────────────────────────────────────────────────

async function openChest(i) {
  const { el } = openModal(
    `<div class="loot">
      <div class="rays"></div>
      <svg class="big-chest" viewBox="-60 -100 120 112">${chestSVG(false)}</svg>
      <p class="loot-text">Chest unlocked</p>
    </div>`,
    { cls: 'loot-modal', dismissable: false },
  );
  await wait(900);
  const chest = $('.big-chest', el);
  chest.innerHTML = chestSVG(true);
  chest.classList.add('popped');
  sound('open');
  await wait(1100);
  showTreasure(i, true);
}

function treasureHTML(i, fresh) {
  const z = config.zones[i - 1];
  const t = z.treasure;
  const next = i + 1;
  return panel(
    fresh ? 'Treasure found' : esc(z.name),
    `<figure class="polaroid"><img src="${imgSrc(t.image, 'Your photo here')}" alt=""/><figcaption>${esc(t.title)}</figcaption></figure>
     <p class="memory">${esc(t.memory)}</p>
     <div class="rune-row"><span class="rune">${esc(t.rune)}</span><span>A rune for the castle gate. Keep it safe.</span></div>
     ${clueCard(t.clue, `Clue for ${esc(names[next])}`)}
     <button class="btn" data-close>${fresh ? 'Follow the clue' : 'Close'}</button>`,
    { cls: 'treasure', closeBtn: !fresh },
  );
}

function showTreasure(i, fresh = false) {
  if (i === CASTLE) return showLetter();
  openModal(treasureHTML(i, fresh), {
    cls: fresh ? 'treasure-modal fresh' : 'treasure-modal',
    onClose: () => fresh && map.reveal(i + 1),
  });
}

// ── Quest + vault ────────────────────────────────────────────────────────

function showQuest() {
  sound('tap');
  if (state.done) return showLetter();
  const i = current();
  openModal(
    panel(
      'Current quest',
      `<p class="prompt">Head to <b>${esc(names[i])}</b> and open what waits there.</p>
       ${clueCard(clueFor(i))}
       <button class="btn" id="go">Show me on the map</button>`,
    ),
  );
  $('#go').addEventListener('click', () => {
    closeModal();
    map.focus(i);
  });
}

function showVault() {
  sound('tap');
  const cells = config.zones
    .map((z, k) => {
      const i = k + 1;
      const got = i <= state.solved;
      return got
        ? `<button class="vault-cell got" data-i="${i}"><img src="${imgSrc(z.treasure.image, '')}" alt=""/><span class="rune">${esc(z.treasure.rune)}</span><em>${esc(z.treasure.title)}</em></button>`
        : `<div class="vault-cell"><span class="q">?</span><em>Still hidden</em></div>`;
    })
    .join('');
  const letter = state.done
    ? `<button class="vault-cell got letter" data-i="${CASTLE}"><span class="seal">♥</span><em>Your letter</em></button>`
    : `<div class="vault-cell letter"><span class="q">♥</span><em>Locked in the castle</em></div>`;
  const { el } = openModal(
    panel('Treasure vault', `<div class="vault-grid">${cells}${letter}</div><p class="vault-note">Runes collected: <b>${runes().slice(0, Math.min(state.solved, config.zones.length)).join(' ') || 'none yet'}</b></p>`),
  );
  el.querySelectorAll('.vault-cell.got').forEach((b) => b.addEventListener('click', () => showTreasure(+b.dataset.i)));
}

// ── Finale ───────────────────────────────────────────────────────────────

async function finale() {
  map.update();
  map.focus(CASTLE);
  await wait(900);
  sound('fanfare');
  confetti(4500);
  const { el } = openModal(
    `<div class="levelup">
      <div class="rays"></div>
      <div class="lvl-star huge"><span>${config.startLevel}</span></div>
      <h2 class="levelup-title">${esc(config.finale.levelUpText)}</h2>
      <p class="levelup-sub">Happy birthday, ${esc(config.herName)}.</p>
      <button class="btn big" id="read">Open your letter</button>
    </div>`,
    { cls: 'levelup-modal', dismissable: false },
  );
  await wait(1100);
  const num = $('.lvl-star span', el);
  num.parentElement.classList.add('flip');
  await wait(300);
  num.textContent = config.endLevel;
  updateHud();
  $('#read', el).addEventListener('click', () => {
    closeModal(true);
    showLetter();
  });
}

function showLetter() {
  sound('tap');
  const f = config.finale;
  openModal(
    `<article class="love-letter">
      <button class="x" data-close aria-label="Close">✕</button>
      <h2>${esc(f.letterTitle)}, ${esc(config.herName)}</h2>
      ${f.letter.map((p) => `<p>${esc(p)}</p>`).join('')}
      <p class="signature">${esc(f.signature)}</p>
      <div class="wax">♥</div>
    </article>`,
    { cls: 'letter-modal' },
  );
}

// ── Boot ─────────────────────────────────────────────────────────────────

document.title = config.intro.title;
state.started ? renderGame() : renderTitle();
