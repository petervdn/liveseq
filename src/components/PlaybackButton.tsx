import type React from 'react';
import { useEffect, useState } from 'react';
import { useLiveseqContext } from '../liveseq/react/useLiveseq';

export const PlaybackButton: React.FunctionComponent = () => {
  const liveseq = useLiveseqContext();
  const [playbackState, setPlaybackState] = useState(liveseq.getPlaybackState);

  useEffect(() => {
    return liveseq.onPlaybackChange(setPlaybackState);
  }, [liveseq]);

  return (
    <>
      {playbackState === 'playing' ? (
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
