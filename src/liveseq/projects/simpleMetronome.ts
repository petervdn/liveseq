import { createLiveseq } from '../lib/liveseq';
import { times } from '../lib/utils/times';
import { addCompleteRouting } from './utils/addCompletRouting';
import { getMetronomeNotes } from './abSwitch';
import type { Beats } from '../lib/types';

export const getSimpleMetronome = () => {
  const liveseq = createLiveseq({ project: { name: 'Simple Metronome' } });

  const offset = 4;
  times(3, (index) => {
    addCompleteRouting({
      liveseq,
      notes: getMetronomeNotes(index % 2 === 1),
      sceneStart: (offset * index) as Beats,
      name: `Routing ${index}`,
    });
  });

  return liveseq.getProject();
};
