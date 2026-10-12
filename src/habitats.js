// Habitats: a little animal scene beside each landmark. Every habitat has
// its own ground, props, animated critters and a sound (with a speech
// bubble) that plays when Joy walks past.

import { drawSprite } from './art.js';
import { sound } from './fx.js';

// default habitat for each landmark, when a zone in config.js doesn't pick one
export const HABITAT_FOR = {
  palms: 'beach',
  windmill: 'farm',
  lighthouse: 'beach',
  lake: 'pond',
  falls: 'birds',
  cottage: 'garden',
  balloon: 'pasture',
  bench: 'fireflies',
  cake: 'bees',
};

// radius of each habitat in world units
export const HABITAT_R = { garden: 120, pond: 130, pasture: 135, farm: 150, bees: 105, mud: 110, beach: 115, birds: 100, fireflies: 105 };

// [sound, bubble text, which critter says it]
const CALLS = {
  garden: [['chime', '♪', 'butterfly']],
  pond: [['quack', 'Quack!', 'duck']],
  pasture: [['baa', 'Baa!', 'sheep']],
  farm: [['moo', 'Moo!', 'cow'], ['oink', 'Oink!', 'pig'], ['cluck', 'Cluck!', 'hen']],
  bees: [['buzz', 'Bzzz!', 'hive']],
  mud: [['ribbit', 'Ribbit!', 'frog']],
  beach: [['gull', 'Squawk!', 'gull']],
  birds: [['tweet', 'Tweet!', 'bird']],
  fireflies: [['crickets', '♪', 'firefly']],
};
const HEARD = 190; // she hears a habitat this far beyond its edge

const INK = '#3B2414';
const TAU = Math.PI * 2;

function rng(seed) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// walks back and forth around a home spot, pausing at each end
const wander = (hx, hy, ax, ay, speed, ph) => (T) => {
  const u = T * speed + ph;
  const sx = Math.sin(u);
  const vx = Math.cos(u) * (1.5 - 1.5 * sx * sx);
  return { x: hx + ax * sx * (1.5 - 0.5 * sx * sx), y: hy + ay * Math.sin(u * 0.5 + ph), flip: vx < 0, moving: Math.abs(vx) > 0.3 };
};

// sits, then hops to the next spot
const hopper = (pts, period, hopPart, height, ph) => (T) => {
  const n = pts.length;
  const tt = T / period + ph;
  const i = Math.floor(tt);
  const f = tt - i;
  const a = pts[((i % n) + n) % n];
  const b = pts[(((i + 1) % n) + n) % n];
  const u = Math.max(0, (f - (1 - hopPart)) / hopPart);
  return { x: a.x + (b.x - a.x) * u, y: a.y + (b.y - a.y) * u, lift: Math.sin(u * Math.PI) * height, flip: b.x < a.x, moving: u > 0 };
};

function shadow(ctx, x, y, rx) {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, rx * 0.32, 0, 0, TAU);
  ctx.fillStyle = 'rgba(0,0,0,.16)';
  ctx.fill();
}

function put(ctx, sp, x, y, k = 1, flip = false, rot = 0) {
  ctx.save();
  ctx.translate(x, y);
  if (flip) ctx.scale(-1, 1);
  if (rot) ctx.rotate(rot);
  drawSprite(ctx, sp, 0, 0, k);
  ctx.restore();
}

function blob(ctx, x, y, rx, ry, fill, stroke, lw = 5) {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, TAU);
  ctx.fillStyle = fill;
  ctx.fill();
  if (stroke) {
    ctx.lineWidth = lw;
    ctx.strokeStyle = stroke;
    ctx.stroke();
  }
}

// ── little flyers, drawn straight onto the canvas ──

function butterfly(ctx, x, y, T, ph, c1, c2) {
  const fl = 0.2 + 0.8 * Math.abs(Math.sin(T * 12 + ph));
  ctx.save();
  ctx.translate(x, y);
  ctx.lineWidth = 2;
  ctx.strokeStyle = INK;
  for (const sd of [-1, 1]) {
    ctx.save();
    ctx.scale(sd * fl, 1);
    ctx.beginPath();
    ctx.ellipse(8, -5, 9, 7.5, -0.5, 0, TAU);
    ctx.fillStyle = c1;
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(6, 6, 6, 5, 0.5, 0, TAU);
    ctx.fillStyle = c2;
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(9, -6, 2.4, 0, TAU);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.restore();
  }
  ctx.beginPath();
  ctx.ellipse(0, 0, 2.4, 8, 0, 0, TAU);
  ctx.fillStyle = INK;
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(-1, -7);
  ctx.quadraticCurveTo(-4, -14, -6, -14);
  ctx.moveTo(1, -7);
  ctx.quadraticCurveTo(4, -14, 6, -14);
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.restore();
}

function bee(ctx, x, y, T, ph, flip) {
  ctx.save();
  ctx.translate(x, y);
  if (flip) ctx.scale(-1, 1);
  const w = 0.4 + 0.6 * Math.abs(Math.sin(T * 40 + ph));
  ctx.lineWidth = 1.6;
  ctx.strokeStyle = INK;
  ctx.fillStyle = 'rgba(255,255,255,.85)';
  for (const dx of [-3, 2]) {
    ctx.beginPath();
    ctx.ellipse(dx, -7, 3.5, 6 * w, dx * 0.12, 0, TAU);
    ctx.fill();
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.ellipse(0, 0, 8, 5.5, 0, 0, TAU);
  ctx.fillStyle = '#FFC83D';
  ctx.fill();
  ctx.save();
  ctx.clip();
  ctx.fillStyle = INK;
  ctx.fillRect(-4, -6, 2.5, 12);
  ctx.fillRect(1, -6, 2.5, 12);
  ctx.restore();
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(5, -1.2, 1.2, 0, TAU);
  ctx.fillStyle = INK;
  ctx.fill();
  ctx.restore();
}

function gull(ctx, x, y, T, ph, flip) {
  const w = Math.sin(T * 7 + ph) * 7;
  ctx.save();
  ctx.translate(x, y);
  if (flip) ctx.scale(-1, 1);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  const wings = () => {
    ctx.beginPath();
    ctx.moveTo(-22, -4 - w);
    ctx.quadraticCurveTo(-10, -12 - w * 0.6, 0, 0);
    ctx.quadraticCurveTo(10, -12 - w * 0.6, 22, -4 - w);
  };
  wings();
  ctx.lineWidth = 8;
  ctx.strokeStyle = INK;
  ctx.stroke();
  wings();
  ctx.lineWidth = 4;
  ctx.strokeStyle = '#fff';
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(0, 1, 9, 6, 0, 0, TAU);
  ctx.fillStyle = '#fff';
  ctx.fill();
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = INK;
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(8, -1);
  ctx.lineTo(15, 1);
  ctx.lineTo(8, 3);
  ctx.closePath();
  ctx.fillStyle = '#FF9F3D';
  ctx.fill();
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(4, -1, 1.4, 0, TAU);
  ctx.fillStyle = INK;
  ctx.fill();
  ctx.restore();
}

function firefly(ctx, x, y, glow) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, 26);
  g.addColorStop(0, `rgba(255,236,90,${0.95 * glow})`);
  g.addColorStop(0.4, `rgba(255,236,90,${0.45 * glow})`);
  g.addColorStop(1, 'rgba(255,236,90,0)');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(x, y, 26, 0, TAU);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x, y, 5, 0, TAU);
  ctx.fillStyle = glow > 0.5 ? '#FFF7B0' : '#FFE45C';
  ctx.fill();
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = 'rgba(59,36,20,.6)';
  ctx.stroke();
}

function bubble(ctx, x, y, text, age) {
  const pop = Math.min(1, age * 7);
  const k = 0.5 + 0.5 * (1 + 2.2 * (pop - 1) ** 3 + 1.2 * (pop - 1) ** 2);
  ctx.save();
  ctx.translate(x, y - age * 12);
  ctx.scale(k, k);
  ctx.globalAlpha = age > 0.8 ? (1 - age) / 0.2 : 1;
  ctx.font = '22px "Lilita One", "Arial Rounded MT Bold", sans-serif';
  const w = ctx.measureText(text).width + 24;
  ctx.beginPath();
  ctx.roundRect(-w / 2, -40, w, 32, 14);
  ctx.moveTo(-7, -9);
  ctx.lineTo(0, 0);
  ctx.lineTo(7, -9);
  ctx.fillStyle = '#fff';
  ctx.fill();
  ctx.lineWidth = 3.5;
  ctx.strokeStyle = INK;
  ctx.lineJoin = 'round';
  ctx.stroke();
  ctx.fillStyle = '#fff';
  ctx.fillRect(-6, -12, 12, 4);
  ctx.fillStyle = INK;
  ctx.textAlign = 'center';
  ctx.fillText(text, 0, -16);
  ctx.restore();
}

// ── building each habitat ──

function build(h, sprites, ctx) {
  const rand = rng(h.k * 977 + 13);
  const rx = h.r;
  const ry = h.r * 0.62;
  const z = Math.max(0.7, Math.min(1, h.r / HABITAT_R[h.type])); // smaller habitats get smaller things
  const at = (fx, fy) => ({ x: h.x + fx * rx, y: h.y + fy * ry });
  const inside = (k = 0.8) => {
    const a = rand() * TAU;
    const d = Math.sqrt(rand()) * k;
    return at(Math.cos(a) * d, Math.sin(a) * d);
  };
  const ground = [];
  const statics = [];
  const movers = [];
  const flyers = [];
  const prop = (name, p, k = 1) => statics.push({ x: p.x, y: p.y, r: 120, draw: () => drawSprite(ctx, sprites[name], p.x, p.y, k * z) });
  const walker = (name, tag, k, path, opts = {}) =>
    movers.push({
      tag,
      height: (opts.height ?? 50) * z,
      path,
      draw(ctx, T) {
        const p = path(T);
        const bob = p.moving ? -Math.abs(Math.sin(T * (opts.step ?? 9) + (opts.ph ?? 0))) * (opts.bob ?? 3) : 0;
        shadow(ctx, p.x, p.y, (opts.shadow ?? 16) * z);
        const rot = opts.rot ? opts.rot(T, p) : 0;
        put(ctx, sprites[name], p.x, p.y + bob - (p.lift || 0), k * z, opts.noFlip ? false : p.flip, rot);
      },
    });
  const tulips = (count, k = 0.85, spread = 0.85) => {
    const names = ['tulipPink', 'tulipGold', 'tulipPurple', 'tulipRed'];
    for (let i = 0; i < count; i++) prop(names[(rand() * 4) | 0], inside(spread), k * (0.85 + rand() * 0.3));
  };

  switch (h.type) {
    case 'garden': {
      ground.push((ctx) => blob(ctx, h.x, h.y, rx, ry, '#9BD86C'));
      ground.push((ctx) => blob(ctx, h.x, h.y, rx * 0.7, ry * 0.7, '#A9E07A'));
      tulips(26, 1);
      const cols = [['#FF9CC0', '#FFD1E1'], ['#FFC83D', '#FFE9A6'], ['#8FD8FF', '#D6F1FF'], ['#C58BF2', '#E8D2FF']];
      for (let i = 0; i < 5; i++) {
        const ph = rand() * TAU;
        const sp = 0.7 + rand() * 0.6;
        const [c1, c2] = cols[i % cols.length];
        const path = (T) => ({
          x: h.x + rx * 0.75 * Math.sin(T * 0.45 * sp + ph),
          y: h.y - 45 + ry * 0.7 * Math.sin(T * 0.7 * sp + ph * 2) + Math.sin(T * 3 + ph) * 6,
        });
        flyers.push({ tag: 'butterfly', path, draw: (ctx, T) => { const p = path(T); butterfly(ctx, p.x, p.y, T, ph, c1, c2); } });
      }
      break;
    }
    case 'bees': {
      ground.push((ctx) => blob(ctx, h.x, h.y, rx, ry, '#9BD86C'));
      const hive = at(0, -0.05);
      prop('hive', hive, 1);
      for (let i = 0; i < 16; i++) {
        const a = (i / 16) * TAU + rand() * 0.2;
        const d = 0.55 + rand() * 0.35;
        prop(['tulipPink', 'tulipGold', 'tulipPurple'][i % 3], at(Math.cos(a) * d, Math.sin(a) * d), 0.95);
      }
      movers.push({ tag: 'hive', height: 96, path: () => ({ x: hive.x, y: hive.y }), draw() {} });
      for (let i = 0; i < 7; i++) {
        const ph = rand() * TAU;
        const sp = 0.8 + rand() * 0.6;
        const R = 30 + rand() * 50;
        const path = (T) => ({
          x: hive.x + R * Math.sin(T * 1.6 * sp + ph),
          y: hive.y - 55 + R * 0.5 * Math.sin(T * 2.7 * sp + ph) + Math.sin(T * 9 + ph) * 3,
          flip: Math.cos(T * 1.6 * sp + ph) < 0,
        });
        flyers.push({ path, draw: (ctx, T) => { const p = path(T); bee(ctx, p.x, p.y, T, ph, p.flip); } });
      }
      break;
    }
    case 'pond': {
      ground.push((ctx) => blob(ctx, h.x, h.y, rx * 0.95, ry * 0.95, '#F2D28B', INK, 5));
      ground.push((ctx) => blob(ctx, h.x, h.y + 2, rx * 0.82, ry * 0.8, '#43B3E8'));
      ground.push((ctx) => blob(ctx, h.x, h.y - 6, rx * 0.7, ry * 0.6, '#5EC8F2'));
      const pads = Array.from({ length: 5 }, () => ({ ...inside(0.6), a: rand() * TAU, flower: rand() < 0.4 }));
      ground.push((ctx, T) => {
        ctx.strokeStyle = 'rgba(255,255,255,.55)';
        ctx.lineWidth = 3;
        for (let i = 0; i < 3; i++) {
          const k = ((T * 0.25 + i / 3) % 1);
          ctx.globalAlpha = 1 - k;
          ctx.beginPath();
          ctx.ellipse(h.x + rx * 0.2, h.y + ry * 0.1, 12 + k * 50, (12 + k * 50) * 0.45, 0, 0, TAU);
          ctx.stroke();
        }
        ctx.globalAlpha = 1;
        for (const p of pads) {
          ctx.beginPath();
          ctx.ellipse(p.x, p.y, 14, 8, 0, p.a, p.a + TAU - 0.7);
          ctx.lineTo(p.x, p.y);
          ctx.closePath();
          ctx.fillStyle = '#5DAE3B';
          ctx.fill();
          ctx.lineWidth = 2.5;
          ctx.strokeStyle = INK;
          ctx.stroke();
          if (p.flower) blob(ctx, p.x + 2, p.y - 3, 5, 4, '#FF9CC0', INK, 2);
        }
      });
      prop('reeds', at(-0.8, -0.35), 0.9);
      prop('reeds', at(0.85, 0.3), 0.8);
      const dir = rand() < 0.5 ? 1 : -1;
      const ph = rand() * TAU;
      const swim = (lag) => (T) => {
        const a = (T * 0.35 + ph) * dir - lag * dir;
        return { x: h.x + rx * 0.5 * Math.cos(a), y: h.y + ry * 0.42 * Math.sin(a), flip: (-Math.sin(a) * dir) < 0 };
      };
      [['duck', 0, 1, 'duck'], ['duckling', 0.38, 1, 'duckling'], ['duckling', 0.68, 1, 'duckling']].forEach(([name, lag, k, tag]) => {
        const path = swim(lag);
        movers.push({
          tag,
          height: 42,
          path,
          draw(ctx, T) {
            const p = path(T);
            const bob = Math.sin(T * 3 + lag * 5) * 1.3;
            ctx.strokeStyle = 'rgba(255,255,255,.7)';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.ellipse(p.x, p.y + 1, name === 'duck' ? 24 : 15, name === 'duck' ? 6 : 4, 0, 0, TAU);
            ctx.stroke();
            put(ctx, sprites[name], p.x, p.y + bob, k * z, p.flip);
          },
        });
      });
      break;
    }
    case 'pasture': {
      ground.push((ctx) => blob(ctx, h.x, h.y, rx, ry, '#A5DB72'));
      const posts = 18;
      const post = (i) => at(Math.cos((i / posts) * TAU) * 0.98, Math.sin((i / posts) * TAU) * 0.98);
      for (let i = 0; i < posts; i++) {
        if (i === Math.round(posts * 0.25)) continue; // a gap for the gate
        const a = post(i);
        const b = post(i + 1);
        statics.push({
          x: (a.x + b.x) / 2,
          y: Math.max(a.y, b.y),
          r: 60,
          draw: () => {
            ctx.lineCap = 'round';
            for (const dy of [-26, -12]) {
              ctx.beginPath();
              ctx.moveTo(a.x, a.y + dy);
              ctx.lineTo(b.x, b.y + dy);
              ctx.lineWidth = 9;
              ctx.strokeStyle = INK;
              ctx.stroke();
              ctx.lineWidth = 4.5;
              ctx.strokeStyle = '#D9A55B';
              ctx.stroke();
            }
            for (const p of [a, b]) {
              ctx.beginPath();
              ctx.roundRect(p.x - 5, p.y - 36, 10, 38, 3);
              ctx.fillStyle = '#C48A4A';
              ctx.fill();
              ctx.lineWidth = 3;
              ctx.strokeStyle = INK;
              ctx.stroke();
            }
          },
        });
      }
      tulips(6, 0.8, 0.7);
      const flock = z > 0.85 ? 3 : 2;
      for (let i = 0; i < flock; i++) {
        const home = at(flock === 3 ? -0.5 + i * 0.5 : -0.35 + i * 0.7, i % 2 ? 0.3 : -0.25);
        walker('sheep', 'sheep', 0.9 - i * 0.05, wander(home.x, home.y, rx * 0.12, 5, 0.3 + rand() * 0.2, rand() * TAU), { height: 62, shadow: 20, ph: i });
      }
      break;
    }
    case 'farm': {
      ground.push((ctx) => blob(ctx, h.x, h.y, rx, ry, '#E8CD93'));
      ground.push((ctx) => blob(ctx, h.x + rx * 0.42, h.y + ry * 0.2, rx * 0.3, ry * 0.3, '#9C6B3E', 'rgba(59,36,20,.5)', 3));
      const barn = at(-0.2, -0.62);
      prop('barn', barn, 0.85);
      prop('hay', at(0.5, -0.45), 0.9);
      prop('hay', at(0.72, -0.3), 0.75);
      movers.push({ tag: 'barn', height: 130, path: () => barn, draw() {} });
      const cow = at(-0.55, 0.2);
      walker('cow', 'cow', 0.8, wander(cow.x, cow.y, 28, 4, 0.22, rand() * TAU), { height: 90, shadow: 32, step: 6, bob: 2 });
      const pig = at(0.42, 0.25);
      walker('pig', 'pig', 0.85, wander(pig.x, pig.y, 20, 3, 0.4, rand() * TAU), { height: 60, shadow: 24, rot: (T) => Math.sin(T * 7) * 0.04 });
      for (let i = 0; i < (z > 0.85 ? 3 : 2); i++) {
        const home = at(-0.15 + i * 0.22, 0.55 + (i % 2) * 0.12);
        const ph = rand() * TAU;
        walker('hen', 'hen', 0.95, wander(home.x, home.y, 22, 5, 0.5 + rand() * 0.3, ph), {
          height: 50,
          shadow: 14,
          rot: (T, p) => (!p.moving && Math.sin(T * 5 + ph) > 0.4 ? 0.45 : 0),
        });
      }
      for (let i = 0; i < 2; i++) {
        const home = at(0.1 + i * 0.2, 0.75);
        walker('chick', 'chick', 1, wander(home.x, home.y, 14, 3, 0.9 + rand() * 0.4, rand() * TAU), { height: 26, shadow: 8, step: 14, bob: 2 });
      }
      break;
    }
    case 'mud': {
      ground.push((ctx) => blob(ctx, h.x, h.y, rx * 0.92, ry * 0.9, '#8B5E34', INK, 5));
      const spots = Array.from({ length: 6 }, () => ({ ...inside(0.6), s: 8 + rand() * 14, water: rand() < 0.35 }));
      ground.push((ctx) => {
        for (const p of spots) blob(ctx, p.x, p.y, p.s, p.s * 0.55, p.water ? '#7FB8D6' : '#6E4826');
      });
      prop('reeds', at(-0.85, -0.2), 0.85);
      prop('reeds', at(0.8, -0.45), 0.75);
      prop('mushrooms', at(0.75, 0.55), 0.7);
      for (let i = 0; i < 3; i++) {
        const pts = Array.from({ length: 5 }, (_, j) => {
          const a = ((j * 2 + i) / 5) * TAU + rand() * 0.4;
          const d = 0.35 + rand() * 0.35;
          return at(Math.cos(a) * d, Math.sin(a) * d);
        });
        walker('frog', 'frog', 1, hopper(pts, 2.6 + rand(), 0.22, 26, rand() * 5), { height: 40, shadow: 12, noFlip: true, bob: 0 });
      }
      break;
    }
    case 'beach': {
      ground.push((ctx) => blob(ctx, h.x, h.y, rx, ry, '#F5DDA0', 'rgba(217,174,98,.8)', 4));
      const pool = at(0.35, 0.15);
      ground.push((ctx) => blob(ctx, pool.x, pool.y, rx * 0.28, ry * 0.26, '#5EC8F2', INK, 3));
      const shells = Array.from({ length: 7 }, () => ({ ...inside(0.85), c: ['#FF9CC0', '#FFF6E8', '#FFC83D'][(rand() * 3) | 0], star: rand() < 0.4 }));
      ground.push((ctx) => {
        for (const sh of shells) {
          ctx.beginPath();
          if (sh.star) {
            for (let j = 0; j < 10; j++) {
              const r = j % 2 ? 3.5 : 9;
              ctx.lineTo(sh.x + Math.cos((j * Math.PI) / 5 - Math.PI / 2) * r, sh.y + Math.sin((j * Math.PI) / 5 - Math.PI / 2) * r);
            }
            ctx.closePath();
          } else ctx.arc(sh.x, sh.y, 6, Math.PI, 0);
          ctx.fillStyle = sh.star ? '#FF8A5B' : sh.c;
          ctx.fill();
          ctx.lineWidth = 2;
          ctx.strokeStyle = INK;
          ctx.stroke();
        }
      });
      prop('umbrella', at(-0.5, -0.3), 0.9);
      for (let i = 0; i < 2; i++) {
        const home = at(-0.2 + i * 0.5, 0.45 - i * 0.6);
        walker('crab', 'crab', 1, wander(home.x, home.y, 30, 4, 1.1 + rand() * 0.5, rand() * TAU), {
          height: 42,
          shadow: 14,
          noFlip: true,
          step: 16,
          bob: 2,
        });
      }
      for (let i = 0; i < 2; i++) {
        const ph = rand() * TAU;
        const dir = i ? -1 : 1;
        const R = 90 + i * 40;
        const path = (T) => {
          const a = T * 0.55 * dir + ph;
          return { x: h.x + R * Math.cos(a), y: h.y - 150 - i * 30 + R * 0.35 * Math.sin(a), gy: h.y + R * 0.3 * Math.sin(a), flip: -Math.sin(a) * dir < 0 };
        };
        flyers.push({
          tag: 'gull',
          height: 18,
          path,
          draw: (ctx, T) => {
            const p = path(T);
            shadow(ctx, p.x, p.gy, 12);
            gull(ctx, p.x, p.y, T, ph, p.flip);
          },
        });
      }
      break;
    }
    case 'birds': {
      ground.push((ctx) => blob(ctx, h.x, h.y, rx, ry, '#9BD86C'));
      const seeds = Array.from({ length: 14 }, () => inside(0.6));
      ground.push((ctx) => {
        ctx.fillStyle = '#C99A2E';
        for (const p of seeds) {
          ctx.beginPath();
          ctx.ellipse(p.x, p.y, 2.5, 1.6, 0, 0, TAU);
          ctx.fill();
        }
      });
      prop('birdhouse', at(-0.1, -0.45), 1);
      tulips(8, 0.8);
      for (let i = 0; i < 4; i++) {
        const pts = Array.from({ length: 6 }, () => inside(0.7));
        walker(i % 2 ? 'songbirdPink' : 'songbirdBlue', 'bird', 1, hopper(pts, 1.1 + rand() * 0.5, 0.35, 12, rand() * 6), {
          height: 34,
          shadow: 10,
          bob: 0,
        });
      }
      break;
    }
    case 'fireflies': {
      ground.push((ctx) => blob(ctx, h.x, h.y, rx, ry, '#5EA53C'));
      ground.push((ctx) => blob(ctx, h.x, h.y, rx * 0.65, ry * 0.65, '#4E9433'));
      prop('mushrooms', at(-0.45, -0.2), 1);
      prop('mushrooms', at(0.4, 0.3), 0.85);
      prop('mushrooms', at(0.1, -0.55), 0.7);
      for (let i = 0; i < 12; i++) {
        const ph = rand() * TAU;
        const sp = 0.6 + rand() * 0.8;
        const path = (T) => ({
          x: h.x + rx * 0.75 * Math.sin(T * 0.3 * sp + ph),
          y: h.y - 30 + ry * 0.6 * Math.sin(T * 0.45 * sp + ph * 1.7) - 18 * Math.sin(T * 0.9 + ph),
        });
        flyers.push({
          tag: 'firefly',
          height: 10,
          path,
          draw: (ctx, T) => {
            const p = path(T);
            firefly(ctx, p.x, p.y, 0.5 + 0.5 * Math.sin(T * 2.6 + ph * 3));
          },
        });
      }
      break;
    }
  }

  return { ...h, ground, statics, movers, flyers, rand, last: -1e9, next: 0, call: 0, bubble: null };
}

export function createHabitats(ctx, world, sprites) {
  const list = world.habitats.map((h) => build(h, sprites, ctx));

  let active = null;

  function speak(h, now, word, tag) {
    const who = [...h.movers, ...h.flyers].filter((m) => m.tag === tag);
    const m = who[(h.rand() * who.length) | 0] || h.movers[0] || h.flyers[0];
    if (m) h.bubble = { text: word, t0: now, m };
  }

  function call(h, now, fresh) {
    h.last = now;
    if (h.type === 'farm' && fresh) {
      sound('farm');
      speak(h, now, 'E-I-E-I-O ♪', 'barn');
      h.next = now + 4800;
      return;
    }
    const calls = CALLS[h.type];
    const [name, word, tag] = calls[h.call++ % calls.length];
    sound(name);
    speak(h, now, word, tag);
    h.next = now + 3500 + h.rand() * 3000;
  }

  return {
    statics: list.flatMap((h) => h.statics),

    // ground patches, drawn before the road
    ground(vis, T) {
      for (const h of list) if (vis(h.x, h.y, h.r + 40)) for (const g of h.ground) g(ctx, T);
    },

    // animals walking on the ground, sorted with trees and Joy
    movers(vis, T) {
      const out = [];
      for (const h of list) {
        if (!vis(h.x, h.y, h.r + 80)) continue;
        for (const m of h.movers) {
          const p = m.path(T);
          out.push({ y: p.y, draw: () => m.draw(ctx, T) });
        }
      }
      return out;
    },

    // butterflies, bees, gulls, fireflies and speech bubbles
    air(vis, T, now) {
      for (const h of list) {
        if (!vis(h.x, h.y - 80, h.r + 160)) continue;
        for (const f of h.flyers) f.draw(ctx, T);
        const b = h.bubble;
        if (!b) continue;
        const age = (now - b.t0) / 1500;
        if (age >= 1) {
          h.bubble = null;
          continue;
        }
        const p = b.m.path(T);
        bubble(ctx, p.x, p.y - (p.lift || 0) - (b.m.height ?? 40) - 6, b.text, age);
      }
    },

    // play the sound of the habitat she is walking past (only the nearest
    // one, so neighbours don't talk over each other)
    update(me, revealed, now) {
      let near = null;
      let best = Infinity;
      for (const h of list) {
        const d = Math.hypot(me.x - h.x, me.y - h.y) - h.r;
        if (d < HEARD && d < best && revealed(h.k)) {
          best = d;
          near = h;
        }
      }
      if (near !== active) {
        active = near;
        if (near && now - near.last > 3000) call(near, now, true);
      } else if (near && now > near.next) call(near, now, false);
    },
  };
}
