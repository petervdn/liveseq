import { useLiveseqContext } from './useLiveseq';
import { useCallbag } from './useCallbag';

export const useBeatsRange = () => {
  const liveseq = useLiveseqContext();
  return useCallbag(liveseq.beatsRange$);
};
