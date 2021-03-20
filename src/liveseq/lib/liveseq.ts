import { createGlobalStore, LiveseqState } from './store/globalStore';
import { getAudioContext } from './utils/getAudioContext';
import { createConnectedPlayer } from './player/connectedPlayer';

import type { SerializableProject } from './project/project';
import type { Bpm, TimeInSeconds } from './time/time';

import { getDefaultProject } from './project/getDefaultProject';

import { createEntities } from './entities/entities';
import { getScheduleItems } from './player/schedule.utils';
import { applyScenesToQueue, createQueue, getSlotsAtRange } from './queue/queue';
import { timeRangeToBeatsRange } from './time/beatsRange';

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
  const entities = createEntities(project, audioContext);

  const initialQueue = applyScenesToQueue(project.startScenes, entities, createQueue());

  // TODO: must update the queue as time progresses
  const currentQueue = initialQueue;
  let currentBpm = bpm as Bpm;

  const setTempo = (bpm: Bpm) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    currentBpm = bpm;
  };

  // just trying with a store setup
  const player = createConnectedPlayer({
    getScheduleItems: (startTime, endTime, previouslyScheduledNoteIds: Array<string>) => {
      const beatsRange = timeRangeToBeatsRange({ start: startTime, end: endTime }, currentBpm);

      const slotsRanges = getSlotsAtRange(beatsRange, entities, currentQueue);

      return slotsRanges.flatMap((slotRange) => {
        // TODO: we already have the Slot entities, so we should refactor getScheduleItems to accept that instead
        const slotIds = slotRange.slots.map(({ id }) => id);

        const scheduleItems = getScheduleItems(
          entities,
          slotIds,
          slotRange,
          currentBpm,
          previouslyScheduledNoteIds,
        );
        // console.log(scheduleItems);
        return scheduleItems;
      });
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
