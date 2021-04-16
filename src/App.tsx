import { Liveseq } from './components/Liveseq';
import { Beats, createLiveseq, getAbSwitch } from './liveseq';
import { addCompleteRouting } from './components/utils/addCompletRouting';
import { getMetronomeNotes } from './liveseq/projects/abSwitch';
import { GlobalStyle } from './components/general/GlobalStyle';
import { Tabs } from './components/general/Tabs';
import { times } from './liveseq/lib/utils/times';

const liveseq = createLiveseq({ project: { name: 'Test project' } });

const offset = 4;
times(2, (index) => {
  addCompleteRouting({
    liveseq,
    notes: getMetronomeNotes(index % 2 === 1),
    sceneStart: (offset * index) as Beats,
    name: `Routing ${index}`,
  });
});

const simpleMetronome = liveseq.getProject();

const projects = [
  {
    label: 'Simple Metronome',
    project: simpleMetronome,
  },
  {
    label: 'A/B Switch',
    project: getAbSwitch(),
  },
];

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function App() {
  return (
    <>
      <GlobalStyle />
      <Tabs
        items={projects.map(({ label, project }) => ({
          label,
          component: () => <Liveseq key={label} project={project} />,
        }))}
      />
    </>
  );
}
