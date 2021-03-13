import type React from 'react';
import { useLiveseq } from '../liveseq/react/hooks/useLiveseq';
import type { LiveseqProps } from '../liveseq/lib/liveseq';

export const Liveseq: React.FunctionComponent<LiveseqProps> = (props) => {
  // Note that LiveseqProvider is a WIP implementation
  // eventually will allow us to use hooks like useIsPlaying
  const { liveseq, LiveseqProvider } = useLiveseq(props);

  return (
    <div>
      <LiveseqProvider>
        <button
          type="button"
          onClick={() => {
            liveseq.play();
          }}
        >
          start
        </button>
        <button
          type="button"
          onClick={() => {
            liveseq.stop();
          }}
        >
          stop
        </button>
      </LiveseqProvider>
    </div>
  );
};
