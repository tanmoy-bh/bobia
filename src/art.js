// Hand-drawn sprites as SVG, turned into images the canvas can paint.
// Each sprite is drawn around (0,0) = the point where it touches the ground.

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

function castleSVG(open) {
  const flag = (x, y) => `<path d="M${x} ${y} V${y - 34}" ${s(4)}/><path d="M${x} ${y - 34} L${x + 34} ${y - 25} L${x} ${y - 14} Z" fill="#FFC83D" ${s(3)}/>`;
  let cren = '';
  for (let x = -128; x < 128; x += 26) cren += `<rect x="${x}" y="-128" width="16" height="18" fill="#E9DCC6" ${s(4)}/>`;
  const gate = open
    ? `<path d="M-38 0 V-50 a38 38 0 0 1 76 0 V0 Z" fill="#2A1A0E" ${s()}/><path d="M-30 0 V-48 a30 30 0 0 1 60 0 V0 Z" fill="#FFE07A"/><path d="M-20 0 V-44 a20 20 0 0 1 40 0 V0 Z" fill="#FFF6C8"/>`
    : `<path d="M-38 0 V-50 a38 38 0 0 1 76 0 V0 Z" fill="#8A5A2B" ${s()}/><path d="M-19 -2 V-80 M0 -2 V-88 M19 -2 V-80 M-36 -34 H36" ${s(4)}/>`;
  return `
    <ellipse cx="0" cy="6" rx="200" ry="30" fill="#000" opacity=".15"/>
    ${cren}
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
    ${gate}`;
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
  castle: [castleSVG(false), -205, -340, 410, 380],
  castleOpen: [castleSVG(true), -205, -340, 410, 380],

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
    Object.entries(DEFS).map(async ([name, [svg, vx, vy, vw, vh]]) => {
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
