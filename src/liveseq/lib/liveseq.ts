import { createGlobalStore, LiveseqState } from './store/globalStore';
import { getAudioContext } from './utils/getAudioContext';
import { createConnectedPlayer } from './player/connectedPlayer';

import type { Project } from './project/project';
import type { Bpm, TimeInSeconds } from './time/time';

import { getDefaultProject } from './project/getDefaultProject';
import { getScheduleItems } from './project/getScheduleItems';
import { getStartSlots } from './project/getStartSlots';
import { createEntities } from './entities/entities';

export type LiveseqProps = {
  initialState?: Partial<LiveseqState>;
  project?: Project;
  audioContext?: AudioContext;
  lookAheadTime?: TimeInSeconds;
  scheduleInterval?: TimeInSeconds;
  bpm?: Bpm;
};

export type Liveseq = ReturnType<typeof createLiveseq>;

export const createLiveseq = ({
  bpm = 120 as Bpm,
  initialState,
  lookAheadTime,
  project = getDefaultProject(),
  audioContext = getAudioContext(),
  scheduleInterval,
}: LiveseqProps = {}) => {
  const store = createGlobalStore(initialState);
  const entities = createEntities(project);

  // TODO: we're always using start slots, should be able to switch with scenes
  const startSlots = getStartSlots(project);
  const startSlotIds = startSlots.map(({ id }) => id);

  // const projectInstance = createProject(project);

  let currentBpm = bpm as Bpm;

  const setTempo = (bpm: Bpm) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    currentBpm = bpm;
  };

  // just trying with a store setup
  const player = createConnectedPlayer({
    getScheduleItems: (startTime, endTime) => {
      const scheduleItems = getScheduleItems(
        entities,
        startSlotIds,
        startTime,
        endTime,
        currentBpm,
      );
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
    getState: store.getState,
    setTempo,
    dispose,
    audioContext,
  };
};
