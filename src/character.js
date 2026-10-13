// Joy: a chibi girl with long dark hair swept from a side parting,
// warm smiling eyes and a big happy smile, a birthday tiara and a pink dress.
// Drawn in code so she can walk in four directions with a little bounce.

const INK = '#3B2414';
const SKIN = '#E3A882';
const SKIN_SHADE = '#C98B66';
const HAIR = '#2C1810';
const HAIR_HI = '#6B4030';
const DRESS = '#FF7EB0';
const DRESS_DARK = '#E2588F';
const SHOE = '#C2386A';
const GOLD = '#FFC83D';

function ellipse(ctx, x, y, rx, ry, fill, stroke = INK, lw = 2.6) {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fillStyle = fill;
  ctx.fill();
  if (stroke) {
    ctx.lineWidth = lw;
    ctx.strokeStyle = stroke;
    ctx.stroke();
  }
}

function fillStroke(ctx, fill, lw = 2.6, stroke = INK) {
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.lineWidth = lw;
  ctx.strokeStyle = stroke;
  ctx.stroke();
}

function line(ctx, color, lw) {
  ctx.strokeStyle = color;
  ctx.lineWidth = lw;
  ctx.stroke();
}

function tiara(ctx, x, y, k = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(k, k);
  ctx.beginPath();
  ctx.moveTo(-10, 0);
  ctx.lineTo(-10, -7);
  ctx.lineTo(-5, -3);
  ctx.lineTo(0, -11);
  ctx.lineTo(5, -3);
  ctx.lineTo(10, -7);
  ctx.lineTo(10, 0);
  ctx.closePath();
  fillStroke(ctx, GOLD, 2);
  ellipse(ctx, 0, -4, 2.2, 2.2, '#E84A7F', null);
  ctx.restore();
}

// wavy lower edge from (x1,y) to (x0,y), right to left
function wavyEdge(ctx, x1, x0, y, waves, amp) {
  const w = (x1 - x0) / waves;
  for (let i = 0; i < waves; i++) {
    const xa = x1 - w * i;
    ctx.quadraticCurveTo(xa - w / 2, y + (i % 2 ? -amp : amp), xa - w, y);
  }
}

// Long hair that falls behind the head and over the shoulders. `len` (0..1)
// shortens everything below the ears, from a toddler's bob to her long hair.
function backHair(ctx, dir, hy, len = 1) {
  const Y = (n) => hy + (n <= 6 ? n : 6 + (n - 6) * len);
  ctx.beginPath();
  if (dir === 'down') {
    ctx.moveTo(-25, hy - 4);
    ctx.arc(0, hy - 2, 26, Math.PI, Math.PI * 2);
    ctx.bezierCurveTo(32, Y(8), 28, Y(20), 34, Y(32));
    ctx.quadraticCurveTo(36, Y(40), 30, Y(44));
    wavyEdge(ctx, 30, 14, Y(42), 2, 4 * len);
    ctx.lineTo(13, Y(26));
    ctx.lineTo(-13, Y(26));
    ctx.lineTo(-14, Y(40));
    wavyEdge(ctx, -14, -29, Y(40), 2, 4 * len);
    ctx.quadraticCurveTo(-33, Y(34), -31, Y(28));
    ctx.bezierCurveTo(-27, Y(18), -30, Y(8), -25, hy - 4);
  } else {
    // side view, facing right: hair down her back
    ctx.moveTo(4, hy - 22);
    ctx.bezierCurveTo(-18, hy - 30, -30, hy - 12, -27, hy + 4);
    ctx.bezierCurveTo(-25, Y(18), -31, Y(28), -26, Y(40));
    wavyEdge(ctx, -8, -26, Y(40), 2, 4 * len);
    ctx.lineTo(-8, Y(40));
    ctx.lineTo(-2, Y(14));
    ctx.closePath();
  }
  fillStroke(ctx, HAIR);
  // a couple of soft wave highlights
  ctx.beginPath();
  if (dir === 'down') {
    ctx.moveTo(-27, Y(10));
    ctx.quadraticCurveTo(-24, Y(22), -28, Y(32));
    ctx.moveTo(27, Y(10));
    ctx.quadraticCurveTo(24, Y(22), 28, Y(32));
  } else {
    ctx.moveTo(-22, Y(6));
    ctx.quadraticCurveTo(-19, Y(20), -23, Y(32));
  }
  line(ctx, HAIR_HI, 2);
}

function cuteEye(ctx, x, y) {
  ellipse(ctx, x, y, 3.4, 3.9, '#2A1610', null);
  ellipse(ctx, x + 1.1, y - 1.4, 1.3, 1.3, '#FFFFFF', null);
  ellipse(ctx, x - 1, y + 1.6, 0.65, 0.65, '#FFFFFF', null);
  ctx.beginPath(); // soft upper lid, a little smiley
  ctx.moveTo(x - 4.2, y - 0.6);
  ctx.quadraticCurveTo(x, y - 5.4, x + 4.2, y - 1.2);
  line(ctx, '#1A0D09', 1.5);
}

function cuteSmile(ctx, x, y, w) {
  // a wide, happy smile with a row of teeth
  const h = w * 0.95;
  ctx.beginPath();
  ctx.moveTo(x - w, y);
  ctx.quadraticCurveTo(x, y + 1.2, x + w, y);
  ctx.quadraticCurveTo(x + w * 0.75, y + h, x, y + h);
  ctx.quadraticCurveTo(x - w * 0.75, y + h, x - w, y);
  ctx.closePath();
  ctx.fillStyle = '#8E2A3E';
  ctx.fill();
  ctx.save();
  ctx.clip();
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(x - w, y - 1, w * 2, h * 0.5);
  ctx.restore();
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = INK;
  ctx.stroke();
}

function blush(ctx, pts) {
  ctx.globalAlpha = 0.5;
  for (const [x, y] of pts) ellipse(ctx, x, y, 4.4, 2.6, '#FF7E9E', null);
  ctx.globalAlpha = 1;
}

function head(ctx, dir, hy, len = 1) {
  const Y = (n) => hy + (n <= 6 ? n : 6 + (n - 6) * len);
  if (dir === 'down') {
    ellipse(ctx, 0, hy + 1, 22.5, 21.5, SKIN); // round face

    // side parting, hair swept across the forehead and down both sides
    ctx.beginPath();
    ctx.moveTo(-25, hy + 4);
    ctx.arc(0, hy - 1, 25.5, Math.PI * 1.04, Math.PI * 1.97);
    ctx.quadraticCurveTo(25.5, hy + 12, 23.5, hy + 20);
    ctx.quadraticCurveTo(20.5, hy + 4, 16, hy - 4);
    ctx.quadraticCurveTo(8, hy - 9, -1, hy - 13);
    ctx.quadraticCurveTo(-5, hy - 15, -7, hy - 19);
    ctx.quadraticCurveTo(-13, hy - 15, -17, hy - 6);
    ctx.quadraticCurveTo(-20.5, hy + 4, -22.5, hy + 17);
    ctx.quadraticCurveTo(-24.5, hy + 11, -25, hy + 4);
    fillStroke(ctx, HAIR);
    // shine following the sweep
    ctx.beginPath();
    ctx.moveTo(-3, hy - 19);
    ctx.quadraticCurveTo(8, hy - 15, 16, hy - 9);
    ctx.moveTo(-14, hy - 17);
    ctx.quadraticCurveTo(-19, hy - 11, -21, hy - 3);
    line(ctx, HAIR_HI, 2.2);

    cuteEye(ctx, -8.5, hy + 2.5);
    cuteEye(ctx, 8.5, hy + 2.5);
    blush(ctx, [[-14.5, hy + 10], [14.5, hy + 10]]);
    cuteSmile(ctx, 0, hy + 10.5, 5.6);
    tiara(ctx, 0, hy - 24, 0.9);
  } else if (dir === 'up') {
    ellipse(ctx, 0, hy + 1, 22.5, 21.5, SKIN);
    ctx.beginPath();
    ctx.moveTo(-25, hy + 2);
    ctx.arc(0, hy - 1, 25, Math.PI * 1.0, Math.PI * 2.0);
    ctx.bezierCurveTo(30, Y(10), 26, Y(20), 30, Y(32));
    ctx.quadraticCurveTo(31, Y(38), 26, Y(40));
    wavyEdge(ctx, 26, -26, Y(40), 4, 4 * len);
    ctx.quadraticCurveTo(-31, Y(38), -30, Y(32));
    ctx.bezierCurveTo(-26, Y(20), -30, Y(10), -25, hy + 2);
    fillStroke(ctx, HAIR);
    ctx.beginPath();
    ctx.moveTo(-10, hy - 12);
    ctx.quadraticCurveTo(-16, Y(8), -12, Y(30));
    ctx.moveTo(8, hy - 10);
    ctx.quadraticCurveTo(14, Y(10), 10, Y(32));
    line(ctx, HAIR_HI, 2.2);
    tiara(ctx, 0, hy - 24, 0.9);
  } else {
    // side view, facing right
    ellipse(ctx, 2, hy + 1, 22, 21.5, SKIN);
    ctx.beginPath();
    ctx.moveTo(-21, hy + 14);
    ctx.bezierCurveTo(-28, hy - 2, -22, hy - 26, 2, hy - 24);
    ctx.quadraticCurveTo(20, hy - 22, 24, hy - 7);
    ctx.quadraticCurveTo(14, hy - 9, 4, hy - 4);
    ctx.quadraticCurveTo(-2, hy + 2, -4, hy + 16);
    ctx.closePath();
    fillStroke(ctx, HAIR);
    ctx.beginPath();
    ctx.arc(-4, hy - 10, 10, Math.PI * 1.1, Math.PI * 1.5);
    line(ctx, HAIR_HI, 2.2);
    cuteEye(ctx, 13, hy + 3);
    blush(ctx, [[12, hy + 10]]);
    cuteSmile(ctx, 16.5, hy + 11, 4);
    tiara(ctx, 2, hy - 24, 0.85);
  }
}

/**
 * dir: 'down' | 'up' | 'left' | 'right'
 * phase: walk cycle (radians), moving: boolean, t: seconds (idle breathing)
 * age: 0 = toddler .. 1 = grown up (bigger head, shorter body and hair when young)
 * crawl: draw her as a crawling baby instead
 */
export function drawGirl(ctx, x, y, dir, phase, moving, t, age = 1, crawl = false, shadow = true, family = {}) {
  if (crawl) return drawBaby(ctx, x, y, dir, phase, moving, t, shadow);
  const B = 0.55 + 0.45 * age; // body
  const H = 0.78 + 0.22 * age; // head
  const L = 0.25 + 0.75 * age; // hair length

  ctx.save();
  ctx.translate(x, y);
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  // shadow (left off mid-jump; the game draws it on the ground instead)
  if (shadow) {
    ctx.beginPath();
    ctx.ellipse(0, 0, 22 * B, 7 * B, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0,0,0,.2)';
    ctx.fill();
  }

  const bob = (moving ? -Math.abs(Math.sin(phase)) * 4 : Math.sin(t * 2.2) * 0.8) * B;
  const step = moving ? Math.sin(phase) : 0;
  const side = dir === 'left' || dir === 'right';
  if (dir === 'left') ctx.scale(-1, 1);
  const body = (fn) => {
    ctx.save();
    ctx.scale(B, B);
    fn();
    ctx.restore();
  };

  // legs + shoes
  body(() => {
    const legs = side ? [[-3, step * 6], [4, -step * 6]] : [[-7, step * 3], [7, -step * 3]];
    for (const [lx, off] of legs) {
      const lift = side ? 0 : Math.max(0, off);
      ctx.fillStyle = SKIN;
      ctx.strokeStyle = INK;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.roundRect(lx - 4 + (side ? off : 0), -20 + bob / B - lift, 8, 17, 4);
      ctx.fill();
      ctx.stroke();
      ellipse(ctx, lx + (side ? off + 2 : 0), -3 - lift + (bob / B) * 0.3, side ? 7 : 6, 4, SHOE);
    }
  });

  ctx.translate(0, bob);
  const hy = -64; // head centre

  body(() => {
    // back arm (side view)
    if (side) ellipse(ctx, -4 - step * 5, -36, 5, 6, SKIN_SHADE);

    // dress
    ctx.beginPath();
    ctx.moveTo(-11, -46);
    ctx.quadraticCurveTo(-24, -24, -21, -15);
    ctx.quadraticCurveTo(0, -10, 21, -15);
    ctx.quadraticCurveTo(24, -24, 11, -46);
    ctx.closePath();
    fillStroke(ctx, DRESS);
    // hem frill + polka dots
    ctx.beginPath();
    ctx.moveTo(-20, -17);
    ctx.quadraticCurveTo(0, -12, 20, -17);
    line(ctx, '#FFFFFF', 3);
    ctx.fillStyle = '#FFD1E2';
    for (const [dx, dy] of [[-9, -26], [7, -30], [-2, -21], [12, -22]]) {
      ctx.beginPath();
      ctx.arc(dx, dy, 1.8, 0, Math.PI * 2);
      ctx.fill();
    }
    if (dir !== 'up') {
      ellipse(ctx, side ? 4 : -5, -42, 4, 3, DRESS_DARK, INK, 1.8);
      ellipse(ctx, side ? 10 : 5, -42, 4, 3, DRESS_DARK, INK, 1.8);
    }
    // a baby on the way
    if (family.belly && dir !== 'up') {
      if (side) ellipse(ctx, 12, -28, 10, 11, DRESS);
      else ellipse(ctx, 0, -27, 13, 10.5, DRESS);
      ctx.beginPath();
      ctx.arc(side ? 15 : 4, side ? -32 : -30, 5, Math.PI * 1.15, Math.PI * 1.6);
      line(ctx, 'rgba(255,255,255,.75)', 2.2);
    }
  });

  // the head (and hair) sit on the neck; a young Joy has a bigger head for her size
  const onHead = (fn) => {
    ctx.save();
    ctx.translate(0, -46 * B);
    ctx.scale(H, H);
    ctx.translate(0, 46);
    fn();
    ctx.restore();
  };

  // long hair falls over the shoulders, in front of the dress
  if (dir === 'down' || side) onHead(() => backHair(ctx, side ? 'side' : 'down', hy, L));

  // arms
  body(() => {
    if (side) ellipse(ctx, 6 + step * 5, -34, 5, 6, SKIN);
    else {
      ellipse(ctx, -17, -34 + step * 3, 5, 6, SKIN);
      ellipse(ctx, 17, -34 - step * 3, 5, 6, SKIN);
    }
  });

  onHead(() => head(ctx, dir, hy, L));
  if (family.baby) body(() => carrier(ctx, dir, side));
  ctx.restore();
}

// Their daughter in a carrier on her mum's front (straps across her back from behind)
function carrier(ctx, dir, side) {
  const STRAP = '#8E5BD8';
  if (dir === 'up') {
    ctx.beginPath();
    ctx.moveTo(-11, -46);
    ctx.lineTo(9, -24);
    ctx.moveTo(11, -46);
    ctx.lineTo(-9, -24);
    line(ctx, INK, 6);
    ctx.beginPath();
    ctx.moveTo(-11, -46);
    ctx.lineTo(9, -24);
    ctx.moveTo(11, -46);
    ctx.lineTo(-9, -24);
    line(ctx, STRAP, 3.2);
    return;
  }
  const cx = side ? 14 : 0;
  // straps over her shoulders
  ctx.beginPath();
  if (side) {
    ctx.moveTo(4, -46);
    ctx.lineTo(cx - 2, -36);
  } else {
    ctx.moveTo(-10, -46);
    ctx.lineTo(-8, -36);
    ctx.moveTo(10, -46);
    ctx.lineTo(8, -36);
  }
  line(ctx, INK, 6);
  line(ctx, STRAP, 3.2);
  // baby's head peeking out over the pouch
  const by = -38;
  ellipse(ctx, cx + (side ? 3 : 0), by, 8.5, 8, SKIN);
  ctx.save();
  ctx.translate(cx + (side ? 3 : 0), by);
  ctx.scale(0.62, 0.62);
  if (side) {
    ellipse(ctx, 6, 0, 2.6, 3, '#2A1610', null);
    ellipse(ctx, 6.9, -1.1, 1, 1, '#FFFFFF', null);
    blush(ctx, [[5, 6]]);
  } else babyFace(ctx, 0, 0);
  babyHair(ctx, -2, -12);
  ctx.restore();
  // the pouch
  ctx.beginPath();
  ctx.moveTo(cx - 12, -33);
  ctx.quadraticCurveTo(cx - 13, -18, cx, -16);
  ctx.quadraticCurveTo(cx + 13, -18, cx + 12, -33);
  ctx.quadraticCurveTo(cx, -29, cx - 12, -33);
  fillStroke(ctx, '#C58BF2', 2.4);
  ellipse(ctx, cx, -24, 3, 3, '#FFE07A', INK, 1.4);
}

// ── Tan: short dark hair, a full beard and a black T-shirt ──────────────

const T_SKIN = '#D9A27A';
const T_SHADE = '#B9805A';
const T_HAIR = '#22150E';
const T_HAIR_HI = '#5C3D2C';
const TEE = '#2A2A2A';
const JEANS = '#3E5277';

// his eyes: dark and warm, with a simple upper lid (no lashes)
function tanEye(ctx, x, y) {
  ellipse(ctx, x, y, 2.4, 2.9, '#2A1610', null);
  ellipse(ctx, x + 0.8, y - 1.1, 0.9, 0.9, '#FFFFFF', null);
  ctx.beginPath();
  ctx.moveTo(x - 3.4, y - 1.6);
  ctx.quadraticCurveTo(x, y - 4.4, x + 3.4, y - 1.8);
  line(ctx, '#1A0D09', 1.4);
}

// thick, fairly straight eyebrows
function tanBrow(ctx, x, y, flip) {
  ctx.save();
  ctx.translate(x, y);
  if (flip) ctx.scale(-1, 1);
  ctx.beginPath();
  ctx.moveTo(-4.5, 0.8);
  ctx.quadraticCurveTo(0, -2.2, 5, -0.6);
  ctx.lineTo(4.6, 1.6);
  ctx.quadraticCurveTo(0, 0, -4.5, 2.6);
  ctx.closePath();
  ctx.fillStyle = T_HAIR;
  ctx.fill();
  ctx.restore();
}

// his face from the front: cheekbones tapering to a slim, V-shaped jaw
function tanFace(ctx, hy) {
  ctx.beginPath();
  ctx.moveTo(0, hy - 25);
  ctx.quadraticCurveTo(18, hy - 25, 18, hy - 6);
  ctx.quadraticCurveTo(18, hy + 12, 10.5, hy + 16);
  ctx.quadraticCurveTo(5.5, hy + 28, 0, hy + 28);
  ctx.quadraticCurveTo(-5.5, hy + 28, -10.5, hy + 16);
  ctx.quadraticCurveTo(-18, hy + 12, -18, hy - 6);
  ctx.quadraticCurveTo(-18, hy - 25, 0, hy - 25);
  ctx.closePath();
}

// a dark full beard: the lower face, leaving the cheeks and mouth clear
function tanBeard(ctx, outline, cutout, shine) {
  ctx.save();
  outline();
  ctx.clip();
  cutout();
  ctx.fillStyle = T_HAIR;
  ctx.fill('evenodd');
  shine();
  ctx.restore();
}

function tanHead(ctx, dir, hy) {
  ctx.lineJoin = 'round';
  if (dir === 'down') {
    ellipse(ctx, -17.5, hy + 1, 3, 4.6, T_SKIN, INK, 2);
    ellipse(ctx, 17.5, hy + 1, 3, 4.6, T_SKIN, INK, 2);
    tanFace(ctx, hy);
    fillStroke(ctx, T_SKIN);
    tanBeard(
      ctx,
      () => tanFace(ctx, hy),
      () => {
        ctx.beginPath();
        ctx.rect(-30, hy - 1, 60, 40);
        ctx.moveTo(-14, hy - 1);
        ctx.quadraticCurveTo(-14, hy + 8, -8, hy + 10);
        ctx.quadraticCurveTo(0, hy + 11.5, 8, hy + 10);
        ctx.quadraticCurveTo(14, hy + 8, 14, hy - 1);
        ctx.closePath();
      },
      () => {
        ctx.beginPath();
        ctx.moveTo(-8, hy + 21);
        ctx.quadraticCurveTo(-4, hy + 24.5, 0, hy + 25);
        ctx.quadraticCurveTo(4, hy + 24.5, 8, hy + 21);
        line(ctx, T_HAIR_HI, 1.4);
      },
    );
    tanFace(ctx, hy);
    line(ctx, INK, 2.4);
    // moustache joined into the beard
    ctx.beginPath();
    ctx.moveTo(-8, hy + 10.5);
    ctx.quadraticCurveTo(-3, hy + 7.4, 0, hy + 8.4);
    ctx.quadraticCurveTo(3, hy + 7.4, 8, hy + 10.5);
    ctx.quadraticCurveTo(0, hy + 9.6, -8, hy + 10.5);
    ctx.fillStyle = T_HAIR;
    ctx.fill();
    // short hair with a little lift at the front
    ctx.beginPath();
    ctx.moveTo(-18, hy - 3);
    ctx.quadraticCurveTo(-20, hy - 24, -6, hy - 29);
    ctx.quadraticCurveTo(6, hy - 35, 16, hy - 28);
    ctx.quadraticCurveTo(20, hy - 20, 18, hy - 3);
    ctx.quadraticCurveTo(16, hy - 13, 9, hy - 15);
    ctx.quadraticCurveTo(2, hy - 18, -6, hy - 15);
    ctx.quadraticCurveTo(-16, hy - 13, -18, hy - 3);
    fillStroke(ctx, T_HAIR, 2);
    ctx.beginPath();
    ctx.moveTo(-8, hy - 23);
    ctx.quadraticCurveTo(0, hy - 28, 9, hy - 26);
    line(ctx, T_HAIR_HI, 1.6);
    // brows, eyes, nose, smile
    tanBrow(ctx, -7.5, hy - 6, false);
    tanBrow(ctx, 7.5, hy - 6, true);
    tanEye(ctx, -7.5, hy + 0.5);
    tanEye(ctx, 7.5, hy + 0.5);
    ctx.beginPath();
    ctx.moveTo(0.5, hy + 1);
    ctx.quadraticCurveTo(2.8, hy + 5, -1, hy + 6);
    line(ctx, T_SHADE, 1.6);
    ctx.beginPath();
    ctx.moveTo(-5.5, hy + 12.5);
    ctx.quadraticCurveTo(0, hy + 18, 5.5, hy + 12.5);
    ctx.quadraticCurveTo(0, hy + 14.5, -5.5, hy + 12.5);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.lineWidth = 1.4;
    ctx.strokeStyle = '#8E2A3E';
    ctx.stroke();
  } else if (dir === 'up') {
    ellipse(ctx, -17.5, hy + 1, 3, 4.6, T_SKIN, INK, 2);
    ellipse(ctx, 17.5, hy + 1, 3, 4.6, T_SKIN, INK, 2);
    tanFace(ctx, hy);
    fillStroke(ctx, T_SKIN);
    ctx.beginPath();
    ctx.moveTo(-17, hy + 12);
    ctx.quadraticCurveTo(-21, hy - 22, -6, hy - 29);
    ctx.quadraticCurveTo(6, hy - 34, 16, hy - 27);
    ctx.quadraticCurveTo(21, hy - 18, 17, hy + 12);
    ctx.quadraticCurveTo(0, hy + 22, -17, hy + 12);
    fillStroke(ctx, T_HAIR, 2);
    ctx.beginPath();
    ctx.moveTo(-8, hy - 21);
    ctx.quadraticCurveTo(0, hy - 25, 8, hy - 22);
    line(ctx, T_HAIR_HI, 1.6);
  } else {
    // side view, facing right: the jaw angles down to a slim chin
    const profile = () => {
      ctx.beginPath();
      ctx.moveTo(-16, hy - 6);
      ctx.quadraticCurveTo(-17, hy - 26, 2, hy - 26);
      ctx.quadraticCurveTo(18, hy - 25, 19, hy - 8);
      ctx.quadraticCurveTo(22.5, hy - 1, 22.5, hy + 3);
      ctx.quadraticCurveTo(21, hy + 6, 20, hy + 9);
      ctx.quadraticCurveTo(20, hy + 20, 15, hy + 28);
      ctx.quadraticCurveTo(9, hy + 29, 4, hy + 22);
      ctx.quadraticCurveTo(-4, hy + 16, -8, hy + 12);
      ctx.quadraticCurveTo(-15, hy + 6, -16, hy - 6);
      ctx.closePath();
    };
    profile();
    fillStroke(ctx, T_SKIN);
    tanBeard(
      ctx,
      profile,
      () => {
        ctx.beginPath();
        ctx.moveTo(-7, hy + 2);
        ctx.quadraticCurveTo(4, hy + 10, 13, hy + 10);
        ctx.lineTo(26, hy + 10);
        ctx.lineTo(26, hy + 34);
        ctx.lineTo(-12, hy + 34);
        ctx.closePath();
      },
      () => {
        ctx.beginPath();
        ctx.moveTo(4, hy + 20);
        ctx.quadraticCurveTo(9, hy + 25, 14, hy + 25);
        line(ctx, T_HAIR_HI, 1.4);
      },
    );
    profile();
    line(ctx, INK, 2.4);
    ctx.beginPath();
    ctx.moveTo(-15, hy + 1);
    ctx.bezierCurveTo(-19, hy - 16, -10, hy - 30, 4, hy - 29);
    ctx.quadraticCurveTo(15, hy - 32, 21, hy - 20);
    ctx.quadraticCurveTo(14, hy - 18, 9, hy - 16);
    ctx.quadraticCurveTo(0, hy - 13, -4, hy - 2);
    ctx.closePath();
    fillStroke(ctx, T_HAIR, 2);
    ctx.beginPath();
    ctx.moveTo(-6, hy - 22);
    ctx.quadraticCurveTo(3, hy - 27, 12, hy - 25);
    line(ctx, T_HAIR_HI, 1.6);
    ellipse(ctx, -5, hy + 3, 3, 4.6, T_SKIN, INK, 2);
    ctx.beginPath();
    ctx.moveTo(13, hy + 11);
    ctx.quadraticCurveTo(18, hy + 8.6, 21.5, hy + 10.5);
    ctx.quadraticCurveTo(18, hy + 10.4, 13, hy + 11);
    ctx.fillStyle = T_HAIR;
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(14, hy + 13.5);
    ctx.quadraticCurveTo(17, hy + 16.5, 20, hy + 13.5);
    ctx.quadraticCurveTo(17, hy + 14.8, 14, hy + 13.5);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.lineWidth = 1.3;
    ctx.strokeStyle = '#8E2A3E';
    ctx.stroke();
    tanBrow(ctx, 13, hy - 6, false);
    tanEye(ctx, 13, hy + 0.5);
    ctx.beginPath();
    ctx.moveTo(20.5, hy + 0);
    ctx.quadraticCurveTo(24.5, hy + 4, 20.5, hy + 6);
    line(ctx, T_SHADE, 1.6);
  }
}

export function drawTan(ctx, x, y, dir, phase, moving, t, shadow = true) {
  ctx.save();
  ctx.translate(x, y);
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  if (shadow) {
    ctx.beginPath();
    ctx.ellipse(0, 0, 23, 7, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0,0,0,.2)';
    ctx.fill();
  }
  const bob = moving ? -Math.abs(Math.sin(phase)) * 4 : Math.sin(t * 2) * 0.8;
  const step = moving ? Math.sin(phase) : 0;
  const side = dir === 'left' || dir === 'right';
  if (dir === 'left') ctx.scale(-1, 1);

  // legs in jeans, dark shoes
  const legs = side ? [[-3, step * 6], [4, -step * 6]] : [[-7, step * 3], [7, -step * 3]];
  for (const [lx, off] of legs) {
    const lift = side ? 0 : Math.max(0, off);
    ctx.fillStyle = JEANS;
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.roundRect(lx - 4.5 + (side ? off : 0), -25 + bob - lift, 9, 22, 4);
    ctx.fill();
    ctx.stroke();
    ellipse(ctx, lx + (side ? off + 2 : 0), -3 - lift + bob * 0.3, side ? 7.5 : 6.5, 4, '#2B1D14');
  }
  ctx.translate(0, bob);

  // back arm in side view
  if (side) {
    ellipse(ctx, -4 - step * 5, -38, 5.5, 7, T_SHADE);
    ellipse(ctx, -4 - step * 5, -45, 5.5, 4.5, TEE);
  }
  // black T-shirt
  ellipse(ctx, 0, -54, 6, 4, T_SKIN);
  ctx.beginPath();
  if (side) {
    ctx.moveTo(-11, -52);
    ctx.quadraticCurveTo(-14, -36, -11, -21);
    ctx.lineTo(12, -21);
    ctx.quadraticCurveTo(15, -36, 12, -52);
    ctx.quadraticCurveTo(0, -56, -11, -52);
  } else {
    ctx.moveTo(-16, -51);
    ctx.quadraticCurveTo(-18, -36, -14, -21);
    ctx.lineTo(14, -21);
    ctx.quadraticCurveTo(18, -36, 16, -51);
    ctx.quadraticCurveTo(0, -56, -16, -51);
  }
  fillStroke(ctx, TEE);
  ctx.beginPath();
  ctx.moveTo(-5, -54);
  ctx.quadraticCurveTo(0, -50, 5, -54);
  line(ctx, '#444', 2);

  // arms with short sleeves
  if (side) {
    ellipse(ctx, 6 + step * 5, -38, 5.5, 7, T_SKIN);
    ellipse(ctx, 6 + step * 5, -45.5, 5.5, 4.5, TEE);
  } else {
    for (const sx of [-1, 1]) {
      ellipse(ctx, sx * 18.5, -37 + sx * step * 3, 5.5, 7, T_SKIN);
      ellipse(ctx, sx * 16.5, -46, 5.5, 4.5, TEE);
    }
  }

  tanHead(ctx, dir, -76);
  ctx.restore();
}

// ── Baby Joy, crawling on all fours ─────────────────────────────────────

function babyFace(ctx, x, y) {
  for (const dx of [-5, 5]) {
    ellipse(ctx, x + dx, y, 2.6, 3, '#2A1610', null);
    ellipse(ctx, x + dx + 0.9, y - 1.1, 1, 1, '#FFFFFF', null);
  }
  blush(ctx, [[x - 9, y + 5], [x + 9, y + 5]]);
  ctx.beginPath();
  ctx.arc(x, y + 5, 3, 0.15 * Math.PI, 0.85 * Math.PI);
  line(ctx, INK, 1.6);
}

function babyHair(ctx, x, y) {
  // one little curl on top and a pink bow
  ctx.beginPath();
  ctx.moveTo(x - 2, y);
  ctx.bezierCurveTo(x - 8, y - 9, x + 5, y - 13, x + 4, y - 5);
  ctx.quadraticCurveTo(x + 3, y - 2, x, y - 4);
  line(ctx, HAIR, 3);
  ctx.beginPath();
  ctx.moveTo(x + 7, y + 1);
  ctx.lineTo(x + 1, y - 3);
  ctx.lineTo(x + 2, y + 5);
  ctx.closePath();
  ctx.moveTo(x + 7, y + 1);
  ctx.lineTo(x + 13, y - 3);
  ctx.lineTo(x + 12, y + 5);
  ctx.closePath();
  fillStroke(ctx, DRESS, 1.6);
  ellipse(ctx, x + 7, y + 1, 2, 2, DRESS_DARK, INK, 1.4);
}

function drawBaby(ctx, x, y, dir, phase, moving, t, shadow = true) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(1.25, 1.25); // a touch bigger than life, so she's easy to spot on a phone
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  if (shadow) {
    ctx.beginPath();
    ctx.ellipse(0, 0, 20, 6, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0,0,0,.2)';
    ctx.fill();
  }

  const c = moving ? Math.sin(phase * 0.7) : 0; // crawl cycle
  const bob = moving ? -Math.abs(Math.sin(phase * 0.7)) * 2 : Math.sin(t * 2.2) * 0.6;
  const side = dir === 'left' || dir === 'right';
  if (dir === 'left') ctx.scale(-1, 1);

  if (side) {
    // far knee and hand
    ellipse(ctx, -12 - c * 3, -5, 7, 5, SKIN_SHADE);
    ellipse(ctx, 9 + c * 3, -5, 4, 6, SKIN_SHADE);
    // onesie + diaper bum up in the air
    ellipse(ctx, -2, -14 + bob, 15, 10, DRESS);
    ellipse(ctx, -14, -16 + bob, 8, 7.5, '#FFFFFF');
    // near knee (with a little foot) and hand
    ellipse(ctx, -10 + c * 3, -4, 7, 5, SKIN);
    ellipse(ctx, -17 + c * 3, -7, 3, 2.4, SKIN);
    ellipse(ctx, 11 - c * 3, -5, 4.5, 7, SKIN);
    // big baby head
    ellipse(ctx, 16, -23 + bob, 13, 12.5, SKIN);
    ellipse(ctx, 9, -22 + bob, 3, 3.5, SKIN_SHADE, INK, 1.6);
    ellipse(ctx, 21, -24 + bob, 2.4, 2.8, '#2A1610', null);
    ellipse(ctx, 21.9, -25 + bob, 0.9, 0.9, '#FFFFFF', null);
    blush(ctx, [[20, -18 + bob]]);
    ctx.beginPath();
    ctx.arc(24, -18 + bob, 2.4, 0.1 * Math.PI, 0.8 * Math.PI);
    line(ctx, INK, 1.5);
    babyHair(ctx, 14, -35 + bob);
  } else if (dir === 'up') {
    // crawling away: we see her bum and the soles of her feet
    ellipse(ctx, 0, -24 + bob, 12.5, 12, SKIN);
    ctx.beginPath();
    ctx.arc(0, -26 + bob, 11, Math.PI * 1.1, Math.PI * 1.9);
    line(ctx, HAIR, 3);
    babyHair(ctx, -2, -36 + bob);
    ellipse(ctx, 0, -15 + bob, 15, 10, DRESS);
    ellipse(ctx, -13, -8 - Math.max(0, c) * 3, 4, 5, SKIN);
    ellipse(ctx, 13, -8 - Math.max(0, -c) * 3, 4, 5, SKIN);
    ellipse(ctx, 0, -9 + bob, 9, 6.5, '#FFFFFF');
    ellipse(ctx, -6 + c * 1.5, -2, 4, 3, SKIN);
    ellipse(ctx, 6 - c * 1.5, -2, 4, 3, SKIN);
  } else {
    // crawling towards us: big head between two little hands, her onesie
    // and bum peeking out behind
    ellipse(ctx, 0, -27 + bob, 10, 7, '#FFFFFF');
    ellipse(ctx, 0, -12 + bob, 18, 8.5, DRESS);
    ellipse(ctx, -12, -4 - Math.max(0, c) * 3, 4.5, 3.6, SKIN);
    ellipse(ctx, 12, -4 - Math.max(0, -c) * 3, 4.5, 3.6, SKIN);
    ellipse(ctx, 0, -19 + bob, 14, 13.5, SKIN);
    babyFace(ctx, 0, -19 + bob);
    babyHair(ctx, -2, -32 + bob);
  }
  ctx.restore();
}
