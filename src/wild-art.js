// Sprites for the newer habitats: night owls and bats, a baby dragon, a
// dinosaur, pigeons, parrots, big cats and pets. Same rules as art.js:
// drawn around (0,0) = where it touches the ground, animals face right.

const O = '#3B2414';
const s = (w = 4) => `stroke="${O}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
const eye = (x, y, r = 2.4) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${O}"/><circle cx="${x + r * 0.35}" cy="${y - r * 0.35}" r="${r * 0.38}" fill="#fff"/>`;
const blush = (x, y, rx = 3) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${rx * 0.6}" fill="#FF8FB8" opacity=".75"/>`;
const legs = (xs, c, h = 16, w = 9) => xs.map((x) => `<rect x="${x}" y="${-h}" width="${w}" height="${h}" rx="4" fill="${c}" ${s(3)}/>`).join('');

const owl = `
  <path d="M-6 -2 l-3 5 M-2 -2 v5 M6 -2 l3 5 M2 -2 v5" stroke="#FFB02E" stroke-width="3" stroke-linecap="round"/>
  <path d="M-22 -6 Q -26 -48 0 -52 Q 26 -48 22 -6 Q 0 2 -22 -6Z" fill="#9C6B3F" ${s(4)}/>
  <path d="M-17 -44 l-7 -15 l14 8z M17 -44 l7 -15 l-14 8z" fill="#9C6B3F" ${s(3)}/>
  <ellipse cx="0" cy="-17" rx="13" ry="12" fill="#E8C99A"/>
  <path d="M-6 -20 l2 3 l2 -3 M2 -20 l2 3 l2 -3 M-3 -12 l2 3 l2 -3" fill="none" stroke="#9C6B3F" stroke-width="2" stroke-linecap="round"/>
  <path d="M-22 -30 q-6 14 4 22 M22 -30 q6 14 -4 22" fill="none" stroke="#7A4B22" stroke-width="3" stroke-linecap="round"/>
  <circle cx="-9" cy="-36" r="9.5" fill="#FFF6D6" ${s(3)}/><circle cx="9" cy="-36" r="9.5" fill="#FFF6D6" ${s(3)}/>
  ${eye(-8, -36, 4.5)}${eye(10, -36, 4.5)}
  <path d="M-3.5 -29 L3.5 -29 L0 -22Z" fill="#FFB02E" ${s(2)}/>`;

const bat = `
  <g transform="translate(0 -40)">
  <path d="M-8 -4 C -24 -22 -46 -18 -52 -4 C -44 -8 -40 0 -34 2 C -30 -4 -24 0 -20 6 C -16 0 -10 2 -8 6 Z" fill="#6B5A8E" ${s(3)}/>
  <path d="M8 -4 C 24 -22 46 -18 52 -4 C 44 -8 40 0 34 2 C 30 -4 24 0 20 6 C 16 0 10 2 8 6 Z" fill="#6B5A8E" ${s(3)}/>
  <path d="M-8 -12 l-4 -12 l9 7z M8 -12 l4 -12 l-9 7z" fill="#5B4A7A" ${s(2.5)}/>
  <ellipse cx="0" cy="0" rx="13" ry="14" fill="#5B4A7A" ${s(3)}/>
  <ellipse cx="0" cy="5" rx="7" ry="6" fill="#8C7BB0"/>
  ${eye(-5, -3, 2.6)}${eye(5, -3, 2.6)}
  <path d="M-3 4 q3 3 6 0" fill="none" ${s(2)}/><path d="M-2 5 l1 3 l1 -2.5" fill="#fff" stroke="${O}" stroke-width="1"/>
  ${blush(-8, 3, 2.2)}${blush(8, 3, 2.2)}
  </g>`;

const dragon = `
  <path d="M-26 -16 C -48 -12 -56 -28 -48 -40 L -56 -46 L -44 -48 L -44 -38 C -46 -26 -38 -20 -22 -24 Z" fill="#5FBF5A" ${s(3)}/>
  <path d="M-10 -52 C -30 -78 -44 -70 -40 -50 C -34 -56 -28 -52 -24 -46 C -20 -52 -14 -50 -10 -44 Z" fill="#C58BF2" ${s(3)}/>
  ${legs([-16, 6], '#5FBF5A', 14, 12)}
  <ellipse cx="-2" cy="-32" rx="22" ry="24" fill="#5FBF5A" ${s(4)}/>
  <path d="M-8 -50 l-6 -6 l2 8 M-18 -40 l-8 -3 l5 7 M-22 -26 l-8 1 l7 5" fill="#FFC83D" ${s(2.5)}/>
  <ellipse cx="4" cy="-26" rx="12" ry="16" fill="#F6E27A" ${s(2.5)}/>
  <path d="M-6 -34 h18 M-7 -26 h20 M-6 -18 h18" stroke="#D9C057" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M8 -64 l-4 -12 l9 8z M20 -66 l2 -12 l6 10z" fill="#FFC83D" ${s(2.5)}/>
  <path d="M-2 -58 C -2 -76 26 -76 32 -64 C 44 -64 48 -54 42 -48 C 36 -42 20 -44 10 -44 C 0 -44 -2 -50 -2 -58 Z" fill="#5FBF5A" ${s(4)}/>
  <circle cx="40" cy="-56" r="1.8" fill="${O}"/>
  ${eye(18, -60, 3.2)}${blush(24, -50, 3)}
  <path d="M30 -48 q6 3 10 -1" fill="none" ${s(2)}/>
  <path d="M48 -56 c6 -6 14 -2 12 4 c6 0 6 8 0 8 c2 6 -8 8 -10 2 c-4 0 -6 -6 -2 -8z" fill="#FF8A2B" ${s(2.5)}/>
  <path d="M52 -52 c3 -2 6 0 5 3 c2 1 1 4 -2 3z" fill="#FFE066"/>`;

const dino = `
  <path d="M-30 -30 C -56 -30 -72 -16 -80 -4 C -64 -10 -46 -10 -28 -14 Z" fill="#59B7A8" ${s(4)}/>
  ${legs([-26, -12, 10, 24], '#4FA597', 22, 12)}
  <ellipse cx="-2" cy="-34" rx="34" ry="22" fill="#59B7A8" ${s(4)}/>
  <path d="M20 -46 C 30 -70 36 -92 46 -104 L 60 -98 C 50 -84 42 -64 34 -36 Z" fill="#59B7A8" ${s(4)}/>
  <ellipse cx="58" cy="-104" rx="15" ry="11" fill="#59B7A8" ${s(4)}/>
  <circle cx="-14" cy="-40" r="5" fill="#8FD8CB"/><circle cx="2" cy="-46" r="4" fill="#8FD8CB"/><circle cx="-2" cy="-30" r="3.5" fill="#8FD8CB"/><circle cx="34" cy="-74" r="3.5" fill="#8FD8CB"/>
  <ellipse cx="-4" cy="-24" rx="20" ry="7" fill="#9FE3D6" opacity=".6"/>
  ${eye(60, -107, 3)}${blush(64, -99, 3)}
  <path d="M66 -100 q4 2 6 -1" fill="none" ${s(2)}/>`;

const pigeon = `
  <path d="M-2 -6 v6 M4 -6 v6" stroke="#FF8FA3" stroke-width="3" stroke-linecap="round"/>
  <path d="M-16 -18 L -30 -24 L -28 -12 Z" fill="#6E7884" ${s(3)}/>
  <ellipse cx="-2" cy="-18" rx="20" ry="13" fill="#A9B3BF" ${s(3)}/>
  <path d="M-12 -20 q8 -6 16 0" fill="none" stroke="#6E7884" stroke-width="3" stroke-linecap="round"/>
  <path d="M-12 -14 q8 -6 16 0" fill="none" stroke="#6E7884" stroke-width="3" stroke-linecap="round"/>
  <ellipse cx="11" cy="-24" rx="8" ry="7" fill="#7FB89A"/><ellipse cx="12" cy="-22" rx="6" ry="4" fill="#A781C9" opacity=".8"/>
  <circle cx="14" cy="-32" r="8" fill="#8D97A3" ${s(3)}/>
  <path d="M21 -33 l6 2 l-6 2z" fill="${O}"/><circle cx="21" cy="-34" r="1.6" fill="#fff"/>
  ${eye(16, -34, 1.9)}`;

const parrot = `
  <path d="M0 0 V-40 M-16 0 H16" stroke="${O}" stroke-width="10" stroke-linecap="round"/>
  <path d="M0 0 V-40 M-16 0 H16" stroke="#8A5A2B" stroke-width="5" stroke-linecap="round"/>
  <g transform="translate(0 -40)">
  <path d="M-4 -14 C -8 4 -12 18 -16 32 L -8 32 C -4 18 0 4 2 -12 Z" fill="#3B7FE0" ${s(3)}/>
  <path d="M0 -14 C 0 4 0 18 -2 34 L 4 34 C 6 18 6 4 6 -12 Z" fill="#E8393B" ${s(3)}/>
  <path d="M-34 0 C -10 -4 10 -4 34 2" fill="none" stroke="${O}" stroke-width="11" stroke-linecap="round"/>
  <path d="M-34 0 C -10 -4 10 -4 34 2" fill="none" stroke="#8A5A2B" stroke-width="6" stroke-linecap="round"/>
  <path d="M-4 -3 v-6 M4 -3 v-6" stroke="#5B4A3A" stroke-width="3" stroke-linecap="round"/>
  <ellipse cx="0" cy="-26" rx="15" ry="20" fill="#E8393B" ${s(4)}/>
  <path d="M-14 -32 C -20 -16 -12 -6 -2 -8 C 0 -20 -6 -28 -14 -32 Z" fill="#FFC83D" ${s(3)}/>
  <path d="M-14 -22 C -16 -12 -10 -8 -3 -9" fill="none" stroke="#3B7FE0" stroke-width="6" stroke-linecap="round"/>
  <circle cx="4" cy="-48" r="13" fill="#E8393B" ${s(4)}/>
  <ellipse cx="8" cy="-48" rx="6.5" ry="5.5" fill="#FFF6EC"/>
  <path d="M13 -53 C 25 -53 27 -42 20 -37 C 18 -41 15 -43 13 -43 Z" fill="#F3E2B8" ${s(2.5)}/>
  ${eye(8, -50, 2.6)}</g>`;

const tiger = `
  <path d="M-30 -32 C -44 -34 -48 -50 -40 -58" fill="none" stroke="${O}" stroke-width="10" stroke-linecap="round"/>
  <path d="M-30 -32 C -44 -34 -48 -50 -40 -58" fill="none" stroke="#F28C28" stroke-width="5" stroke-linecap="round"/>
  ${legs([-26, -14, 8, 20], '#F28C28')}
  <ellipse cx="-4" cy="-30" rx="32" ry="18" fill="#F28C28" ${s(4)}/>
  <ellipse cx="-4" cy="-20" rx="20" ry="6" fill="#FFF3DD" opacity=".8"/>
  <path d="M-20 -46 q4 8 0 14 M-8 -48 q4 9 0 16 M4 -47 q4 8 0 14 M-28 -40 q4 6 0 10" fill="none" stroke="${O}" stroke-width="3.5" stroke-linecap="round"/>
  <circle cx="16" cy="-58" r="6.5" fill="#F28C28" ${s(3)}/><circle cx="38" cy="-58" r="6.5" fill="#F28C28" ${s(3)}/>
  <circle cx="16" cy="-58" r="3" fill="#FFB3C9"/><circle cx="38" cy="-58" r="3" fill="#FFB3C9"/>
  <circle cx="27" cy="-44" r="18" fill="#F28C28" ${s(4)}/>
  <path d="M21 -60 l2 6 M27 -62 v6 M33 -60 l-2 6 M10 -46 h6 M10 -40 h5" stroke="${O}" stroke-width="3" stroke-linecap="round"/>
  <ellipse cx="33" cy="-36" rx="11" ry="7.5" fill="#FFF3DD" ${s(2.5)}/>
  <path d="M30 -41 h6 l-3 3z" fill="#FF8FB8" ${s(1.5)}/>
  ${eye(25, -48, 2.6)}${eye(35, -48, 2.6)}`;

const lion = `
  <path d="M-30 -32 C -44 -32 -48 -44 -46 -54" fill="none" stroke="${O}" stroke-width="9" stroke-linecap="round"/>
  <path d="M-30 -32 C -44 -32 -48 -44 -46 -54" fill="none" stroke="#E8B04A" stroke-width="4" stroke-linecap="round"/>
  <circle cx="-46" cy="-58" r="6" fill="#B8642A" ${s(3)}/>
  ${legs([-26, -14, 8, 20], '#E8B04A')}
  <ellipse cx="-4" cy="-30" rx="32" ry="18" fill="#E8B04A" ${s(4)}/>
  ${Array.from({ length: 11 }, (_, i) => { const t = (i / 11) * Math.PI * 2; return `<circle cx="${(27 + Math.cos(t) * 21).toFixed(1)}" cy="${(-44 + Math.sin(t) * 21).toFixed(1)}" r="10" fill="#B8642A" ${s(3.5)}/>`; }).join('')}
  <circle cx="27" cy="-44" r="21" fill="#B8642A"/>
  <circle cx="27" cy="-44" r="17" fill="#F2C062" ${s(4)}/>
  <circle cx="16" cy="-58" r="5" fill="#F2C062" ${s(3)}/><circle cx="38" cy="-58" r="5" fill="#F2C062" ${s(3)}/>
  <ellipse cx="32" cy="-36" rx="10" ry="7" fill="#FFF3DD" ${s(2.5)}/>
  <path d="M29 -41 h6 l-3 3z" fill="#7A4B22" ${s(1.5)}/>
  ${eye(24, -48, 2.6)}${eye(34, -48, 2.6)}`;

const dog = `
  <path d="M-30 -34 C -40 -40 -40 -54 -34 -58" fill="none" stroke="${O}" stroke-width="10" stroke-linecap="round"/>
  <path d="M-30 -34 C -40 -40 -40 -54 -34 -58" fill="none" stroke="#F2D6A8" stroke-width="5" stroke-linecap="round"/>
  ${legs([-24, -12, 8, 20], '#F2D6A8')}
  <ellipse cx="-2" cy="-30" rx="30" ry="17" fill="#F2D6A8" ${s(4)}/>
  <ellipse cx="-14" cy="-36" rx="8" ry="6" fill="#D9A86A"/>
  <circle cx="26" cy="-46" r="17" fill="#F2D6A8" ${s(4)}/>
  <path d="M13 -58 C 4 -54 4 -38 10 -34 C 16 -40 16 -52 13 -58 Z" fill="#C99A62" ${s(3)}/>
  <path d="M37 -60 C 46 -56 46 -40 40 -36 C 34 -42 34 -54 37 -60 Z" fill="#C99A62" ${s(3)}/>
  <ellipse cx="32" cy="-38" rx="10" ry="7" fill="#FFF6EC" ${s(2.5)}/>
  <ellipse cx="35" cy="-42" rx="3.5" ry="2.6" fill="${O}"/>
  <path d="M30 -33 q2 8 6 6 q2 -3 0 -6" fill="#FF6F91" ${s(2)}/>
  ${eye(22, -50, 2.8)}${eye(31, -50, 2.8)}${blush(18, -42, 2.6)}`;

const cat = `
  <path d="M-14 -4 C -34 -4 -36 -20 -28 -26 C -24 -28 -20 -24 -22 -20" fill="none" stroke="${O}" stroke-width="10" stroke-linecap="round"/>
  <path d="M-14 -4 C -34 -4 -36 -20 -28 -26 C -24 -28 -20 -24 -22 -20" fill="none" stroke="#F2A65A" stroke-width="5" stroke-linecap="round"/>
  <path d="M-16 0 C -20 -26 -10 -40 2 -40 C 14 -40 22 -26 18 0 Z" fill="#F2A65A" ${s(4)}/>
  <path d="M-4 0 C -6 -14 -2 -26 4 -28 C 10 -26 12 -14 10 0 Z" fill="#FFF3DD"/>
  <path d="M-12 -18 q5 2 8 -1 M12 -20 q4 3 6 0" fill="none" stroke="#C9762E" stroke-width="3" stroke-linecap="round"/>
  <path d="M-8 -60 l-2 -14 l12 8z M14 -62 l6 -12 l2 14z" fill="#F2A65A" ${s(3)}/>
  <path d="M-6 -64 l-1 -6 l5 4z M15 -65 l3 -5 l1 6z" fill="#FFB3C9"/>
  <ellipse cx="4" cy="-50" rx="17" ry="15" fill="#F2A65A" ${s(4)}/>
  <path d="M-2 -63 l1 5 M4 -64 v5 M10 -63 l-1 5" stroke="#C9762E" stroke-width="2.5" stroke-linecap="round"/>
  ${eye(-2, -51, 2.6)}${eye(10, -51, 2.6)}
  <path d="M3 -46 h3 l-1.5 2z" fill="#FF8FB8"/>
  <path d="M1 -42 q3 3 4 0 q1 3 4 0" fill="none" ${s(1.8)}/>
  <path d="M-6 -45 h-12 M-6 -42 l-11 3 M14 -45 h12 M14 -42 l11 3" stroke="${O}" stroke-width="1.5" stroke-linecap="round"/>
  ${blush(-5, -45, 2.4)}${blush(13, -45, 2.4)}`;


// a dark old tree with a branch for the owl (branch tip around 44, -100)
const nightTree = `
  <ellipse cx="0" cy="2" rx="40" ry="9" fill="#000" opacity=".18"/>
  <path d="M-14 0 C -12 -50 -12 -110 -8 -150 L 8 -150 C 8 -110 10 -50 14 0 Z" fill="#5B4636" ${s(4)}/>
  <path d="M4 -96 C 20 -100 36 -102 58 -100" fill="none" stroke="${O}" stroke-width="13" stroke-linecap="round"/>
  <path d="M4 -96 C 20 -100 36 -102 58 -100" fill="none" stroke="#5B4636" stroke-width="7" stroke-linecap="round"/>
  <ellipse cx="-4" cy="-162" rx="54" ry="34" fill="#2F5A44" ${s(4)}/>
  <ellipse cx="-22" cy="-170" rx="20" ry="12" fill="#3C6E54"/>
  <circle cx="-2" cy="-60" r="7" fill="#3A2A20"/>`;

const doghouse = `
  <ellipse cx="0" cy="2" rx="42" ry="9" fill="#000" opacity=".15"/>
  <rect x="-32" y="-46" width="64" height="46" fill="#E8B04A" ${s(4)}/>
  <path d="M-40 -42 L0 -76 L40 -42 Z" fill="#D9534F" ${s(4)}/>
  <path d="M-13 0 V-20 a13 13 0 0 1 26 0 V0 Z" fill="#5B3A22" ${s(3)}/>
  <path d="M-20 -54 h40" stroke="#B8402F" stroke-width="3" stroke-linecap="round"/>
  <rect x="-12" y="-38" width="24" height="9" rx="3" fill="#fff" ${s(2)}/>`;

const bone = `
  <path d="M-12 -4 h24" stroke="${O}" stroke-width="9" stroke-linecap="round"/><path d="M-12 -4 h24" stroke="#fff" stroke-width="4" stroke-linecap="round"/>
  ${[-14, 14].map((x) => `<circle cx="${x}" cy="-7" r="4" fill="#fff" ${s(2)}/><circle cx="${x}" cy="-1" r="4" fill="#fff" ${s(2)}/>`).join('')}`;

const yarn = `
  <path d="M10 -6 C 24 -4 26 4 38 2" fill="none" stroke="#E84A7F" stroke-width="2.5" stroke-linecap="round"/>
  <circle cx="0" cy="-11" r="11" fill="#FF8FB8" ${s(3)}/>
  <path d="M-8 -16 C -2 -10 2 -4 6 -2 M-9 -8 C -3 -14 4 -18 9 -17 M-4 -21 C 0 -14 6 -10 10 -10" fill="none" stroke="#E84A7F" stroke-width="2" stroke-linecap="round"/>`;

const acacia = `
  <ellipse cx="0" cy="2" rx="38" ry="8" fill="#000" opacity=".15"/>
  <path d="M-6 0 C -6 -40 -4 -70 -18 -96 M-2 -60 C 6 -76 18 -88 30 -98" fill="none" stroke="${O}" stroke-width="13" stroke-linecap="round"/>
  <path d="M-6 0 C -6 -40 -4 -70 -18 -96 M-2 -60 C 6 -76 18 -88 30 -98" fill="none" stroke="#8A5A2B" stroke-width="7" stroke-linecap="round"/>
  <path d="M-70 -104 C -60 -130 60 -132 76 -104 C 50 -96 -44 -96 -70 -104 Z" fill="#7DB346" ${s(4)}/>
  <path d="M-50 -112 C -30 -122 30 -124 50 -112" fill="none" stroke="#9CCB5E" stroke-width="5" stroke-linecap="round"/>`;

const fern = `
  ${[-60, -30, 0, 30, 60].map((a) => `<path d="M0 0 Q ${a * 0.4} -30 ${a * 0.8} -${54 - Math.abs(a) * 0.3}" fill="none" stroke="${O}" stroke-width="9" stroke-linecap="round"/><path d="M0 0 Q ${a * 0.4} -30 ${a * 0.8} -${54 - Math.abs(a) * 0.3}" fill="none" stroke="#3E9E4A" stroke-width="5" stroke-linecap="round"/>`).join('')}`;

const eggs = `
  <ellipse cx="0" cy="-2" rx="30" ry="9" fill="#C9A06A" ${s(3)}/>
  <ellipse cx="-12" cy="-14" rx="9" ry="12" fill="#B9E6A0" ${s(3)}/>
  <ellipse cx="10" cy="-15" rx="9" ry="12" fill="#F6C1E0" ${s(3)}/>
  <path d="M-16 -18 l4 3 M8 -20 l5 2 M12 -10 l-4 2" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/>`;

const boulders = `
  <ellipse cx="-14" cy="-14" rx="26" ry="18" fill="#9AA5B1" ${s(4)}/>
  <ellipse cx="18" cy="-10" rx="18" ry="13" fill="#B4BEC9" ${s(4)}/>
  <ellipse cx="-20" cy="-22" rx="8" ry="4" fill="#fff" opacity=".45"/>`;

// [svg, viewBox x, y, w, h]
export const WILD_DEFS = {
  owl: [owl, -32, -62, 64, 68],
  bat: [bat, -56, -68, 112, 46],
  dragon: [dragon, -62, -82, 126, 86],
  dino: [dino, -84, -120, 162, 124],
  pigeon: [pigeon, -34, -44, 66, 48],
  parrot: [parrot, -40, -110, 80, 116],
  tiger: [tiger, -52, -66, 102, 70],
  lion: [lion, -56, -78, 118, 82],
  dog: [dog, -48, -66, 98, 70],
  cat: [cat, -42, -78, 74, 82],
  nightTree: [nightTree, -62, -200, 128, 206],
  doghouse: [doghouse, -44, -80, 88, 84],
  bone: [bone, -22, -14, 44, 16],
  yarn: [yarn, -14, -26, 54, 28],
  acacia: [acacia, -74, -136, 154, 140],
  fern: [fern, -54, -60, 108, 62],
  eggs: [eggs, -34, -30, 68, 32],
  boulders: [boulders, -44, -36, 84, 38],
};
