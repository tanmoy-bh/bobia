// Joy: a chibi version of her — long wavy dark hair with a middle parting
// and sindoor, a little red bindi, a nose stud, warm skin and a big smile —
// plus a birthday tiara and a pink dress.
// Drawn in code so she can walk in four directions with a little bounce.

const INK = '#3B2414';
const SKIN = '#DDA27C';
const SKIN_SHADE = '#C4835E';
const HAIR = '#24130E';
const HAIR_HI = '#5A3326';
const SINDOOR = '#D7263D';
const LIPS = '#B5485A';
const MOUTH = '#6E1F2C';
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

// Long hair that falls behind the head and over the shoulders.
function backHair(ctx, dir, hy) {
  ctx.beginPath();
  if (dir === 'down') {
    ctx.moveTo(-25, hy - 4);
    ctx.arc(0, hy - 2, 26, Math.PI, Math.PI * 2);
    ctx.bezierCurveTo(30, hy + 8, 26, hy + 18, 31, hy + 30);
    ctx.quadraticCurveTo(33, hy + 36, 28, hy + 40);
    wavyEdge(ctx, 28, 14, hy + 40, 2, 4);
    ctx.lineTo(13, hy + 26);
    ctx.lineTo(-13, hy + 26);
    ctx.lineTo(-14, hy + 40);
    wavyEdge(ctx, -14, -29, hy + 40, 2, 4);
    ctx.quadraticCurveTo(-33, hy + 34, -31, hy + 28);
    ctx.bezierCurveTo(-27, hy + 18, -30, hy + 8, -25, hy - 4);
  } else {
    // side view, facing right: hair down her back
    ctx.moveTo(4, hy - 22);
    ctx.bezierCurveTo(-18, hy - 30, -30, hy - 12, -27, hy + 4);
    ctx.bezierCurveTo(-25, hy + 18, -31, hy + 28, -26, hy + 40);
    wavyEdge(ctx, -8, -26, hy + 40, 2, 4);
    ctx.lineTo(-8, hy + 40);
    ctx.lineTo(-2, hy + 14);
    ctx.closePath();
  }
  fillStroke(ctx, HAIR);
  // a couple of soft wave highlights
  ctx.beginPath();
  if (dir === 'down') {
    ctx.moveTo(-27, hy + 10);
    ctx.quadraticCurveTo(-24, hy + 22, -28, hy + 32);
    ctx.moveTo(27, hy + 10);
    ctx.quadraticCurveTo(24, hy + 22, 28, hy + 32);
  } else {
    ctx.moveTo(-22, hy + 6);
    ctx.quadraticCurveTo(-19, hy + 20, -23, hy + 32);
  }
  line(ctx, HAIR_HI, 2);
}

function smile(ctx, x, y, w, h) {
  // open, happy smile showing teeth
  ctx.beginPath();
  ctx.moveTo(x - w, y);
  ctx.quadraticCurveTo(x, y + 1.5, x + w, y);
  ctx.quadraticCurveTo(x + w * 0.7, y + h, x, y + h);
  ctx.quadraticCurveTo(x - w * 0.7, y + h, x - w, y);
  ctx.closePath();
  ctx.fillStyle = MOUTH;
  ctx.fill();
  ctx.save();
  ctx.clip();
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(x - w, y - 1, w * 2, h * 0.55);
  ctx.restore();
  ctx.lineWidth = 1.6;
  ctx.strokeStyle = LIPS;
  ctx.stroke();
}

function head(ctx, dir, hy) {
  if (dir === 'down') {
    ellipse(ctx, 0, hy + 1, 23, 22, SKIN); // round, full-cheeked face

    // hair on top with a middle parting, framing the face
    ctx.beginPath();
    ctx.moveTo(-25.5, hy + 2);
    ctx.arc(0, hy - 1, 25.5, Math.PI * 1.03, Math.PI * 1.97);
    ctx.quadraticCurveTo(25, hy + 12, 22, hy + 20);
    ctx.quadraticCurveTo(19, hy + 6, 15, hy - 4);
    ctx.quadraticCurveTo(9, hy - 15, 1, hy - 18);
    ctx.lineTo(-1, hy - 18);
    ctx.quadraticCurveTo(-9, hy - 15, -15, hy - 4);
    ctx.quadraticCurveTo(-19, hy + 6, -22, hy + 20);
    ctx.quadraticCurveTo(-25, hy + 12, -25.5, hy + 2);
    fillStroke(ctx, HAIR);
    ctx.beginPath();
    ctx.moveTo(-6, hy - 21);
    ctx.quadraticCurveTo(-15, hy - 16, -19, hy - 4);
    ctx.moveTo(9, hy - 20);
    ctx.quadraticCurveTo(16, hy - 13, 19, hy - 2);
    line(ctx, HAIR_HI, 2);
    // sindoor in the parting
    ctx.beginPath();
    ctx.moveTo(0, hy - 18);
    ctx.lineTo(0, hy - 24);
    line(ctx, SINDOOR, 2.4);

    // brows, smiling eyes
    ctx.beginPath();
    ctx.moveTo(-12, hy - 5);
    ctx.quadraticCurveTo(-8, hy - 8, -4, hy - 6);
    ctx.moveTo(12, hy - 5);
    ctx.quadraticCurveTo(8, hy - 8, 4, hy - 6);
    line(ctx, HAIR, 1.8);
    for (const ex of [-8, 8]) {
      ellipse(ctx, ex, hy + 1.2, 3.2, 2.8, '#2A1610', null);
      ellipse(ctx, ex + 1, hy + 0.3, 1.05, 1.05, '#FFFFFF', null);
      ctx.beginPath(); // upper lash line
      ctx.moveTo(ex - 4.2, hy + 0.6);
      ctx.quadraticCurveTo(ex, hy - 3.4, ex + 4.2, hy + 0.2);
      line(ctx, '#1A0D09', 1.6);
    }
    ellipse(ctx, 0, hy - 4.5, 1.6, 1.6, SINDOOR, null); // bindi

    // nose + stud
    ctx.beginPath();
    ctx.moveTo(-1.5, hy + 7);
    ctx.quadraticCurveTo(0, hy + 8.4, 1.5, hy + 7);
    line(ctx, SKIN_SHADE, 1.4);
    ellipse(ctx, -2.8, hy + 6.6, 0.95, 0.95, '#FFF6D8', '#9A8A6A', 0.6);

    // blush + big smile
    ctx.globalAlpha = 0.45;
    ellipse(ctx, -15, hy + 9, 4.4, 2.6, '#FF6F8E', null);
    ellipse(ctx, 15, hy + 9, 4.4, 2.6, '#FF6F8E', null);
    ctx.globalAlpha = 1;
    smile(ctx, 0, hy + 11.5, 6.8, 4.6);

    tiara(ctx, 0, hy - 24, 0.9);
  } else if (dir === 'up') {
    ellipse(ctx, 0, hy + 1, 23, 22, SKIN);
    ctx.beginPath();
    ctx.moveTo(-25.5, hy + 2);
    ctx.arc(0, hy - 1, 25.5, Math.PI * 1.0, Math.PI * 2.0);
    ctx.bezierCurveTo(30, hy + 10, 26, hy + 20, 30, hy + 32);
    ctx.quadraticCurveTo(31, hy + 38, 26, hy + 40);
    wavyEdge(ctx, 26, -26, hy + 40, 4, 4);
    ctx.quadraticCurveTo(-31, hy + 38, -30, hy + 32);
    ctx.bezierCurveTo(-26, hy + 20, -30, hy + 10, -25.5, hy + 2);
    fillStroke(ctx, HAIR);
    ctx.beginPath();
    ctx.moveTo(-10, hy - 12);
    ctx.quadraticCurveTo(-16, hy + 8, -12, hy + 30);
    ctx.moveTo(8, hy - 10);
    ctx.quadraticCurveTo(14, hy + 10, 10, hy + 32);
    ctx.moveTo(0, hy - 24);
    ctx.lineTo(0, hy - 14);
    line(ctx, HAIR_HI, 2);
    tiara(ctx, 0, hy - 24, 0.9);
  } else {
    // side view, facing right
    ellipse(ctx, 2, hy + 1, 22, 21.5, SKIN);
    // little nose
    ctx.beginPath();
    ctx.moveTo(22.5, hy - 1);
    ctx.quadraticCurveTo(27, hy + 5, 22.5, hy + 7);
    fillStroke(ctx, SKIN, 1.8);
    ellipse(ctx, 21, hy + 4.2, 0.95, 0.95, '#FFF6D8', '#9A8A6A', 0.6); // stud
    // hair: top + back of the head, swept from the parting
    ctx.beginPath();
    ctx.moveTo(-21, hy + 14);
    ctx.bezierCurveTo(-28, hy - 2, -22, hy - 26, 2, hy - 24);
    ctx.quadraticCurveTo(18, hy - 23, 23, hy - 10);
    ctx.quadraticCurveTo(12, hy - 15, 4, hy - 6);
    ctx.quadraticCurveTo(-2, hy + 2, -4, hy + 16);
    ctx.closePath();
    fillStroke(ctx, HAIR);
    ctx.beginPath();
    ctx.moveTo(-8, hy - 18);
    ctx.quadraticCurveTo(-16, hy - 6, -14, hy + 8);
    line(ctx, HAIR_HI, 2);
    // brow, smiling eye, bindi
    ctx.beginPath();
    ctx.moveTo(9, hy - 5);
    ctx.quadraticCurveTo(13, hy - 8, 17, hy - 5);
    line(ctx, HAIR, 1.8);
    ellipse(ctx, 13.5, hy + 1.2, 2.6, 2.8, '#2A1610', null);
    ellipse(ctx, 14.3, hy + 0.3, 0.95, 0.95, '#FFFFFF', null);
    ctx.beginPath();
    ctx.moveTo(10, hy + 0.4);
    ctx.quadraticCurveTo(13.5, hy - 3, 17, hy + 0.6);
    line(ctx, '#1A0D09', 1.5);
    ellipse(ctx, 20.5, hy - 4.5, 1.4, 1.4, SINDOOR, null);
    ctx.globalAlpha = 0.45;
    ellipse(ctx, 11, hy + 10, 4, 2.4, '#FF6F8E', null);
    ctx.globalAlpha = 1;
    smile(ctx, 16.5, hy + 11.5, 4.2, 3.6);
    tiara(ctx, 2, hy - 24, 0.85);
  }
}

/**
 * dir: 'down' | 'up' | 'left' | 'right'
 * phase: walk cycle (radians), moving: boolean, t: seconds (idle breathing)
 */
export function drawGirl(ctx, x, y, dir, phase, moving, t) {
  ctx.save();
  ctx.translate(x, y);
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  // shadow
  ctx.beginPath();
  ctx.ellipse(0, 0, 22, 7, 0, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0,0,0,.2)';
  ctx.fill();

  const bob = moving ? -Math.abs(Math.sin(phase)) * 4 : Math.sin(t * 2.2) * 0.8;
  const step = moving ? Math.sin(phase) : 0;
  const side = dir === 'left' || dir === 'right';
  if (dir === 'left') ctx.scale(-1, 1);

  // legs + shoes
  const legs = side ? [[-3, step * 6], [4, -step * 6]] : [[-7, step * 3], [7, -step * 3]];
  for (const [lx, off] of legs) {
    const lift = side ? 0 : Math.max(0, off);
    ctx.fillStyle = SKIN;
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.roundRect(lx - 4 + (side ? off : 0), -20 + bob - lift, 8, 17, 4);
    ctx.fill();
    ctx.stroke();
    ellipse(ctx, lx + (side ? off + 2 : 0), -3 - lift + bob * 0.3, side ? 7 : 6, 4, SHOE);
  }

  ctx.translate(0, bob);
  const hy = -64; // head centre

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

  // long hair falls over the shoulders, in front of the dress
  if (dir === 'down' || side) backHair(ctx, side ? 'side' : 'down', hy);

  // arms
  if (side) ellipse(ctx, 6 + step * 5, -34, 5, 6, SKIN);
  else {
    ellipse(ctx, -17, -34 + step * 3, 5, 6, SKIN);
    ellipse(ctx, 17, -34 - step * 3, 5, 6, SKIN);
  }

  head(ctx, dir, hy);
  ctx.restore();
}
