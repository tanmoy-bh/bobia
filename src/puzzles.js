// Puzzle renderers. Each one mounts into `root` and calls onSolve() / onWrong().

import { sound } from './fx.js';
import { photo } from './vault.js';

export const norm = (v) => String(v).toLowerCase().normalize('NFKD').replace(/[^a-z0-9]/g, '');

const h = (html) => {
  const t = document.createElement('template');
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
};

function shuffle(arr, notEqualTo) {
  const a = arr.slice();
  for (let tries = 0; tries < 50; tries++) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    if (!notEqualTo || a.join('') !== notEqualTo.join('')) break;
  }
  return a;
}

// Colourful stand-in art, used whenever a puzzle or treasure has no image yet.
export function placeholderArt(label = 'Your photo here') {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300">
    <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFB3CF"/><stop offset="1" stop-color="#FFE3A3"/></linearGradient></defs>
    <rect width="300" height="300" fill="url(#g)"/>
    <circle cx="62" cy="62" r="34" fill="#FFC83D" stroke="#3B2414" stroke-width="5"/>
    <path d="M0 230 Q 80 170 160 220 T 300 200 V300 H0 Z" fill="#79C24A" stroke="#3B2414" stroke-width="5"/>
    <path d="M0 262 Q 110 220 300 256 V300 H0 Z" fill="#4E9F3D" stroke="#3B2414" stroke-width="5"/>
    <path d="M150 196 C 92 150 104 96 150 118 C 196 96 208 150 150 196 Z" fill="#E84A7F" stroke="#3B2414" stroke-width="6"/>
    <text x="150" y="160" font-family="Lilita One, sans-serif" font-size="34" text-anchor="middle" fill="#fff" stroke="#3B2414" stroke-width="5" paint-order="stroke">33</text>
    <text x="196" y="46" font-family="Baloo 2, sans-serif" font-weight="700" font-size="17" text-anchor="middle" fill="#3B2414">${label}</text>
  </svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

// photos/… are the encrypted photos, decrypted by vault.js after the gate
export const imgSrc = (src, label) => (src ? photo(src) || (src.startsWith('photos/') ? placeholderArt(label) : src) : placeholderArt(label));

// ── text ─────────────────────────────────────────────────────────────────
function text(root, p, { onSolve, onWrong }) {
  const el = h(`<form class="pz-text" autocomplete="off">
    <input class="field" type="text" placeholder="Type your answer" aria-label="Your answer"
      autocapitalize="off" autocomplete="off" autocorrect="off" spellcheck="false" enterkeyhint="go"/>
    <button class="btn" type="submit">Unlock</button>
  </form>`);
  const input = el.querySelector('input');
  el.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!input.value.trim()) return input.focus();
    const ok = p.answers.some((a) => norm(a) === norm(input.value));
    ok ? onSolve() : (onWrong(), input.select());
  });
  // When the phone keyboard opens, keep the field in view.
  input.addEventListener('focus', () => setTimeout(() => input.scrollIntoView({ block: 'center', behavior: 'smooth' }), 350));
  root.append(el);
  // Only auto-focus with a real keyboard; on phones it would cover the clue.
  if (matchMedia('(hover: hover) and (pointer: fine)').matches) setTimeout(() => input.focus(), 350);
}

// ── code lock ────────────────────────────────────────────────────────────
function code(root, p, { onSolve, onWrong }) {
  const n = String(p.answer).length;
  const vals = Array(n).fill(0);
  const el = h(`<div class="pz-code">
    <div class="dials">${vals
      .map((_, i) => `<div class="dial" data-i="${i}">
        <button class="dial-btn" data-d="1" aria-label="Dial ${i + 1} up">▲</button>
        <div class="dial-num" aria-live="polite">0</div>
        <button class="dial-btn" data-d="-1" aria-label="Dial ${i + 1} down">▼</button>
      </div>`)
      .join('')}</div>
    <button class="btn" type="button">Try the lock</button>
  </div>`);
  el.querySelectorAll('.dial-btn').forEach((b) =>
    b.addEventListener('click', () => {
      const dial = b.closest('.dial');
      const i = +dial.dataset.i;
      vals[i] = (vals[i] + +b.dataset.d + 10) % 10;
      const num = dial.querySelector('.dial-num');
      num.textContent = vals[i];
      num.classList.remove('tick');
      void num.offsetWidth;
      num.classList.add('tick');
      sound('tick');
    }),
  );
  el.querySelector('.btn').addEventListener('click', () => (vals.join('') === String(p.answer) ? onSolve() : onWrong()));
  root.append(el);
}

// ── multiple choice ──────────────────────────────────────────────────────
function choice(root, p, { onSolve, onWrong }) {
  const hasImg = p.options.some((o) => o.image !== undefined);
  const el = h(`<div class="pz-choice ${hasImg ? 'with-img' : ''}">${p.options
    .map((o, i) => `<button class="opt" data-i="${i}">
      ${hasImg ? `<img src="${imgSrc(o.image, o.label)}" alt=""/>` : ''}
      <span>${o.label}</span></button>`)
    .join('')}</div>`);
  el.querySelectorAll('.opt').forEach((b) =>
    b.addEventListener('click', () => {
      if (+b.dataset.i === p.answer) {
        b.classList.add('right');
        onSolve();
      } else {
        b.classList.add('wrong');
        b.disabled = true;
        onWrong();
      }
    }),
  );
  root.append(el);
}

// ── tile swap ────────────────────────────────────────────────────────────
const STUCK_AFTER = 6; // swaps before "Wife is always right" shows up

function swap(root, p, { onSolve, onStuck }) {
  const g = p.grid || 3;
  const total = g * g;
  const solved = [...Array(total).keys()];
  let order = shuffle(solved, solved);
  let picked = null;
  let swaps = 0;
  const src = imgSrc(p.image, 'Your photo here');
  const el = h(`<div class="pz-swap" style="--g:${g}"></div>`);
  const draw = () => {
    el.innerHTML = order
      .map((t, pos) => {
        const x = (t % g) * (100 / (g - 1));
        const y = Math.floor(t / g) * (100 / (g - 1));
        return `<button class="tile ${picked === pos ? 'picked' : ''}" data-pos="${pos}" aria-label="Tile ${pos + 1}"
          style="background-image:url('${src}');background-position:${x}% ${y}%"></button>`;
      })
      .join('');
  };
  el.addEventListener('click', (e) => {
    const b = e.target.closest('.tile');
    if (!b) return;
    const pos = +b.dataset.pos;
    if (picked === null) {
      picked = pos;
      sound('tick');
    } else if (picked === pos) {
      picked = null;
    } else {
      [order[picked], order[pos]] = [order[pos], order[picked]];
      picked = null;
      sound('swap');
      if (++swaps === STUCK_AFTER) onStuck?.();
      if (order.every((t, i) => t === i)) {
        draw();
        el.classList.add('done');
        return setTimeout(onSolve, 700);
      }
    }
    draw();
  });
  draw();
  root.append(el);
}

// ── letter tiles (scramble + castle runes) ───────────────────────────────
function letters(root, p, { onSolve, onWrong }, pool) {
  const answer = String(p.answer).toUpperCase().replace(/\s/g, '');
  const tiles = shuffle(pool, answer.split('')).map((ch, id) => ({ ch, id, used: false }));
  const slots = Array(answer.length).fill(null);
  const el = h(`<div class="pz-letters ${p.type === 'runes' ? 'runes' : ''}" style="--n:${Math.max(answer.length, pool.length)}">
    <div class="slots"></div><div class="pool"></div>
  </div>`);
  const draw = () => {
    el.querySelector('.slots').innerHTML = slots
      .map((t, i) => `<button class="slot ${t ? 'filled' : ''}" data-i="${i}" aria-label="Slot ${i + 1}">${t ? t.ch : ''}</button>`)
      .join('');
    el.querySelector('.pool').innerHTML = tiles
      .map((t) => `<button class="ltile ${t.used ? 'used' : ''}" data-id="${t.id}" ${t.used ? 'disabled' : ''}>${t.ch}</button>`)
      .join('');
  };
  el.addEventListener('click', (e) => {
    const letter = e.target.closest('.ltile');
    const slot = e.target.closest('.slot');
    if (letter) {
      const t = tiles[+letter.dataset.id];
      const free = slots.indexOf(null);
      if (free < 0 || t.used) return;
      slots[free] = t;
      t.used = true;
      sound('tick');
      draw();
      if (!slots.includes(null)) {
        const word = slots.map((x) => x.ch).join('');
        if (word === answer) {
          el.classList.add('done');
          setTimeout(onSolve, 600);
        } else {
          onWrong();
          setTimeout(() => {
            slots.fill(null);
            tiles.forEach((x) => (x.used = false));
            draw();
          }, 650);
        }
      }
    } else if (slot && slots[+slot.dataset.i]) {
      slots[+slot.dataset.i].used = false;
      slots[+slot.dataset.i] = null;
      draw();
    }
  });
  draw();
  root.append(el);
}

export function mountPuzzle(root, p, handlers, ctx = {}) {
  switch (p.type) {
    case 'text':
      return text(root, p, handlers);
    case 'code':
      return code(root, p, handlers);
    case 'choice':
      return choice(root, p, handlers);
    case 'swap':
      return swap(root, p, handlers);
    case 'scramble':
      return letters(root, p, handlers, String(p.answer).toUpperCase().replace(/\s/g, '').split(''));
    case 'runes':
      return letters(root, p, handlers, ctx.runes || String(p.answer).toUpperCase().split(''));
    default:
      root.append(h(`<p>Unknown puzzle type: ${p.type}</p>`));
  }
}
