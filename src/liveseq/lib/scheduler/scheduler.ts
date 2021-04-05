import { getScheduleItemsWithinRange } from './utils/getScheduleItemsWithinRange';
import type { Note } from '../note/note';
import type { TimeInSeconds, Beats, Bpm } from '../types';
import type { MixerChannel } from '../mixer/mixer';
import type { Instrument } from '../entities/instrumentChannel';
import type { BeatsRange } from '../..';
import { getSlotPlaybackStatesWithinRange } from './utils/getSlotPlaybackStatesWithinRange';
import { addScenesToQueue } from './utils/addScenesToQueue';
import { removeScenesFromQueue } from './utils/removeScenesFromQueue';
import type { EntityEntries } from '../entities/entities';
import { timeRangeToBeatsRange } from '../time/beatsRange';
import { createPubSub } from '../utils/pubSub';
import { objectValues } from '../utils/objUtils';

// TODO: this is a bit repeated in player
export const createSchedulerEvents = () => {
  const events = {
    onSchedule: createPubSub<ScheduleData>(),
  };

  const dispose = () => {
    objectValues(events).forEach((pubSub) => pubSub.dispose());
  };

  return {
    ...events,
    dispose,
  };
};

export type ScheduleNote = Note & {
  startTime: TimeInSeconds;
  endTime: TimeInSeconds;
  schedulingId: string;
};
export type ScheduleItem = {
  notes: Array<ScheduleNote>;
  channelMixer: MixerChannel;
  instrument: Instrument;
};
export type ScheduleData = ReturnType<typeof getScheduleItemsWithinRange>;

type PlayingSlot = {
  slotId: string;
  start: Beats;
};
export type QueuedScene = BeatsRange & {
  sceneId: string;
};
export type SlotPlaybackState = {
  playingSlots: Array<PlayingSlot>;
  activeSceneIds: Array<string>;
  queuedScenes: Array<QueuedScene>;
};

export const createSlotPlaybackState = (): SlotPlaybackState => {
  const defaultSlotPlaybackState = {
    playingSlots: [],
    activeSceneIds: [],
    queuedScenes: [],
  };

  return defaultSlotPlaybackState;
};

export type SchedulerState = {
  slotPlaybackState: SlotPlaybackState;
};

type SchedulerProps = {
  entityEntries: EntityEntries;
  initialState: Partial<SchedulerState>;
};

export type Scheduler = ReturnType<typeof createScheduler>;

export const createScheduler = ({ initialState, entityEntries }: SchedulerProps) => {
  const schedulerEvents = createSchedulerEvents();
  let state: SchedulerState = {
    slotPlaybackState: initialState.slotPlaybackState || createSlotPlaybackState(),
  };

  let onStopCallbacks: Array<() => void> = [];

  const getSlotPlaybackState = () => {
    return state.slotPlaybackState;
  };

  // TODO: this is repeated in Player as well
  const setState = (newState: Partial<SchedulerState>) => {
    // mutation!
    state = {
      ...state,
      ...newState,
    };
    return state;
  };

  const setSlotPlaybackState = (slotPlaybackState: SlotPlaybackState) => {
    setState({
      slotPlaybackState,
    });
  };

  const addSceneToQueue = (scene: QueuedScene) => {
    // TODO: consider duplicates
    setState({
      slotPlaybackState: addScenesToQueue([scene], state.slotPlaybackState),
    });
  };

  const removeSceneFromQueue = (scene: QueuedScene) => {
    // TODO: consider duplicates
    setState({
      slotPlaybackState: removeScenesFromQueue([scene], state.slotPlaybackState),
    });
  };

  // move to scheduler
  // todo: probably make this an object for more efficient lookup
  // todo: how does this work when slots are played again later on (and loop count is reset)
  // ^ we could assign new ids at every play if that is an issue
  // but we gotta clean up based on some criteria
  let previouslyScheduledNoteIds: Array<string> = [];

  // move to scheduler
  const schedule = (songTime: TimeInSeconds, tempo: Bpm, lookAheadTime: TimeInSeconds) => {
    const beatsRange = timeRangeToBeatsRange(
      {
        start: songTime,
        end: (songTime + lookAheadTime) as TimeInSeconds,
      },
      tempo,
    );

    const stuff = getScheduleItemsWithinRange(
      beatsRange,
      entityEntries,
      tempo,
      getSlotPlaybackState(),
      previouslyScheduledNoteIds,
    );

    const { scheduleItems } = stuff;

    // TODO: first calculate one and then the other so we don't need stuff to be an obj
    setSlotPlaybackState(stuff.nextSlotPlaybackState);
    schedulerEvents.onSchedule.dispatch(stuff);

    // TODO: this will grow indefinitely so we need to clean up
    previouslyScheduledNoteIds = previouslyScheduledNoteIds.concat(
      scheduleItems.flatMap((scheduleItem) => {
        return scheduleItem.notes.map((note) => note.schedulingId);
      }),
    );

    scheduleItems.forEach((item) => {
      onStopCallbacks.push(item.instrument.schedule(item.notes, item.channelMixer));
    });
  };

  const loop = (
    getTime: () => TimeInSeconds,
    getTempo: () => Bpm,
    scheduleInterval: TimeInSeconds,
    lookAheadTime: TimeInSeconds,
  ) => {
    let timeoutId: number | null = null;

    const internalSchedule = () => {
      schedule(getTime(), getTempo(), lookAheadTime);
    };

    const handleSchedule = () => {
      timeoutId = window.setTimeout(() => {
        internalSchedule();
        handleSchedule();
      }, scheduleInterval * 1000);
    };

    internalSchedule();
    handleSchedule();

    return () => {
      // TODO: this should be done in the dispose as well
      onStopCallbacks.forEach((callback) => {
        callback();
      });
      onStopCallbacks = [];
      timeoutId !== null && window.clearTimeout(timeoutId);
    };
  };

  const dispose = () => {
    // TODO: kill loop immediately
    schedulerEvents.dispose();
  };

  return {
    setSlotPlaybackState,
    addSceneToQueue,
    removeSceneFromQueue,
    getSlotPlaybackState,
    getSlotPlaybackStatesWithinRange: (beatsRange: BeatsRange) => {
      return getSlotPlaybackStatesWithinRange(beatsRange, entityEntries, getSlotPlaybackState());
    },
    onSchedule: schedulerEvents.onSchedule.subscribe,
    loop,
    dispose,
  };
};
