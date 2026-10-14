// Hand-drawn sprites as SVG, turned into images the canvas can paint.
// Each sprite is drawn around (0,0) = the point where it touches the ground.

import { CRITTER_DEFS } from './critters-art.js';
import { WILD_DEFS } from './wild-art.js';

const O = '#3B2414';
const s = (w = 5) => `stroke="${O}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;

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

const W = '#F7F4EC';
// the Merlion: lion head with a long mane hood, scaly fish body with the
// tail coiled at the front, on a blue wave base and a stone pedestal
function merlion(x) {
  const scales = [];
  for (let r = 0; r < 6; r++) for (let c = 0; c < 8; c++) {
    const cx = -44 + c * 12 + (r % 2) * 6, cy = -66 - r * 12;
    scales.push(`<path d="M${cx - 6} ${cy} a6 6 0 0 0 12 0" fill="none" stroke="#B9B1A2" stroke-width="2.5" stroke-linecap="round"/>`);
  }
  const groove = (dx) => `<path d="M${-12 + dx} -222 q-10 8 -6 18 q-10 8 -6 18 q-10 8 -6 18 q-10 8 -6 18 q-10 8 -6 18 q-8 8 -4 16" fill="none" stroke="#C9C1B1" stroke-width="3" stroke-linecap="round"/>`;
  return `<g transform="translate(${x} 0)">
    <defs><clipPath id="mhood"><path d="M-8 -228 C -42 -226 -60 -198 -60 -166 C -60 -140 -54 -118 -44 -100 L -16 -112 L -4 -200 Z"/></clipPath><clipPath id="mbody"><path d="M-44 -104 C -50 -86 -48 -70 -44 -58 L 40 -58 C 46 -84 38 -112 24 -136 L -4 -126 Z"/></clipPath></defs>
    <!-- water arc from the mouth -->
    <path d="M56 -164 C 116 -184 166 -130 178 -16" fill="none" stroke="${O}" stroke-width="17" stroke-linecap="round"/>
    <path d="M56 -164 C 116 -184 166 -130 178 -16" fill="none" stroke="#9FE0FA" stroke-width="10" stroke-linecap="round"/>
        <ellipse cx="176" cy="-6" rx="34" ry="10" fill="#5EC8F2" ${s(4)}/>
    <circle cx="158" cy="-24" r="4" fill="#9FE0FA" ${s(2)}/><circle cx="194" cy="-22" r="5" fill="#9FE0FA" ${s(2)}/><circle cx="178" cy="-34" r="3.5" fill="#9FE0FA" ${s(2)}/>
    <!-- stone pedestal -->
    <rect x="-72" y="-44" width="144" height="44" rx="3" fill="#CFC8BA" ${s()}/>
    <path d="M-72 -22 H72 M-36 -44 V-22 M10 -44 V-22 M52 -44 V-22 M-56 -22 V0 M-12 -22 V0 M32 -22 V0" stroke="#A39A89" stroke-width="3"/>
    <rect x="-72" y="-44" width="144" height="44" rx="3" fill="none" ${s()}/>
    <!-- blue wave base -->
    <path d="M-64 -44 C -64 -60 -40 -64 0 -64 C 40 -64 64 -60 64 -44 Z" fill="#2F6FD0" ${s(4)}/>
    <path d="M-54 -50 q6 -9 12 -2 q4 4 -2 6 M-30 -52 q6 -9 12 -2 q4 4 -2 6 M-6 -54 q6 -9 12 -2 q4 4 -2 6 M18 -52 q6 -9 12 -2 q4 4 -2 6 M42 -50 q6 -9 12 -2 q4 4 -2 6" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/>
    <!-- mane hood flowing down the back -->
    <path d="M-8 -228 C -42 -226 -60 -198 -60 -166 C -60 -140 -54 -118 -44 -100 L -16 -112 L -4 -200 Z" fill="${W}" ${s()}/>
    <g clip-path="url(#mhood)">${groove(-14)}${groove(-26)}${groove(-38)}</g>
    <!-- fish body with scales -->
    <path d="M-44 -104 C -50 -86 -48 -70 -44 -58 L 40 -58 C 46 -84 38 -112 24 -136 L -4 -126 Z" fill="${W}" ${s()}/>
    <g clip-path="url(#mbody)">${scales.join('')}</g>
    <!-- tail coiled at the front -->
    <circle cx="20" cy="-82" r="22" fill="${W}" ${s(4)}/>
    <path d="M20 -82 m-12 0 a12 12 0 1 1 12 12 a7 7 0 1 1 -5 -9" fill="none" stroke="#9C9384" stroke-width="3.5" stroke-linecap="round"/>
    <!-- lion face, mouth open -->
    <path d="M-8 -226 C 16 -232 34 -222 38 -208 L 50 -200 L 46 -194 C 56 -190 60 -182 58 -176 L 50 -172 L 58 -168 L 32 -162 L 54 -148 C 54 -140 44 -136 30 -137 C 14 -140 4 -134 -2 -124 L -16 -150 Z" fill="${W}" ${s()}/>
    <path d="M58 -168 L 32 -162 L 54 -148 Z" fill="#7A3B2E" ${s(3)}/>
    <path d="M50 -167 l2 4 l2 -4 M43 -166 l2 4 l2 -4 M46 -151 l2 -4 l2 4" fill="#fff" stroke="${O}" stroke-width="1.5"/>
    <path d="M-6 -222 q-8 10 -2 20 q-8 10 -2 20 q-8 10 -2 20 q-8 10 -2 20 q-6 8 -2 16" fill="none" ${s(3)}/>
    <path d="M20 -208 q12 -8 26 -2" fill="none" ${s(4)}/>
    <ellipse cx="34" cy="-199" rx="5" ry="4" fill="${O}"/>
    <path d="M26 -186 q10 6 22 2 M44 -180 q6 -2 10 2" fill="none" stroke="#B9B1A2" stroke-width="3" stroke-linecap="round"/>
    <ellipse cx="55" cy="-180" rx="3" ry="2.5" fill="${O}"/>
  </g>`;
}
// city skyline like the view behind the real Merlion
const skyline = () => `<g>
  ${[[-250, 40, 170, '#7FA6C9'], [-205, 34, 210, '#5F8DB8'], [-165, 44, 150, '#8DB5D6'], [-118, 30, 190, '#6E9BC4'], [-84, 38, 135, '#9CC0DD']]
    .map(([bx, w, h, c]) => `<rect x="${bx}" y="${-h}" width="${w}" height="${h}" fill="${c}" ${s(4)}/><path d="${Array.from({ length: Math.floor(h / 22) }, (_, i) => `M${bx + 6} ${-h + 14 + i * 22} H${bx + w - 6}`).join(' ')}" stroke="#fff" stroke-opacity=".5" stroke-width="3"/>`)
    .join('')}
</g>`;
// Marina Bay Sands: three towers with the boat on top
const mbs = `<g transform="translate(-190 0)">
  ${[-50, 0, 50].map((dx) => `<path d="M${dx - 18} 0 L${dx - 14} -150 L${dx + 14} -150 L${dx + 18} 0 Z" fill="#E6EBF1" ${s(4)}/><path d="M${dx - 8} -140 V-10 M${dx + 8} -140 V-10" stroke="#9FB3C8" stroke-width="3"/>`).join('')}
  <path d="M-92 -162 L 96 -162 Q 104 -152 92 -150 L -82 -150 Z" fill="#9FB3C8" ${s(4)}/>
  <path d="M-80 -170 Q -20 -178 70 -168" fill="none" stroke="#4FA83D" stroke-width="6" stroke-linecap="round"/>
</g>`;

function castleSVG(open) {
  const flag = (x, y, c = '#FFC83D') => `<path d="M${x} ${y} V${y - 36}" ${s(4)}/><path d="M${x} ${y - 36} L${x + 36} ${y - 26} L${x} ${y - 16} Z" fill="${c}" ${s(3)}/>`;
  const crenels = (x0, x1, y, fill) => {
    let d = '';
    for (let x = x0; x <= x1 - 16; x += 26) d += `<rect x="${x}" y="${y - 18}" width="16" height="20" fill="${fill}" ${s(4)}/>`;
    return d;
  };
  const heartPath = (x, y, k) => `M${x} ${y + 9 * k} c ${-12 * k} ${-9 * k} ${-12 * k} ${-21 * k} ${-5 * k} ${-21 * k} c ${3 * k} 0 ${5 * k} ${2 * k} ${5 * k} ${4 * k} c 0 ${-2 * k} ${2 * k} ${-4 * k} ${5 * k} ${-4 * k} c ${7 * k} 0 ${7 * k} ${12 * k} ${-5 * k} ${21 * k} Z`;
  const heartWin = (x, y, k = 1) => `<path d="${heartPath(x, y, k)}" fill="#FFE07A" ${s(3)}/>`;
  const bricks = (x0, x1, y0, y1) => {
    let d = '';
    for (let y = y0 + 22, row = 0; y < y1 - 8; y += 24, row++) {
      for (let x = x0 + 14 + (row % 2) * 22; x < x1 - 20; x += 46) d += `M${x} ${y} h18 `;
    }
    return `<path d="${d}" stroke="#CDBBA0" stroke-width="3" stroke-linecap="round"/>`;
  };
  const balloon = (x, y, c) => `<path d="M${x} ${y + 26} q 4 14 -2 26" fill="none" ${s(2)}/><ellipse cx="${x}" cy="${y}" rx="15" ry="18" fill="${c}" ${s(3)}/><path d="M${x - 4} ${y + 17} l4 6 l4 -6 Z" fill="${c}" ${s(2)}/><ellipse cx="${x - 5}" cy="${y - 6}" rx="3.5" ry="6" fill="#fff" opacity=".6"/>`;
  const bunting = (() => {
    const pts = [];
    const cols = ['#E84A7F', '#FFC83D', '#5EC8F2', '#C58BF2', '#79C24A'];
    let d = '';
    for (let i = 0; i <= 12; i++) {
      const t = i / 12;
      const x = -150 + 300 * t;
      const y = -148 + Math.sin(t * Math.PI) * 26;
      pts.push([x, y]);
    }
    const line = `<path d="M${pts.map((p) => p.join(' ')).join(' L')}" fill="none" ${s(2.5)}/>`;
    for (let i = 0; i < pts.length - 1; i++) {
      const [x1, y1] = pts[i];
      const [x2, y2] = pts[i + 1];
      d += `<path d="M${x1 + 2} ${y1} L${x2 - 2} ${y2} L${(x1 + x2) / 2} ${(y1 + y2) / 2 + 20} Z" fill="${cols[i % cols.length]}" ${s(2.5)}/>`;
    }
    return line + d;
  })();
  const banner = (x) => `<path d="M${x - 15} -116 h30 v66 l-15 -11 l-15 11 Z" fill="#E84A7F" ${s(4)}/><path d="${heartPath(x, -92, 0.7)}" fill="#FFE07A" ${s(2)}/>`;
  const gate = open
    ? `<path d="M-44 0 V-56 a44 44 0 0 1 88 0 V0 Z" fill="#2A1A0E" ${s()}/>
       <path d="M-36 0 V-54 a36 36 0 0 1 72 0 V0 Z" fill="#FFE07A"/>
       <path d="M-24 0 V-50 a24 24 0 0 1 48 0 V0 Z" fill="#FFF6C8"/>`
    : `<path d="M-44 0 V-56 a44 44 0 0 1 88 0 V0 Z" fill="#9C6430" ${s()}/>
       <path d="M0 -98 V0 M-22 -88 V0 M22 -88 V0" ${s(3)}/>
       <circle cx="-9" cy="-44" r="4" fill="#FFC83D" ${s(2)}/><circle cx="9" cy="-44" r="4" fill="#FFC83D" ${s(2)}/>`;
  const rose = (x) => `<g transform="translate(${x} 0)"><ellipse cx="0" cy="-14" rx="30" ry="20" fill="#4E9F3D" ${s(4)}/><circle cx="-12" cy="-20" r="5" fill="#E84A7F" ${s(2)}/><circle cx="6" cy="-26" r="5" fill="#FF8FB8" ${s(2)}/><circle cx="14" cy="-12" r="5" fill="#E84A7F" ${s(2)}/><circle cx="-2" cy="-10" r="4" fill="#FFC83D" ${s(2)}/></g>`;
  return `
    <ellipse cx="0" cy="10" rx="250" ry="34" fill="#000" opacity=".15"/>

    <!-- tower balloons -->
    ${balloon(-226, -330, '#FF8FB8')}${balloon(-198, -350, '#FFC83D')}${balloon(-176, -326, '#5EC8F2')}
    ${balloon(176, -326, '#C58BF2')}${balloon(198, -350, '#FF8FB8')}${balloon(226, -330, '#FFC83D')}

    <!-- keep -->
    <rect x="-58" y="-262" width="116" height="150" fill="#F6EEDF" ${s()}/>
    ${crenels(-58, 58, -262, '#F6EEDF')}
    <path d="M-70 -270 L0 -372 L70 -270 Z" fill="#E84A7F" ${s()}/>
    <path d="M-46 -270 L0 -340 M0 -270 V-372 M46 -270 L0 -340" stroke="#C2386A" stroke-width="4"/>
    <circle cx="0" cy="-372" r="7" fill="#FFC83D" ${s(3)}/>
    ${flag(0, -378, '#FF8FB8')}
    <path d="M-16 -196 v-26 a16 16 0 0 1 32 0 v26 Z" fill="#5A3A22" ${s(4)}/>
    ${heartWin(0, -216, 0.8)}

    <!-- side towers -->
    ${[-1, 1]
      .map(
        (d) => `
      <rect x="${d * 175 - 38}" y="-212" width="76" height="212" fill="#F6EEDF" ${s()}/>
      ${bricks(d * 175 - 38, d * 175 + 38, -212, 0)}
      ${crenels(d * 175 - 44, d * 175 + 44, -212, '#F6EEDF')}
      <rect x="${d * 175 - 44}" y="-214" width="88" height="12" fill="#E9DCC6" ${s(4)}/>
      <path d="M${d * 175 - 50} -226 L${d * 175} -310 L${d * 175 + 50} -226 Z" fill="#E84A7F" ${s()}/>
      <path d="M${d * 175 - 25} -226 L${d * 175} -290 L${d * 175 + 25} -226" fill="none" stroke="#C2386A" stroke-width="4"/>
      <circle cx="${d * 175}" cy="-310" r="6" fill="#FFC83D" ${s(3)}/>
      ${flag(d * 175, -316)}
      ${heartWin(d * 175, -160, 1)}
      <path d="M${d * 175 - 11} -60 v-24 a11 11 0 0 1 22 0 v24 Z" fill="#5A3A22" ${s(3)}/>`,
      )
      .join('')}

    <!-- front wall -->
    ${crenels(-137, 137, -128, '#EFE4D0')}
    <rect x="-137" y="-130" width="274" height="130" fill="#EFE4D0" ${s()}/>
    ${bricks(-137, 137, -130, 0)}
    ${bunting}
    ${banner(-92)}${banner(92)}

    <!-- gate -->
    <path d="M-56 0 V-62 a56 56 0 0 1 112 0 V0" fill="#E2D2B6" ${s(4)}/>
    ${gate}
    <path d="M-44 0 V-56 a44 44 0 0 1 88 0 V0" fill="none" stroke="#FFC83D" stroke-width="5"/>
    <path d="${heartPath(0, -134, 1.15)}" fill="#E84A7F" ${s(3)}/>

    <!-- steps + roses -->
    <rect x="-62" y="0" width="124" height="12" rx="3" fill="#D9CBB2" ${s(4)}/>
    <rect x="-74" y="10" width="148" height="12" rx="3" fill="#CDBBA0" ${s(4)}/>
    ${rose(-118)}${rose(118)}`;
}

function giftSVG(box, ribbon) {
  return `
    <ellipse cx="0" cy="3" rx="34" ry="7" fill="#000" opacity=".16"/>
    <rect x="-26" y="-44" width="52" height="44" rx="4" fill="${box}" ${s(4)}/>
    <rect x="-31" y="-54" width="62" height="13" rx="4" fill="${box}" ${s(4)}/>
    <rect x="-6" y="-54" width="12" height="54" fill="${ribbon}" ${s(3)}/>
    <path d="M0 -55 c -10 -18 -30 -10 -18 0 Z M0 -55 c 10 -18 30 -10 18 0 Z" fill="${ribbon}" ${s(3)}/>
    <circle cx="0" cy="-55" r="4" fill="${ribbon}" ${s(2)}/>`;
}

function cakeTableSVG() {
  return `
    <ellipse cx="0" cy="4" rx="58" ry="10" fill="#000" opacity=".16"/>
    <rect x="-6" y="-46" width="12" height="46" fill="#C48A4A" ${s(3)}/>
    <path d="M-52 -48 h104 l-6 30 q -46 12 -92 0 Z" fill="#FFFFFF" ${s(4)}/>
    <path d="M-46 -26 q 10 8 20 0 q 10 8 20 0 q 10 8 20 0 q 10 8 20 0 q 10 8 20 0" fill="none" stroke="#FF8FB8" stroke-width="3"/>
    <ellipse cx="0" cy="-48" rx="54" ry="10" fill="#FFF3F8" ${s(4)}/>
    <rect x="-34" y="-86" width="68" height="36" rx="7" fill="#FFB3CF" ${s(4)}/>
    <path d="M-34 -78 q 8 10 17 0 q 8 10 17 0 q 8 10 17 0 q 8 10 17 0 V-86 H-34 Z" fill="#FFFFFF" ${s(3)}/>
    <rect x="-22" y="-112" width="44" height="28" rx="6" fill="#FFF3C4" ${s(4)}/>
    <path d="M-22 -104 q 6 8 11 0 q 6 8 11 0 q 6 8 11 0 q 6 8 11 0 V-112 H-22 Z" fill="#E84A7F" ${s(3)}/>
    ${[-10, 0, 10]
      .map((x, i) => `<rect x="${x - 3}" y="-128" width="6" height="17" rx="2" fill="${['#7FD3F7', '#C58BF2', '#79C24A'][i]}" ${s(2)}/>
        <path d="M${x} -130 c -6 -7 -2 -13 0 -17 c 2 4 6 10 0 17 Z" fill="#FF8A2B" ${s(1.5)}/>`)
      .join('')}
    <ellipse cx="-44" cy="-54" rx="7" ry="3" fill="#FFC83D" ${s(2)}/>
    <ellipse cx="40" cy="-54" rx="7" ry="3" fill="#FF8FB8" ${s(2)}/>`;
}

function balloonsSVG() {
  const b = (x, y, c, rot) => `<path d="M${x} ${y + 26} Q ${x * 0.5} ${(y + 26) / 2 - 10} 0 -10" fill="none" ${s(2)}/>
    <g transform="rotate(${rot} ${x} ${y})"><ellipse cx="${x}" cy="${y}" rx="20" ry="24" fill="${c}" ${s(3)}/><path d="M${x - 5} ${y + 23} l5 7 l5 -7 Z" fill="${c}" ${s(2)}/><ellipse cx="${x - 7}" cy="${y - 8}" rx="4.5" ry="8" fill="#fff" opacity=".6"/></g>`;
  return `
    <ellipse cx="0" cy="2" rx="16" ry="5" fill="#000" opacity=".16"/>
    ${b(-30, -120, '#5EC8F2', -12)}${b(30, -122, '#C58BF2', 12)}${b(0, -150, '#E84A7F', 0)}${b(-14, -95, '#FFC83D', -6)}${b(18, -98, '#79C24A', 8)}
    <path d="M-8 -10 h16 l-3 10 h-10 Z" fill="#A8743A" ${s(3)}/>`;
}

function chestSVG(open) {
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

// [svg content, viewBox x, y, w, h]
const DEFS = {
  chest: [chestSVG(false), -48, -94, 96, 106],
  chestOpen: [chestSVG(true), -48, -94, 96, 106],
  castle: [castleSVG(false), -265, -420, 530, 465],
  castleOpen: [castleSVG(true), -265, -420, 530, 465],
  giftPink: [giftSVG('#E84A7F', '#FFC83D'), -40, -78, 80, 90],
  giftBlue: [giftSVG('#5EC8F2', '#FFFFFF'), -40, -78, 80, 90],
  giftPurple: [giftSVG('#C58BF2', '#FF8FB8'), -40, -78, 80, 90],
  giftGold: [giftSVG('#FFC83D', '#E84A7F'), -40, -78, 80, 90],
  cakeTable: [cakeTableSVG(), -62, -152, 124, 164],
  balloons: [balloonsSVG(), -60, -182, 120, 192],

  tree: [
    `<ellipse cx="0" cy="4" rx="34" ry="8" fill="#000" opacity=".15"/>
     <rect x="-7" y="-26" width="14" height="30" rx="4" fill="#8A5A2B" ${s(4)}/>
     <circle cx="-16" cy="-40" r="24" fill="#4E9F3D" ${s(4)}/>
     <circle cx="16" cy="-42" r="24" fill="#4E9F3D" ${s(4)}/>
     <circle cx="0" cy="-62" r="27" fill="#5DB848" ${s(4)}/>
     <circle cx="-8" cy="-70" r="7" fill="#8FD86E"/>`,
    -45, -95, 90, 106,
  ],
  pine: [
    `<ellipse cx="0" cy="4" rx="30" ry="8" fill="#000" opacity=".15"/>
     <rect x="-6" y="-22" width="12" height="26" rx="3" fill="#8A5A2B" ${s(4)}/>
     <path d="M-34 -18 L0 -64 L34 -18 Z" fill="#2F8F4E" ${s(4)}/>
     <path d="M-28 -46 L0 -92 L28 -46 Z" fill="#3AA35C" ${s(4)}/>
     <path d="M-20 -74 L0 -112 L20 -74 Z" fill="#46B86A" ${s(4)}/>`,
    -42, -118, 84, 128,
  ],

  camp: [
    `<ellipse cx="0" cy="4" rx="140" ry="26" fill="#6DB33F" opacity=".6"/>
     <path d="M-120 0 L-55 -120 L10 0 Z" fill="#E84A7F" ${s()}/>
     <path d="M-55 -120 L-35 0 L10 0 Z" fill="#C2386A" ${s()}/>
     <path d="M-70 0 L-55 -62 L-40 0 Z" fill="${O}"/>
     <path d="M-55 -120 V-160" ${s(4)}/>
     <path d="M-55 -160 L-22 -150 L-55 -140 Z" fill="#FFC83D" ${s(3)}/>
     <g transform="translate(70 -4)">
       <ellipse rx="44" ry="13" fill="#9AA5B1" ${s(4)}/>
       <rect x="-30" y="-12" width="60" height="12" rx="6" fill="#7A4B22" ${s(3)} transform="rotate(14)"/>
       <rect x="-30" y="-12" width="60" height="12" rx="6" fill="#8A5A2B" ${s(3)} transform="rotate(-14)"/>
       <path d="M0 -12 C -22 -30 -10 -50 -4 -70 C 4 -52 26 -40 0 -12 Z" fill="#FF8A2B" ${s(4)}/>
       <path d="M0 -16 C -10 -28 -4 -40 0 -50 C 6 -38 12 -30 0 -16 Z" fill="#FFE07A"/>
     </g>`,
    -150, -170, 300, 205,
  ],

  palms: [
    `<ellipse cx="0" cy="6" rx="130" ry="30" fill="#F2D28B" ${s(4)}/>
     ${palm(-55, -1)}
     ${palm(40, 1, 0.82)}`,
    -195, -205, 345, 245,
  ],

  windmill: [
    `<ellipse cx="0" cy="4" rx="70" ry="14" fill="#000" opacity=".15"/>
     <path d="M-48 0 L-32 -135 L32 -135 L48 0 Z" fill="#F4E4C1" ${s()}/>
     <path d="M-44 -128 L0 -182 L44 -128 Z" fill="#D9534F" ${s()}/>
     <path d="M-15 0 V-34 a15 15 0 0 1 30 0 V0 Z" fill="#8A5A2B" ${s(4)}/>
     <circle cx="0" cy="-86" r="11" fill="#7FD3F7" ${s(4)}/>`,
    -60, -190, 120, 205,
  ],
  blades: [
    `${[0, 90, 180, 270]
      .map((a) => `<g transform="rotate(${a})"><rect x="-11" y="-104" width="22" height="92" rx="4" fill="#FBEBC8" ${s(4)}/><path d="M-11 -80 H11 M-11 -58 H11 M-11 -36 H11" ${s(2)}/></g>`)
      .join('')}
     <circle r="14" fill="#8A5A2B" ${s(4)}/>`,
    -110, -110, 220, 220,
  ],

  lighthouse: [
    `<ellipse cx="-20" cy="2" rx="70" ry="20" fill="#9AA5B1" ${s(4)}/>
     <ellipse cx="45" cy="6" rx="40" ry="14" fill="#B4BEC9" ${s(4)}/>
     <path d="M-32 0 L-20 -160 L20 -160 L32 0 Z" fill="#FFFFFF"/>
     <path d="M-29.6 -30 L-27.2 -62 L27.2 -62 L29.6 -30 Z M-24.9 -94 L-22.5 -126 L22.5 -126 L24.9 -94 Z" fill="#D9534F"/>
     <path d="M-32 0 L-20 -160 L20 -160 L32 0 Z" fill="none" ${s()}/>
     <rect x="-30" y="-172" width="60" height="14" rx="3" fill="#8A5A2B" ${s(4)}/>
     <rect x="-17" y="-206" width="34" height="34" fill="#FFE07A" ${s(4)}/>
     <path d="M-24 -206 L0 -234 L24 -206 Z" fill="#D9534F" ${s(4)}/>`,
    -95, -242, 185, 270,
  ],

  lake: [
    `<ellipse cx="0" cy="-24" rx="128" ry="58" fill="#5EC8F2" ${s()}/>
     <ellipse cx="-10" cy="-30" rx="92" ry="36" fill="#8EDCF9"/>
     <path d="M-40 -34 q 12 -8 24 0 M20 -18 q 12 -8 24 0" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round"/>
     <circle cx="60" cy="-44" r="11" fill="#4FA83D" ${s(3)}/>
     <circle cx="44" cy="-8" r="8" fill="#4FA83D" ${s(3)}/>
     <g transform="translate(-112 -18)">
       <path d="M0 0 L-14 -46 L0 -76 L14 -46 Z" fill="#C58BF2" ${s(4)}/>
       <path d="M-18 4 L-34 -30 L-26 -50 L-10 -24 Z" fill="#E7A6F7" ${s(4)}/>
       <path d="M14 4 L22 -28 L36 -36 L32 0 Z" fill="#A36BE0" ${s(4)}/>
     </g>`,
    -155, -100, 292, 140,
  ],

  falls: [
    `<path d="M-160 0 L-70 -190 L20 0 Z" fill="#9AA5B1" ${s()}/>
     <path d="M-92 -144 L-70 -190 L-48 -144 L-60 -152 L-70 -138 L-80 -152 Z" fill="#fff" ${s(4)}/>
     <path d="M-30 0 L70 -240 L170 0 Z" fill="#B4BEC9" ${s()}/>
     <path d="M42 -172 L70 -240 L98 -172 L84 -182 L70 -164 L56 -182 Z" fill="#fff" ${s(4)}/>
     <rect x="52" y="-150" width="36" height="146" fill="#7FD3F7" ${s(4)}/>
     <path d="M62 -146 V-8 M78 -146 V-8" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-dasharray="14 18"/>
     <ellipse cx="70" cy="2" rx="62" ry="17" fill="#5EC8F2" ${s(4)}/>`,
    -168, -248, 346, 272,
  ],

  cottage: [
    `<ellipse cx="0" cy="4" rx="110" ry="18" fill="#000" opacity=".14"/>
     <rect x="44" y="-178" width="22" height="50" fill="#9C5A1E" ${s(4)}/>
     <rect x="-72" y="-96" width="144" height="96" fill="#FBE3C0" ${s()}/>
     <path d="M-94 -90 L0 -166 L94 -90 Z" fill="#E84A7F" ${s()}/>
     <path d="M-60 -112 L0 -150 M-30 -96 L20 -132" stroke="#C2386A" stroke-width="4" stroke-linecap="round"/>
     <path d="M-17 0 V-46 a17 17 0 0 1 34 0 V0 Z" fill="#8A5A2B" ${s(4)}/>
     <path d="M0 -36 c -4 -6 -12 -2 -7 4 L0 -26 L7 -32 c 5 -6 -3 -10 -7 -4 Z" fill="#FFC83D"/>
     <rect x="-60" y="-70" width="30" height="28" rx="3" fill="#7FD3F7" ${s(4)}/>
     <rect x="30" y="-70" width="30" height="28" rx="3" fill="#7FD3F7" ${s(4)}/>
     <rect x="-64" y="-42" width="38" height="10" rx="3" fill="#6DB33F" ${s(3)}/>
     <rect x="26" y="-42" width="38" height="10" rx="3" fill="#6DB33F" ${s(3)}/>
     <circle cx="-54" cy="-44" r="4" fill="#E84A7F"/><circle cx="-38" cy="-44" r="4" fill="#FFC83D"/>
     <circle cx="38" cy="-44" r="4" fill="#E84A7F"/><circle cx="54" cy="-44" r="4" fill="#FFC83D"/>`,
    -110, -190, 220, 210,
  ],

  balloon: [
    `<ellipse cx="0" cy="4" rx="60" ry="12" fill="#000" opacity=".14"/>
     <path d="M30 -24 L60 0" ${s(3)}/>
     <rect x="54" y="-6" width="10" height="10" fill="#8A5A2B" ${s(3)}/>
     <path d="M-18 -64 L-30 -112 M18 -64 L30 -112" ${s(3)}/>
     <rect x="-24" y="-66" width="48" height="40" rx="6" fill="#C48A4A" ${s(4)}/>
     <path d="M-24 -54 H24" stroke="#8A5A2B" stroke-width="4"/>
     <path d="M0 -104 C -96 -116 -96 -250 0 -256 C 96 -250 96 -116 0 -104 Z" fill="#FFC83D" ${s()}/>
     <path d="M0 -104 C -42 -130 -42 -236 0 -256 C 42 -236 42 -130 0 -104 Z" fill="#E84A7F" ${s(4)}/>
     <path d="M0 -104 V-256" ${s(3)}/>
     <ellipse cx="-50" cy="-210" rx="9" ry="20" fill="#fff" opacity=".6" transform="rotate(20 -50 -210)"/>`,
    -100, -264, 200, 280,
  ],

  bench: [
    `<ellipse cx="0" cy="4" rx="100" ry="16" fill="#000" opacity=".14"/>
     <circle cx="80" cy="-170" r="34" fill="#FFF3A0" opacity=".45"/>
     <rect x="76" y="-160" width="9" height="160" fill="#3B2414"/>
     <path d="M66 -160 h29 l-6 -24 h-17 Z" fill="#FFE07A" ${s(4)}/>
     <rect x="-64" y="-26" width="8" height="26" fill="#7A4B22" ${s(3)}/>
     <rect x="40" y="-26" width="8" height="26" fill="#7A4B22" ${s(3)}/>
     <rect x="-72" y="-36" width="128" height="14" rx="4" fill="#C48A4A" ${s(4)}/>
     <rect x="-72" y="-70" width="128" height="12" rx="4" fill="#C48A4A" ${s(4)}/>
     <rect x="-72" y="-54" width="128" height="10" rx="4" fill="#C48A4A" ${s(4)}/>
     <path d="M-60 -70 V-36 M44 -70 V-36" ${s(4)}/>
     <path d="M-40 -70 Q -52 -110 -62 -132" fill="none" ${s(2)}/>
     <path d="M-62 -128 c -14 -20 -46 -6 -28 18 L-62 -84 L-34 -110 c 18 -24 -14 -38 -28 -18 Z" fill="#E84A7F" ${s(4)}/>`,
    -110, -210, 225, 225,
  ],

  merlion: [
    `<ellipse cx="0" cy="6" rx="150" ry="30" fill="#F2D28B" ${s(4)}/>
     ${skyline()}
     ${merlion(10)}`,
    -262, -240, 482, 282,
  ],

  cake: [
    `<ellipse cx="0" cy="2" rx="112" ry="22" fill="#FFFFFF" ${s(4)}/>
     <rect x="-84" y="-74" width="168" height="74" rx="10" fill="#FFB3CF" ${s()}/>
     <path d="M-84 -60 q 14 18 28 0 q 14 18 28 0 q 14 18 28 0 q 14 18 28 0 q 14 18 28 0 q 14 18 28 0 V-74 H-84 Z" fill="#FFFFFF" ${s(4)}/>
     <rect x="-58" y="-130" width="116" height="58" rx="10" fill="#FFF3C4" ${s()}/>
     <path d="M-58 -118 q 12 16 24 0 q 12 16 24 0 q 12 16 24 0 q 12 16 24 0 q 10 14 20 0 V-130 H-58 Z" fill="#E84A7F" ${s(4)}/>
     <text x="0" y="-18" text-anchor="middle" font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="38" fill="#fff" stroke="${O}" stroke-width="7" paint-order="stroke">33</text>
     ${[-30, 0, 30]
       .map((x) => `<rect x="${x - 5}" y="-160" width="10" height="30" rx="3" fill="${x ? '#7FD3F7' : '#C58BF2'}" ${s(3)}/>
         <path d="M${x} -162 c -9 -10 -4 -20 0 -26 c 4 6 9 16 0 26 Z" fill="#FF8A2B" ${s(2)}/>`)
       .join('')}
     <circle cx="-40" cy="-96" r="3" fill="#79C24A"/><circle cx="34" cy="-92" r="3" fill="#5EC8F2"/><circle cx="10" cy="-100" r="3" fill="#C58BF2"/>`,
    -118, -195, 236, 222,
  ],
};

const SCALE = 2; // sprite pixels per world unit

function load(svg, vx, vy, vw, vh) {
  const markup = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vx} ${vy} ${vw} ${vh}" width="${vw * SCALE}" height="${vh * SCALE}">${svg}</svg>`;
  return new Promise((res) => {
    const img = new Image();
    img.onload = () => res(img);
    img.onerror = () => res(null);
    img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(markup)}`;
  });
}

export async function loadSprites() {
  const out = {};
  await Promise.all(
    Object.entries({ ...DEFS, ...CRITTER_DEFS, ...WILD_DEFS }).map(async ([name, [svg, vx, vy, vw, vh]]) => {
      out[name] = { img: await load(svg, vx, vy, vw, vh), vx, vy, vw, vh };
    }),
  );
  return out;
}

export function drawSprite(ctx, sp, x, y, k = 1) {
  if (!sp || !sp.img) return;
  ctx.drawImage(sp.img, x + sp.vx * k, y + sp.vy * k, sp.vw * k, sp.vh * k);
}

export { chestSVG };
