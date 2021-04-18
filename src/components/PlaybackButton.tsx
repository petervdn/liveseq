import type React from 'react';
import { Button } from './general/Button';
import { usePlayback } from '../liveseq/react/usePlayback';

export const PlaybackButton: React.FunctionComponent = () => {
  const { playbackState, stop, play } = usePlayback();

  return (
    <>
      {playbackState === 'playing' ? (
        <Button
          onClick={() => {
            stop();
          }}
        >
          stop
        </Button>
      ) : (
        <Button
          onClick={() => {
            play();
          }}
        >
          start
        </Button>
      )}
    </>
  );
};
