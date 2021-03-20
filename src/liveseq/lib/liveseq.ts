import { createGlobalStore, LiveseqState } from './store/globalStore';
import { getAudioContext } from './utils/getAudioContext';
import { createConnectedPlayer } from './player/connectedPlayer';

import type { SerializableProject } from './project/project';
import type { Beats, Bpm, TimeInSeconds } from './time/time';

import { getDefaultProject } from './project/getDefaultProject';

import { createEntities } from './entities/entities';
import { getScheduleItems } from './player/schedule.utils';
import { applyScenesToQueue, createQueue, getSlotsWithinRange } from './queue/queue';
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

  const startScenes = project.startScenes.map((sceneId) => entities.scenes[sceneId]);
  const initialQueue = applyScenesToQueue(startScenes, entities, createQueue(), 0 as Beats);

  // TODO: must update the queue as time progresses
  const currentQueue = initialQueue;
  let currentBpm = bpm as Bpm;

  const setTempo = (bpm: Bpm) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    currentBpm = bpm;
  };

  // just trying with a store setup
  const player = createConnectedPlayer({
    getScheduleItems: (timeRange, previouslyScheduledNoteIds: Array<string>) => {
      const beatsRange = timeRangeToBeatsRange(timeRange, currentBpm);

      // we must split the beatsRange into sections where the playing slots in the queue changes
      const slotsRanges = getSlotsWithinRange(beatsRange, currentQueue, entities);
      // console.log(slotsRanges);

      // then we get schedule items according to those split ranges and their playing slots
      return slotsRanges.flatMap((slotRange) => {
        const slotIds = slotRange.slots.map((slot) => slot.slotId);

        return getScheduleItems(
          entities,
          slotIds,
          slotRange,
          currentBpm,
          previouslyScheduledNoteIds,
        );
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
