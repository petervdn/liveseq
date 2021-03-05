import { useEffect, useRef } from 'react';
import { createPlayer, Player } from './liveseq/player';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function App() {
  const playerRef = useRef<Player>();
  useEffect(() => {
    playerRef.current = createPlayer();
  }, []);

  return (
    <div>
      <button
        type="button"
        onClick={() => {
          playerRef.current?.play();
        }}
      >
        start
      </button>
      <button
        type="button"
        onClick={() => {
          playerRef.current?.stop();
        }}
      >
        stop
      </button>
    </div>
  );
}
