import type { Liveseq } from '../liveseq';
import type { BeatsRange } from '../..';

// calling these functions should not cause liveseq to throw
export const isStable = (liveseq: Liveseq, mutate = false) => {
  liveseq.play();
  liveseq.stop();
  liveseq.setTempo(liveseq.getTempo());
  liveseq.getIsPlaying();
  liveseq.getProject();
  liveseq.getScheduleItemsInfo({ start: 0, end: 0 } as BeatsRange);
  mutate && liveseq.dispose();
};
