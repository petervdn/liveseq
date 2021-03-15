import { createGlobalStore, LiveseqState } from './store/globalStore';
import { getAudioContext } from './utils/getAudioContext';
import { createConnectedPlayer } from './player/connectedPlayer';

import type { SerializableProject } from './project/project';
import type { Bpm, TimeInSeconds } from './time/time';

import { getDefaultProject } from './project/getDefaultProject';

import { createEntities, getSlotsBySceneIds } from './entities/entities';
import { getScheduleItems } from './player/schedule.utils';

export type CommonProps = {
  id: string;
  name?: string;
  isEnabled?: boolean;
};

export type LiveseqProps = {
  initialState?: Partial<LiveseqState>;
  project?: SerializableProject;
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
  const startSlots = getSlotsBySceneIds(entities, project.startScenes);
  const startSlotIds = startSlots.map(({ id }) => id);

  let currentBpm = bpm as Bpm;

  const setTempo = (bpm: Bpm) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    currentBpm = bpm;
  };

  // just trying with a store setup
  const player = createConnectedPlayer({
    getScheduleItems: (startTime, endTime, previouslyScheduledNoteIds: Array<string>) => {
      const scheduleItems = getScheduleItems(
        entities,
        startSlotIds,
        startTime,
        endTime,
        currentBpm,
        previouslyScheduledNoteIds,
      );

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
