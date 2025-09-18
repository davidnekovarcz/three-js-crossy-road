// Shared AudioContext for all sounds
import { getAudioContext } from './playGameOverSound';

const NOTES = [660, 784]; // E5, G5
const DURATIONS = [0.12, 0.12];
const GAIN = 0.14;

export function playHorn() {
  const ctx = getAudioContext();
  let currentTime = ctx.currentTime;
  for (let i = 0; i < NOTES.length; i++) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(NOTES[i], currentTime);
    gain.gain.setValueAtTime(GAIN, currentTime);
    gain.gain.linearRampToValueAtTime(0, currentTime + DURATIONS[i]);
    osc.connect(gain).connect(ctx.destination);
    osc.start(currentTime);
    osc.stop(currentTime + DURATIONS[i]);
    osc.onended = () => {
      osc.disconnect();
      gain.disconnect();
    };
    currentTime += DURATIONS[i] * 0.92;
  }
}
