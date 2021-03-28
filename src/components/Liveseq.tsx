import type React from 'react';
import { useLiveseq } from '../liveseq';
import type { PartialLiveseqProps } from '../liveseq';
import { PlaybackButton } from './PlaybackButton';

export const Liveseq: React.FunctionComponent<PartialLiveseqProps> = (props) => {
  const { LiveseqProvider } = useLiveseq(props);

  return (
    <div>
      <LiveseqProvider>
        <PlaybackButton />
      </LiveseqProvider>
    </div>
  );
};
