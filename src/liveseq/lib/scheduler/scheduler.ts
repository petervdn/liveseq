import type { Note } from '../note/note';
import type { TimeInSeconds, Beats, Bpm } from '../types';
import type { MixerChannel } from '../mixer/mixer';
import type { Instrument } from '../entities/instrumentChannel';
import type { BeatsRange } from '../..';
import { addScenesToQueue } from './utils/addScenesToQueue';
import { removeScenesFromQueue } from './utils/removeScenesFromQueue';
import type { EntityEntries } from '../entities/entities';
import { timeRangeToBeatsRange } from '../time/beatsRange';
import { createPubSub } from '../utils/pubSub';
import { objectValues } from '../utils/objUtils';
import { getQueuedScenesWithinRange } from './utils/getQueuedScenesWithinRange';
import { groupQueuedScenesByStart } from './utils/groupQueuedScenesByStart';
import { getAppliedStatesForQueuedScenes } from './utils/getAppliedStatesForQueuedScenes';
import { getNotesForInstrumentInTimeRange } from '../entities/utils/getNotesForInstrumentInTimeRange';

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

export type ScheduleData = {
  slotPlaybackStateRanges: Array<BeatsRange & SlotPlaybackState>;
  scheduleItems: Array<ScheduleItem>;
};

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

  // todo: probably make this an object for more efficient lookup
  // todo: how does this work when slots are played again later on (and loop count is reset)
  // ^ we could assign new ids at every play if that is an issue
  // but we gotta clean up based on some criteria
  const previouslyScheduledNoteIds: Array<string> = [];

  const schedule = (scheduleItems: Array<ScheduleItem>) => {
    scheduleItems.forEach((item) => {
      item.notes.forEach((note) => {
        if (previouslyScheduledNoteIds.includes(note.schedulingId)) return;

        previouslyScheduledNoteIds.push(note.schedulingId);
        onStopCallbacks.push(item.instrument.schedule(note, item.channelMixer));

        // eslint-disable-next-line no-console
        console.log('scheduling', note.schedulingId);
      });
    });
  };

  const getScheduleDataWithinRange = (beatsRange: BeatsRange, tempo: Bpm): ScheduleData => {
    const slotPlaybackState = getSlotPlaybackState();
    const queuedScenes = getQueuedScenesWithinRange(beatsRange, slotPlaybackState);
    const queuedScenesByStart = groupQueuedScenesByStart(beatsRange.start, queuedScenes);
    const slotPlaybackStateRanges = getAppliedStatesForQueuedScenes(
      beatsRange,
      queuedScenesByStart,
      entityEntries,
      slotPlaybackState,
    );

    // get schedule items according to split slotPlaybackState ranges and their playing slots
    const scheduleItems = slotPlaybackStateRanges.flatMap((slotRange) => {
      const slotIds = slotRange.playingSlots.map((slot) => slot.slotId);

      return getNotesForInstrumentInTimeRange(entityEntries, slotIds, slotRange, tempo);
    });

    return {
      slotPlaybackStateRanges,
      scheduleItems,
    };
  };

  const stopLoop = () => {
    onStopCallbacks.forEach((callback) => {
      callback();
    });
    onStopCallbacks = [];
  };

  const loop = (
    getTime: () => TimeInSeconds,
    getTempo: () => Bpm,
    scheduleInterval: TimeInSeconds,
    lookAheadTime: TimeInSeconds,
  ) => {
    let timeoutId: number | null = null;

    const internalSchedule = () => {
      const songTime = getTime();
      const tempo = getTempo();
      const beatsRange = timeRangeToBeatsRange(
        {
          start: songTime,
          end: (songTime + lookAheadTime) as TimeInSeconds,
        },
        tempo,
      );

      // we must split the beatsRange into sections where the playing slots in the slotPlaybackState changes
      const scheduleData = getScheduleDataWithinRange(beatsRange, tempo);

      // TODO: not sure this logic is correct, we gotta update the state
      // the first slotPlaybackState becomes the new slotPlaybackState assuming we always move ahead in time
      // setSlotPlaybackState(scheduleData.slotPlaybackStateRanges[0]);
      schedule(scheduleData.scheduleItems);

      schedulerEvents.onSchedule.dispatch(scheduleData);
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
      stopLoop();
      // TODO: move this to stopLoop
      timeoutId !== null && window.clearTimeout(timeoutId);
    };
  };

  const dispose = () => {
    stopLoop();
    schedulerEvents.dispose();
  };

  return {
    setSlotPlaybackState,
    addSceneToQueue,
    removeSceneFromQueue,
    getSlotPlaybackState,
    getScheduleDataWithinRange,
    onSchedule: schedulerEvents.onSchedule.subscribe,
    schedule,
    loop,
    dispose,
  };
};
