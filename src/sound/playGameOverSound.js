export function playGameOverSound() {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const duration = 0.7; // seconds
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();

  oscillator.type = 'triangle';
  oscillator.frequency.setValueAtTime(660, ctx.currentTime); // E5
  oscillator.frequency.linearRampToValueAtTime(220, ctx.currentTime + duration); // down to A3

  gain.gain.setValueAtTime(0.18, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0, ctx.currentTime + duration);

  oscillator.connect(gain).connect(ctx.destination);
  oscillator.start();
  oscillator.stop(ctx.currentTime + duration);

  oscillator.onended = () => ctx.close();
} 
