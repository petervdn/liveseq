import { Liveseq } from './components/Liveseq';
import { createAudioContext, getAbSwitch } from './packages/sequencer';
import { GlobalStyle } from './components/general/GlobalStyle';
import { Tabs } from './components/general/Tabs';
import { getSimpleMetronome } from './packages/sequencer/projects/simpleMetronome';
import { getTestProject } from './packages/sequencer/projects/testProject';

const projects = [getSimpleMetronome(), getTestProject(), getAbSwitch()].map((project) => ({
  label: project.name,
  project,
}));

const audioContext = createAudioContext();

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function App() {
  return (
    <>
      <GlobalStyle />
      <Tabs
        items={projects.map(({ label, project }) => ({
          label,
          component: () => (
            <Liveseq
              key={label}
              project={project}
              audioContext={audioContext}
              // lookAheadTime={100 as TimeInSeconds}
              // scheduleInterval={50 as TimeInSeconds}
            />
          ),
        }))}
      />
    </>
  );
}
