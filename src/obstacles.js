// Things lying across the road: rocks and logs to jump over, and puddles
// that are better jumped than waded. Drawn straight onto the canvas, turned
// to sit square across the road wherever it bends.

const INK = '#3B2414';
const TAU = Math.PI * 2;

// a boulder sitting on the ground at (x, y)
function boulder(ctx, x, y, r, tilt) {
  ctx.save();
  ctx.translate(x, y - r * 0.55);
  ctx.rotate(tilt);
  const shape = () => {
    ctx.beginPath();
    ctx.moveTo(-r, r * 0.45);
    ctx.quadraticCurveTo(-r * 1.05, -r * 0.35, -r * 0.45, -r * 0.7);
    ctx.quadraticCurveTo(r * 0.1, -r * 1.05, r * 0.65, -r * 0.6);
    ctx.quadraticCurveTo(r * 1.1, -r * 0.1, r, r * 0.45);
    ctx.quadraticCurveTo(0, r * 0.75, -r, r * 0.45);
    ctx.closePath();
  };
  shape();
  ctx.fillStyle = '#A3ABB5';
  ctx.fill();
  ctx.save();
  ctx.clip();
  ctx.fillStyle = '#868F9A';
  ctx.beginPath();
  ctx.ellipse(r * 0.35, r * 0.3, r * 0.9, r * 0.55, 0, 0, TAU);
  ctx.fill();
  ctx.fillStyle = '#79C24A';
  ctx.beginPath();
  ctx.ellipse(-r * 0.25, -r * 0.7, r * 0.5, r * 0.22, -0.2, 0, TAU);
  ctx.fill();
  ctx.restore();
  shape(); // outline the whole stone (the shading above replaced the path)
  ctx.lineWidth = 3.5;
  ctx.strokeStyle = INK;
  ctx.lineJoin = 'round';
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(-r * 0.4, -r * 0.2, r * 0.18, r * 0.1, -0.5, 0, TAU);
  ctx.fillStyle = 'rgba(255,255,255,.55)';
  ctx.fill();
  ctx.restore();
}

function rocks(ctx, o) {
  const { x, y, n } = o;
  // a little shadow band across the road
  ctx.beginPath();
  ctx.ellipse(x, y + 4, 44, 12, Math.atan2(n.y, n.x), 0, TAU);
  ctx.fillStyle = 'rgba(0,0,0,.15)';
  ctx.fill();
  const stones = [
    [-25, 18, 0.2],
    [25, 19, -0.15],
    [0, 25, 0.05],
  ].sort((a, b) => n.y * a[0] - n.y * b[0]); // back to front
  for (const [d, r, tilt] of stones) boulder(ctx, x + n.x * d, y + n.y * d, r, tilt);
}

function log(ctx, o) {
  const { x, y, n } = o;
  const a = { x: x - n.x * 44, y: y - n.y * 44 - 10 };
  const b = { x: x + n.x * 44, y: y + n.y * 44 - 10 };
  ctx.beginPath();
  ctx.ellipse(x, y + 4, 48, 12, Math.atan2(n.y, n.x), 0, TAU);
  ctx.fillStyle = 'rgba(0,0,0,.15)';
  ctx.fill();
  ctx.lineCap = 'round';
  const bar = (w, c) => {
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.lineWidth = w;
    ctx.strokeStyle = c;
    ctx.stroke();
  };
  bar(28, INK);
  bar(21, '#A8743A');
  // bark lines
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = '#7A4B22';
  for (const f of [0.25, 0.5, 0.72]) {
    const px = a.x + (b.x - a.x) * f;
    const py = a.y + (b.y - a.y) * f;
    ctx.beginPath();
    ctx.moveTo(px - n.x * 8, py - n.y * 8 - 5);
    ctx.lineTo(px + n.x * 8, py + n.y * 8 - 5);
    ctx.stroke();
  }
  // a cut end with rings, on whichever end faces us
  const e = a.y > b.y ? a : b;
  ctx.beginPath();
  ctx.ellipse(e.x, e.y, 11, 13, 0, 0, TAU);
  ctx.fillStyle = '#E8C48A';
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = INK;
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(e.x, e.y, 6, 7, 0, 0, TAU);
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#B98A4E';
  ctx.stroke();
  // a little leaf sprouting from the top
  const m = { x: (a.x + b.x) / 2 + n.x * 10, y: (a.y + b.y) / 2 + n.y * 10 - 12 };
  ctx.beginPath();
  ctx.moveTo(m.x, m.y);
  ctx.quadraticCurveTo(m.x + 10, m.y - 12, m.x + 16, m.y - 6);
  ctx.quadraticCurveTo(m.x + 8, m.y - 2, m.x, m.y);
  ctx.fillStyle = '#79C24A';
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = INK;
  ctx.stroke();
}

// puddles lie flat, so they are drawn with the road, under everything else
export function drawPuddle(ctx, o, T) {
  const ang = Math.atan2(o.t.y, o.t.x);
  ctx.save();
  ctx.translate(o.x, o.y);
  ctx.rotate(ang);
  ctx.beginPath();
  ctx.ellipse(0, 0, o.half, 37, 0, 0, TAU);
  ctx.fillStyle = '#4FB0E0';
  ctx.fill();
  ctx.lineWidth = 4;
  ctx.strokeStyle = '#2E86B8';
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(-6, -6, o.half * 0.7, 24, 0, 0, TAU);
  ctx.fillStyle = '#7FD3F7';
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,.7)';
  ctx.lineWidth = 2.5;
  for (let i = 0; i < 2; i++) {
    const k = (T * 0.5 + i / 2) % 1;
    ctx.globalAlpha = 1 - k;
    ctx.beginPath();
    ctx.ellipse(8, 4, 6 + k * 22, (6 + k * 22) * 0.55, 0, 0, TAU);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
  ctx.restore();
}

export function drawObstacle(ctx, o) {
  if (o.type === 'rock') rocks(ctx, o);
  else if (o.type === 'log') log(ctx, o);
}
