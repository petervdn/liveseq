import { createGlobalStore, LiveseqState } from './store/globalStore';
import { getAudioContext } from './utils/getAudioContext';
import { createConnectedPlayer } from './player/connectedPlayer';
import type { Project } from './project/projectStructure';
import { createProject } from './project/project';
import type { Bpm } from './utils/musicTime';

export type LiveseqProps = {
  initialState?: Partial<LiveseqState>;
  project?: Project;
  audioContext?: AudioContext;
  lookAheadTime?: number;
  scheduleInterval?: number;
  bpm?: number;
};

export type Liveseq = ReturnType<typeof createLiveseq>;

export const createLiveseq = ({
  bpm = 120,
  initialState,
  lookAheadTime,
  project,
  audioContext = getAudioContext(),
  scheduleInterval,
}: LiveseqProps = {}) => {
  const store = createGlobalStore(initialState);
  const projectInstance = createProject(project);

  let currentBpm = bpm as Bpm;

  const setTempo = (bpm: Bpm) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    currentBpm = bpm;
  };

  // just trying with a store setup
  const player = createConnectedPlayer({
    getScheduleItems: (startTime, endTime) => {
      const scheduleItems = projectInstance.getScheduleItems(startTime, endTime, currentBpm);
      // eslint-disable-next-line no-console
      console.log(scheduleItems);
      return scheduleItems;
    },
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
    setTempo,
    dispose,
    audioContext,
  };
};
