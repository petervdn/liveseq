import type { Hertz } from '../note/note';
import type { ChannelMixer } from '../mixer/mixer';

export const playTick = (
  channelMixer: ChannelMixer,
  frequency: Hertz,
  atTime: number,
  releaseTime = 0.1,
) => {
  const { audioContext } = channelMixer;
  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();
  osc.connect(gain);
  gain.connect(channelMixer.getGainNode());
  osc.start(atTime);

  gain.gain.linearRampToValueAtTime(0, atTime + releaseTime);

  // TODO: glide
  osc.frequency.setValueAtTime(frequency, atTime);
};
