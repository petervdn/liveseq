import { createLiveseq } from '../lib/liveseq';
import { addCompleteRouting } from './utils/addCompletRouting';
import { getMetronomeNotes } from './abSwitch';
import type { Beats } from '../../core/lib/types';

export const getSimpleMetronome = () => {
  const liveseq = createLiveseq({ project: { name: 'Simple Metronome' } });

  addCompleteRouting({
    liveseq,
    notes: getMetronomeNotes(true),
    sceneStart: 0 as Beats,
    name: `Routing ${0}`,
  });

  return liveseq.getProject();
};
