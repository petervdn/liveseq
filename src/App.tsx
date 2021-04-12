import { Liveseq } from './components/Liveseq';
import { Beats, createLiveseq, getAbSwitch } from './liveseq';
import { addCompleteRouting } from './components/utils/addCompletRouting';
import { getMetronomeNotes } from './liveseq/projects/abSwitch';
import { GlobalStyle } from './components/general/GlobalStyle';
import { Tabs } from './components/general/Tabs';

const liveseq = createLiveseq({ project: { name: 'Test project' } });

addCompleteRouting({
  liveseq,
  notes: getMetronomeNotes(false),
  sceneStart: 0 as Beats,
  sceneEnd: 4 as Beats,
  name: 'test track',
});

const simpleMetronome = liveseq.getProject();

const projects = [
  {
    label: 'A/B Switch',
    project: getAbSwitch(),
  },
  {
    label: 'Simple Metronome',
    project: simpleMetronome,
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
