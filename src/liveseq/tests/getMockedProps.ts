import { AudioContext } from 'standardized-audio-context-mock';
import type { LiveseqProps } from '../lib/liveseq';

export const getMockedProps = (): Pick<LiveseqProps, 'audioContext'> => {
  return { audioContext: new AudioContext() as never };
};
