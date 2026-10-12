// The animated title screen: a birthday cake on the island, little lambs
// wandering about and round birds flapping across the sky.

const INK = '#3B2414';

const flame = (x) => `
  <g transform="translate(${x} 19)">
    <path d="M0 0v5" stroke="${INK}" stroke-width="2"/>
    <g class="flame">
      <path d="M0-14C7-5 6 1 0 2-6 1-7-5 0-14Z" fill="#FFC83D" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>
      <path d="M0-7C3-3 3 0 0 0-3 0-3-3 0-7Z" fill="#FF7A3D"/>
    </g>
  </g>`;

const CAKE = `
<svg class="cake" viewBox="0 0 120 130" aria-hidden="true">
  <ellipse cx="60" cy="121" rx="55" ry="7" fill="#fff" stroke="${INK}" stroke-width="4"/>
  <rect x="12" y="76" width="96" height="44" rx="10" fill="#FF9CC0" stroke="${INK}" stroke-width="4"/>
  <path d="M14 86Q14 78 22 78H98Q106 78 106 86V92q-5 8-10 0q-6 10-12 0q-6 8-12 0q-6 11-13 0q-6 8-12 0q-6 10-12 0q-6 8-11 0q-5 9-10 0Z" fill="#FFF6E8"/>
  <g stroke="${INK}" stroke-width="1.5">
    <circle cx="28" cy="106" r="3.5" fill="#FFC83D"/><circle cx="46" cy="110" r="3.5" fill="#5EC8F2"/>
    <circle cx="64" cy="105" r="3.5" fill="#FFC83D"/><circle cx="82" cy="110" r="3.5" fill="#79C24A"/>
    <circle cx="96" cy="104" r="3.5" fill="#5EC8F2"/>
  </g>
  <rect x="30" y="44" width="60" height="36" rx="9" fill="#FFD9E6" stroke="${INK}" stroke-width="4"/>
  <path d="M32 52Q32 46 38 46H82Q88 46 88 52V57q-5 8-10 0q-6 9-12 0q-6 8-12 0q-6 10-12 0q-6 8-10 0Z" fill="#fff"/>
  <path d="M60 75c-7-4-9-8-6-11 2-2 5-1 6 1 1-2 4-3 6-1 3 3 1 7-6 11Z" fill="#E84A7F" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>
  <g font-family="'Lilita One', sans-serif" font-size="30" text-anchor="middle" fill="#FFC83D" stroke="${INK}" stroke-width="5" paint-order="stroke" stroke-linejoin="round">
    <text x="48" y="47">3</text><text x="72" y="47">3</text>
  </g>
  ${flame(48)}${flame(72)}
</svg>`;

const fluff = (r = 0) =>
  [
    [-12, 0, 10],
    [0, -6, 11],
    [11, -1, 10],
    [-7, 7, 9],
    [6, 7, 9],
    [0, 2, 12],
  ]
    .map(([x, y, s]) => `<circle cx="${x}" cy="${y}" r="${s + r}"/>`)
    .join('');

export const LAMB_ART = `
  <g fill="${INK}">
    <rect class="leg a" x="-14" y="8" width="5" height="12" rx="2.5"/>
    <rect class="leg b" x="-5" y="9" width="5" height="12" rx="2.5"/>
    <rect class="leg b" x="4" y="9" width="5" height="12" rx="2.5"/>
    <rect class="leg a" x="12" y="8" width="5" height="12" rx="2.5"/>
  </g>
  <g fill="${INK}">${fluff(2.5)}</g>
  <g fill="#fff">${fluff()}</g>
  <ellipse cx="13" cy="-8" rx="5" ry="3" transform="rotate(-30 13 -8)" fill="#FFB3C9" stroke="${INK}" stroke-width="2"/>
  <ellipse cx="19" cy="-2" rx="8" ry="8.5" fill="#FFE9D6" stroke="${INK}" stroke-width="2.5"/>
  <ellipse cx="25" cy="-9" rx="5" ry="3" transform="rotate(30 25 -9)" fill="#FFB3C9" stroke="${INK}" stroke-width="2"/>
  <g fill="#fff" stroke="${INK}" stroke-width="2"><circle cx="16" cy="-10" r="3.5"/><circle cx="21" cy="-11" r="3.5"/></g>
  <g fill="#fff"><circle cx="16" cy="-10" r="3.5"/><circle cx="21" cy="-11" r="3.5"/><circle cx="18.5" cy="-8" r="3"/></g>
  <circle cx="17" cy="-2" r="1.8" fill="${INK}"/><circle cx="23" cy="-2" r="1.8" fill="${INK}"/>
  <circle cx="17.6" cy="-2.6" r="0.6" fill="#fff"/><circle cx="23.6" cy="-2.6" r="0.6" fill="#fff"/>
  <ellipse cx="15" cy="2" rx="2" ry="1.2" fill="#FF9CC0"/><ellipse cx="25" cy="2" rx="2" ry="1.2" fill="#FF9CC0"/>
  <path d="M18.5 3.5q1.5 1.5 3 0" fill="none" stroke="${INK}" stroke-width="1.4" stroke-linecap="round"/>
`;

const LAMB = `<svg class="lamb-body" viewBox="-28 -24 58 48" aria-hidden="true">${LAMB_ART}</svg>`;

const bird = (body, belly, wing) => `
<svg class="bird-body" viewBox="-20 -16 40 32" aria-hidden="true">
  <path d="M-9-2-18-7-16 3Z" fill="${wing}" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>
  <circle r="11" fill="${body}" stroke="${INK}" stroke-width="2.5"/>
  <ellipse cx="2" cy="5" rx="7" ry="4.5" fill="${belly}"/>
  <path d="M10-3 17 0 10 3Z" fill="#FF9F3D" stroke="${INK}" stroke-width="1.8" stroke-linejoin="round"/>
  <circle cx="5" cy="-3" r="2" fill="${INK}"/><circle cx="5.6" cy="-3.6" r="0.7" fill="#fff"/>
  <ellipse cx="7" cy="2" rx="2" ry="1.2" fill="#FF7FA8"/>
  <path class="wing" d="M-7-1C-6-11 4-11 3-1Z" fill="${wing}" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>
</svg>`;

const BIRDS = [
  { y: 9, dur: 17, delay: -3, size: 50, colors: ['#FF9CC0', '#FFE3EC', '#E84A7F'] },
  { y: 20, dur: 23, delay: -14, size: 42, colors: ['#FFD66B', '#FFF4CC', '#E8951A'], rtl: true },
  { y: 30, dur: 20, delay: -9, size: 36, colors: ['#8FD8FF', '#E6F7FF', '#2E9BD6'] },
];

const LAMBS = [
  { x: 22, y: 76, d: 9, dur: 14, delay: 0, size: 64 },
  { x: 68, y: 66, d: -7, dur: 11, delay: -4, size: 56 },
  { x: 34, y: 50, d: 6, dur: 16, delay: -9, size: 46 },
];

export const skyHTML = () => `
  <div class="flock" aria-hidden="true">
    ${BIRDS.map(
      (b) => `<div class="bird${b.rtl ? ' rtl' : ''}" style="--y:${b.y}%;--dur:${b.dur}s;--delay:${b.delay}s;--size:${b.size}px">${bird(...b.colors)}</div>`,
    ).join('')}
  </div>`;

export const isleHTML = () => `
  <div class="isle">
    ${LAMBS.map(
      (l) => `<button class="lamb" type="button" aria-label="Lamb" style="z-index:${l.y};--x:${l.x}%;--y:${l.y}%;--d:${l.d};--dur:${l.dur}s;--delay:${l.delay}s;--size:${l.size}px">${LAMB}<span class="baa-bubble">Baa!</span></button>`,
    ).join('')}
    ${CAKE}
  </div>`;
