import type React from 'react';
import { useEffect, useState } from 'react';
import { useLiveseqContext } from '../liveseq/react/useLiveseq';

export const PlaybackButton: React.FunctionComponent = () => {
  const liveseq = useLiveseqContext();
  const [isPlaying, setIsPlaying] = useState(liveseq.getIsPlaying);

  useEffect(() => {
    const disposers = [
      liveseq.subscribe('playbackChange', (state) => {
        setIsPlaying(state.isPlaying);
      }),
    ];

    return () => {
      disposers.forEach((dispose) => dispose());
    };
  }, [liveseq]);

  return (
    <>
      {isPlaying ? (
        <button
          type="button"
          onClick={() => {
            liveseq.stop();
          }}
        >
          stop
        </button>
      ) : (
        <button
          type="button"
          onClick={() => {
            liveseq.play();
          }}
        >
          start
        </button>
      )}
    </>
  );
};
