// Small synthesized sounds, a looping island tune and a confetti burst. No audio files needed.

let ctx = null;
// The ♪ button only switches the background tune; animal calls and other
// sound effects always play.
let musicOff = false;
try {
  musicOff = localStorage.getItem('bobia-muted') === '1';
} catch {}

export const isMusicOff = () => musicOff;
export function setMusicOff(v) {
  musicOff = v;
  try {
    localStorage.setItem('bobia-muted', v ? '1' : '0');
  } catch {}
  if (musicOff) stopMusic();
  else startMusic();
}

function audio() {
  try {
    ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
    // 'suspended' before her first tap, 'interrupted' on iPhones after a call
    // or the screen locking
    if (ctx.state !== 'running') ctx.resume()?.catch?.(() => {});
    return ctx;
  } catch {
    return null;
  }
}

// Phones (iPhones above all) only let a page make sound if its audio is
// started or resumed during a tap. Call this from every tap, whether or not
// the music is on, so the animal calls and other sounds always work.
let unlocked = false;
export function unlockAudio() {
  const c = audio();
  if (!c || unlocked) return;
  const s = c.createBufferSource(); // a silent blip finishes the unlock on older iPhones
  s.buffer = c.createBuffer(1, 1, 22050);
  s.connect(c.destination);
  s.start(0);
  unlocked = true;
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
  if (document.hidden || !audio()) return;
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
    case 'grow':
      growUp();
      break;
    case 'jump':
      voice({ type: 'square', fs: [300, 780], dur: 0.16, vol: 0.07, filter: ['lowpass', 2200] });
      break;
    case 'land':
      voice({ type: 'sine', fs: [170, 70], dur: 0.12, vol: 0.28 });
      break;
    case 'bonk':
      voice({ type: 'triangle', fs: [240, 130], dur: 0.14, vol: 0.22 });
      noise(0, 0.08, 0.08, 900, 400);
      break;
    case 'splash':
      noise(0, 0.4, 0.2, 2600, 500);
      for (const [f, at] of [[1500, 0.04], [2100, 0.11], [1750, 0.19]]) voice({ type: 'sine', fs: [f, f * 1.5], at, dur: 0.06, vol: 0.06 });
      break;
    case 'baa':
      baa();
      break;
    default:
      ANIMALS[name]?.();
  }
}

// ── Animal and nature sounds for the habitats on the map ────────────────

// One synthesized voice: an oscillator gliding through `fs`, optionally
// wobbled (vib), chopped (am) and shaped by a filter.
function voice({ type = 'sawtooth', fs, at = 0, dur, vol = 0.2, filter, q = 1, vib = 0, vibRate = 6, am = 0, amRate = 30 }) {
  const t = ctx.currentTime + at;
  const o = ctx.createOscillator();
  o.type = type;
  o.frequency.setValueAtTime(fs[0], t);
  fs.slice(1).forEach((f, i) => o.frequency.linearRampToValueAtTime(f, t + (dur * (i + 1)) / (fs.length - 1)));
  const stops = [o];
  if (vib) {
    const lfo = ctx.createOscillator();
    const d = ctx.createGain();
    lfo.frequency.value = vibRate;
    d.gain.value = vib;
    lfo.connect(d).connect(o.frequency);
    stops.push(lfo);
  }
  let node = o;
  if (filter) {
    const f = ctx.createBiquadFilter();
    f.type = filter[0];
    f.frequency.value = filter[1];
    f.Q.value = q;
    node = node.connect(f);
  }
  if (am) {
    const trem = ctx.createGain();
    const lfo = ctx.createOscillator();
    const d = ctx.createGain();
    lfo.type = 'square';
    lfo.frequency.value = amRate;
    trem.gain.value = 1 - am / 2;
    d.gain.value = am / 2;
    lfo.connect(d).connect(trem.gain);
    node = node.connect(trem);
    stops.push(lfo);
  }
  const g = ctx.createGain();
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(vol, t + Math.min(0.03, dur / 4));
  g.gain.setValueAtTime(vol, t + dur * 0.7);
  g.gain.exponentialRampToValueAtTime(0.001, t + dur);
  node.connect(g).connect(ctx.destination);
  for (const x of stops) {
    x.start(t);
    x.stop(t + dur + 0.05);
  }
}

function noise(at, dur, vol, from, to) {
  const t = ctx.currentTime + at;
  const buf = ctx.createBuffer(1, ctx.sampleRate * dur, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  const src = ctx.createBufferSource();
  src.buffer = buf;
  const f = ctx.createBiquadFilter();
  f.type = 'bandpass';
  f.Q.value = 0.8;
  f.frequency.setValueAtTime(from, t);
  f.frequency.exponentialRampToValueAtTime(to, t + dur);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + dur * 0.4);
  g.gain.exponentialRampToValueAtTime(0.001, t + dur);
  src.connect(f).connect(g).connect(ctx.destination);
  src.start(t);
}

const ANIMALS = {
  quack() {
    for (const at of [0, 0.24]) voice({ fs: [560, 470, 380], at, dur: 0.17, vol: 0.22, filter: ['bandpass', 1300], q: 2.5, am: 0.6, amRate: 70 });
  },
  moo() {
    voice({ fs: [108, 150, 146, 96], dur: 1.15, vol: 0.32, filter: ['lowpass', 650], q: 4, vib: 3, vibRate: 5 });
  },
  oink() {
    for (const at of [0, 0.19]) voice({ type: 'square', fs: [280, 210], at, dur: 0.13, vol: 0.14, filter: ['lowpass', 900], q: 5, am: 0.8, amRate: 38 });
  },
  cluck() {
    for (const at of [0, 0.13, 0.26]) voice({ type: 'triangle', fs: [760, 520], at, dur: 0.07, vol: 0.22, filter: ['bandpass', 950], q: 2 });
    voice({ type: 'triangle', fs: [620, 980, 560], at: 0.45, dur: 0.28, vol: 0.22, filter: ['bandpass', 1000], q: 2 });
  },
  ribbit() {
    for (const at of [0, 0.2]) voice({ fs: [190, 230], at, dur: 0.13, vol: 0.3, filter: ['bandpass', 650], q: 3, am: 1, amRate: 48 });
  },
  buzz() {
    voice({ fs: [215, 235, 205, 225], dur: 1.5, vol: 0.09, filter: ['bandpass', 420], q: 1.2, vib: 10, vibRate: 9, am: 0.4, amRate: 19 });
    voice({ fs: [222, 210, 230, 218], at: 0.1, dur: 1.3, vol: 0.07, filter: ['bandpass', 520], q: 1.2, vib: 8, vibRate: 11 });
  },
  chime() {
    [84, 88, 91, 96, 93, 88].forEach((m, i) => tone(440 * 2 ** ((m - 69) / 12), i * 0.2, 1.8, 'sine', 0.06));
  },
  tweet() {
    for (const at of [0, 0.13, 0.26]) voice({ type: 'sine', fs: [2600, 4200], at, dur: 0.09, vol: 0.08 });
    voice({ type: 'sine', fs: [4000, 2700], at: 0.45, dur: 0.16, vol: 0.08 });
  },
  gull() {
    noise(0, 2.2, 0.1, 500, 280);
    voice({ type: 'triangle', fs: [1350, 1750, 950], at: 0.3, dur: 0.42, vol: 0.09, filter: ['bandpass', 1500], q: 1.5, vib: 40, vibRate: 13 });
    voice({ type: 'triangle', fs: [1300, 1650, 900], at: 0.85, dur: 0.32, vol: 0.08, filter: ['bandpass', 1500], q: 1.5, vib: 40, vibRate: 13 });
  },
  crickets() {
    for (const at of [0, 0.45, 0.9]) voice({ type: 'sine', fs: [4400, 4500], at, dur: 0.3, vol: 0.05, am: 1, amRate: 32 });
  },
  // "Old MacDonald had a farm, E-I-E-I-O" (traditional)
  farm() {
    const q = 0.27;
    const tune = [[67, 1], [67, 1], [67, 1], [62, 1], [64, 1], [64, 1], [62, 2], [71, 1], [71, 1], [69, 1], [69, 1], [67, 2]];
    let at = 0;
    for (const [m, n] of tune) {
      tone(440 * 2 ** ((m - 69) / 12), at, q * n * 0.95, 'triangle', 0.13);
      at += q * n;
    }
  },
};

// Joy growing up: bloops that climb in step with her small / medium / big
// flicker (each round higher than the last), a whoosh rising underneath,
// then a bright ta-da with sparkly bells and a soft thump as she settles.
function growUp() {
  const STEP = 0.11; // one flicker frame
  [0, 4, 7, 5, 9, 12, 10, 14, 17].forEach((semi, i) => {
    const f = 392 * 2 ** (semi / 12);
    tone(f, i * STEP, 0.1, 'square', 0.09);
    tone(f * 2, i * STEP, 0.08, 'triangle', 0.05);
  });
  noise(0, 1.1, 0.08, 500, 5000);
  const end = 1.0;
  [1047, 1319, 1568, 2093].forEach((f, i) => tone(f, end + i * 0.03, 0.9, 'triangle', 0.08));
  [2637, 3136, 3520, 4186, 3136].forEach((f, i) => tone(f, end + 0.12 + i * 0.07, 0.35, 'sine', 0.05));
  tone(98, end, 0.5, 'sine', 0.25);
}

// A sheep's "baa": a low, buzzy voice that quavers about eleven times a
// second (pitch and loudness together, "ba-a-a-a"), shaped into an open
// "aah" vowel by three formant filters, with a quick "b" at the start.
function baa() {
  const t = ctx.currentTime;
  const dur = 0.85;
  const f0 = 250 + Math.random() * 50;
  const o = ctx.createOscillator();
  o.type = 'sawtooth';
  o.frequency.setValueAtTime(f0 * 0.92, t);
  o.frequency.linearRampToValueAtTime(f0 * 1.04, t + 0.12);
  o.frequency.linearRampToValueAtTime(f0 * 0.86, t + dur);
  const lfo = ctx.createOscillator();
  lfo.frequency.value = 11;
  const pitchWobble = ctx.createGain();
  pitchWobble.gain.value = f0 * 0.035;
  lfo.connect(pitchWobble).connect(o.frequency);
  const quaver = ctx.createGain();
  quaver.gain.value = 0.65;
  const loudWobble = ctx.createGain();
  loudWobble.gain.value = 0.35;
  lfo.connect(loudWobble).connect(quaver.gain);
  o.connect(quaver);
  const vowel = ctx.createGain();
  for (const [f, q, v] of [[750, 5, 1], [1200, 6, 0.7], [2500, 8, 0.25]]) {
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = f;
    bp.Q.value = q;
    const g = ctx.createGain();
    g.gain.value = v;
    quaver.connect(bp).connect(g).connect(vowel);
  }
  const env = ctx.createGain();
  env.gain.setValueAtTime(0, t);
  env.gain.linearRampToValueAtTime(0.5, t + 0.04);
  env.gain.setValueAtTime(0.5, t + dur * 0.6);
  env.gain.exponentialRampToValueAtTime(0.001, t + dur);
  vowel.connect(env).connect(ctx.destination);
  o.start(t);
  lfo.start(t);
  o.stop(t + dur + 0.05);
  lfo.stop(t + dur + 0.05);
}

// ── Background tune ──────────────────────────────────────────────────────
// An original, bouncy island loop (C – Am – F – G) played by a soft bass,
// ukulele-ish chord plucks and a music-box melody. Browsers only allow sound
// after a tap, so startMusic() is called from the first tap or key press.

const BPM = 104;
const STEP = 60 / BPM / 2; // eighth notes
const CHORDS = [
  { bass: 48, notes: [60, 64, 67] }, // C
  { bass: 45, notes: [57, 60, 64] }, // Am
  { bass: 41, notes: [57, 60, 65] }, // F
  { bass: 43, notes: [55, 59, 62] }, // G
];
// 8 bars of melody, 8 steps each (0 = rest), MIDI note numbers.
const MELODY = [
  [76, 0, 79, 0, 81, 79, 76, 0],
  [72, 0, 76, 0, 74, 72, 69, 0],
  [69, 0, 72, 0, 77, 0, 76, 74],
  [74, 0, 0, 71, 0, 74, 79, 0],
  [76, 0, 79, 0, 84, 0, 83, 81],
  [79, 0, 76, 0, 81, 79, 76, 0],
  [77, 0, 81, 0, 79, 0, 76, 74],
  [74, 0, 76, 0, 72, 0, 0, 0],
].flat();

const hz = (m) => 440 * 2 ** ((m - 69) / 12);
let bus = null;
let timer = null;
let step = 0;
let nextAt = 0;

function note(m, at, dur, type, vol, harmonic = 0) {
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = type;
  o.frequency.value = hz(m);
  g.gain.setValueAtTime(0, at);
  g.gain.linearRampToValueAtTime(vol, at + 0.01);
  g.gain.exponentialRampToValueAtTime(0.001, at + dur);
  o.connect(g).connect(bus);
  o.start(at);
  o.stop(at + dur + 0.05);
  if (harmonic) note(m + 12, at, dur * 0.5, 'sine', vol * harmonic);
}

function schedule() {
  while (nextAt < ctx.currentTime + 0.25) {
    const bar = Math.floor(step / 8) % 8;
    const beat = step % 8;
    const chord = CHORDS[bar % 4];
    if (beat === 0) note(chord.bass, nextAt, STEP * 3.5, 'triangle', 0.32);
    if (beat === 4) note(chord.bass + 7, nextAt, STEP * 3.5, 'triangle', 0.26);
    if (beat === 2 || beat === 6 || (beat === 7 && bar % 2)) {
      chord.notes.forEach((m, i) => note(m, nextAt + i * 0.012, STEP * 1.4, 'triangle', 0.07));
    }
    const m = MELODY[step % MELODY.length];
    if (m) note(m, nextAt, STEP * 2.2, 'sine', 0.16, 0.35);
    step = (step + 1) % MELODY.length;
    nextAt += STEP;
  }
}

export function startMusic() {
  if (musicOff || timer || document.hidden || !audio()) return;
  if (!bus) {
    bus = ctx.createGain();
    const echo = ctx.createDelay();
    const fb = ctx.createGain();
    echo.delayTime.value = STEP * 3;
    fb.gain.value = 0.22;
    bus.connect(ctx.destination);
    bus.connect(echo).connect(fb).connect(echo);
    fb.connect(ctx.destination);
  }
  bus.gain.cancelScheduledValues(ctx.currentTime);
  bus.gain.setValueAtTime(0, ctx.currentTime);
  bus.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 1.5);
  nextAt = ctx.currentTime + 0.1;
  schedule();
  timer = setInterval(schedule, 80);
}

export function stopMusic() {
  if (!timer) return;
  clearInterval(timer);
  timer = null;
  bus.gain.cancelScheduledValues(ctx.currentTime);
  bus.gain.setTargetAtTime(0, ctx.currentTime, 0.08);
}

// Go completely quiet while the page is hidden (another tab or app, or the
// phone locked): stop the tune, and suspend the audio so nothing already
// queued or newly called can play. Carry on when she comes back.
let wasPlaying = false;
const hide = () => {
  if (timer) wasPlaying = true;
  stopMusic();
  ctx?.suspend?.().catch?.(() => {});
};
document.addEventListener('visibilitychange', () => {
  if (document.hidden) return hide();
  audio();
  if (wasPlaying) {
    wasPlaying = false;
    startMusic();
  }
});
addEventListener('pagehide', hide);

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
