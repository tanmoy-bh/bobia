// Sprites for the animals and props around each habitat on the map.
// Same rules as art.js: drawn around (0,0) = where it touches the ground,
// animals face right.

import { LAMB_ART } from './title-scene.js';

const O = '#3B2414';
const s = (w = 4) => `stroke="${O}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
const eye = (x, y, r = 2.4) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${O}"/><circle cx="${x + r * 0.35}" cy="${y - r * 0.35}" r="${r * 0.38}" fill="#fff"/>`;
const blush = (x, y, rx = 3) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${rx * 0.6}" fill="#FF8FB8" opacity=".75"/>`;

const sheep = `<g transform="scale(1.25) translate(0 -21)">${LAMB_ART}</g>`;

const cow = `
  <path d="M-42 -54 q-12 6 -8 30" fill="none" ${s(3)}/><path d="M-53 -28 l3 -8 l5 7 z" fill="${O}"/>
  ${[-32, -20, 14, 26].map((x) => `<rect x="${x}" y="-26" width="10" height="26" rx="4" fill="#fff" ${s(3)}/><rect x="${x + 1.5}" y="-6" width="7" height="5" rx="1.5" fill="#6B4A36"/>`).join('')}
  <rect x="-46" y="-70" width="82" height="48" rx="22" fill="#fff" ${s(4)}/>
  <path d="M-30 -66 c10 -2 14 8 8 14 c-6 7 -16 2 -14 -6 c1 -4 2 -7 6 -8z" fill="#4A3426"/>
  <path d="M2 -44 c8 -4 16 2 13 9 c-3 6 -14 6 -15 0 c-1 -4 0 -7 2 -9z" fill="#4A3426"/>
  <ellipse cx="-34" cy="-38" rx="5" ry="4" fill="#4A3426"/>
  <ellipse cx="0" cy="-23" rx="9" ry="5" fill="#FFB3C9" ${s(2.5)}/>
  <path d="M34 -86 q-4 -8 2 -10 M50 -86 q4 -8 -2 -10" fill="none" stroke="#F3E2B8" stroke-width="6" stroke-linecap="round"/>
  <path d="M34 -86 q-4 -8 2 -10 M50 -86 q4 -8 -2 -10" fill="none" ${s(2)}/>
  <ellipse cx="25" cy="-78" rx="9" ry="5" transform="rotate(-20 25 -78)" fill="#fff" ${s(3)}/>
  <ellipse cx="59" cy="-78" rx="9" ry="5" transform="rotate(20 59 -78)" fill="#fff" ${s(3)}/>
  <ellipse cx="42" cy="-70" rx="17" ry="18" fill="#fff" ${s(4)}/>
  <path d="M30 -82 c6 -4 12 0 10 6 c-2 5 -10 4 -11 -1z" fill="#4A3426"/>
  <ellipse cx="43" cy="-56" rx="15" ry="10" fill="#FFB3C9" ${s(3)}/>
  <ellipse cx="38" cy="-56" rx="2" ry="2.8" fill="${O}"/><ellipse cx="48" cy="-56" rx="2" ry="2.8" fill="${O}"/>
  ${eye(36, -72, 3)}${eye(49, -72, 3)}
  <path d="M30 -46 h22" ${s(3)}/><circle cx="41" cy="-42" r="5" fill="#FFC83D" ${s(2.5)}/>`;

const pig = `
  <path d="M-30 -36 c-9 -1 -11 -10 -5 -12 c5 -1 6 6 0 7" fill="none" ${s(3)}/>
  ${[-22, -12, 8, 18].map((x) => `<rect x="${x}" y="-16" width="8" height="16" rx="3" fill="#FF9CC0" ${s(3)}/>`).join('')}
  <ellipse cx="-2" cy="-30" rx="31" ry="21" fill="#FFB3C9" ${s(4)}/>
  <path d="M10 -46 l2 -14 l10 9z M26 -47 l6 -12 l5 12z" fill="#FF9CC0" ${s(3)}/>
  <circle cx="24" cy="-34" r="16" fill="#FFB3C9" ${s(4)}/>
  <ellipse cx="37" cy="-30" rx="7.5" ry="9" fill="#FF8FB8" ${s(3)}/>
  <ellipse cx="35" cy="-31" rx="1.5" ry="2.5" fill="${O}"/><ellipse cx="39.5" cy="-31" rx="1.5" ry="2.5" fill="${O}"/>
  ${eye(20, -40, 2.4)}${eye(29, -41, 2.4)}${blush(18, -29)}
  <ellipse cx="-14" cy="-38" rx="6" ry="3" fill="#fff" opacity=".45"/>`;

const hen = `
  <path d="M-4 -9 v9 M4 -9 v9 M-4 0 h-4 M4 0 h4" stroke="#F08A24" stroke-width="3" stroke-linecap="round"/>
  <path d="M-15 -24 c-8 -6 -9 -14 -4 -16 c2 4 6 8 8 10z" fill="#fff" ${s(3)}/>
  <ellipse cx="-2" cy="-19" rx="16" ry="12" fill="#fff" ${s(3)}/>
  <ellipse cx="-4" cy="-19" rx="8" ry="5.5" fill="#F3E9DA" ${s(2)}/>
  <path d="M5 -40 c1 -5 5 -5 5 -1 c1 -5 6 -4 5 0 c3 -2 5 1 3 4z" fill="#E84A7F" ${s(2)}/>
  <circle cx="11" cy="-31" r="9" fill="#fff" ${s(3)}/>
  <path d="M19 -33 l7 2 l-7 3z" fill="#FFB02E" ${s(1.8)}/>
  <path d="M18 -27 c2 2 2 5 -1 6 c-2 -1 -2 -4 1 -6z" fill="#E84A7F"/>
  ${eye(13, -33, 1.8)}`;

const chick = `
  <path d="M-2 -5 v5 M3 -5 v5" stroke="#F08A24" stroke-width="2.4" stroke-linecap="round"/>
  <circle cx="0" cy="-12" r="9" fill="#FFE066" ${s(2.5)}/>
  <path d="M8 -14 l5 2 l-5 2z" fill="#FFB02E" ${s(1.5)}/>
  <path d="M-6 -11 q-4 2 -1 5" fill="none" ${s(2)}/>
  ${eye(4, -14, 1.6)}${blush(3, -9, 1.8)}`;

const duck = (body, wing, beak, k = 1) => `<g transform="scale(${k})">
  <path d="M-22 -4 Q-26 -16 -18 -18 Q-20 -10 -12 -14 Q4 -20 12 -8 Q18 0 8 2 H-14 Q-22 2 -22 -4Z" fill="${body}" ${s(3)}/>
  <ellipse cx="-4" cy="-8" rx="9" ry="5" fill="${wing}" ${s(2)}/>
  <circle cx="12" cy="-22" r="10" fill="${body}" ${s(3)}/>
  <ellipse cx="23" cy="-20" rx="7" ry="3.6" fill="${beak}" ${s(2)}/>
  ${eye(14, -24, 2)}${blush(13, -17, 2.2)}</g>`;

const frog = `
  <ellipse cx="-12" cy="-5" rx="9" ry="6" fill="#5DAE3B" ${s(3)}/>
  <ellipse cx="12" cy="-5" rx="9" ry="6" fill="#5DAE3B" ${s(3)}/>
  <ellipse cx="0" cy="-12" rx="15" ry="12" fill="#79C24A" ${s(3)}/>
  <ellipse cx="0" cy="-8" rx="9" ry="6" fill="#D7F0A8"/>
  <circle cx="-8" cy="-23" r="6.5" fill="#79C24A" ${s(3)}/><circle cx="8" cy="-23" r="6.5" fill="#79C24A" ${s(3)}/>
  <circle cx="-8" cy="-23" r="4" fill="#fff"/><circle cx="8" cy="-23" r="4" fill="#fff"/>
  ${eye(-8, -23, 2.2)}${eye(8, -23, 2.2)}
  <path d="M-6 -14 q6 4 12 0" fill="none" ${s(2)}/>${blush(-10, -13, 2.4)}${blush(10, -13, 2.4)}
  <path d="M-6 -1 h-4 M6 -1 h4" ${s(3)}/>`;

const crab = `
  <path d="M-12 -8 l-9 6 M-10 -5 l-7 8 M12 -8 l9 6 M10 -5 l7 8" ${s(3)}/>
  <path d="M-10 -16 l-10 -6 M10 -16 l10 -6" ${s(3)}/>
  <path d="M-21 -30 a7 7 0 1 0 6 9 l-4 -3z" fill="#FF6B57" ${s(2.5)}/>
  <path d="M21 -30 a7 7 0 1 1 -6 9 l4 -3z" fill="#FF6B57" ${s(2.5)}/>
  <ellipse cx="0" cy="-12" rx="15" ry="10" fill="#FF6B57" ${s(3)}/>
  <path d="M-5 -20 v-7 M5 -20 v-7" ${s(2.5)}/>
  <circle cx="-5" cy="-29" r="3.6" fill="#fff" ${s(2)}/><circle cx="5" cy="-29" r="3.6" fill="#fff" ${s(2)}/>
  <circle cx="-5" cy="-29" r="1.6" fill="${O}"/><circle cx="5" cy="-29" r="1.6" fill="${O}"/>
  <path d="M-4 -10 q4 3 8 0" fill="none" ${s(2)}/>${blush(-9, -11, 2)}${blush(9, -11, 2)}`;

const songbird = (body, belly, wing) => `
  <path d="M-2 -6 v6 M3 -6 v6" stroke="#F08A24" stroke-width="2.2" stroke-linecap="round"/>
  <path d="M-9 -14 l-9 -4 l2 9z" fill="${wing}" ${s(2)}/>
  <circle cx="0" cy="-15" r="10" fill="${body}" ${s(2.5)}/>
  <ellipse cx="2" cy="-10" rx="6" ry="4" fill="${belly}"/>
  <path d="M9 -17 l6 2 l-6 2z" fill="#FF9F3D" ${s(1.6)}/>
  ${eye(4, -18, 1.8)}${blush(6, -13, 1.8)}
  <path d="M-6 -15 c0 -6 8 -6 7 0z" fill="${wing}" ${s(2)}/>`;

const barn = `
  <path d="M-72 0 V-82 L0 -132 L72 -82 V0 Z" fill="#E2574C" ${s(5)}/>
  <path d="M-62 -78 H62 M-72 -40 H72" stroke="#C2443B" stroke-width="3"/>
  <path d="M-84 -76 L0 -142 L84 -76" fill="none" stroke="${O}" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M-84 -76 L0 -142 L84 -76" fill="none" stroke="#8B4A3A" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="-15" y="-112" width="30" height="24" rx="3" fill="#FFF6E8" ${s(4)}/>
  <path d="M-11 -92 q11 -12 22 0" fill="#F2C94C"/>
  <rect x="-32" y="-64" width="64" height="64" fill="#C9473D" ${s(4)}/>
  <path d="M-32 -64 L32 0 M32 -64 L-32 0" stroke="${O}" stroke-width="9"/>
  <path d="M-32 -64 L32 0 M32 -64 L-32 0" stroke="#FFF6E8" stroke-width="4"/>
  <rect x="-32" y="-64" width="64" height="64" fill="none" stroke="#FFF6E8" stroke-width="5"/>
  <rect x="-32" y="-64" width="64" height="64" fill="none" ${s(3)}/>
  <rect x="-62" y="-66" width="20" height="20" rx="2" fill="#FFF6E8" ${s(3)}/><rect x="42" y="-66" width="20" height="20" rx="2" fill="#FFF6E8" ${s(3)}/>`;

const hay = `
  <rect x="-30" y="-34" width="60" height="34" rx="10" fill="#F2C94C" ${s(4)}/>
  <path d="M-20 -26 h12 M-2 -14 h14 M-22 -10 h8 M8 -26 h10" stroke="#C99A2E" stroke-width="3" stroke-linecap="round"/>
  <path d="M-30 -18 h60" stroke="#B5523B" stroke-width="3"/>`;

const hive = `
  <rect x="-6" y="-30" width="12" height="30" fill="#A8743A" ${s(3)}/>
  <rect x="-26" y="-36" width="52" height="9" rx="3" fill="#C48A4A" ${s(3)}/>
  <path d="M-24 -38 h48 a6 6 0 0 0 0 -12 h-48 a6 6 0 0 0 0 12z" fill="#F5B93C" ${s(3)}/>
  <path d="M-21 -50 h42 a6 6 0 0 0 0 -12 h-42 a6 6 0 0 0 0 12z" fill="#F5B93C" ${s(3)}/>
  <path d="M-16 -62 h32 a6 6 0 0 0 0 -12 h-32 a6 6 0 0 0 0 12z" fill="#F5B93C" ${s(3)}/>
  <path d="M-9 -74 h18 a6 6 0 0 0 0 -12 h-18 a6 6 0 0 0 0 12z" fill="#F5B93C" ${s(3)}/>
  <ellipse cx="0" cy="-45" rx="6" ry="5" fill="${O}"/>
  <path d="M10 -30 c3 6 -1 10 -4 8" fill="#F5B93C" ${s(2)}/>`;

const birdhouse = `
  <rect x="-4" y="-70" width="8" height="70" fill="#A8743A" ${s(3)}/>
  <rect x="-20" y="-104" width="40" height="38" rx="3" fill="#7FD3F7" ${s(3.5)}/>
  <path d="M-27 -100 L0 -122 L27 -100" fill="none" stroke="${O}" stroke-width="12" stroke-linejoin="round" stroke-linecap="round"/>
  <path d="M-27 -100 L0 -122 L27 -100" fill="none" stroke="#E84A7F" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"/>
  <circle cx="0" cy="-88" r="7" fill="${O}"/><path d="M-6 -76 h12" ${s(3)}/>`;

const reeds = `
  <path d="M-12 0 q-4 -30 -8 -54 M0 0 v-64 M12 0 q4 -26 10 -48" fill="none" stroke="${O}" stroke-width="6" stroke-linecap="round"/>
  <path d="M-12 0 q-4 -30 -8 -54 M0 0 v-64 M12 0 q4 -26 10 -48" fill="none" stroke="#4FA83D" stroke-width="3" stroke-linecap="round"/>
  <rect x="-24" y="-56" width="8" height="18" rx="4" fill="#8B5A2B" ${s(2.5)}/>
  <rect x="-4" y="-66" width="8" height="20" rx="4" fill="#8B5A2B" ${s(2.5)}/>
  <rect x="17" y="-50" width="8" height="16" rx="4" fill="#8B5A2B" ${s(2.5)}/>
  <path d="M-6 0 q-14 -10 -16 -24 q10 8 16 24z M6 0 q12 -12 18 -20 q-4 12 -18 20z" fill="#5DAE3B" ${s(2.5)}/>`;

const mushrooms = `
  <rect x="-20" y="-20" width="10" height="20" rx="4" fill="#FFF6E8" ${s(3)}/>
  <path d="M-32 -18 a17 15 0 0 1 34 0z" fill="#E84A7F" ${s(3)}/>
  <circle cx="-22" cy="-26" r="3" fill="#fff"/><circle cx="-12" cy="-22" r="2.4" fill="#fff"/>
  <rect x="10" y="-13" width="8" height="13" rx="3" fill="#FFF6E8" ${s(3)}/>
  <path d="M2 -12 a12 10 0 0 1 24 0z" fill="#C58BF2" ${s(3)}/>
  <circle cx="12" cy="-16" r="2" fill="#fff"/>`;

const tulip = (c) => `
  <path d="M0 0 v-18" stroke="#3E8E2E" stroke-width="3" stroke-linecap="round"/>
  <path d="M0 -4 q-9 -2 -10 -12 q8 2 10 10z" fill="#5DAE3B"/>
  <path d="M-7 -26 l3 5 l3 -6 l3 6 l3 -5 v6 a6 6 0 0 1 -12 0z" fill="${c}" stroke="${O}" stroke-width="2" stroke-linejoin="round"/>`;

const umbrella = `
  <path d="M0 0 V-76" stroke="${O}" stroke-width="6" stroke-linecap="round"/><path d="M0 0 V-76" stroke="#fff" stroke-width="2.5"/>
  <path d="M-46 -70 Q0 -118 46 -70 Q34 -78 23 -70 Q11 -78 0 -70 Q-11 -78 -23 -70 Q-34 -78 -46 -70Z" fill="#FF6B8F" ${s(3.5)}/>
  <path d="M-23 -70 Q-16 -100 0 -106 Q-6 -90 0 -70 Q6 -90 0 -106 Q16 -100 23 -70" fill="#fff" ${s(2.5)}/>
  <circle cx="0" cy="-108" r="4" fill="#FFC83D" ${s(2)}/>`;

// [svg, viewBox x, y, w, h]
export const CRITTER_DEFS = {
  sheep: [sheep, -38, -58, 78, 62],
  cow: [cow, -58, -102, 124, 106],
  pig: [pig, -42, -64, 92, 66],
  hen: [hen, -26, -46, 56, 48],
  chick: [chick, -12, -24, 28, 26],
  duck: [duck('#FFFFFF', '#EDE4D6', '#FF9F3D'), -28, -36, 62, 40],
  duckling: [duck('#FFE066', '#FFD23F', '#FF9F3D', 0.62), -18, -24, 38, 26],
  frog: [frog, -24, -34, 48, 36],
  crab: [crab, -30, -40, 60, 42],
  songbirdBlue: [songbird('#7FD3F7', '#E6F7FF', '#2E9BD6'), -20, -28, 38, 30],
  songbirdPink: [songbird('#FF9CC0', '#FFE3EC', '#E84A7F'), -20, -28, 38, 30],
  barn: [barn, -92, -150, 184, 154],
  hay: [hay, -34, -38, 68, 40],
  hive: [hive, -30, -90, 60, 92],
  birdhouse: [birdhouse, -32, -128, 64, 130],
  reeds: [reeds, -30, -70, 62, 72],
  mushrooms: [mushrooms, -36, -38, 66, 40],
  tulipPink: [tulip('#FF7FA8'), -12, -34, 24, 36],
  tulipGold: [tulip('#FFC83D'), -12, -34, 24, 36],
  tulipPurple: [tulip('#C58BF2'), -12, -34, 24, 36],
  tulipRed: [tulip('#FF6B57'), -12, -34, 24, 36],
  umbrella: [umbrella, -50, -116, 100, 120],
};
