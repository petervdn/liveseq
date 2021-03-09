import { createGlobalStore, LiveseqState } from './store/globalStore';
import { getAudioContext } from './utils/getAudioContext';
import { createConnectedPlayer } from './player/connectedPlayer';
import type { Project } from './project/projectStructure';
import { createProject } from './project/project';

export type LiveseqProps = {
  initialState?: Partial<LiveseqState>;
  project?: Project;
  audioContext?: AudioContext;
  lookAheadTime?: number;
  scheduleInterval?: number;
};

export type Liveseq = ReturnType<typeof createLiveseq>;

// Entry point of the library
// Manages:
//   - store initialization
//   - player initialization
//   - sample loading // TODO

export const createLiveseq = ({
  initialState,
  lookAheadTime,
  project,
  audioContext = getAudioContext(),
  scheduleInterval,
}: LiveseqProps = {}) => {
  const store = createGlobalStore(initialState);

  // TODO: better naming
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const projectInstance = createProject(project);

  // eslint-disable-next-line no-console
  console.log(
    'all the notes playing in the first 2 bars:',
    projectInstance.getNotesToPlay([0, 0, 0], [2, 0, 0]),
  );

  // just trying with a store setup
  // if you want the plain player just replace createConnectedPlayer with createPlayer
  // and then return the ...player instead of the store.actions
  const player = createConnectedPlayer({
    audioContext,
    store,
    lookAheadTime,
    scheduleInterval,
  });

  const dispose = () => {
    player.dispose();
    store.dispose();
  };

  // liveseq's API
  return {
    subscribe: store.subscribe,
    ...store.actions,
    dispose,
    audioContext,
  };
};
