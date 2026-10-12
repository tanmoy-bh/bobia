// Joy: a chibi girl with a bun, a birthday tiara and a pink dress.
// Drawn in code so she can walk in four directions with a little bounce.

const INK = '#3B2414';
const SKIN = '#F1C09A';
const SKIN_SHADE = '#E2A57E';
const HAIR = '#2B1712';
const HAIR_HI = '#4A2A20';
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

function tiara(ctx, x, y) {
  ctx.beginPath();
  ctx.moveTo(x - 11, y);
  ctx.lineTo(x - 11, y - 8);
  ctx.lineTo(x - 5, y - 3);
  ctx.lineTo(x, y - 12);
  ctx.lineTo(x + 5, y - 3);
  ctx.lineTo(x + 11, y - 8);
  ctx.lineTo(x + 11, y);
  ctx.closePath();
  ctx.fillStyle = GOLD;
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = INK;
  ctx.stroke();
  ellipse(ctx, x, y - 4, 2.4, 2.4, '#E84A7F', null);
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

  // back arm (side view)
  if (side) ellipse(ctx, -4 - step * 5, -36, 5, 6, SKIN_SHADE);

  // dress
  ctx.beginPath();
  ctx.moveTo(-11, -46);
  ctx.quadraticCurveTo(-24, -24, -21, -15);
  ctx.quadraticCurveTo(0, -10, 21, -15);
  ctx.quadraticCurveTo(24, -24, 11, -46);
  ctx.closePath();
  ctx.fillStyle = DRESS;
  ctx.fill();
  ctx.lineWidth = 2.6;
  ctx.strokeStyle = INK;
  ctx.stroke();
  // hem frill + polka dots
  ctx.beginPath();
  ctx.moveTo(-20, -17);
  ctx.quadraticCurveTo(0, -12, 20, -17);
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#FFFFFF';
  ctx.stroke();
  ctx.fillStyle = '#FFD1E2';
  for (const [dx, dy] of [[-9, -26], [7, -30], [-2, -21], [12, -22]]) {
    ctx.beginPath();
    ctx.arc(dx, dy, 1.8, 0, Math.PI * 2);
    ctx.fill();
  }
  // bow at the waist
  if (dir !== 'up') {
    ellipse(ctx, side ? 4 : -5, -42, 4, 3, DRESS_DARK, INK, 1.8);
    ellipse(ctx, side ? 10 : 5, -42, 4, 3, DRESS_DARK, INK, 1.8);
  }

  // arms
  if (side) ellipse(ctx, 6 + step * 5, -34, 5, 6, SKIN);
  else {
    ellipse(ctx, -17, -34 + step * 3, 5, 6, SKIN);
    ellipse(ctx, 17, -34 - step * 3, 5, 6, SKIN);
  }

  const hy = -64; // head centre
  if (dir === 'down') {
    // hair behind the head (shoulder length)
    ctx.beginPath();
    ctx.roundRect(-25, hy - 6, 50, 30, 10);
    ctx.fillStyle = HAIR;
    ctx.fill();
    ctx.lineWidth = 2.6;
    ctx.strokeStyle = INK;
    ctx.stroke();
    ellipse(ctx, 0, hy - 30, 10, 9, HAIR); // bun
    ellipse(ctx, 0, hy, 22, 21, SKIN); // face
    // bangs
    ctx.beginPath();
    ctx.arc(0, hy - 2, 23, Math.PI * 1.02, Math.PI * 1.98);
    ctx.quadraticCurveTo(14, hy - 14, 4, hy - 9);
    ctx.quadraticCurveTo(-2, hy - 16, -9, hy - 8);
    ctx.quadraticCurveTo(-17, hy - 13, -23, hy - 3);
    ctx.closePath();
    ctx.fillStyle = HAIR;
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(-8, hy - 15, 5, Math.PI * 1.1, Math.PI * 1.6);
    ctx.strokeStyle = HAIR_HI;
    ctx.lineWidth = 2;
    ctx.stroke();
    // eyes
    for (const ex of [-8, 8]) {
      ellipse(ctx, ex, hy + 3, 3.4, 4.4, INK, null);
      ellipse(ctx, ex + 1.2, hy + 1.4, 1.3, 1.3, '#FFFFFF', null);
    }
    // blush + smile
    ctx.globalAlpha = 0.55;
    ellipse(ctx, -14, hy + 10, 4.2, 2.6, '#FF7E9E', null);
    ellipse(ctx, 14, hy + 10, 4.2, 2.6, '#FF7E9E', null);
    ctx.globalAlpha = 1;
    ctx.beginPath();
    ctx.arc(0, hy + 10, 3.4, 0.15 * Math.PI, 0.85 * Math.PI);
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2;
    ctx.stroke();
    tiara(ctx, 0, hy - 18);
  } else if (dir === 'up') {
    ellipse(ctx, 0, hy, 22, 21, SKIN);
    ctx.beginPath();
    ctx.arc(0, hy - 1, 23.5, Math.PI * 0.88, Math.PI * 2.12);
    ctx.lineTo(24, hy + 22);
    ctx.quadraticCurveTo(0, hy + 30, -24, hy + 22);
    ctx.closePath();
    ctx.fillStyle = HAIR;
    ctx.fill();
    ctx.lineWidth = 2.6;
    ctx.strokeStyle = INK;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(-6, hy - 8, 9, Math.PI * 1.1, Math.PI * 1.5);
    ctx.strokeStyle = HAIR_HI;
    ctx.lineWidth = 2.4;
    ctx.stroke();
    ellipse(ctx, 0, hy - 24, 11, 10, HAIR);
    ellipse(ctx, 0, hy - 14, 9, 3, '#E84A7F', INK, 1.8); // scrunchie
    tiara(ctx, 0, hy - 18);
  } else {
    // side view, facing right
    ctx.beginPath();
    ctx.roundRect(-26, hy - 8, 30, 32, 10);
    ctx.fillStyle = HAIR;
    ctx.fill();
    ctx.lineWidth = 2.6;
    ctx.strokeStyle = INK;
    ctx.stroke();
    ellipse(ctx, -6, hy - 28, 10, 9, HAIR);
    ellipse(ctx, 1, hy, 21, 21, SKIN);
    ctx.beginPath();
    ctx.arc(1, hy - 1, 22.5, Math.PI * 0.62, Math.PI * 1.9);
    ctx.quadraticCurveTo(14, hy - 10, 6, hy - 8);
    ctx.quadraticCurveTo(-2, hy - 4, -6, hy + 8);
    ctx.quadraticCurveTo(-14, hy + 18, -18, hy + 14);
    ctx.closePath();
    ctx.fillStyle = HAIR;
    ctx.fill();
    ctx.stroke();
    ellipse(ctx, 11, hy + 3, 3.2, 4.4, INK, null);
    ellipse(ctx, 12.2, hy + 1.4, 1.2, 1.2, '#FFFFFF', null);
    ctx.globalAlpha = 0.55;
    ellipse(ctx, 13, hy + 11, 4, 2.5, '#FF7E9E', null);
    ctx.globalAlpha = 1;
    ctx.beginPath();
    ctx.arc(16, hy + 11, 2.6, 0.2 * Math.PI, 0.8 * Math.PI);
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2;
    ctx.stroke();
    tiara(ctx, 0, hy - 18);
  }
  ctx.restore();
}
