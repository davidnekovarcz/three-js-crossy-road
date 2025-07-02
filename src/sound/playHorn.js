export function playHorn() {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const duration = 0.25; // seconds
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();

  oscillator.type = 'square';
  oscillator.frequency.setValueAtTime(440, ctx.currentTime); // A4
  oscillator.frequency.setValueAtTime(392, ctx.currentTime + 0.12); // G4 (slide down for 'honk' effect)

  gain.gain.setValueAtTime(0.2, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0, ctx.currentTime + duration);

  oscillator.connect(gain).connect(ctx.destination);
  oscillator.start();
  oscillator.stop(ctx.currentTime + duration);

  oscillator.onended = () => ctx.close();
} 
