import type React from 'react';
import { LiveseqProps, useLiveseq } from '../liveseq';
import { PlaybackButton } from './PlaybackButton';
import { EntityInspector } from './EntityInspector/EntityInspector';
import { Tempo } from './Tempo';
import { SchedulerInspector } from './SchedulerInspector';

export const Liveseq: React.FunctionComponent<LiveseqProps> = (props) => {
  const { LiveseqProvider } = useLiveseq(props);

  return (
    <div>
      <LiveseqProvider>
        <Tempo />
        <PlaybackButton />
        <SchedulerInspector />
        <EntityInspector />
      </LiveseqProvider>
    </div>
  );
};
