import type React from 'react';
import { LiveseqProps, useLiveseq } from '../liveseq';
import { PlaybackButton } from './PlaybackButton';
import { Tempo } from './Tempo';
import { SchedulerInspector } from './SchedulerInspector/SchedulerInspector';
import { ProjectJson } from './Project/ProjectJson';
import { GlobalStyle } from './general/GlobalStyle';
import { Box } from './general/Box';
import { Tabs } from './general/Tabs';

export const Liveseq: React.FunctionComponent<LiveseqProps> = (props) => {
  const { LiveseqProvider } = useLiveseq(props);

  return (
    <>
      <GlobalStyle />
      <LiveseqProvider>
        <Box position="relative" margin="auto 200px;" marginTop={30} paddingBottom={150}>
          <Tabs
            items={[
              {
                label: 'Scheduler',
                component: () => <SchedulerInspector />,
              },
              {
                label: 'Project',
                component: () => <ProjectJson />,
              },
            ]}
          />
        </Box>
        <Box position="fixed" bottom={0} padding={20} width="100%" style={{ background: '#444' }}>
          <Tempo />
          <PlaybackButton />
        </Box>
      </LiveseqProvider>
    </>
  );
};
