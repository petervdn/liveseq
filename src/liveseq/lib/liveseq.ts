import { createStore, LiveseqState } from './store/store';
import { getAudioContext } from './utils/getAudioContext';

import type { SerializableProject } from './project/project';
import type { Bpm, TimeInSeconds } from './time/time';

import { getDefaultProject } from './project/getDefaultProject';
import { createEntities } from './entities/entities';
import { getScheduleItemsWithinRange } from './player/slotPlaybackState';
import { timeRangeToBeatsRange } from './time/beatsRange';
import type { TimeRange } from './time/timeRange';
import { createPubSub, LiveseqPubSub } from './utils/pubSub';
import { createPlayer } from './player/player';

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
  // TODO: move types somewhere else instead of inlining here
  const pubSub = createPubSub() as LiveseqPubSub;
  const store = createStore(initialState, pubSub);
  const entities = createEntities(project, audioContext);
  const initialSlotPlaybackState = project.slotPlaybackState;

  let currentSlotPlaybackState = initialSlotPlaybackState;
  let currentBpm = bpm as Bpm;

  const setTempo = (bpm: Bpm) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    currentBpm = bpm;
  };

  const player = createPlayer({
    getScheduleItems: (timeRange: TimeRange, previouslyScheduledNoteIds: Array<string>) => {
      const beatsRange = timeRangeToBeatsRange(timeRange, currentBpm);

      const { nextSlotPlaybackState, scheduleItems } = getScheduleItemsWithinRange(
        beatsRange,
        entities,
        currentBpm,
        currentSlotPlaybackState,
        previouslyScheduledNoteIds,
      );

      currentSlotPlaybackState = nextSlotPlaybackState;

      return scheduleItems;
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
    subscribe: pubSub.subscribe,
    getState: store.getState,
    play: player.play,
    stop: player.stop,
    setTempo,
    dispose,
    audioContext,
  };
};
