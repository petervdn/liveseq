import { useEffect, useRef } from 'react';
import { createPlayer, Player, playTick } from './liveseq/player';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const context = new (window.AudioContext || (window as any).webkitAudioContext)();

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function App() {
  const playerRef = useRef<Player>();
  useEffect(() => {
    playerRef.current = createPlayer(context);
  }, []);

  return (
    <div>
      <button
        type="button"
        onClick={() => {
          context.state === 'suspended' && context.resume();
          setTimeout(() => {
            playTick(context, 0);
            playerRef.current?.play();
          }, 10);
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
