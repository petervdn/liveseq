import { Liveseq } from './components/Liveseq';
import { Beats, createLiveseq } from './liveseq';
import { addCompleteRouting } from './components/utils/addCompletRouting';

const liveseq = createLiveseq({ project: { name: 'Test project' } });

addCompleteRouting({
  liveseq,
  notes: [],
  sceneEnd: 4 as Beats,
  sceneStart: 0 as Beats,
  name: 'test track',
});

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function App() {
  return <Liveseq project={liveseq.getProject()}></Liveseq>;
}
