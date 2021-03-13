import type React from 'react';
import { useLiveseq } from '../liveseq/react/useLiveseq';
import type { LiveseqProps } from '../liveseq';
import { PlaybackButton } from './PlaybackButton';

export const Liveseq: React.FunctionComponent<LiveseqProps> = (props) => {
  // Note that LiveseqProvider is a WIP implementation
  // eventually will allow us to use hooks like useIsPlaying
  const { LiveseqProvider } = useLiveseq(props);

  return (
    <div>
      <LiveseqProvider>
        <PlaybackButton />
      </LiveseqProvider>
    </div>
  );
};
