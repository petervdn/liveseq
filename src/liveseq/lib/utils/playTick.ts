export const playTick = (context: AudioContext, atTime: number, releaseTime = 0.1) => {
  const osc = context.createOscillator();
  const gain = context.createGain();
  osc.connect(gain);
  gain.connect(context.destination);
  osc.start(atTime);

  gain.gain.linearRampToValueAtTime(0, atTime + releaseTime);
};
