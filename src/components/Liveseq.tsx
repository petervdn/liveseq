import { LiveseqProps, useLiveseq } from '../liveseq';
import { PlaybackButton } from './PlaybackButton';
import { Tempo } from './Tempo';
import { ProjectJson } from './Project/ProjectJson';
import { Box } from './general/Box';
import { Tabs } from './general/Tabs';
import { Timelines } from './Entities/Timelines';
import { SchedulerInspector } from './Scheduler/SchedulerInspector';

const viewerProps = {
  horizontalScale: 60,
  end: 32,
  height: 200,
};

export const Liveseq: React.FunctionComponent<LiveseqProps> = (props) => {
  const { LiveseqProvider } = useLiveseq(props);

  return (
    <LiveseqProvider>
      {/* start */}

      <Box position="relative" marginLeft="200px;" marginTop={30} paddingBottom={150}>
        <Tabs
          items={[
            {
              label: 'Scheduler',
              component: () => <SchedulerInspector {...viewerProps} />,
            },
            {
              label: 'Timelines',
              component: () => <Timelines {...viewerProps} />,
            },
            {
              label: 'Project',
              component: () => <ProjectJson />,
            },
          ]}
        />
      </Box>
      <Box position="fixed" bottom={0} padding={20} width="100%" backgroundColor="#23345a">
        <Tempo />
        <PlaybackButton />
      </Box>
    </LiveseqProvider>
  );
};
