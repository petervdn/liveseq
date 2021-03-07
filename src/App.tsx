import { useEffect, useRef } from 'react';
import { playTick } from './liveseq/player';
import { createLiveseq, Liveseq } from './liveseq/liveseq';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function App() {
  const liveseqRef = useRef<Liveseq>();

  useEffect(() => {
    liveseqRef.current = createLiveseq();
  }, []);

  return (
    <div>
      <button
        type="button"
        onClick={() => {
          const { audioContext } = liveseqRef.current!;
          audioContext.state === 'suspended' &&
            audioContext.resume().then(() => {
              playTick(audioContext, 0);
              liveseqRef.current?.play();
            });
        }}
      >
        start
      </button>
      <button
        type="button"
        onClick={() => {
          liveseqRef.current?.stop();
        }}
      >
        stop
      </button>
    </div>
  );
}
