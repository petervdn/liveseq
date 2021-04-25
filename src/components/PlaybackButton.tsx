import type React from 'react';
import { Button } from './general/Button';
import { usePlayback } from '../packages/sequencer/react/usePlayback';

export const PlaybackButton: React.FunctionComponent = () => {
  const { playbackState, stop, play, pause } = usePlayback();

  return (
    <>
      <Button
        isDisabled={playbackState === 'pause'}
        onClick={() => {
          pause();
        }}
      >
        pause
      </Button>
      <Button
        isDisabled={playbackState === 'stop'}
        onClick={() => {
          stop();
        }}
      >
        stop
      </Button>
      <Button
        isDisabled={playbackState === 'play'}
        onClick={() => {
          play();
        }}
      >
        play
      </Button>
    </>
  );
};
