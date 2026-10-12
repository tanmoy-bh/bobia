// Island map: hand-drawn SVG with clouds over every land she hasn't reached yet.
// Slot 0 is the starting camp, slots 1-5 are treasure zones, slot 6 is the castle.

const O = '#3B2414'; // outline
const W = 1000;
const H = 1500;

export const SLOTS = [
  { key: 'camp', x: 250, y: 1290 },
  { key: 'cove', x: 690, y: 1215 },
  { key: 'windmill', x: 270, y: 1010 },
  { key: 'lighthouse', x: 770, y: 830 },
  { key: 'lake', x: 320, y: 640 },
  { key: 'falls', x: 740, y: 525 },
  { key: 'castle', x: 500, y: 305 },
];

const ISLAND =
  'M 500 60 C 700 50, 880 140, 905 320 C 935 480, 975 600, 935 760 C 895 900, 965 1040, 905 1200 ' +
  'C 855 1360, 700 1455, 500 1445 C 300 1455, 115 1385, 88 1220 C 50 1060, 120 940, 78 780 ' +
  'C 38 620, 88 460, 106 320 C 136 140, 300 70, 500 60 Z';

const s = (w = 5) => `stroke="${O}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;

// ── Landmarks (drawn around 0,0 = ground point) ──────────────────────────

function palm(x, lean, sc = 1) {
  const tx = x + lean * 34;
  const ty = -130;
  const leaves = [-160, -120, -60, -20, 20]
    .map((a) => `<ellipse rx="52" ry="15" fill="#4FA83D" ${s(4)} transform="translate(${tx} ${ty}) rotate(${a + lean * 10}) translate(42 0)"/>`)
    .join('');
  return `<g transform="scale(${sc})">
    <path d="M${x} 0 Q ${x + lean * 22} -70 ${tx} ${ty}" fill="none" stroke="${O}" stroke-width="24" stroke-linecap="round"/>
    <path d="M${x} 0 Q ${x + lean * 22} -70 ${tx} ${ty}" fill="none" stroke="#A8743A" stroke-width="15" stroke-linecap="round"/>
    ${leaves}
    <circle cx="${tx - 8}" cy="${ty + 10}" r="9" fill="#7A4B22" ${s(3)}/>
    <circle cx="${tx + 9}" cy="${ty + 12}" r="9" fill="#7A4B22" ${s(3)}/>
  </g>`;
}

const LANDMARKS = {
  camp: () => `
    <ellipse cx="0" cy="4" rx="140" ry="26" fill="#6DB33F" opacity=".6"/>
    <path d="M-120 0 L-55 -120 L10 0 Z" fill="#E84A7F" ${s()}/>
    <path d="M-55 -120 L-35 0 L10 0 Z" fill="#C2386A" ${s()}/>
    <path d="M-70 0 L-55 -62 L-40 0 Z" fill="${O}"/>
    <path d="M-55 -120 V-160" ${s(4)}/>
    <path class="wave" d="M-55 -160 L-22 -150 L-55 -140 Z" fill="#FFC83D" ${s(3)}/>
    <g transform="translate(70 -4)">
      <ellipse rx="44" ry="13" fill="#9AA5B1" ${s(4)}/>
      <rect x="-30" y="-12" width="60" height="12" rx="6" fill="#7A4B22" ${s(3)} transform="rotate(14)"/>
      <rect x="-30" y="-12" width="60" height="12" rx="6" fill="#8A5A2B" ${s(3)} transform="rotate(-14)"/>
      <path class="flicker" d="M0 -12 C -22 -30 -10 -50 -4 -70 C 4 -52 26 -40 0 -12 Z" fill="#FF8A2B" ${s(4)}/>
      <path class="flicker" d="M0 -16 C -10 -28 -4 -40 0 -50 C 6 -38 12 -30 0 -16 Z" fill="#FFE07A"/>
    </g>`,

  cove: () => `
    <ellipse cx="0" cy="6" rx="130" ry="30" fill="#F2D28B" ${s(4)}/>
    ${palm(-55, -1)}
    ${palm(40, 1, 0.82)}
    <path d="M60 2 q 14 -14 28 0" fill="none" ${s(3)}/>`,

  windmill: () => `
    <path d="M-48 0 L-32 -135 L32 -135 L48 0 Z" fill="#F4E4C1" ${s()}/>
    <path d="M-44 -128 L0 -182 L44 -128 Z" fill="#D9534F" ${s()}/>
    <path d="M-15 0 V-34 a15 15 0 0 1 30 0 V0 Z" fill="#8A5A2B" ${s(4)}/>
    <circle cx="0" cy="-86" r="11" fill="#7FD3F7" ${s(4)}/>
    <g transform="translate(0 -146)">
      <g class="spin">
        ${[0, 90, 180, 270]
          .map((a) => `<g transform="rotate(${a})"><rect x="-11" y="-104" width="22" height="92" rx="4" fill="#FBEBC8" ${s(4)}/><path d="M-11 -80 H11 M-11 -58 H11 M-11 -36 H11" ${s(2)}/></g>`)
          .join('')}
        <circle r="14" fill="#8A5A2B" ${s(4)}/>
      </g>
    </g>`,

  lighthouse: () => {
    const half = (y) => 32 - (12 * -y) / 160;
    const band = (y1, y2) => `<path d="M${-half(y1)} ${y1} L${-half(y2)} ${y2} L${half(y2)} ${y2} L${half(y1)} ${y1} Z" fill="#D9534F"/>`;
    return `
    <ellipse cx="-20" cy="2" rx="70" ry="20" fill="#9AA5B1" ${s(4)}/>
    <ellipse cx="45" cy="6" rx="40" ry="14" fill="#B4BEC9" ${s(4)}/>
    <path class="beam" d="M0 -186 L300 -250 L300 -120 Z" fill="#FFF6B0" opacity=".45"/>
    <path d="M-32 0 L-20 -160 L20 -160 L32 0 Z" fill="#FFFFFF"/>
    ${band(-30, -62)}${band(-94, -126)}
    <path d="M-32 0 L-20 -160 L20 -160 L32 0 Z" fill="none" ${s()}/>
    <rect x="-30" y="-172" width="60" height="14" rx="3" fill="#8A5A2B" ${s(4)}/>
    <rect x="-17" y="-206" width="34" height="34" fill="#FFE07A" ${s(4)}/>
    <path d="M-24 -206 L0 -234 L24 -206 Z" fill="#D9534F" ${s(4)}/>`;
  },

  lake: () => `
    <ellipse cx="0" cy="-24" rx="128" ry="58" fill="#5EC8F2" ${s()}/>
    <ellipse cx="-10" cy="-30" rx="92" ry="36" fill="#8EDCF9"/>
    <path d="M-40 -34 q 12 -8 24 0 M20 -18 q 12 -8 24 0" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round"/>
    <circle cx="60" cy="-44" r="11" fill="#4FA83D" ${s(3)}/>
    <circle cx="44" cy="-8" r="8" fill="#4FA83D" ${s(3)}/>
    <g transform="translate(-112 -18)">
      <path d="M0 0 L-14 -46 L0 -76 L14 -46 Z" fill="#C58BF2" ${s(4)}/>
      <path d="M-18 4 L-34 -30 L-26 -50 L-10 -24 Z" fill="#E7A6F7" ${s(4)}/>
      <path d="M14 4 L22 -28 L36 -36 L32 0 Z" fill="#A36BE0" ${s(4)}/>
      <path d="M0 -70 L4 -50" stroke="#fff" stroke-width="4" stroke-linecap="round"/>
    </g>`,

  falls: () => `
    <path d="M-160 0 L-70 -190 L20 0 Z" fill="#9AA5B1" ${s()}/>
    <path d="M-92 -144 L-70 -190 L-48 -144 L-60 -152 L-70 -138 L-80 -152 Z" fill="#fff" ${s(4)}/>
    <path d="M-30 0 L70 -240 L170 0 Z" fill="#B4BEC9" ${s()}/>
    <path d="M42 -172 L70 -240 L98 -172 L84 -182 L70 -164 L56 -182 Z" fill="#fff" ${s(4)}/>
    <rect x="52" y="-150" width="36" height="146" fill="#7FD3F7" ${s(4)}/>
    <path class="flow" d="M62 -146 V-8 M78 -146 V-8" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-dasharray="14 18"/>
    <ellipse cx="70" cy="2" rx="62" ry="17" fill="#5EC8F2" ${s(4)}/>`,

  castle: () => {
    const flag = (x, y) => `<path d="M${x} ${y} V${y - 34}" ${s(4)}/><path class="wave" d="M${x} ${y - 34} L${x + 34} ${y - 25} L${x} ${y - 14} Z" fill="#FFC83D" ${s(3)}/>`;
    const crenel = (x0, x1, y) => {
      let d = '';
      for (let x = x0; x < x1; x += 26) d += `<rect x="${x}" y="${y - 16}" width="16" height="18" fill="#E9DCC6" ${s(4)}/>`;
      return d;
    };
    return `
    ${crenel(-128, 128, -112)}
    <rect x="-130" y="-114" width="260" height="114" fill="#E9DCC6" ${s()}/>
    <rect x="-46" y="-214" width="92" height="104" fill="#F3E9D8" ${s()}/>
    <path d="M-56 -212 L0 -294 L56 -212 Z" fill="#E84A7F" ${s()}/>
    ${flag(0, -292)}
    <rect x="-172" y="-176" width="62" height="176" fill="#F3E9D8" ${s()}/>
    <path d="M-180 -174 L-141 -244 L-102 -174 Z" fill="#E84A7F" ${s()}/>
    ${flag(-141, -242)}
    <rect x="110" y="-176" width="62" height="176" fill="#F3E9D8" ${s()}/>
    <path d="M102 -174 L141 -244 L180 -174 Z" fill="#E84A7F" ${s()}/>
    ${flag(141, -242)}
    <path d="M-148 -120 v-22 a7 7 0 0 1 14 0 v22 Z M134 -120 v-22 a7 7 0 0 1 14 0 v22 Z M-8 -160 v-26 a8 8 0 0 1 16 0 v26 Z" fill="#5A3A22"/>
    <path d="M0 -112 c -10 -14 -30 -4 -18 12 L0 -84 L18 -100 c 12 -16 -8 -26 -18 -12 Z" fill="#E84A7F" ${s(3)}/>
    <g id="castle-gate">
      <path d="M-38 0 V-50 a38 38 0 0 1 76 0 V0 Z" fill="#2A1A0E" ${s()}/>
      <path class="gate-glow" d="M-30 0 V-48 a30 30 0 0 1 60 0 V0 Z" fill="#FFE07A"/>
      <g class="gate-door">
        <path d="M-38 0 V-50 a38 38 0 0 1 76 0 V0 Z" fill="#8A5A2B" ${s()}/>
        <path d="M-19 -2 V-80 M0 -2 V-88 M19 -2 V-80 M-36 -34 H36" ${s(4)}/>
      </g>
    </g>`;
  },
};

// ── Chest, marker, sign ──────────────────────────────────────────────────

export function chestSVG(open = false) {
  const lid = open
    ? `<path d="M-38 -36 L-32 -70 Q0 -88 32 -70 L38 -36 Z" fill="#9C5A1E" ${s(4)}/>
       <path d="M-35 -50 L35 -50" stroke="#FFC83D" stroke-width="8"/>
       <ellipse cx="0" cy="-36" rx="32" ry="9" fill="#FFC83D" ${s(3)}/>
       <circle cx="-12" cy="-42" r="7" fill="#FFE07A" ${s(2)}/><circle cx="8" cy="-44" r="7" fill="#FFE07A" ${s(2)}/>`
    : `<path d="M-38 -34 V-48 Q0 -74 38 -48 V-34 Z" fill="#C9772B" ${s(4)}/>
       <path d="M-8 -66 V-34 M8 -66 V-34" stroke="#FFC83D" stroke-width="6"/>`;
  return `
    <ellipse cx="0" cy="4" rx="44" ry="9" fill="#000" opacity=".18"/>
    ${lid}
    <rect x="-38" y="-36" width="76" height="40" rx="6" fill="#B5651D" ${s(4)}/>
    <rect x="-38" y="-24" width="76" height="9" fill="#FFC83D" ${s(3)}/>
    ${open ? '' : `<rect x="-8" y="-34" width="16" height="20" rx="3" fill="#FFE07A" ${s(3)}/>`}`;
}

function sign(text) {
  const w = Math.max(120, text.length * 15 + 40);
  return `<g class="sign">
    <rect x="${-w / 2}" y="0" width="${w}" height="40" rx="10" fill="#A8743A" ${s(4)}/>
    <path d="M${-w / 2 + 8} 13 H${w / 2 - 8}" stroke="#8A5A2B" stroke-width="2"/>
    <text x="0" y="29" text-anchor="middle" class="sign-text">${text}</text>
  </g>`;
}

// ── Decoration ───────────────────────────────────────────────────────────

const TREES = [
  [480, 1340, 1], [585, 1345, 0.8], [165, 1150, 0.9], [470, 1140, 1], [545, 1075, 0.8], [850, 1040, 1],
  [535, 900, 0.9], [455, 830, 0.8], [165, 840, 1], [150, 750, 0.8], [575, 680, 1], [860, 610, 0.9],
  [200, 470, 1], [270, 410, 0.8], [470, 520, 0.9], [835, 300, 0.9], [180, 330, 0.8], [255, 280, 1],
  [395, 1250, 0.7], [890, 1150, 0.8], [140, 600, 0.9], [610, 640, 0.75],
];

function tree(x, y, k) {
  return `<g transform="translate(${x} ${y}) scale(${k})">
    <ellipse cx="0" cy="4" rx="34" ry="8" fill="#000" opacity=".15"/>
    <rect x="-7" y="-26" width="14" height="30" rx="4" fill="#8A5A2B" ${s(4)}/>
    <circle cx="-16" cy="-40" r="24" fill="#4E9F3D" ${s(4)}/>
    <circle cx="16" cy="-42" r="24" fill="#4E9F3D" ${s(4)}/>
    <circle cx="0" cy="-62" r="27" fill="#5DB848" ${s(4)}/>
    <circle cx="-8" cy="-70" r="7" fill="#8FD86E"/>
  </g>`;
}

function flowers() {
  const pts = [[420, 1290], [610, 1290], [380, 1060], [610, 980], [650, 760], [420, 720], [560, 400], [360, 470], [800, 520], [180, 1220]];
  return pts
    .map(([x, y], i) => {
      const c = ['#FFC83D', '#E84A7F', '#FFFFFF'][i % 3];
      return `<g transform="translate(${x} ${y})"><circle r="6" fill="${c}" ${s(2)}/><circle cx="14" cy="6" r="5" fill="${c}" ${s(2)}/><circle cx="4" cy="14" r="5" fill="${c}" ${s(2)}/></g>`;
    })
    .join('');
}

function waves() {
  const pts = [[40, 200], [930, 120], [960, 520], [30, 900], [960, 1340], [60, 1420], [880, 1460], [40, 560], [970, 960]];
  return pts
    .map(([x, y], i) => `<path class="wave-line" style="animation-delay:${i * -0.7}s" d="M${x - 24} ${y} q 12 -10 24 0 t 24 0" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".55"/>`)
    .join('');
}

// ── Trail ────────────────────────────────────────────────────────────────

function trailPoints() {
  return SLOTS.map((p, i) => (i === 6 ? [p.x, p.y + 30] : [p.x, p.y + 52]));
}

function segment(pts, i) {
  // Catmull-Rom → cubic bezier between pts[i] and pts[i+1]
  const p0 = pts[Math.max(0, i - 1)];
  const p1 = pts[i];
  const p2 = pts[i + 1];
  const p3 = pts[Math.min(pts.length - 1, i + 2)];
  const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
  const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
  return `M${p1[0]} ${p1[1]} C ${c1[0]} ${c1[1]}, ${c2[0]} ${c2[1]}, ${p2[0]} ${p2[1]}`;
}

// ── Clouds ───────────────────────────────────────────────────────────────

const PUFFS = [
  [0, 0, 125], [-135, 22, 98], [135, 16, 102], [-72, -74, 92], [82, -78, 96],
  [-200, -36, 74], [205, -28, 78], [-44, 86, 88], [62, 90, 84], [0, -132, 76],
];

function cloud(k, cx, cy) {
  const layer = (fill, dy, scale, extra = '') =>
    PUFFS.map(([dx, py, r]) => {
      const len = Math.hypot(dx, py) || 1;
      const mx = Math.round((dx / len) * 420 + (dx === 0 ? 0 : 0));
      const my = Math.round((py / len) * 260 - 60);
      return `<circle cx="${cx + dx}" cy="${cy + py + dy}" r="${r * scale}" fill="${fill}" ${extra} style="--dx:${mx}px;--dy:${my}px"/>`;
    }).join('');
  return `<g class="cloud" data-cloud="${k}">
    ${layer('#A9C4DE', 0, 1, `stroke="#A9C4DE" stroke-width="14"`)}
    ${layer('#DCE9F6', 0, 1)}
    ${layer('#FFFFFF', -16, 0.86)}
  </g>`;
}

// ── Build ────────────────────────────────────────────────────────────────

export function buildMap(names) {
  const pts = trailPoints();
  const trail = pts
    .slice(0, -1)
    .map((_, i) => `<path class="trail" data-trail="${i + 1}" d="${segment(pts, i)}"/>`)
    .join('');

  const zones = SLOTS.map((p, i) => {
    const isCastle = i === 6;
    const chest = i > 0 && !isCastle
      ? `<g class="chest-wrap" transform="translate(${p.key === 'lake' ? 110 : p.key === 'falls' ? -150 : 95} 36)"><g class="chest-art"></g></g>`
      : '';
    const markerAt = isCastle ? [0, -70] : [p.key === 'lake' ? 110 : p.key === 'falls' ? -150 : 95, -60];
    return `<g class="zone" data-zone="${i}" transform="translate(${p.x} ${p.y})">
      <ellipse class="zone-glow" cx="0" cy="0" rx="170" ry="70"/>
      ${isCastle ? `<g transform="scale(.86)">${LANDMARKS.castle()}</g>` : LANDMARKS[p.key]()}
      ${chest}
      <g transform="translate(0 ${isCastle ? 22 : 62})">${sign(names[i])}</g>
      <g class="marker" transform="translate(${markerAt[0]} ${markerAt[1]})"><g class="bob">
        <path d="M0 26 L-9 12 H9 Z" fill="#fff" ${s(4)}/>
        <circle r="24" fill="#fff" ${s(4)}/>
        <text y="12" text-anchor="middle" class="marker-text">!</text>
      </g></g>
      <circle class="hit" cx="0" cy="-60" r="150"/>
    </g>`;
  }).join('');

  const clouds = SLOTS.map((p, i) => (i === 0 ? '' : cloud(i, p.x, p.y - (i === 6 ? 110 : 70))))
    .reverse()
    .join('');

  return `<svg id="map-svg" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Island map">
    
    ${waves()}
    <path d="${ISLAND}" fill="#1B6FA8" opacity=".5" transform="translate(0 18)"/>
    <path d="${ISLAND}" fill="none" stroke="#fff" stroke-width="22" opacity=".55"/>
    <path d="${ISLAND}" fill="#F2D28B" ${s(6)}/>
    <path d="${ISLAND}" fill="#79C24A" ${s(6)} transform="translate(500 752) scale(0.92) translate(-500 -752)"/>
    <path d="${ISLAND}" fill="#8BD158" transform="translate(500 740) scale(0.84) translate(-500 -740)" opacity=".55"/>
    ${flowers()}
    ${trail}
    ${TREES.map(([x, y, k]) => tree(x, y, k)).join('')}
    ${zones}
    ${clouds}
  </svg>`;
}

export function slotXY(i) {
  return [SLOTS[i].x / W, (SLOTS[i].y - 60) / H];
}
