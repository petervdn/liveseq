import type React from 'react';
import { LiveseqProps, useLiveseq } from '../liveseq';
import { PlaybackButton } from './PlaybackButton';
import { Tempo } from './Tempo';
import { SchedulerInspector } from './SchedulerInspector/SchedulerInspector';
import { ProjectJson } from './Project/ProjectJson';

export const Liveseq: React.FunctionComponent<LiveseqProps> = (props) => {
  const { LiveseqProvider } = useLiveseq(props);

  return (
    <div>
      <LiveseqProvider>
        <Tempo />
        <PlaybackButton />
        <SchedulerInspector />
        <ProjectJson />
      </LiveseqProvider>
    </div>
  );
};
