// The walkable island: canvas rendering, camera, movement along the road,
// clouds over every zone she hasn't reached, and chest proximity.

import { WORLD, C, ISLE, ROAD_HALF, CHEST_REACH, islandPath, islandR } from './world.js';
import { drawSprite } from './art.js';
import { drawGirl, drawTan } from './character.js';
import { createHabitats } from './habitats.js';
import { sound } from './fx.js';
import { drawObstacle, drawPuddle } from './obstacles.js';

if (typeof CanvasRenderingContext2D !== 'undefined' && !CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2);
    this.moveTo(x + r, y);
    this.arcTo(x + w, y, x + w, y + h, r);
    this.arcTo(x + w, y + h, x, y + h, r);
    this.arcTo(x, y + h, x, y, r);
    this.arcTo(x, y, x + w, y, r);
    this.closePath();
  };
}

const SPEED = 330; // world units per second
const CLEAR_MS = 1900;
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

export function createGame(canvas, { world, sprites, names, getProgress, isBlocked, onNear, onBump }) {
  const ctx = canvas.getContext('2d');
  const N = world.chests.length;
  const sand = islandPath(0);
  const grass = islandPath(62);
  const meadow = islandPath(330, 0.05);

  let vw = 0;
  let vh = 0;
  let dpr = 1;
  let baseScale = 1;
  const resize = () => {
    dpr = Math.min(2, window.devicePixelRatio || 1);
    vw = canvas.clientWidth;
    vh = canvas.clientHeight;
    canvas.width = Math.round(vw * dpr);
    canvas.height = Math.round(vh * dpr);
    baseScale = Math.max(0.5, Math.min(1.1, Math.min(vw, vh * 0.8) / 600));
  };
  resize();
  window.addEventListener('resize', resize);

  // ── player ──
  const prog = getProgress();
  const startAt = prog.solved > 0 ? world.chests[Math.min(prog.solved, N) - 1].road : world.start;
  const me = { x: startAt.x, y: startAt.y, dir: 'up', phase: 0, moving: false, z: 0, vz: 0 };
  me.s = world.nearest(me).s; // how far along the road she is

  // Tan walks the path she walked, a few steps behind (and hops where she hopped)
  const FOLLOW = 90;
  const trail = [];
  {
    // start him a little way back along the road
    let i = world.s.findIndex((v) => v >= me.s - FOLLOW - 10);
    if (i < 0) i = 0;
    for (; i < world.pts.length && world.s[i] <= me.s; i += 2) trail.push({ x: world.pts[i].x, y: world.pts[i].y, z: 0 });
    trail.push({ x: me.x, y: me.y, z: 0 });
  }
  const tan = { x: trail[0].x, y: trail[0].y, z: 0, dir: 'up', phase: 0, moving: false };
  let tanArrivedAt = -1e9;
  function followHer(dt) {
    const last = trail[trail.length - 1];
    if (Math.hypot(me.x - last.x, me.y - last.y) > 150) {
      // she jumped somewhere new (a fresh start, say): line him up behind her again
      trail.length = 0;
      let i = world.s.findIndex((v) => v >= me.s - FOLLOW - 10);
      if (i < 0) i = 0;
      for (; i < world.pts.length && world.s[i] <= me.s; i += 2) trail.push({ x: world.pts[i].x, y: world.pts[i].y, z: 0 });
      trail.push({ x: me.x, y: me.y, z: me.z });
      tan.x = trail[0].x;
      tan.y = trail[0].y;
    }
    if (Math.hypot(me.x - last.x, me.y - last.y) > 3 || me.z !== last.z) trail.push({ x: me.x, y: me.y, z: me.z });
    if (trail.length > 600) trail.splice(0, trail.length - 600);
    // the spot on her path FOLLOW units behind her
    let d = 0;
    let target = trail[0];
    for (let i = trail.length - 1; i > 0; i--) {
      d += Math.hypot(trail[i].x - trail[i - 1].x, trail[i].y - trail[i - 1].y);
      if (d >= FOLLOW) {
        target = trail[i - 1];
        break;
      }
    }
    const dx = target.x - tan.x;
    const dy = target.y - tan.y;
    const dist = Math.hypot(dx, dy);
    const max = SPEED * 1.4 * dt;
    tan.moving = dist > 0.5;
    if (tan.moving) {
      const k = Math.min(1, max / dist);
      tan.x += dx * k;
      tan.y += dy * k;
      tan.dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : dy > 0 ? 'down' : 'up';
      tan.phase += dt * 11;
    }
    tan.z = target.z;
  }
  const GRAVITY = 1500;
  let bumpedAt = 0;
  const puddleAt = (sv) => world.obstacles.find((o) => o.type === 'puddle' && Math.abs(sv - o.s) < o.half);

  // Joy grows up along the way: a crawling baby for the first two chests,
  // then a toddler who grows a little with every chest until the 25th
  const GROWN_AT = 25;
  const crawling = () => getProgress().solved < 2;
  const ageFor = () => Math.max(0, Math.min(1, (getProgress().solved - 2) / (GROWN_AT - 2)));
  // and the family grows too: Tan joins her after the 27th chest, she is
  // expecting after the 30th, and carries their daughter after the 31st
  const lookFor = () => {
    const n = getProgress().solved;
    return { age: ageFor(), crawl: crawling(), partner: n >= 27, belly: n === 30, baby: n >= 31 };
  };
  const sameLook = (a, b) => Math.abs(a.age - b.age) < 1e-3 && a.crawl === b.crawl && a.partner === b.partner && a.belly === b.belly && a.baby === b.baby;
  let look = lookFor(); // how she looks right now

  // After a chest she grows Mario style: a short freeze while she flickers
  // small, medium, big a few times (each pulse a little exaggerated, so even
  // a small step shows), then settles at her new size.
  const GROW_MS = 1100;
  const GROW_SEQ = [0, 1, 2, 0, 1, 2, 0, 1, 2, 2];
  const GROW_SIZE = [1, 1.09, 1.18];
  let grow = null;
  // pinch (or ctrl + scroll) to zoom the island; remembered between visits
  const ZOOM_MIN = 0.55;
  const ZOOM_MAX = 2.2;
  let zoom = 1;
  try {
    zoom = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, Number(localStorage.getItem('bobia-zoom')) || 1));
  } catch {}
  const setZoom = (z) => {
    zoom = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, z));
    try {
      localStorage.setItem('bobia-zoom', zoom.toFixed(3));
    } catch {}
  };
  const cam = { x: me.x, y: me.y - 60, scale: baseScale * zoom };
  let overview = false;

  // ── clouds ──
  const clearedAt = new Map(); // zone -> time it started clearing (-1 = already clear)
  for (let k = 1; k <= prog.solved + 1; k++) clearedAt.set(k, -1);

  // ── input ──
  const keys = new Set();
  const joy = { x: 0, y: 0 };
  const KEYMAP = { ArrowUp: 'u', KeyW: 'u', ArrowDown: 'd', KeyS: 'd', ArrowLeft: 'l', KeyA: 'l', ArrowRight: 'r', KeyD: 'r' };
  window.addEventListener('keydown', (e) => {
    if (e.target.closest?.('input')) return;
    const k = KEYMAP[e.code];
    if (!k) return;
    // remember held keys even behind a pop-up, so she walks the moment it closes
    keys.add(k);
    if (!isBlocked()) e.preventDefault();
  });
  window.addEventListener('keyup', (e) => {
    const k = KEYMAP[e.code];
    if (k) keys.delete(k);
  });
  window.addEventListener('blur', () => keys.clear());

  // two fingers anywhere on the island zoom in and out
  const fingers = new Map();
  let pinch = null;
  const spread = () => {
    const [a, b] = [...fingers.values()];
    return Math.hypot(a.x - b.x, a.y - b.y) || 1;
  };
  const onIsland = (e) => e.target.closest?.('#world, .stick-zone');
  // one finger (or the mouse) dragged on the island pans the view; it
  // glides back to Joy as soon as she walks again
  const pan = { x: 0, y: 0 };
  let drag = null;
  const down = (e) => {
    if (!onIsland(e) || isBlocked() || overview) return;
    if (e.target === canvas && !drag && (e.pointerType !== 'mouse' || e.button === 0)) {
      drag = { id: e.pointerId, x: e.clientX, y: e.clientY };
      canvas.classList.add('dragging');
    }
    if (e.pointerType !== 'touch') return;
    fingers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (fingers.size === 2) {
      pinch = { d0: spread(), z0: zoom };
      endDrag();
    }
  };
  const move = (e) => {
    if (drag && e.pointerId === drag.id && !pinch) {
      const dx = (e.clientX - drag.x) / cam.scale;
      const dy = (e.clientY - drag.y) / cam.scale;
      drag.x = e.clientX;
      drag.y = e.clientY;
      pan.x -= dx;
      pan.y -= dy;
      cam.x -= dx;
      cam.y -= dy;
      clampPan();
    }
    if (!fingers.has(e.pointerId)) return;
    fingers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pinch && fingers.size >= 2) setZoom((pinch.z0 * spread()) / pinch.d0);
  };
  const endDrag = () => {
    drag = null;
    canvas.classList.remove('dragging');
  };
  const up = (e) => {
    if (drag && e.pointerId === drag.id) endDrag();
    fingers.delete(e.pointerId);
    if (fingers.size < 2) pinch = null;
  };
  // keep the view over the island
  const clampPan = () => {
    const x = me.x + pan.x - C.x;
    const y = me.y - 50 + pan.y - C.y;
    const d = Math.hypot(x, y);
    const max = ISLE + 100;
    if (d > max) {
      pan.x -= (x * (d - max)) / d;
      pan.y -= (y * (d - max)) / d;
    }
  };
  window.addEventListener('pointerdown', down);
  window.addEventListener('pointermove', move);
  window.addEventListener('pointerup', up);
  window.addEventListener('pointercancel', up);
  // trackpad pinch arrives as ctrl + wheel; a mouse wheel zooms too
  canvas.addEventListener(
    'wheel',
    (e) => {
      if (isBlocked() || overview) return;
      e.preventDefault();
      setZoom(zoom * Math.exp(-e.deltaY * (e.ctrlKey ? 0.01 : 0.0015)));
    },
    { passive: false },
  );

  const habitats = createHabitats(ctx, world, sprites);

  // sparkles running down the Merlion's water arc (same curve as its sprite)
  function merlionSpray(x, y) {
    const t = performance.now() / 1000;
    const P = [[66, -164], [126, -184], [176, -130], [188, -16]];
    ctx.fillStyle = '#fff';
    for (let i = 0; i < 5; i++) {
      const u = (t * 0.7 + i / 5) % 1;
      const v = 1 - u;
      const bx = v * v * v * P[0][0] + 3 * v * v * u * P[1][0] + 3 * v * u * u * P[2][0] + u * u * u * P[3][0];
      const by = v * v * v * P[0][1] + 3 * v * v * u * P[1][1] + 3 * v * u * u * P[2][1] + u * u * u * P[3][1];
      ctx.beginPath();
      ctx.arc(x + bx * 0.82, y + by * 0.82, 2.6, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // ── static drawables, sorted by y each frame ──
  const statics = [
    ...habitats.statics,
    ...world.trees.map((t) => {
      // round trees come in a few kinds, picked from where they stand so the map stays the same
      const kinds = ['tree', 'tree', 'blossom', 'autumn', 'apple', 'birch', 'bush'];
      const kind = t.kind === 'pine' ? 'pine' : kinds[Math.abs(Math.floor(t.x * 7 + t.y * 13)) % kinds.length];
      return { y: t.y, x: t.x, r: 70, draw: () => drawSprite(ctx, sprites[kind], t.x, t.y, t.k) };
    }),
    ...world.chests.map((c) => ({
      y: c.landmark.y,
      x: c.landmark.x,
      r: 200,
      draw: () => {
        const k = c.landmark.type;
        drawSprite(ctx, sprites[k], c.landmark.x, c.landmark.y, 0.82);
        if (k === 'windmill') {
          ctx.save();
          ctx.translate(c.landmark.x, c.landmark.y - 146 * 0.82);
          ctx.rotate((performance.now() / 1000) * (reduceMotion ? 0 : 0.7));
          drawSprite(ctx, sprites.blades, 0, 0, 0.82);
          ctx.restore();
        }
        if (k === 'merlion' && !reduceMotion) merlionSpray(c.landmark.x, c.landmark.y);
      },
    })),
    ...world.chests.map((c) => ({
      y: c.y,
      x: c.x,
      r: 60,
      draw: () => {
        const p = getProgress();
        const open = c.k <= p.solved;
        if (c.k === p.solved + 1 && !p.done) {
          const pulse = 0.35 + 0.25 * Math.sin(performance.now() / 260);
          ctx.beginPath();
          ctx.ellipse(c.x, c.y, 62, 22, 0, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,236,140,${pulse})`;
          ctx.fill();
        }
        drawSprite(ctx, sprites[open ? 'chestOpen' : 'chest'], c.x, c.y, 0.85);
      },
    })),
    { y: world.castle.y, x: world.castle.x, r: 420, draw: () => drawSprite(ctx, sprites[getProgress().done ? 'castleOpen' : 'castle'], world.castle.x, world.castle.y, 1) },
    ...world.decor.map((d) => ({
      y: d.y,
      x: d.x,
      r: 120,
      draw: () => {
        const bob = d.sprite === 'balloons' && !reduceMotion ? Math.sin(performance.now() / 700 + d.x) * 4 : 0;
        drawSprite(ctx, sprites[d.sprite], d.x, d.y + bob, d.k);
      },
    })),
    { y: world.camp.y, x: world.camp.x, r: 160, draw: () => drawSprite(ctx, sprites.camp, world.camp.x, world.camp.y, 0.9) },
  ];

  // ── helpers ──
  const unlockedS = () => {
    const p = getProgress();
    return p.solved >= N ? world.total : world.chests[p.solved].s + 24;
  };
  const zoneRevealed = (k) => clearedAt.has(k);

  let near = null;
  function updateNear() {
    const p = getProgress();
    let best = null;
    let bd = CHEST_REACH;
    for (const c of world.chests) {
      if (c.k > p.solved + 1) break;
      const d = Math.hypot(me.x - c.x, me.y - c.y);
      if (d < bd) {
        bd = d;
        best = { type: 'chest', k: c.k, opened: c.k <= p.solved };
      }
    }
    if (p.solved >= N && Math.hypot(me.x - world.gate.x, me.y - world.gate.y) < 120) best = { type: 'castle', done: p.done };
    const key = best ? `${best.type}${best.k}${best.opened}${best.done}` : '';
    const prevKey = near ? `${near.type}${near.k}${near.opened}${near.done}` : '';
    if (key !== prevKey) {
      near = best;
      onNear(near);
    }
  }

  // ── simulation ──
  function step(dt) {
    let ix = 0;
    let iy = 0;
    if (!isBlocked() && !overview && !grow) {
      if (Math.hypot(joy.x, joy.y) > 0.12) {
        ix = joy.x;
        iy = joy.y;
      } else {
        ix = (keys.has('r') ? 1 : 0) - (keys.has('l') ? 1 : 0);
        iy = (keys.has('d') ? 1 : 0) - (keys.has('u') ? 1 : 0);
      }
    }
    const mag = Math.hypot(ix, iy);
    if (mag > 1) {
      ix /= mag;
      iy /= mag;
    }
    me.moving = mag > 0.05;
    if (me.moving) {
      const onGround = me.z < 12;
      const wading = onGround && puddleAt(me.s);
      const speed = SPEED * (look.crawl ? 0.8 : 0.85 + 0.15 * look.age) * (wading ? 0.4 : 1);
      const nx = me.x + ix * speed * dt;
      const ny = me.y + iy * speed * dt;
      const q = world.nearest({ x: nx, y: ny }, unlockedS());
      // rocks and logs stop her unless she is in the air
      const rock = onGround && world.obstacles.find((o) => o.solid && Math.abs(q.s - o.s) < o.half && Math.abs(me.s - o.s) >= o.half - 0.5);
      if (rock) {
        const now = performance.now();
        if (now - bumpedAt > 900) {
          bumpedAt = now;
          sound('bonk');
          onBump?.(rock);
        }
      } else {
        if (q.d > ROAD_HALF) {
          me.x = q.x + ((nx - q.x) * ROAD_HALF) / q.d;
          me.y = q.y + ((ny - q.y) * ROAD_HALF) / q.d;
        } else {
          me.x = nx;
          me.y = ny;
        }
        if (onGround && !wading && puddleAt(q.s)) sound('splash');
        me.s = q.s;
      }
      me.dir = Math.abs(ix) > Math.abs(iy) ? (ix > 0 ? 'right' : 'left') : iy > 0 ? 'down' : 'up';
      me.phase += dt * 11 * Math.min(1, mag + 0.3);
    }
    // jumping
    if (me.z > 0 || me.vz > 0) {
      me.vz -= GRAVITY * dt;
      me.z += me.vz * dt;
      if (me.z <= 0) {
        me.z = 0;
        me.vz = 0;
        sound(puddleAt(me.s) ? 'splash' : 'land');
      }
    }
    updateNear();
    habitats.update(me, zoneRevealed, performance.now());
    // grow as soon as the treasure closes
    const want = lookFor();
    const nowMs = performance.now();
    if (!grow && !isBlocked() && !sameLook(want, look)) {
      grow = { t0: nowMs, from: look, to: want };
      me.moving = false;
      sound('grow');
    }
    if (grow && nowMs - grow.t0 > GROW_MS) {
      if (grow.to.partner && !grow.from.partner) tanArrivedAt = nowMs;
      look = grow.to;
      grow = null;
    }
    followHer(dt);

    // camera
    if (me.moving && !drag) {
      const k = Math.pow(0.004, dt);
      pan.x *= k;
      pan.y *= k;
    }
    const target = overview
      ? { x: C.x, y: C.y, scale: Math.min(vw, vh - 120) / (2 * (ISLE + 160)) }
      : { x: me.x + pan.x, y: me.y - 50 + pan.y, scale: baseScale * zoom };
    const f = 1 - Math.pow(0.0015, dt);
    cam.x += (target.x - cam.x) * f;
    cam.y += (target.y - cam.y) * f;
    cam.scale += (target.scale - cam.scale) * f;
    if (!overview) {
      const halfW = vw / 2 / cam.scale;
      const halfH = vh / 2 / cam.scale;
      cam.x = Math.max(halfW - 200, Math.min(WORLD + 200 - halfW, cam.x));
      cam.y = Math.max(halfH - 200, Math.min(WORLD + 200 - halfH, cam.y));
    }
  }

  // ── rendering ──
  function sign(x, y, text) {
    ctx.font = '22px "Lilita One", "Arial Rounded MT Bold", sans-serif';
    const w = Math.max(100, ctx.measureText(text).width + 30);
    ctx.beginPath();
    ctx.roundRect(x - w / 2, y, w, 36, 9);
    ctx.fillStyle = '#A8743A';
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#3B2414';
    ctx.stroke();
    ctx.textAlign = 'center';
    ctx.lineWidth = 5;
    ctx.lineJoin = 'round';
    ctx.strokeText(text, x, y + 26);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(text, x, y + 26);
  }

  function drawPartner(now) {
    if (tan.z > 0) {
      const f = Math.max(0.35, 1 - tan.z / 110);
      ctx.beginPath();
      ctx.ellipse(tan.x, tan.y, 21 * f, 7 * f, 0, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,0,0,${0.22 * f})`;
      ctx.fill();
    }
    drawTan(ctx, tan.x, tan.y - tan.z, tan.dir, tan.phase, tan.moving && tan.z === 0, now / 1000, tan.z === 0);
    // a burst of hearts the moment he arrives
    const e = (performance.now() - tanArrivedAt) / 1600;
    if (e < 1) {
      ctx.save();
      for (let i = 0; i < 7; i++) {
        const a = -Math.PI / 2 + (i - 3) * 0.42;
        const r = 20 + e * 70;
        const hx = tan.x + Math.cos(a) * r;
        const hy = tan.y - 70 + Math.sin(a) * r - e * 20;
        ctx.globalAlpha = 1 - e;
        ctx.fillStyle = i % 2 ? '#E84A7F' : '#FF9CC0';
        ctx.beginPath();
        ctx.moveTo(hx, hy + 6);
        ctx.bezierCurveTo(hx - 10, hy - 2, hx - 6, hy - 10, hx, hy - 5);
        ctx.bezierCurveTo(hx + 6, hy - 10, hx + 10, hy - 2, hx, hy + 6);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  function drawJoy(now) {
    let st = look;
    let k = 1;
    if (grow) {
      const frame = Math.min(GROW_SEQ.length - 1, Math.floor(((now - grow.t0) / GROW_MS) * GROW_SEQ.length));
      const i = GROW_SEQ[Math.max(0, frame)];
      const mid = { ...grow.to, age: grow.from.crawl ? 0 : (grow.from.age + grow.to.age) / 2, crawl: false };
      st = [grow.from, mid, grow.to][i];
      k = GROW_SIZE[i];
    }
    if (me.z > 0) {
      // her shadow stays on the ground and shrinks as she rises
      const f = Math.max(0.35, 1 - me.z / 110);
      ctx.beginPath();
      ctx.ellipse(me.x, me.y, 20 * f, 6.5 * f, 0, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,0,0,${0.22 * f})`;
      ctx.fill();
    }
    ctx.save();
    ctx.translate(me.x, me.y - me.z);
    ctx.scale(k, k);
    drawGirl(ctx, 0, 0, me.dir, me.phase, me.moving && me.z === 0, now / 1000, st.age, st.crawl, me.z === 0, st);
    ctx.restore();
    if (grow) {
      // sparkles circling her while she grows
      const e = Math.min(1, (now - grow.t0) / GROW_MS);
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2 + e * 5;
        const r = 34 + e * 26;
        const tw = 0.5 + 0.5 * Math.sin(now / 70 + i);
        ctx.save();
        ctx.translate(me.x + Math.cos(a) * r, me.y - 42 + Math.sin(a) * r * 0.8);
        ctx.rotate(now / 300 + i);
        ctx.globalAlpha = (1 - e * 0.6) * tw;
        ctx.fillStyle = i % 2 ? '#FFE07A' : '#FFFFFF';
        ctx.beginPath();
        for (let j = 0; j < 8; j++) {
          const rr = j % 2 ? 2.5 : 8;
          ctx.lineTo(Math.cos((j * Math.PI) / 4) * rr, Math.sin((j * Math.PI) / 4) * rr);
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
      ctx.globalAlpha = 1;
    }
  }

  function marker(x, y, now) {
    const b = reduceMotion ? 0 : Math.sin(now / 280) * 7;
    ctx.save();
    ctx.translate(x, y + b);
    ctx.beginPath();
    ctx.moveTo(0, 30);
    ctx.lineTo(-10, 15);
    ctx.lineTo(10, 15);
    ctx.closePath();
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#3B2414';
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, 25, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.font = '34px "Lilita One", "Arial Black", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#E84A7F';
    ctx.fillText('!', 0, 12);
    ctx.restore();
  }

  function render(now) {
    const sc = cam.scale;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = '#2392D2';
    ctx.fillRect(0, 0, vw, vh);
    ctx.setTransform(dpr * sc, 0, 0, dpr * sc, dpr * (vw / 2 - cam.x * sc), dpr * (vh / 2 - cam.y * sc));

    const x0 = cam.x - vw / 2 / sc;
    const y0 = cam.y - vh / 2 / sc;
    const x1 = cam.x + vw / 2 / sc;
    const y1 = cam.y + vh / 2 / sc;
    const vis = (x, y, r) => x + r > x0 && x - r < x1 && y + r > y0 && y - r < y1;

    // sea waves
    ctx.strokeStyle = 'rgba(255,255,255,.5)';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    for (const w of world.waves) {
      if (!vis(w.x, w.y, 40)) continue;
      const dx = reduceMotion ? 0 : Math.sin(now / 900 + w.ph) * 8;
      ctx.beginPath();
      ctx.moveTo(w.x - 24 + dx, w.y);
      ctx.quadraticCurveTo(w.x - 12 + dx, w.y - 10, w.x + dx, w.y);
      ctx.quadraticCurveTo(w.x + 12 + dx, w.y + 10, w.x + 24 + dx, w.y);
      ctx.stroke();
    }

    if (!reduceMotion) dolphins(now, x0, y0, x1, y1);

    // island
    ctx.lineJoin = 'round';
    ctx.lineWidth = 28;
    ctx.strokeStyle = 'rgba(255,255,255,.5)';
    ctx.stroke(sand);
    ctx.fillStyle = '#F2D28B';
    ctx.fill(sand);
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#3B2414';
    ctx.stroke(sand);
    ctx.fillStyle = '#79C24A';
    ctx.fill(grass);
    ctx.stroke(grass);
    ctx.fillStyle = 'rgba(139,209,88,.55)';
    ctx.fill(meadow);

    for (const f of world.flowers) {
      if (!vis(f.x, f.y, 20)) continue;
      ctx.fillStyle = f.c;
      for (const [dx, dy] of [[0, 0], [12, 5], [4, 12]]) {
        ctx.beginPath();
        ctx.arc(f.x + dx, f.y + dy, 5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const T = reduceMotion ? 0 : now / 1000;
    habitats.ground(vis, T);

    // party plaza in front of the castle
    const pz = world.plaza;
    if (vis(pz.x, pz.y, pz.rx + 20)) {
      ctx.beginPath();
      ctx.ellipse(pz.x, pz.y, pz.rx, pz.ry, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#F1E2C2';
      ctx.fill();
      ctx.lineWidth = 6;
      ctx.strokeStyle = '#3B2414';
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(pz.x, pz.y, pz.rx - 34, pz.ry - 22, 0, 0, Math.PI * 2);
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#DCC79F';
      ctx.stroke();
    }

    // road
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#3B2414';
    ctx.lineWidth = 84;
    ctx.stroke(world.roadPath);
    ctx.strokeStyle = '#D9AE62';
    ctx.lineWidth = 74;
    ctx.stroke(world.roadPath);
    ctx.strokeStyle = '#EBCB86';
    ctx.lineWidth = 50;
    ctx.stroke(world.roadPath);
    ctx.setLineDash([2, 30]);
    ctx.strokeStyle = 'rgba(122,75,34,.55)';
    ctx.lineWidth = 8;
    ctx.stroke(world.roadPath);
    ctx.setLineDash([]);

    // puddles lie on the road
    for (const o of world.obstacles) if (o.type === 'puddle' && vis(o.x, o.y, 60)) drawPuddle(ctx, o, T);

    // pink carpet up to the castle gate
    if (vis(world.gate.x, world.gate.y + 60, 120)) {
      const gx = world.gate.x;
      const top = world.castle.y + 20;
      const bot = world.plaza.y + world.plaza.ry - 6;
      ctx.fillStyle = '#E84A7F';
      ctx.fillRect(gx - 26, top, 52, bot - top);
      ctx.fillStyle = '#FFC83D';
      ctx.fillRect(gx - 26, top, 5, bot - top);
      ctx.fillRect(gx + 21, top, 5, bot - top);
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#3B2414';
      ctx.strokeRect(gx - 26, top, 52, bot - top);
    }

    // things standing on the ground, back to front
    const items = statics.filter((o) => vis(o.x, o.y, o.r));
    items.push(...habitats.movers(vis, T));
    for (const o of world.obstacles) if (o.solid && vis(o.x, o.y, 70)) items.push({ y: o.y, draw: () => drawObstacle(ctx, o) });
    items.push({ y: me.y, draw: () => drawJoy(now) });
    if (look.partner) items.push({ y: tan.y, draw: () => drawPartner(now) });
    items.sort((a, b) => a.y - b.y);
    for (const o of items) o.draw();
    // owl and bat country: the map darkens to night around her
    const night = habitats.night(me);
    if (night > 0.01) {
      ctx.save();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const g = ctx.createRadialGradient(vw / 2, vh / 2, 40, vw / 2, vh / 2, Math.max(vw, vh) * 0.7);
      g.addColorStop(0, `rgba(20,26,76,${0.48 * night})`);
      g.addColorStop(1, `rgba(6,8,36,${0.8 * night})`);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, vw, vh);
      ctx.globalAlpha = night;
      ctx.beginPath();
      ctx.arc(vw - 70, 130, 26, 0, Math.PI * 2);
      ctx.fillStyle = '#FFF3B0';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(vw - 59, 122, 22, 0, Math.PI * 2);
      ctx.fillStyle = '#1C2558';
      ctx.fill();
      for (let i = 0; i < 18; i++) {
        const x = ((i * 397) % 1000) / 1000 * vw;
        const y = ((i * 173) % 1000) / 1000 * vh * 0.45 + 20;
        ctx.globalAlpha = night * (0.5 + 0.5 * Math.sin(now / 400 + i * 2.3));
        ctx.fillStyle = '#FFF3B0';
        ctx.fillRect(x, y, 2.5, 2.5);
      }
      ctx.restore();
    }

    habitats.air(vis, T, now);
    phoenix(T, vis);

    // signs + marker for revealed zones
    const p = getProgress();
    for (const c of world.chests) {
      if (!zoneRevealed(c.k) || !vis(c.landmark.x, c.landmark.y, 200)) continue;
      sign(c.landmark.x, c.landmark.y + 22, names[c.k]);
    }
    if (zoneRevealed(N + 1) && vis(world.castle.x, world.castle.y, 300)) sign(world.castle.x, world.plaza.y + world.plaza.ry + 8, names[N + 1]);
    if (p.done && vis(world.castle.x, world.castle.y - 200, 400)) {
      for (let i = 0; i < 16; i++) {
        const a = (i / 16) * Math.PI * 2;
        const x = world.castle.x + Math.cos(a) * (230 + (i % 3) * 30);
        const y = world.castle.y - 190 + Math.sin(a) * (170 + (i % 2) * 30);
        const tw = 0.5 + 0.5 * Math.sin(now / 300 + i * 1.7);
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(now / 1500 + i);
        ctx.globalAlpha = tw;
        ctx.fillStyle = i % 2 ? '#FFE07A' : '#FFFFFF';
        ctx.beginPath();
        for (let j = 0; j < 8; j++) {
          const r = j % 2 ? 4 : 11 * (0.6 + tw * 0.4);
          ctx.lineTo(Math.cos((j * Math.PI) / 4) * r, Math.sin((j * Math.PI) / 4) * r);
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
      ctx.globalAlpha = 1;
    }
    if (!p.done) {
      const cur = p.solved + 1;
      if (cur <= N) {
        const c = world.chests[cur - 1];
        if (vis(c.x, c.y, 120)) marker(c.x, c.y - 112, now);
      } else if (vis(world.gate.x, world.gate.y, 200)) marker(world.gate.x, world.gate.y - 130, now);
    }

    // clouds
    const visible = [];
    for (const pf of world.puffs) {
      if (!vis(pf.x, pf.y, pf.r + 200)) continue;
      const t0 = clearedAt.get(pf.zone);
      let a = 1;
      let off = 0;
      if (t0 !== undefined) {
        if (t0 < 0) continue;
        const k = Math.min(1, (now - t0) / CLEAR_MS);
        if (k >= 1) continue;
        const e = k * k * (3 - 2 * k);
        a = 1 - e;
        off = e * 260;
      }
      // a soft clear bubble around Joy so clouds never hide her
      const dme = Math.hypot(pf.x - me.x, pf.y - (me.y - 40));
      const bubble = Math.min(1, Math.max(0, (dme - 170) / 150));
      a *= bubble * bubble * (3 - 2 * bubble);
      if (a <= 0.01) continue;
      const wob = reduceMotion ? 0 : Math.sin(now / 1800 + pf.wob) * 6;
      visible.push({ x: pf.x + pf.dx * off + wob, y: pf.y + pf.dy * off, r: pf.r * (1 + (1 - a) * 0.3), a });
    }
    const layer = (color, grow, dy, k) => {
      ctx.fillStyle = color;
      for (const v of visible) {
        ctx.globalAlpha = v.a;
        ctx.beginPath();
        ctx.arc(v.x, v.y + dy, v.r * k + grow, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };
    layer('#A9C4DE', 7, 0, 1);
    layer('#DCE9F6', 0, 0, 1);
    layer('#FFFFFF', 0, -16, 0.84);

    // in overview, show where she is
    if (overview) {
      const pr = (16 + 5 * Math.sin(now / 200)) / cam.scale;
      ctx.beginPath();
      ctx.arc(me.x, me.y - 40, pr, 0, Math.PI * 2);
      ctx.lineWidth = 4 / cam.scale;
      ctx.strokeStyle = '#E84A7F';
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(me.x, me.y - 40, 6 / cam.scale, 0, Math.PI * 2);
      ctx.fillStyle = '#E84A7F';
      ctx.fill();
    }
  }

  // ── a phoenix circling above Heart Castle, trailing embers ──
  const embers = [];
  function phoenix(T, vis) {
    const cx = world.castle.x;
    const cy = world.castle.y - 480;
    if (!vis(cx, cy, 300)) return;
    const a = (reduceMotion ? 0.6 : T * 0.45) % (Math.PI * 2);
    const x = cx + Math.cos(a) * 190;
    const y = cy + Math.sin(a) * 50 + Math.sin(T * 2.2) * 8;
    const dir = -Math.sin(a) < 0 ? -1 : 1; // heading left or right
    const flap = reduceMotion ? 0.6 : Math.sin(T * 7);
    if (!reduceMotion && Math.random() < 0.6) embers.push({ x: x - dir * 30, y: y + 6, vx: -dir * (10 + Math.random() * 20), vy: 15 + Math.random() * 25, t0: T, c: Math.random() < 0.5 ? '#FFC83D' : '#FF8A2B' });
    for (let i = embers.length - 1; i >= 0; i--) {
      const e = embers[i];
      const k = (T - e.t0) / 1.2;
      if (k > 1 || k < 0) {
        embers.splice(i, 1);
        continue;
      }
      ctx.globalAlpha = 1 - k;
      ctx.fillStyle = e.c;
      ctx.beginPath();
      ctx.arc(e.x + e.vx * k, e.y + e.vy * k, 4 * (1 - k) + 1, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    ctx.save();
    ctx.translate(x, y);
    ctx.scale(dir * 1.25, 1.25);
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    const ink = '#3B2414';
    // glow
    const g = ctx.createRadialGradient(0, 0, 4, 0, 0, 70);
    g.addColorStop(0, 'rgba(255,200,61,.45)');
    g.addColorStop(1, 'rgba(255,138,43,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(0, 0, 70, 0, Math.PI * 2);
    ctx.fill();
    // long flowing tail feathers
    [['#E8393B', 0, 12], ['#FF8A2B', 10, 9], ['#FFC83D', -10, 7]].forEach(([c, dy, w], i) => {
      const wave = Math.sin(T * 4 + i) * 10;
      const path = () => {
        ctx.beginPath();
        ctx.moveTo(-12, 2);
        ctx.bezierCurveTo(-40, 10 + dy, -60, dy - 6 + wave, -92, 8 + dy + wave);
      };
      path();
      ctx.lineWidth = w + 5;
      ctx.strokeStyle = ink;
      ctx.stroke();
      path();
      ctx.lineWidth = w;
      ctx.strokeStyle = c;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(-94, 8 + dy + wave, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#FFE07A';
      ctx.fill();
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = ink;
      ctx.stroke();
    });
    // wings: the far one darker, behind the body
    const wing = (fill, edge, off, f) => {
      ctx.beginPath();
      ctx.moveTo(6 + off, -4);
      ctx.quadraticCurveTo(-4 + off, -30 * f - 14, -34 + off, -48 * f - 8);
      ctx.quadraticCurveTo(-30 + off, -30 * f, -40 + off, -26 * f + 2);
      ctx.quadraticCurveTo(-28 + off, -16 * f, -32 + off, -8 * f + 4);
      ctx.quadraticCurveTo(-14 + off, -4, -8 + off, 4);
      ctx.closePath();
      ctx.fillStyle = fill;
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = ink;
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-6 + off, -6);
      ctx.quadraticCurveTo(-20 + off, -24 * f - 6, -32 + off, -40 * f - 6);
      ctx.lineWidth = 3;
      ctx.strokeStyle = edge;
      ctx.stroke();
    };
    wing('#D93A2B', '#FF8A2B', 8, 0.7 + 0.5 * Math.sin(T * 7 + 0.6));
    // body
    ctx.beginPath();
    ctx.ellipse(0, 0, 24, 12, -0.15, 0, Math.PI * 2);
    ctx.fillStyle = '#FF6A2B';
    ctx.fill();
    ctx.lineWidth = 3.5;
    ctx.strokeStyle = ink;
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(4, 4, 14, 5, -0.15, 0, Math.PI * 2);
    ctx.fillStyle = '#FFC83D';
    ctx.fill();
    // head, crest and beak
    ctx.beginPath();
    ctx.moveTo(18, -16);
    ctx.lineTo(14, -32);
    ctx.lineTo(22, -22);
    ctx.lineTo(24, -36);
    ctx.lineTo(28, -20);
    ctx.lineTo(34, -30);
    ctx.lineTo(32, -14);
    ctx.closePath();
    ctx.fillStyle = '#FFC83D';
    ctx.fill();
    ctx.lineWidth = 2.5;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(26, -10, 11, 0, Math.PI * 2);
    ctx.fillStyle = '#FF6A2B';
    ctx.fill();
    ctx.lineWidth = 3.5;
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(35, -12);
    ctx.lineTo(46, -7);
    ctx.lineTo(35, -4);
    ctx.closePath();
    ctx.fillStyle = '#FFE07A';
    ctx.fill();
    ctx.lineWidth = 2.5;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(29, -12, 2.6, 0, Math.PI * 2);
    ctx.fillStyle = ink;
    ctx.fill();
    // near wing, in front of the body
    wing('#FF8A2B', '#FFE07A', 0, 0.7 + 0.5 * flap);
    ctx.restore();
  }

  // ── dolphins leaping out of the sea now and then, wherever she can see water ──
  const leaps = [];
  let nextLeap = 0;
  const LEAP_MS = 1500;
  const inSea = (x, y) => Math.hypot(x - C.x, y - C.y) > islandR(Math.atan2(y - C.y, x - C.x)) + 110;

  function dolphin(x, y, ang) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(ang);
    ctx.scale(1.3, 1.3);
    ctx.lineJoin = 'round';
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#3B2414';
    // tail flukes
    ctx.beginPath();
    ctx.moveTo(-32, 0);
    ctx.quadraticCurveTo(-44, -14, -50, -12);
    ctx.quadraticCurveTo(-44, 0, -50, 12);
    ctx.quadraticCurveTo(-44, 14, -32, 0);
    ctx.fillStyle = '#4F8FCC';
    ctx.fill();
    ctx.stroke();
    // fin
    ctx.beginPath();
    ctx.moveTo(-6, -11);
    ctx.quadraticCurveTo(-12, -26, -20, -26);
    ctx.quadraticCurveTo(-12, -16, -16, -8);
    ctx.fill();
    ctx.stroke();
    // body and snout
    ctx.beginPath();
    ctx.moveTo(-34, 0);
    ctx.quadraticCurveTo(-8, -18, 22, -8);
    ctx.quadraticCurveTo(32, -5, 42, 1);
    ctx.quadraticCurveTo(32, 6, 22, 6);
    ctx.quadraticCurveTo(-8, 13, -34, 0);
    ctx.fillStyle = '#5FA3DE';
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(6, 5, 18, 3.5, 0.05, 0, Math.PI * 2);
    ctx.fillStyle = '#D6ECFA';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(24, -3, 2.4, 0, Math.PI * 2);
    ctx.fillStyle = '#3B2414';
    ctx.fill();
    ctx.restore();
  }

  function splash(x, y, k) {
    ctx.strokeStyle = `rgba(255,255,255,${1 - k})`;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(x, y, 10 + k * 26, (10 + k * 26) * 0.35, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = `rgba(255,255,255,${1 - k})`;
    for (const dx of [-12, -4, 6, 13]) {
      ctx.beginPath();
      ctx.arc(x + dx * (1 + k), y - 6 - Math.sin(k * Math.PI) * 18 - Math.abs(dx) * 0.4, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function dolphins(now, x0, y0, x1, y1) {
    if (now > nextLeap) {
      nextLeap = now + 1800 + Math.random() * 2600;
      // look for open water just off the shore in the direction she is looking
      const a0 = Math.atan2(cam.y - C.y, cam.x - C.x);
      for (let tries = 0; tries < 24; tries++) {
        const a = a0 + (Math.random() - 0.5) * 1.2;
        const r = islandR(a) + 150 + Math.random() * 380;
        const x = C.x + Math.cos(a) * r;
        const y = C.y + Math.sin(a) * r;
        const dir = Math.random() < 0.5 ? -1 : 1;
        if (x < x0 + 60 || x > x1 - 60 || y < y0 + 120 || y > y1 - 40) continue;
        if (!inSea(x, y) || !inSea(x + dir * 150, y)) continue;
        leaps.push({ x, y, dir, t0: now });
        // sometimes a friend jumps right behind
        if (Math.random() < 0.4) leaps.push({ x: x - dir * 50, y: y + 18, dir, t0: now + 260 });
        break;
      }
    }
    for (let i = leaps.length - 1; i >= 0; i--) {
      const L = leaps[i];
      const k = (now - L.t0) / LEAP_MS;
      if (k < 0) continue;
      if (k > 1.35) {
        leaps.splice(i, 1);
        continue;
      }
      if (k < 0.3) splash(L.x, L.y, k / 0.3);
      if (k > 0.8) splash(L.x + L.dir * 150, L.y, Math.min(1, (k - 0.8) / 0.5));
      if (k > 1) continue;
      const x = L.x + L.dir * 150 * k;
      const y = L.y - Math.sin(k * Math.PI) * 80;
      const rise = -Math.cos(k * Math.PI) * 80 * Math.PI; // dy/dk, nose follows the arc
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(L.dir, 1);
      dolphin(0, 0, Math.atan2(rise, 150));
      ctx.restore();
    }
  }

  let last = performance.now();
  let raf = 0;
  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    step(dt);
    render(now);
    raf = requestAnimationFrame(frame);
  }
  raf = requestAnimationFrame(frame);

  return {
    joy,
    get near() {
      return near;
    },
    reveal(k) {
      if (!clearedAt.has(k)) clearedAt.set(k, performance.now());
    },
    setOverview(v) {
      overview = v;
      pan.x = pan.y = 0;
      endDrag();
    },
    get overview() {
      return overview;
    },
    // true while two fingers are pinching, so the thumbstick lets go
    get pinching() {
      return !!pinch;
    },
    position: () => ({ x: me.x, y: me.y }),
    // hop (a baby only manages a little bounce)
    jump() {
      if (me.z > 0 || me.vz > 0 || grow || isBlocked() || overview) return;
      me.vz = look.crawl ? 170 : 430;
      sound('jump');
    },
    // hold or let go of a direction ('u', 'd', 'l', 'r'), as the arrow keys do
    press(k, on) {
      on ? keys.add(k) : keys.delete(k);
    },
    // for tests: teleport next to the current target
    _warp(x, y) {
      me.x = x;
      me.y = y;
      me.s = world.nearest(me).s;
    },
    stop() {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointerdown', down);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
    },
  };
}

export { islandR };
