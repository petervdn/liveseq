import { createStore, LiveseqState } from './store/store';
import { getAudioContext } from './utils/getAudioContext';

import type { SerializableProject } from './project/project';
import type { TimeInSeconds } from './time/time';

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
  // Omitting because that comes from the project
  // TODO: maybe should just add initialState to the project file
  initialState?: Partial<Omit<LiveseqState, 'slotPlaybackState'>>;
  project?: SerializableProject;
  audioContext?: AudioContext;
  lookAheadTime?: TimeInSeconds;
  scheduleInterval?: TimeInSeconds;
};

export type Liveseq = ReturnType<typeof createLiveseq>;

export const createLiveseq = ({
  initialState,
  lookAheadTime,
  project = getDefaultProject(),
  audioContext = getAudioContext(),
  scheduleInterval,
}: LiveseqProps = {}) => {
  const pubSub = createPubSub() as LiveseqPubSub;
  const store = createStore(
    {
      ...initialState,
      slotPlaybackState: project.slotPlaybackState,
    },
    pubSub,
  );
  const entities = createEntities(project, audioContext);

  const player = createPlayer({
    getScheduleItems: (timeRange: TimeRange, previouslyScheduledNoteIds: Array<string>) => {
      const currentBpm = store.selectors.getTempo();
      const currentSlotPlaybackState = store.selectors.getSlotPlaybackState();
      const beatsRange = timeRangeToBeatsRange(timeRange, currentBpm);

      const { nextSlotPlaybackState, scheduleItems } = getScheduleItemsWithinRange(
        beatsRange,
        entities,
        currentBpm,
        currentSlotPlaybackState,
        previouslyScheduledNoteIds,
      );

      store.actions.setSlotPlaybackState(nextSlotPlaybackState);

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
    ...store.selectors,
    play: player.play,
    stop: player.stop,
    setTempo: store.actions.setTempo,
    dispose,
    audioContext,
  };
};
