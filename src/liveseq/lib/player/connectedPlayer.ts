import type { GlobalStore } from '../store/globalStore';
import { ActionType } from '../store/globalStore';
import type { PlayerProps } from './player';
import { createPlayer } from './player';

type ConnectedPlayerProps = PlayerProps & {
  store: GlobalStore;
};

export const createConnectedPlayer = ({ store, ...playerProps }: ConnectedPlayerProps) => {
  const player = createPlayer(playerProps);

  // make player respond to state changes
  const subscriptionDisposers = [
    store.subscribe(ActionType.Play, ({ state }) => {
      state.isPlaying && player.play();
    }),
    store.subscribe(ActionType.Stop, ({ state }) => {
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
