import { useEffect, useRef } from 'react';
import { createLiveseq, Liveseq } from './liveseq';
import { abSwitch } from './projects/abSwitch';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function App() {
  const liveseqRef = useRef<Liveseq>();

  useEffect(() => {
    liveseqRef.current = createLiveseq({
      project: abSwitch,
    });
  }, []);

  return (
    <div>
      <button
        type="button"
        onClick={() => {
          liveseqRef.current?.play();
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
