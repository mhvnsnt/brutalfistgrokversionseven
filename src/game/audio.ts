let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let musicBus: GainNode | null = null;
let sfxBus: GainNode | null = null;
let musicTimer: number | null = null;
let unlocked = false;

function ensure() {
  if (ctx) return ctx;
  const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  ctx = new AC({ latencyHint: "interactive" });
  master = ctx.createGain();
  musicBus = ctx.createGain();
  sfxBus = ctx.createGain();
  musicBus.connect(master);
  sfxBus.connect(master);
  master.connect(ctx.destination);
  return ctx;
}

export function unlockAudio() {
  const audio = ensure();
  if (audio.state === "suspended") void audio.resume();
  unlocked = true;
}

export function setMix(masterVol: number, musicVol: number, sfxVol: number) {
  if (!master || !musicBus || !sfxBus || !ctx) return;
  const t = ctx.currentTime;
  master.gain.setTargetAtTime(masterVol * masterVol, t, 0.04);
  musicBus.gain.setTargetAtTime(musicVol * musicVol * 0.35, t, 0.04);
  sfxBus.gain.setTargetAtTime(sfxVol * sfxVol, t, 0.04);
}

function tone(
  freq: number,
  dur: number,
  type: OscillatorType,
  gain: number,
  bus: GainNode,
  slide?: number,
) {
  if (!ctx || !unlocked) return;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime);
  if (slide) osc.frequency.exponentialRampToValueAtTime(Math.max(40, slide), ctx.currentTime + dur);
  g.gain.setValueAtTime(gain, ctx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
  osc.connect(g);
  g.connect(bus);
  osc.start();
  osc.stop(ctx.currentTime + dur + 0.02);
}

function noise(dur: number, gain: number, bus: GainNode) {
  if (!ctx || !unlocked) return;
  const length = Math.floor(ctx.sampleRate * dur);
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / length);
  const src = ctx.createBufferSource();
  const g = ctx.createGain();
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 900;
  src.buffer = buffer;
  g.gain.setValueAtTime(gain, ctx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
  src.connect(filter);
  filter.connect(g);
  g.connect(bus);
  src.start();
}

export function playSfx(kind: "hit" | "heavy" | "block" | "ko" | "menu" | "confirm" | "start" | "grapple" | "whoosh") {
  if (!sfxBus || !unlocked) return;
  const jitter = 1 + (Math.random() * 0.12 - 0.06);
  switch (kind) {
    case "hit":
      tone(180 * jitter, 0.09, "square", 0.12, sfxBus, 90);
      noise(0.08, 0.18, sfxBus);
      break;
    case "heavy":
      tone(110 * jitter, 0.16, "sawtooth", 0.16, sfxBus, 55);
      noise(0.14, 0.28, sfxBus);
      break;
    case "block":
      tone(420 * jitter, 0.07, "square", 0.08, sfxBus, 280);
      break;
    case "ko":
      tone(90, 0.5, "sawtooth", 0.2, sfxBus, 40);
      noise(0.4, 0.22, sfxBus);
      break;
    case "menu":
      tone(520, 0.05, "square", 0.05, sfxBus);
      break;
    case "confirm":
      tone(240, 0.08, "square", 0.07, sfxBus, 480);
      break;
    case "start":
      tone(160, 0.22, "sawtooth", 0.1, sfxBus, 320);
      break;
    case "grapple":
      tone(140, 0.12, "triangle", 0.1, sfxBus, 80);
      break;
    case "whoosh":
      noise(0.07, 0.1, sfxBus);
      break;
  }
}

export function startMusic() {
  if (!ctx || !musicBus || !unlocked) return;
  stopMusic();
  const pattern = [98, 98, 130, 87, 98, 73, 65, 98];
  let step = 0;
  const tick = () => {
    if (!ctx || !musicBus) return;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = "square";
    osc.frequency.value = pattern[step % pattern.length];
    g.gain.setValueAtTime(0.07, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.28);
    osc.connect(g);
    g.connect(musicBus);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
    step++;
  };
  tick();
  musicTimer = window.setInterval(tick, 320);
}

export function stopMusic() {
  if (musicTimer != null) {
    window.clearInterval(musicTimer);
    musicTimer = null;
  }
}
