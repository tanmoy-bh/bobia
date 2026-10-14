// World geometry: the island, the spiral road, where chests, landmarks,
// trees and clouds sit. Everything is deterministic so the island looks
// the same on every visit.

import { HABITAT_FOR, HABITAT_R } from './habitats.js';

export const WORLD = 4200;
export const C = { x: WORLD / 2, y: WORLD / 2 }; // island centre (castle)
export const ISLE = 1950; // island radius
export const ROAD_HALF = 26; // how far from the road's centre line she can walk
export const CHEST_REACH = 105; // how close she must be to open a chest

function rng(seed) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function islandR(a) {
  return ISLE + 42 * Math.sin(3 * a) + 26 * Math.sin(7 * a + 1) + 14 * Math.sin(11 * a + 2);
}

export function islandPath(inset = 0, step = 0.02) {
  const p = new Path2D();
  for (let a = 0; a <= Math.PI * 2 + step; a += step) {
    const r = islandR(a) - inset;
    const x = C.x + r * Math.cos(a);
    const y = C.y + r * Math.sin(a);
    a === 0 ? p.moveTo(x, y) : p.lineTo(x, y);
  }
  p.closePath();
  return p;
}

const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

export function buildWorld(zones) {
  const N = zones.length; // chests (castle is treasure N + 1)
  const rand = rng(33);

  // ── Road: an inward spiral from the south shore to the castle gate ──
  const R0 = 1680;
  const R1 = 420;
  const TURNS = 2;
  const SPAN = TURNS * Math.PI * 2;
  const b = (R0 - R1) / SPAN;
  const pts = [];
  for (let t = 0; t <= SPAN; ) {
    const r = R0 - b * t;
    const a = Math.PI / 2 + t;
    pts.push({ x: C.x + r * Math.cos(a), y: C.y + r * Math.sin(a) });
    t += 7 / r;
  }
  const spiralEnd = pts.length - 1;
  const gate = { x: C.x, y: C.y + 205 };
  const last = pts[pts.length - 1];
  const straight = dist(last, gate);
  for (let d = 7; d < straight; d += 7) pts.push({ x: last.x + ((gate.x - last.x) * d) / straight, y: last.y + ((gate.y - last.y) * d) / straight });
  pts.push(gate);

  const s = [0];
  for (let i = 1; i < pts.length; i++) s.push(s[i - 1] + dist(pts[i - 1], pts[i]));
  const total = s[s.length - 1];
  const spiralLen = s[spiralEnd];

  const indexAt = (sv) => {
    let lo = 0;
    let hi = s.length - 1;
    while (lo < hi) {
      const m = (lo + hi) >> 1;
      s[m] < sv ? (lo = m + 1) : (hi = m);
    }
    return lo;
  };

  const roadPath = new Path2D();
  pts.forEach((p, i) => (i ? roadPath.lineTo(p.x, p.y) : roadPath.moveTo(p.x, p.y)));

  // ── Chests + landmarks ──
  const chests = [];
  for (let k = 1; k <= N; k++) {
    const sk = (spiralLen * k) / (N + 1);
    const i = indexAt(sk);
    const P = pts[i];
    const A = pts[Math.max(0, i - 2)];
    const B = pts[Math.min(pts.length - 1, i + 2)];
    const tl = Math.hypot(B.x - A.x, B.y - A.y) || 1;
    const t = { x: (B.x - A.x) / tl, y: (B.y - A.y) / tl };
    let n = { x: -t.y, y: t.x };
    if (n.x * (P.x - C.x) + n.y * (P.y - C.y) < 0) n = { x: -n.x, y: -n.y }; // n points outward
    const r = dist(P, C);
    // landmark side: alternate, but stay on land near the shore and clear of the castle
    let side = k % 2 ? 1 : -1;
    if (r > R0 - 150) side = -1;
    if (r - 215 < R1 + 140 && side === -1) side = 1;
    const lm = { x: P.x + n.x * side * 215, y: P.y + n.y * side * 215 };
    const chest = { x: P.x - n.x * side * 60, y: P.y - n.y * side * 60 };
    chests.push({ k, s: sk, road: { x: P.x, y: P.y }, n, t, side, x: chest.x, y: chest.y, landmark: { x: lm.x, y: lm.y, type: zones[k - 1].landmark || 'palms' } });
  }

  // ── Obstacles: one on the road between each pair of chests, from the
  // third stretch on (baby Joy only crawls the first two). Rocks and logs
  // must be jumped; a puddle can be waded through, slowly. ──
  const KINDS = ['rock', 'puddle', 'log'];
  const obstacles = [];
  for (let k = 3; k <= N; k++) {
    const sv = (chests[k - 2].s + chests[k - 1].s) / 2;
    const i = indexAt(sv);
    const A = pts[Math.max(0, i - 2)];
    const B = pts[Math.min(pts.length - 1, i + 2)];
    const tl = Math.hypot(B.x - A.x, B.y - A.y) || 1;
    const t = { x: (B.x - A.x) / tl, y: (B.y - A.y) / tl };
    const type = KINDS[(k - 3) % KINDS.length];
    obstacles.push({ k, type, s: sv, x: pts[i].x, y: pts[i].y, t, n: { x: -t.y, y: t.x }, half: { rock: 28, log: 20, puddle: 46 }[type], solid: type !== 'puddle' });
  }

  const castle = { x: C.x, y: C.y + 175, k: N + 1, s: total };
  // birthday party in front of the castle
  const decor = [
    ['balloons', -242, 188, 0.85], ['balloons', 242, 188, 0.85],
    ['cakeTable', -178, 198, 0.9], ['cakeTable', 178, 198, 0.9],
    ['giftBlue', -108, 236, 0.95], ['giftPurple', 108, 236, 0.95],
    ['giftPink', -150, 250, 0.8], ['giftPink', 150, 250, 0.8],
    ['giftGold', -86, 272, 0.7], ['giftBlue', 86, 272, 0.7],
  ].map(([sprite, dx, dy, k]) => ({ sprite, x: C.x + dx, y: C.y + dy, k }));
  const plaza = { x: C.x, y: C.y + 238, rx: 270, ry: 82 };
  const camp = { x: C.x + 200, y: C.y + R0 + 105 };
  const start = { x: pts[0].x + 10, y: pts[0].y };

  // zone of a road position: zone k covers the road up to chest k
  const zoneOfS = (sv) => {
    for (const c of chests) if (sv <= c.s + 1) return c.k;
    return N + 1;
  };

  // ── nearest point on the road, limited to the stretch she has unlocked ──
  function nearest(p, maxS = total) {
    let best = null;
    let bd = Infinity;
    const lastI = Math.min(pts.length - 1, indexAt(maxS));
    for (let i = 0; i < lastI; i++) {
      const a = pts[i];
      const c = pts[i + 1];
      const vx = c.x - a.x;
      const vy = c.y - a.y;
      const len2 = vx * vx + vy * vy || 1;
      let u = ((p.x - a.x) * vx + (p.y - a.y) * vy) / len2;
      u = Math.max(0, Math.min(1, u));
      const sv = s[i] + u * Math.sqrt(len2);
      if (sv > maxS) u = Math.max(0, (maxS - s[i]) / Math.sqrt(len2));
      const qx = a.x + u * vx;
      const qy = a.y + u * vy;
      const d = Math.hypot(p.x - qx, p.y - qy);
      if (d < bd) {
        bd = d;
        best = { x: qx, y: qy, d, s: s[i] + u * Math.sqrt(len2) };
      }
    }
    return best;
  }

  // ── Habitats: a little scene with animals beside each landmark ──
  const habitats = [];
  // how far each landmark sprite reaches sideways and upwards (plus its sign below)
  const FOOT = { palms: [150, 175], windmill: [95, 215], lighthouse: [80, 200], lake: [120, 90], falls: [145, 205], cottage: [95, 160], balloon: [85, 220], bench: [95, 175], cake: [100, 165], merlion: [215, 200] };
  const TALL = { farm: 100, birds: 100, beach: 90, bees: 80 }; // tallest prop in a habitat
  const box = (m) => {
    const [w, up] = FOOT[m.type] || [120, 200];
    return [m.x - w, m.y - up, m.x + w, m.y + 62];
  };
  const marks = chests.map((c) => box(c.landmark));
  const fits = (p, r, type, pad = 30) => {
    const a = Math.atan2(p.y - C.y, p.x - C.x);
    if (dist(p, C) > islandR(a) - (type === 'beach' ? 30 : 62) - r * 0.6) return false;
    const onCastle = Math.abs(p.x - C.x) < 290 + r && p.y > C.y - 270 - r * 0.6 && p.y < C.y + 340 + r * 0.6;
    if (onCastle || dist(p, camp) < r + 150) return false;
    const hb = [p.x - r - pad, p.y - r * 0.62 - (TALL[type] || 45) - pad, p.x + r + pad, p.y + r * 0.62 + pad];
    if (marks.some((m) => hb[0] < m[2] && hb[2] > m[0] && hb[1] < m[3] && hb[3] > m[1])) return false;
    if (chests.some((c) => dist(p, c) < r + 45)) return false;
    if (!habitats.every((h) => dist(p, h) > r + h.r + 30)) return false;
    return nearest(p).d > 46 + r;
  };
  for (const c of chests) {
    const type = zones[c.k - 1].habitat || HABITAT_FOR[c.landmark.type] || 'garden';
    const spots = [];
    for (let d = 140; d <= 620; d += 30) {
      for (let i = 0; i < 32; i++) {
        const a = (i / 32) * Math.PI * 2;
        spots.push({ x: c.road.x + d * Math.cos(a), y: c.road.y + d * Math.sin(a), d });
      }
    }
    spots.sort((p, q) => p.d - q.d);
    // stay close to its own stop if at all possible: full size first, then
    // smaller and tucked tighter, and only then look further away
    const tries = [];
    for (const reach of [420, 620]) for (const [k, pad] of [[1, 30], [0.85, 30], [0.7, 20], [0.6, 0], [0.55, -15]]) tries.push([reach, k, pad]);
    tries.push([620, 0.5, -30]);
    for (const [reach, k, pad] of tries) {
      const r = HABITAT_R[type] * k;
      const hit = spots.find((p) => p.d <= reach && fits(p, r, type, pad));
      if (hit) {
        habitats.push({ k: c.k, type, x: hit.x, y: hit.y, r });
        break;
      }
    }
  }

  // ── Trees + flowers (kept off the road and away from landmarks) ──
  const blockers = [
    ...habitats.map((h) => ({ x: h.x, y: h.y, r: h.r + 25 })),
    ...chests.map((c) => ({ x: c.landmark.x, y: c.landmark.y, r: 150 })),
    ...chests.map((c) => ({ x: c.x, y: c.y, r: 70 })),
    { x: castle.x, y: castle.y - 120, r: 330 },
    { x: plaza.x, y: plaza.y, r: 300 },
    { x: camp.x, y: camp.y, r: 150 },
  ];
  const clear = (p, pad) => {
    const q = nearest(p);
    if (q.d < 70 + pad) return false;
    return blockers.every((b) => Math.hypot(p.x - b.x, p.y - b.y) > b.r + pad);
  };
  const trees = [];
  for (let i = 0; i < 1500 && trees.length < 360; i++) {
    const a = rand() * Math.PI * 2;
    const r = Math.sqrt(rand()) * (islandR(a) - 120);
    const p = { x: C.x + r * Math.cos(a), y: C.y + r * Math.sin(a), k: 0.7 + rand() * 0.45, kind: rand() < 0.18 ? 'pine' : 'round' };
    if (clear(p, 10) && trees.every((t) => Math.hypot(t.x - p.x, t.y - p.y) > 75)) trees.push(p);
  }
  const flowers = [];
  for (let i = 0; i < 800 && flowers.length < 250; i++) {
    const a = rand() * Math.PI * 2;
    const r = Math.sqrt(rand()) * (islandR(a) - 110);
    const p = { x: C.x + r * Math.cos(a), y: C.y + r * Math.sin(a), c: ['#FFC83D', '#E84A7F', '#FFFFFF', '#C58BF2'][(rand() * 4) | 0] };
    if (clear(p, -20)) flowers.push(p);
  }

  // ── Clouds: puffs over the whole island, each tied to a zone ──
  const puffs = [];
  const STEP = 150;
  for (let y = 0; y <= WORLD; y += STEP) {
    for (let x = 0; x <= WORLD; x += STEP) {
      const p = { x: x + (rand() - 0.5) * 70, y: y + (rand() - 0.5) * 70 };
      const a = Math.atan2(p.y - C.y, p.x - C.x);
      if (dist(p, C) > islandR(a) + 90) continue;
      const q = nearest(p);
      let zone = zoneOfS(q.s);
      if (Math.hypot(p.x - camp.x, p.y - camp.y) < 260) zone = 1;
      // clouds over a stop's landmark and animal habitat belong to that stop,
      // so they clear while she is heading there, not after she solves it
      for (const h of habitats) if (h.k < zone && Math.hypot(p.x - h.x, p.y - h.y) < h.r + 110) zone = h.k;
      for (const c of chests) if (c.k < zone && Math.hypot(p.x - c.landmark.x, p.y - (c.landmark.y - 90)) < 210) zone = c.k;
      const dl = Math.hypot(p.x - q.x, p.y - q.y) || 1;
      const dir = dl > 5 ? { x: (p.x - q.x) / dl, y: (p.y - q.y) / dl } : { x: rand() - 0.5, y: -1 };
      puffs.push({ x: p.x, y: p.y, r: 105 + rand() * 45, zone, dx: dir.x, dy: dir.y, wob: rand() * Math.PI * 2 });
    }
  }

  // sea waves
  const waves = [];
  for (let i = 0; i < 210; i++) {
    const x = rand() * WORLD;
    const y = rand() * WORLD;
    const a = Math.atan2(y - C.y, x - C.x);
    if (Math.hypot(x - C.x, y - C.y) > islandR(a) + 60) waves.push({ x, y, ph: rand() * 6 });
  }

  return { pts, s, total, roadPath, chests, castle, decor, plaza, camp, start, gate, nearest, zoneOfS, trees, flowers, puffs, waves, habitats, obstacles };
}
