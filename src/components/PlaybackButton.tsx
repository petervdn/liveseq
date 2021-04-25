import type React from 'react';
import { Button } from './general/Button';
import { usePlayback } from '../packages/liveseq/react/usePlayback';

export const PlaybackButton: React.FunctionComponent = () => {
  const { playbackState, stop, play, pause } = usePlayback();

  return (
    <>
      <Button
        isDisabled={playbackState === 'paused'}
        onClick={() => {
          pause();
        }}
      >
        pause
      </Button>
      <Button
        isDisabled={playbackState === 'stopped'}
        onClick={() => {
          stop();
        }}
      >
        stop
      </Button>
      <Button
        isDisabled={playbackState === 'playing'}
        onClick={() => {
          play();
        }}
      >
        play
      </Button>
    </>
  );
};
