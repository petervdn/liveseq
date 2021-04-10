import type React from 'react';
import { useEffect, useState } from 'react';
import { useLiveseqContext } from '../liveseq/react/useLiveseq';
import { Button } from './general/Button';

export const PlaybackButton: React.FunctionComponent = () => {
  const liveseq = useLiveseqContext();
  const [playbackState, setPlaybackState] = useState(liveseq.getPlaybackState);

  useEffect(() => {
    return liveseq.onPlaybackChange(setPlaybackState);
  }, [liveseq]);

  return (
    <>
      {playbackState === 'playing' ? (
        <Button
          onClick={() => {
            liveseq.stop();
          }}
        >
          stop
        </Button>
      ) : (
        <Button
          onClick={() => {
            liveseq.play();
          }}
        >
          start
        </Button>
      )}
    </>
  );
};
