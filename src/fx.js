// Small synthesized sounds and a confetti burst. No audio files needed.

let ctx = null;
let muted = false;
try {
  muted = localStorage.getItem('bobia-muted') === '1';
} catch {}

export const isMuted = () => muted;
export function setMuted(v) {
  muted = v;
  try {
    localStorage.setItem('bobia-muted', v ? '1' : '0');
  } catch {}
}

function tone(freq, start, dur, type = 'triangle', vol = 0.18) {
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, ctx.currentTime + start);
  g.gain.setValueAtTime(0, ctx.currentTime + start);
  g.gain.linearRampToValueAtTime(vol, ctx.currentTime + start + 0.02);
  g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + dur);
  o.connect(g).connect(ctx.destination);
  o.start(ctx.currentTime + start);
  o.stop(ctx.currentTime + start + dur + 0.05);
}

export function sound(name) {
  if (muted) return;
  try {
    ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
  } catch {
    return;
  }
  switch (name) {
    case 'tick':
      tone(880, 0, 0.06, 'square', 0.05);
      break;
    case 'swap':
      tone(520, 0, 0.08, 'triangle', 0.12);
      tone(780, 0.06, 0.1, 'triangle', 0.12);
      break;
    case 'wrong':
      tone(196, 0, 0.18, 'sawtooth', 0.08);
      tone(147, 0.12, 0.25, 'sawtooth', 0.08);
      break;
    case 'open':
      [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.09, 0.35));
      break;
    case 'reveal':
      [392, 523, 659].forEach((f, i) => tone(f, i * 0.14, 0.6, 'sine', 0.12));
      break;
    case 'hint':
      tone(1175, 0, 0.15, 'sine', 0.1);
      tone(1568, 0.1, 0.25, 'sine', 0.1);
      break;
    case 'fanfare':
      [523, 523, 659, 784, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.13, i === 6 ? 0.9 : 0.2, 'square', 0.07));
      break;
    case 'tap':
      tone(660, 0, 0.05, 'triangle', 0.08);
      break;
  }
}

export function confetti(duration = 3500) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const c = document.createElement('canvas');
  c.className = 'confetti';
  document.body.append(c);
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const resize = () => {
    c.width = innerWidth * dpr;
    c.height = innerHeight * dpr;
  };
  resize();
  const x = c.getContext('2d');
  const colors = ['#FFC83D', '#E84A7F', '#5EC8F2', '#79C24A', '#FFFFFF', '#C58BF2'];
  const parts = Array.from({ length: 180 }, () => ({
    x: innerWidth / 2 + (Math.random() - 0.5) * 120,
    y: innerHeight * 0.55,
    vx: (Math.random() - 0.5) * 16,
    vy: -Math.random() * 18 - 8,
    r: Math.random() * Math.PI,
    vr: (Math.random() - 0.5) * 0.4,
    w: 7 + Math.random() * 7,
    h: 10 + Math.random() * 8,
    c: colors[(Math.random() * colors.length) | 0],
  }));
  const t0 = performance.now();
  const frame = (t) => {
    x.setTransform(dpr, 0, 0, dpr, 0, 0);
    x.clearRect(0, 0, innerWidth, innerHeight);
    for (const p of parts) {
      p.vy += 0.42;
      p.vx *= 0.99;
      p.x += p.vx;
      p.y += p.vy;
      p.r += p.vr;
      x.save();
      x.translate(p.x, p.y);
      x.rotate(p.r);
      x.fillStyle = p.c;
      x.fillRect(-p.w / 2, -p.h / 2, p.w, p.h * Math.cos(p.r * 2));
      x.restore();
    }
    if (t - t0 < duration) requestAnimationFrame(frame);
    else c.remove();
  };
  requestAnimationFrame(frame);
}
