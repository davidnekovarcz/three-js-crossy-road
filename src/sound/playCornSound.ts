import { getAudioContext } from './playGameOverSound';

let lastPlay = 0;
const DEBOUNCE_MS = 100;

export async function playCornSound() {
  const now = performance.now();
  if (now - lastPlay < DEBOUNCE_MS) return;
  lastPlay = now;

  const ctx = getAudioContext();
  if (ctx.state === 'suspended') {
    try {
      await ctx.resume();
    } catch (e) {
      /* ignore */
    }
  }

  const duration = 0.22; // seconds
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();

  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(660, ctx.currentTime); // E5
  oscillator.frequency.linearRampToValueAtTime(
    1046,
    ctx.currentTime + duration
  ); // up to C6

  gain.gain.setValueAtTime(0.18, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0, ctx.currentTime + duration);

  oscillator.connect(gain).connect(ctx.destination);
  oscillator.start();
  oscillator.stop(ctx.currentTime + duration);

  oscillator.onended = () => {
    oscillator.disconnect();
    gain.disconnect();
  };
}
