// Shared AudioContext for all sounds
let sharedCtx;
export function getAudioContext() {
  if (!sharedCtx) {
    sharedCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return sharedCtx;
}

// Note sequence for 'tu du dum dum dum' (G4, E4, C4, D4, G3)
const NOTES = [392, 330, 262, 294, 196];
const DURATIONS = [0.18, 0.14, 0.14, 0.14, 0.32]; // seconds
const GAIN = 0.18;

export function playGameOverSound() {
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
    // Clean up oscillator after it stops
    osc.onended = () => {
      osc.disconnect();
      gain.disconnect();
    };
    currentTime += DURATIONS[i] * 0.95; // slight overlap for musicality
  }
} 
