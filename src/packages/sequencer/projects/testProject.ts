import { createLiveseq } from '../lib/liveseq';
import { times } from '../../core/lib/utils/times';
import { addCompleteRouting } from './utils/addCompletRouting';
import { getMetronomeNotes } from './abSwitch';
import type { Beats } from '../../core/lib/types';

export const getTestProject = () => {
  const liveseq = createLiveseq({ project: { name: 'Test Project' } });

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
