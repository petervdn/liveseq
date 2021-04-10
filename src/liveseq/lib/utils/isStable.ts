import type { Liveseq } from '../liveseq';

// calling these functions should not cause liveseq to throw
export const isStable = (liveseq: Liveseq, mutate = false) => {
  liveseq.play();
  liveseq.stop();
  liveseq.setTempo(liveseq.getTempo());
  liveseq.getIsPlaying();
  liveseq.getProject();
  // liveseq.getScheduledata({ start: 0, end: 0 } as BeatsRange, );
  mutate && liveseq.dispose();
};
