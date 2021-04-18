import type React from 'react';
import { useState } from 'react';
import { LiveseqProps, useLiveseq } from '../liveseq';
import { PlaybackButton } from './PlaybackButton';
import { Tempo } from './Tempo';
import { SchedulerInspector } from './Viewers/SchedulerInspector';
import { ProjectJson } from './Project/ProjectJson';
import { Box } from './general/Box';
import { Tabs } from './general/Tabs';
import { Timelines } from './Viewers/Timelines';

const viewerProps = {
  horizontalScale: 60,
  totalBeats: 32,
  height: 200,
};

export const Liveseq: React.FunctionComponent<LiveseqProps> = (props) => {
  const { LiveseqProvider } = useLiveseq(props);
  const [start, setStart] = useState(0);
  const [totalBeats, setTotalBeats] = useState(viewerProps.totalBeats);

  return (
    <LiveseqProvider>
      {/* start */}
      <input
        type="range"
        onChange={(event) => {
          const unit = parseInt(event.target.value, 10) / 100;
          setStart(Math.round(viewerProps.totalBeats * unit));
        }}
      />
      {/* end */}
      <input
        type="range"
        onChange={(event) => {
          const unit = parseInt(event.target.value, 10) / 100;
          setTotalBeats(Math.round(viewerProps.totalBeats * unit));
        }}
      />

      <Box position="relative" marginLeft="200px;" marginTop={30} paddingBottom={150}>
        <Tabs
          items={[
            {
              label: 'Scheduler',
              component: () => (
                <SchedulerInspector {...viewerProps} start={start} totalBeats={totalBeats} />
              ),
            },
            {
              label: 'Timelines',
              component: () => <Timelines {...viewerProps} totalBeats={totalBeats} />,
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
