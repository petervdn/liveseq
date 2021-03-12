import type { GlobalStore } from '../store/globalStore';
import type { PlayerProps } from './player';
import { createPlayer } from './player';

type ConnectedPlayerProps = PlayerProps & {
  store: GlobalStore;
};

export const createConnectedPlayer = ({ store, ...playerProps }: ConnectedPlayerProps) => {
  const player = createPlayer(playerProps);

  // make player respond to state changes
  const subscriptionDisposers = [
    store.subscribe('play', ({ state }) => {
      if (!state.isPlaying) return;

      const { audioContext } = playerProps;

      audioContext.state === 'suspended' ? audioContext.resume().then(player.play) : player.play();
    }),

    store.subscribe('stop', ({ state }) => {
      !state.isPlaying && player.stop();
    }),
  ];

  const dispose = () => {
    subscriptionDisposers.forEach((disposeSubscription) => disposeSubscription());
    player.dispose();
  };

  return {
    dispose,
  };
};
