import type { Hertz } from '../../note/note';

export const playTick = (
  audioContext: AudioContext,
  frequency: Hertz,
  atTime: number,
  releaseTime = 0.1,
) => {
  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();
  osc.connect(gain);
  gain.connect(audioContext.destination);
  osc.start(atTime);

  gain.gain.linearRampToValueAtTime(0, atTime + releaseTime);

  // TODO: glide
  osc.frequency.setValueAtTime(frequency, atTime);
};
