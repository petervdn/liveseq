import type React from 'react';
import { useLiveseq } from '../liveseq/react/useLiveseq';
import type { LiveseqProps } from '../liveseq';
import { PlaybackButton } from './PlaybackButton';

export const Liveseq: React.FunctionComponent<LiveseqProps> = (props) => {
  const { LiveseqProvider } = useLiveseq(props);

  return (
    <div>
      <LiveseqProvider>
        <PlaybackButton />
      </LiveseqProvider>
    </div>
  );
};
