import { useEffect, useRef } from 'react';
import { createPlayer, Player, playTick } from './liveseq/player';

import { audioContext } from './liveseq/utils/audioContext';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function App() {
  const playerRef = useRef<Player>();
  useEffect(() => {
    playerRef.current = createPlayer(audioContext);
  }, []);

  return (
    <div>
      <button
        type="button"
        onClick={() => {
          audioContext.state === 'suspended' && audioContext.resume();
          setTimeout(() => {
            playTick(audioContext, 0);
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
