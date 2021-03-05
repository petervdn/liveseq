import { useEffect, useRef } from 'react';
import { createPlayer, Player } from './liveseq/player';

export default function App() {
  const playerRef = useRef<Player>();
  useEffect(() => {
    playerRef.current = createPlayer({ lookAheadTime: 1200, interval: 1000 });
  }, []);

  return (
    <div>
      <button
        onClick={() => {
          playerRef.current?.play();
        }}
      >
        start
      </button>
      <button
        onClick={() => {
          playerRef.current?.stop();
        }}
      >
        stop
      </button>
    </div>
  );
}
