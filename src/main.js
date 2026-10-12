import './style.css';
import config from './config.js';
import { buildWorld } from './world.js';
import { loadSprites, chestSVG } from './art.js';
import { createGame } from './game.js';
import { mountPuzzle, imgSrc, norm } from './puzzles.js';
import { sound, confetti, isMuted, setMuted } from './fx.js';

// ── State ────────────────────────────────────────────────────────────────

const KEY = 'joy-island-v2';
const N = config.zones.length; // chests
const CASTLE = N + 1; // the castle is treasure N + 1
const TOTAL = N + 1; // 33 treasures

const fresh = () => ({ gate: false, started: false, solved: 0, gems: config.startGems, hints: {}, done: false });

let state = fresh();
try {
  state = { ...fresh(), ...JSON.parse(localStorage.getItem(KEY) || '{}') };
} catch {}

const params = new URLSearchParams(location.search);
if (params.has('reset')) state = fresh();
if (params.has('skip')) {
  // Testing shortcut: ?skip=10 marks the first 10 chests as opened.
  state.gate = true;
  state.started = true;
  state.solved = Math.min(N, Math.max(0, +params.get('skip') || 0));
  state.done = false;
}
if (params.has('reset') || params.has('skip')) history.replaceState(null, '', location.pathname);

const save = () => {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {}
};
save();

// Keep modals inside the part of the screen the phone keyboard leaves visible.
const vv = window.visualViewport;
if (vv) {
  const syncViewport = () => {
    document.documentElement.style.setProperty('--vv-h', `${vv.height}px`);
    document.documentElement.style.setProperty('--vv-top', `${vv.offsetTop}px`);
  };
  vv.addEventListener('resize', syncViewport);
  vv.addEventListener('scroll', syncViewport);
  syncViewport();
}

// ── Helpers ──────────────────────────────────────────────────────────────

const $ = (sel, root = document) => root.querySelector(sel);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const names = ['Camp', ...config.zones.map((z) => z.name), config.castle.name];
const zoneAt = (i) => (i === CASTLE ? config.castle : config.zones[i - 1]);
const clueFor = (i) => (i === 1 ? config.intro.firstClue : config.zones[i - 2].treasure.clue);
const current = () => Math.min(state.solved + 1, CASTLE);
const runes = () => config.zones.map((z) => z.treasure.rune).filter(Boolean);
const runesSoFar = () => config.zones.slice(0, state.solved).map((z) => z.treasure.rune).filter(Boolean);
const found = () => state.solved + (state.done ? 1 : 0);
const isTouch = matchMedia('(pointer: coarse)').matches || navigator.maxTouchPoints > 0;

const GEM = `<svg class="gem" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h12l4 6-10 12L2 9z" fill="#E84A7F" stroke="#3B2414" stroke-width="2" stroke-linejoin="round"/><path d="M2 9h20M9 3 7 9l5 12 5-12-2-6" fill="none" stroke="#3B2414" stroke-width="1.5" stroke-linejoin="round"/><path d="M7 5.5 9 4" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg>`;
const SCROLL = `<svg viewBox="0 0 32 32" aria-hidden="true"><rect x="6" y="5" width="20" height="22" rx="3" fill="#FBEBC8" stroke="#3B2414" stroke-width="2.5"/><path d="M10 11h12M10 16h12M10 21h8" stroke="#A8743A" stroke-width="2.5" stroke-linecap="round"/><rect x="3" y="3" width="26" height="5" rx="2.5" fill="#D9A55B" stroke="#3B2414" stroke-width="2.5"/><rect x="3" y="24" width="26" height="5" rx="2.5" fill="#D9A55B" stroke="#3B2414" stroke-width="2.5"/></svg>`;
const CHEST_ICON = `<svg viewBox="-46 -80 92 92" aria-hidden="true">${chestSVG(false)}</svg>`;
const MAP_ICON = `<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M4 8l8-3 8 3 8-3v19l-8 3-8-3-8 3z" fill="#FBEBC8" stroke="#3B2414" stroke-width="2.5" stroke-linejoin="round"/><path d="M12 5v19M20 8v19" stroke="#3B2414" stroke-width="2"/><path d="M23 12c0 2-3 5-3 5s-3-3-3-5a3 3 0 0 1 6 0z" fill="#E84A7F" stroke="#3B2414" stroke-width="1.6"/></svg>`;

function toast(msg) {
  document.querySelectorAll('.toast').forEach((t) => t.remove());
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

// ── Title + passphrase ───────────────────────────────────────────────────

const app = $('#app');

function renderTitle() {
  const locked = !state.gate;
  app.innerHTML = `
    <main class="title-screen">
      <div class="title-sea"></div>
      <div class="title-card">
        <div class="title-badge">${config.endLevel}</div>
        <h1 class="title">${esc(config.intro.title)}</h1>
        <p class="subtitle">${esc(config.intro.subtitle)}</p>
        ${
          locked
            ? `<form class="gate" id="gate" autocomplete="off">
                 <label class="gate-label" for="pass">Say the secret words to enter</label>
                 <input class="field" id="pass" type="text" placeholder="Passphrase" autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="go"/>
                 <button class="btn big" type="submit">Enter the island</button>
                 <p class="gate-error" aria-live="polite"></p>
               </form>`
            : `<button class="btn big" id="start">${state.started ? 'Continue the hunt' : 'Start the hunt'}</button>`
        }
      </div>
    </main>`;

  const enter = () => {
    sound('tap');
    if (state.started) return renderGame();
    state.started = true;
    save();
    renderGame().then(() => showWelcome(true));
  };

  if (!locked) return $('#start').addEventListener('click', enter);

  const form = $('#gate');
  const input = $('#pass');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (norm(input.value) === norm(config.passphrase)) {
      state.gate = true;
      save();
      sound('open');
      enter();
    } else {
      sound('wrong');
      navigator.vibrate?.(120);
      $('.gate-error').textContent = input.value.trim() ? 'That is not it. Try again.' : 'Type the passphrase first.';
      form.classList.remove('shake');
      void form.offsetWidth;
      form.classList.add('shake');
      input.select();
    }
  });
}

function showWelcome(first = false) {
  const how = isTouch
    ? 'Drag anywhere on the left side of the screen to walk. Tap the gold button when you reach a chest.'
    : 'Use the arrow keys or W A S D to walk. Press Space when you reach a chest.';
  const body = `
    <div class="letter-text">${config.intro.letter.map((p) => `<p>${esc(p)}</p>`).join('')}</div>
    <p class="how">${how}</p>
    ${clueCard(config.intro.firstClue, 'Your first clue')}
    <button class="btn" data-close>${first ? 'Set off to ' + esc(names[1]) : 'Close'}</button>`;
  openModal(panel(`Welcome, ${esc(config.herName)}`, body), {});
}

// ── Game screen ──────────────────────────────────────────────────────────

let game;
let world;
let sprites;

async function renderGame() {
  app.innerHTML = `
    <div class="game ${isTouch ? 'touch' : 'keys'}">
      <canvas id="world" aria-label="Island map"></canvas>
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
          <button class="icon-btn" id="map-btn" aria-label="Island map" aria-pressed="false">${MAP_ICON}</button>
          <button class="icon-btn" id="mute" aria-label="Sound"></button>
        </div>
      </header>
      <button class="quest" id="quest">${SCROLL}<span id="quest-text"></span></button>
      <div class="stick-zone" id="stick-zone"></div>
      <div class="stick" id="stick" aria-hidden="true"><div class="knob"></div></div>
      <div class="actions">
        <button class="vault-btn" id="vault">${CHEST_ICON}<span>Vault</span><b id="vault-count"></b></button>
        <button class="act" id="act" disabled><span id="act-label">Walk to a chest</span></button>
      </div>
      <p class="keys-hint">Arrow keys or WASD to walk · Space to open</p>
      <div class="loading" id="loading">Drawing the island…</div>
    </div>`;

  if (!world) world = buildWorld(config.zones);
  if (!sprites) {
    sprites = await loadSprites();
    try {
      await Promise.race([document.fonts.load('22px "Lilita One"'), wait(1500)]);
    } catch {}
  }
  $('#loading').remove();

  game?.stop();
  game = createGame($('#world'), {
    world,
    sprites,
    names,
    getProgress: () => state,
    isBlocked: () => !!modalClose,
    onNear: updateAction,
  });

  setupStick();
  $('#act').addEventListener('click', act);
  window.onkeydown = (e) => {
    if (modalClose || e.target.closest?.('input')) return;
    if (e.code === 'Space' || e.code === 'Enter') {
      e.preventDefault();
      act();
    }
    if (e.code === 'KeyM') toggleMap();
  };
  $('#quest').addEventListener('click', showQuest);
  $('#vault').addEventListener('click', showVault);
  $('#map-btn').addEventListener('click', toggleMap);
  $('#mute').addEventListener('click', () => {
    setMuted(!isMuted());
    updateHud();
  });
  updateHud();
  updateAction(null);
}

function toggleMap() {
  sound('tap');
  const v = !game.overview;
  game.setOverview(v);
  $('#map-btn').setAttribute('aria-pressed', String(v));
  $('.game').classList.toggle('overview', v);
}

function updateHud() {
  $('#lvl-num').textContent = state.done ? config.endLevel : config.startLevel;
  $('#xp-fill').style.width = Math.round((found() / TOTAL) * 100) + '%';
  $('#xp-text').textContent = `${found()} / ${TOTAL} treasures`;
  $('#gems').textContent = state.gems;
  $('#mute').innerHTML = isMuted() ? '<span aria-hidden="true">♪</span><s></s>' : '<span aria-hidden="true">♪</span>';
  $('#mute').setAttribute('aria-pressed', String(!isMuted()));
  $('#vault-count').textContent = state.solved;
  $('#quest-text').textContent = state.done ? 'Your letter is waiting at the castle' : clueFor(current()).text;
}

// ── Thumbstick (touch) ───────────────────────────────────────────────────

function setupStick() {
  const zone = $('#stick-zone');
  const stick = $('#stick');
  const knob = stick.querySelector('.knob');
  const R = 52;
  let id = null;
  let ox = 0;
  let oy = 0;

  const home = () => {
    stick.classList.remove('active');
    stick.style.left = '';
    stick.style.top = '';
    knob.style.transform = '';
    game.joy.x = 0;
    game.joy.y = 0;
  };
  zone.addEventListener('pointerdown', (e) => {
    if (id !== null || modalClose) return;
    id = e.pointerId;
    zone.setPointerCapture(id);
    ox = e.clientX;
    oy = e.clientY;
    stick.classList.add('active');
    stick.style.left = `${ox}px`;
    stick.style.top = `${oy}px`;
    e.preventDefault();
  });
  zone.addEventListener('pointermove', (e) => {
    if (e.pointerId !== id) return;
    let dx = e.clientX - ox;
    let dy = e.clientY - oy;
    const d = Math.hypot(dx, dy);
    if (d > R) {
      // drag the base along, PUBG style, so she never runs out of stick
      ox += (dx * (d - R)) / d;
      oy += (dy * (d - R)) / d;
      stick.style.left = `${ox}px`;
      stick.style.top = `${oy}px`;
      dx = e.clientX - ox;
      dy = e.clientY - oy;
    }
    knob.style.transform = `translate(${dx}px, ${dy}px)`;
    game.joy.x = dx / R;
    game.joy.y = dy / R;
  });
  const end = (e) => {
    if (e.pointerId !== id) return;
    id = null;
    home();
  };
  zone.addEventListener('pointerup', end);
  zone.addEventListener('pointercancel', end);
}

// ── Action button ────────────────────────────────────────────────────────

function updateAction(near) {
  const btn = $('#act');
  if (!btn) return;
  const label = $('#act-label');
  btn.disabled = !near;
  btn.classList.toggle('ready', !!near && !(near.type === 'chest' && near.opened));
  if (!near) label.textContent = state.done ? 'Explore' : 'Find the chest';
  else if (near.type === 'castle') label.textContent = near.done ? 'Read letter' : 'Open gate';
  else label.textContent = near.opened ? 'Look again' : 'Open';
  if (near && !(near.type === 'chest' && near.opened)) sound('tick');
}

function act() {
  const near = game?.near;
  if (!near || modalClose) return;
  sound('tap');
  if (near.type === 'castle') return state.done ? showLetter() : showPuzzle(CASTLE);
  if (near.opened) return showTreasure(near.k);
  showPuzzle(near.k);
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
  const title = i === CASTLE ? esc(zone.name) : `${esc(zone.name)} <small>${i} / ${TOTAL}</small>`;
  const { el, close } = openModal(panel(title, body), { cls: 'puzzle-modal' });
  const fb = $('.feedback', el);
  const hintsBox = $('.hints', el);
  const used = () => state.hints[i] || 0;

  const drawHints = () => {
    hintsBox.innerHTML = (p.hints || [])
      .slice(0, used())
      .map((t) => `<p class="hint"><b>Wizard:</b> ${esc(t)}</p>`)
      .join('');
    $('#wizard', el).hidden = (p.hints || []).length - used() <= 0;
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
        navigator.vibrate?.(120);
        fb.textContent = WRONG[wrongs++ % WRONG.length];
        const pnl = $('.panel', el);
        pnl.classList.remove('shake');
        void pnl.offsetWidth;
        pnl.classList.add('shake');
      },
      onSolve: () => {
        if (i === CASTLE) state.done = true;
        else {
          state.solved = Math.max(state.solved, i);
          state.gems += config.gemsPerChest || 0;
        }
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
      <p class="loot-text">Treasure ${i} of ${TOTAL}</p>
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
  const rune = t.rune
    ? `<div class="rune-row"><span class="rune">${esc(t.rune)}</span><span>A rune for the castle gate. Keep it safe.</span></div>`
    : '';
  const gems = fresh && config.gemsPerChest ? `<p class="gem-gain">+${config.gemsPerChest} ${GEM}</p>` : '';
  return panel(
    fresh ? `Treasure ${i} of ${TOTAL}` : esc(z.name),
    `<figure class="polaroid"><img src="${imgSrc(t.image, 'Your photo here')}" alt=""/><figcaption>${esc(t.title)}</figcaption></figure>
     <p class="memory">${esc(t.memory)}</p>
     ${rune}${gems}
     ${clueCard(t.clue, `Clue for ${esc(names[i + 1])}`)}
     <button class="btn" data-close>${fresh ? 'Follow the clue' : 'Close'}</button>`,
    { cls: 'treasure', closeBtn: !fresh },
  );
}

function showTreasure(i, fresh = false) {
  if (i === CASTLE) return showLetter();
  openModal(treasureHTML(i, fresh), {
    cls: fresh ? 'treasure-modal fresh' : 'treasure-modal',
    onClose: () => {
      if (!fresh) return;
      game.reveal(i + 1);
      sound('reveal');
      toast(i + 1 === CASTLE ? `${names[CASTLE]} rises from the clouds` : `The clouds over ${names[i + 1]} cleared`);
    },
  });
}

// ── Quest + vault ────────────────────────────────────────────────────────

function showQuest() {
  sound('tap');
  if (state.done) return showLetter();
  const i = current();
  openModal(
    panel(
      `Treasure ${i} of ${TOTAL}`,
      `<p class="prompt">Follow the road to <b>${esc(names[i])}</b>.</p>
       ${clueCard(clueFor(i))}
       <button class="btn" id="go">Show the island map</button>`,
    ),
  );
  $('#go').addEventListener('click', () => {
    closeModal();
    if (!game.overview) toggleMap();
  });
}

function showVault() {
  sound('tap');
  const cells = config.zones
    .map((z, k) => {
      const i = k + 1;
      return i <= state.solved
        ? `<button class="vault-cell got" data-i="${i}"><img src="${imgSrc(z.treasure.image, '')}" alt=""/>${z.treasure.rune ? `<span class="rune">${esc(z.treasure.rune)}</span>` : ''}<em>${i}</em></button>`
        : `<div class="vault-cell"><span class="q">${i}</span></div>`;
    })
    .join('');
  const letter = state.done
    ? `<button class="vault-cell got letter" data-i="${CASTLE}"><span class="seal">♥</span><em>${CASTLE}</em></button>`
    : `<div class="vault-cell letter"><span class="q">♥</span></div>`;
  const got = runesSoFar();
  const { el } = openModal(
    panel(
      `Vault · ${found()} / ${TOTAL}`,
      `<div class="vault-grid">${cells}${letter}</div>
       <p class="vault-note">Runes collected: <b>${got.join(' ') || 'none yet'}</b> (${got.length} of ${runes().length})</p>`,
    ),
  );
  el.querySelectorAll('.vault-cell.got').forEach((b) => b.addEventListener('click', () => showTreasure(+b.dataset.i)));
}

// ── Finale ───────────────────────────────────────────────────────────────

async function finale() {
  await wait(500);
  sound('fanfare');
  confetti(4500);
  const { el } = openModal(
    `<div class="levelup">
      <div class="rays"></div>
      <div class="lvl-star huge"><span>${config.startLevel}</span></div>
      <h2 class="levelup-title">${esc(config.finale.levelUpText)}</h2>
      <p class="levelup-sub">All ${TOTAL} treasures found. Happy birthday, ${esc(config.herName)}.</p>
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
state.gate && state.started ? renderGame() : renderTitle();

// test hook
window.__joy = { state: () => state, game: () => game, world: () => world };
