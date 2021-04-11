import type React from 'react';
import { LiveseqProps, useLiveseq } from '../liveseq';
import { PlaybackButton } from './PlaybackButton';
import { Tempo } from './Tempo';
import { SchedulerInspector } from './SchedulerInspector/SchedulerInspector';
import { ProjectJson } from './Project/ProjectJson';
import { GlobalStyle } from './general/GlobalStyle';
import { Box } from './general/Box';

export const Liveseq: React.FunctionComponent<LiveseqProps> = (props) => {
  const { LiveseqProvider } = useLiveseq(props);

  return (
    <>
      <GlobalStyle />
      <LiveseqProvider>
        <Box position="relative" margin="auto 150px;" marginTop={30}>
          <Tempo />
          <PlaybackButton />
          <SchedulerInspector />
          <ProjectJson />
        </Box>
      </LiveseqProvider>
    </>
  );
};
