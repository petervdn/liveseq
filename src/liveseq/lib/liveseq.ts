import { createStore } from './store/store';
import { getAudioContext } from './utils/getAudioContext';

import type { SerializableProject } from './project/project';
import type { TimeInSeconds } from './time/time';

import { getDefaultProject } from './project/getDefaultProject';
import { createEntities } from './entities/entities';
import { getScheduleItemsWithinRange } from './player/slotPlaybackState';
import { timeRangeToBeatsRange } from './time/beatsRange';
import type { TimeRange } from './time/timeRange';

import { createPlayer } from './player/player';
import { noop } from './utils/noop';

export type CommonProps = {
  id: string;
  name?: string;
  isEnabled?: boolean;
};

export type LiveseqCallbacks = {
  onPlay: () => void;
  onStop: () => void;
  onTempoChange: () => void;
};

const defaultCallbacks: LiveseqCallbacks = {
  onPlay: noop,
  onStop: noop,
  onTempoChange: noop,
};

export type LiveseqProps = Partial<LiveseqCallbacks> & {
  project?: SerializableProject;
  audioContext?: AudioContext;
  lookAheadTime?: TimeInSeconds;
  scheduleInterval?: TimeInSeconds;
};

export type Liveseq = ReturnType<typeof createLiveseq>;

export const createLiveseq = ({
  lookAheadTime,
  project = getDefaultProject(),
  audioContext = getAudioContext(),
  scheduleInterval,
  ...callbacksRest
}: LiveseqProps = {}) => {
  const callbacks = {
    ...defaultCallbacks,
    ...callbacksRest,
  };
  const store = createStore(project.initialState, callbacks);
  const entities = createEntities(project, audioContext);

  // TODO: better naming
  // separate function so we can make it part of the API (useful for testing as well)
  const getScheduleItems = (
    timeRange: TimeRange,
    previouslyScheduledNoteIds: Array<string> = [],
  ) => {
    const currentBpm = store.selectors.getTempo();
    const currentSlotPlaybackState = store.selectors.getSlotPlaybackState();
    const beatsRange = timeRangeToBeatsRange(timeRange, currentBpm);

    return getScheduleItemsWithinRange(
      beatsRange,
      entities,
      currentBpm,
      currentSlotPlaybackState,
      previouslyScheduledNoteIds,
    );
  };

  // TODO: better naming
  const getScheduleItemsInfo = (timeRange: TimeRange) => {
    return getScheduleItems(timeRange).scheduleItems.map((scheduleItem) => {
      return {
        notes: scheduleItem.notes,
        // TODO: add SerializableInstrument here as well
      };
    });
  };

  const player = createPlayer({
    getScheduleItems,
    onSchedule: ({ nextSlotPlaybackState }) => {
      store.actions.setSlotPlaybackState(nextSlotPlaybackState);
    },
    onPlay: () => {
      store.actions.play();
    },
    onStop: () => {
      store.actions.stop();
    },
    audioContext,
    lookAheadTime,
    scheduleInterval,
  });

  const dispose = () => {
    player.dispose();
    store.dispose();
  };

  // liveseq's API
  return {
    ...store.selectors,
    getScheduleItemsInfo,
    play: player.play,
    stop: player.stop,
    setTempo: store.actions.setTempo,
    dispose,
    audioContext,
  };
};
