import { createGlobalStore, LiveseqState } from './store/globalStore';
import { getAudioContext } from './utils/getAudioContext';
import { createConnectedPlayer } from './player/connectedPlayer';

import type { SerializableProject } from './project/project';
import type { Bpm, TimeInSeconds } from './time/time';

import { getDefaultProject } from './project/getDefaultProject';
import { createEntities } from './entities/entities';
import { getScheduleItems } from './slotPlaybackState/slotPlaybackState';
import { timeRangeToBeatsRange } from './time/beatsRange';
import type { TimeRange } from './time/timeRange';

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
  const initialSlotPlaybackState = project.slotPlaybackState;

  let currentSlotPlaybackState = initialSlotPlaybackState;
  let currentBpm = bpm as Bpm;

  const setTempo = (bpm: Bpm) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    currentBpm = bpm;
  };

  // just trying with a store setup
  const player = createConnectedPlayer({
    getScheduleItems: (timeRange: TimeRange, previouslyScheduledNoteIds: Array<string>) => {
      const beatsRange = timeRangeToBeatsRange(timeRange, currentBpm);

      const { nextSlotPlaybackState, scheduleItems } = getScheduleItems(
        beatsRange,
        entities,
        currentBpm,
        currentSlotPlaybackState,
        previouslyScheduledNoteIds,
      );

      currentSlotPlaybackState = nextSlotPlaybackState;

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
