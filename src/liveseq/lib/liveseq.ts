import { createGlobalStore, LiveseqState } from './store/globalStore';
import { getAudioContext } from './utils/getAudioContext';
import { createConnectedPlayer } from './player/connectedPlayer';

import type { SerializableProject } from './project/project';
import type { Beats, Bpm, TimeInSeconds } from './time/time';

import { getDefaultProject } from './project/getDefaultProject';

import { createEntities } from './entities/entities';
import { getScheduleItems } from './player/schedule.utils';
import {
  addScenesToQueue,
  applyScenesToSlotPlaybackState,
  createSlotPlaybackState,
  getSlotsWithinRange,
} from './slotPlaybackState/slotPlaybackState';
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
  const startSlotPlaybackState = applyScenesToSlotPlaybackState(
    startScenes,
    entities,
    createSlotPlaybackState(),
    0 as Beats,
  );

  // TODO: instead of startScenes we need a scenesSlotPlaybackState or some other way to place them
  // to switch after some time
  const initialSlotPlaybackState = addScenesToQueue(
    [
      {
        start: 4 as Beats,
        end: Infinity as Beats,
        sceneId: 'scene_2',
      },
    ],
    startSlotPlaybackState,
  );

  let currentSlotPlaybackState = initialSlotPlaybackState;
  let currentBpm = bpm as Bpm;

  const setTempo = (bpm: Bpm) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    currentBpm = bpm;
  };

  // just trying with a store setup
  const player = createConnectedPlayer({
    getScheduleItems: (timeRange, previouslyScheduledNoteIds: Array<string>) => {
      const beatsRange = timeRangeToBeatsRange(timeRange, currentBpm);

      // we must split the beatsRange into sections where the playing slots in the slotPlaybackState changes
      const slotsRanges = getSlotsWithinRange(beatsRange, entities, currentSlotPlaybackState);

      // the first slotPlaybackState becomes the new slotPlaybackState since we always move ahead in time
      currentSlotPlaybackState = slotsRanges[0].slotPlaybackState;

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
