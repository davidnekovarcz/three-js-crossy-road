export function playCornSound() {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const duration = 0.22; // seconds
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();

  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(660, ctx.currentTime); // E5
  oscillator.frequency.linearRampToValueAtTime(1046, ctx.currentTime + duration); // up to C6

  gain.gain.setValueAtTime(0.18, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0, ctx.currentTime + duration);

  oscillator.connect(gain).connect(ctx.destination);
  oscillator.start();
  oscillator.stop(ctx.currentTime + duration);

  oscillator.onended = () => ctx.close();
} 
