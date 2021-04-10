import { Liveseq } from './components/Liveseq';
import { Beats, createLiveseq } from './liveseq';
import { addCompleteRouting } from './components/utils/addCompletRouting';
import { getMetronomeNotes } from './liveseq/projects/abSwitch';

const liveseq = createLiveseq({ project: { name: 'Test project' } });

addCompleteRouting({
  liveseq,
  notes: getMetronomeNotes(false),
  sceneEnd: 4 as Beats,
  sceneStart: 0 as Beats,
  name: 'test track',
});

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function App() {
  return <Liveseq project={liveseq.getProject()}></Liveseq>;
}
