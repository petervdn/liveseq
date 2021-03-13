import type React from 'react';

export const PlaybackButton: React.FunctionComponent = () => {
  return (
    <>
      <button
        type="button"
        onClick={() => {
          // liveseq.play();
        }}
      >
        start
      </button>
      <button
        type="button"
        onClick={() => {
          // liveseq.stop();
        }}
      >
        stop
      </button>
    </>
  );
};
