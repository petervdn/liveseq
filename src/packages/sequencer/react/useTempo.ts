import { useLiveseqContext } from './useLiveseq';
import { useCallbag } from './useCallbag';

export const useTempo = () => {
  const liveseq = useLiveseqContext();
  const tempo = useCallbag(liveseq.tempo$);

  return [tempo, liveseq.setTempo] as const;
};
