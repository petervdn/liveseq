import type { getScheduleItemsWithinRange } from './utils/getScheduleItemsWithinRange';
import type { Note } from '../note/note';
import type { TimeInSeconds, Beats } from '../types';
import type { MixerChannel } from '../mixer/mixer';
import type { Instrument } from '../entities/instrumentChannel';
import type { BeatsRange } from '../..';
import { getSlotPlaybackStatesWithinRange } from './utils/getSlotPlaybackStatesWithinRange';
import { addScenesToQueue } from './utils/addScenesToQueue';
import { removeScenesFromQueue } from './utils/removeScenesFromQueue';
import type { EntityEntries } from '../entities/entities';

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
  let state: SchedulerState = {
    slotPlaybackState: initialState.slotPlaybackState || createSlotPlaybackState(),
  };

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

  return {
    setSlotPlaybackState,
    addSceneToQueue,
    removeSceneFromQueue,
    getSlotPlaybackState,
    getSlotPlaybackStatesWithinRange: (beatsRange: BeatsRange) => {
      return getSlotPlaybackStatesWithinRange(beatsRange, entityEntries, getSlotPlaybackState());
    },
  };
};
