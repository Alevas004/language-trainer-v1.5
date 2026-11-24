export type SoundKind = "drum" | "bell" | "flute";

export const SOUND_NAMES: Record<SoundKind, string> = {
  drum: "tambor",
  bell: "campana",
  flute: "flauta",
};

let context: AudioContext | null = null;

const getContext = (): AudioContext => {
  if (!context) {
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    context = new Ctor();
  }
  if (context.state === "suspended") void context.resume();
  return context;
};

// Sonidos sencillos y limpios, generados por el navegador (sin ruido de fondo)
const playSound = (kind: SoundKind, volume: number): Promise<void> =>
  new Promise((resolve) => {
    const ctx = getContext();
    const now = ctx.currentTime;
    const level = Math.max(volume, 0.0001);
    const gain = ctx.createGain();
    gain.connect(ctx.destination);
    const osc = ctx.createOscillator();
    osc.connect(gain);
    let duration = 0.6;

    if (kind === "drum") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(55, now + 0.18);
      gain.gain.setValueAtTime(level * 0.9, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      duration = 0.5;
    } else if (kind === "bell") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, now);
      const overtone = ctx.createOscillator();
      const overtoneGain = ctx.createGain();
      overtone.frequency.setValueAtTime(1760, now);
      overtoneGain.gain.setValueAtTime(level * 0.25, now);
      overtoneGain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
      overtone.connect(overtoneGain).connect(ctx.destination);
      overtone.start(now);
      overtone.stop(now + 1.1);
      gain.gain.setValueAtTime(level * 0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.1);
      duration = 1.1;
    } else {
      osc.type = "triangle";
      osc.frequency.setValueAtTime(523.25, now);
      const vibrato = ctx.createOscillator();
      const vibratoDepth = ctx.createGain();
      vibrato.frequency.setValueAtTime(5, now);
      vibratoDepth.gain.setValueAtTime(5, now);
      vibrato.connect(vibratoDepth).connect(osc.frequency);
      vibrato.start(now);
      vibrato.stop(now + 0.8);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(level * 0.5, now + 0.08);
      gain.gain.setValueAtTime(level * 0.5, now + 0.5);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
      duration = 0.8;
    }

    osc.onended = () => resolve();
    osc.start(now);
    osc.stop(now + duration);
  });

export const playSequence = async (
  kinds: SoundKind[],
  volume: number
): Promise<void> => {
  for (const kind of kinds) {
    await playSound(kind, volume);
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
};
