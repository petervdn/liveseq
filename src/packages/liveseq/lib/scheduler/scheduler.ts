import type { Note } from '../../../note/note';
import type { MixerChannel } from '../mixer/mixer';
import type { Instrument } from '../entities/instrumentChannel';
import type { Beats, BeatsRange, Bpm } from '../../index';
import type { EntityEntries } from '../entities/entities';
import { timeRangeToBeatsRange } from '../../../time/beatsRange/timeRangeToBeatsRange';
import { getQueuedScenesWithinRange } from './utils/getQueuedScenesWithinRange';
import { groupQueuedScenesByStart } from './utils/groupQueuedScenesByStart';
import { getSlotPlaybackStateRanges } from './utils/getSlotPlaybackStateRanges';
import { getNotesForInstrumentInTimeRange } from '../entities/utils/getNotesForInstrumentInTimeRange';
import { createSchedulerEvents } from './schedulerEvents';
import { createSchedulerState, SchedulerState, SlotPlaybackState } from './schedulerState';
import { setTimer } from '../../../core/utils/setTimer';
import type { TimeInSeconds } from '../../../time/types';

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
  beatsRange: BeatsRange;
  slotPlaybackStateRanges: Array<BeatsRange & SlotPlaybackState>;
  scheduleItems: Array<ScheduleItem>;
};

type SchedulerProps = {
  entityEntries: EntityEntries;
  initialState: Partial<SchedulerState>;
};

export type Scheduler = ReturnType<typeof createScheduler>;

export const createScheduler = ({ initialState, entityEntries }: SchedulerProps) => {
  const schedulerEvents = createSchedulerEvents();
  const {
    getSlotPlaybackState,
    setSlotPlaybackState,
    addSceneToQueue,
    removeSceneFromQueue,
    reset,
    ...schedulerState
  } = createSchedulerState(initialState);
  let onStopCallbacks: Array<() => void> = [];

  // todo: probably make this an object for more efficient lookup
  // todo: how does this work when slots are played again later on (and loop count is reset)
  // ^ we could assign new ids at every play if that is an issue
  // but we gotta clean up based on some criteria
  let previouslyScheduledNoteIds: Array<string> = [];

  const schedule = (scheduleItems: Array<ScheduleItem>) => {
    scheduleItems.forEach((item) => {
      item.notes.forEach((note) => {
        if (previouslyScheduledNoteIds.includes(note.schedulingId)) {
          // console.log('skipping', note.schedulingId);
          return;
        }

        previouslyScheduledNoteIds.push(note.schedulingId);
        onStopCallbacks.push(item.instrument.schedule(note, item.channelMixer));

        // TODO: time accuracy can probably be improved
        onStopCallbacks.push(
          setTimer(() => {
            schedulerEvents.onPlayNote.dispatch(note);
          }, note.startTime * 1000),
        );
      });
    });
  };

  // TODO: can be optmized by caching at some times and using that as a start, now just reduces from the beginning
  const getSlotPlaybackStateAt = (at: Beats) => {
    const initialSlotPlaybackState = getSlotPlaybackState();
    const start = 0 as Beats;
    const beatsRange = { start, end: at };
    const queuedScenes = getQueuedScenesWithinRange(beatsRange, initialSlotPlaybackState);
    const queuedScenesByStart = groupQueuedScenesByStart(start, queuedScenes);
    // TODO: adapt this function so we don't need to collect and throw away all the items, but just reduce to the last directly
    const slotPlaybackStateRanges = getSlotPlaybackStateRanges(
      beatsRange,
      queuedScenesByStart,
      entityEntries,
      initialSlotPlaybackState,
    );
    const last = slotPlaybackStateRanges[slotPlaybackStateRanges.length - 1];
    return last;
  };

  const getScheduleDataWithinRange = (beatsRange: BeatsRange, tempo: Bpm): ScheduleData => {
    const slotPlaybackState = getSlotPlaybackStateAt(beatsRange.start);
    const queuedScenes = getQueuedScenesWithinRange(beatsRange, slotPlaybackState);
    const queuedScenesByStart = groupQueuedScenesByStart(beatsRange.start, queuedScenes);
    const slotPlaybackStateRanges = getSlotPlaybackStateRanges(
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
      beatsRange,
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

      schedule(scheduleData.scheduleItems);
      schedulerEvents.onSchedule.dispatch(scheduleData);
    };

    const handleSchedule = () => {
      const cancelTimer = setTimer(() => {
        internalSchedule();
        handleSchedule();
      }, scheduleInterval * 1000);

      // TODO: will keep adding until stopped, maybe just save this separately or improve cleanup
      onStopCallbacks.push(cancelTimer);
    };

    internalSchedule();
    handleSchedule();

    return () => {
      stopLoop();
    };
  };

  const dispose = () => {
    stopLoop();
    reset();
    previouslyScheduledNoteIds = [];
    schedulerEvents.dispose();
    schedulerState.dispose();
  };

  return {
    setSlotPlaybackState,
    addSceneToQueue,
    removeSceneFromQueue,
    getSlotPlaybackState,
    getScheduleDataWithinRange,
    onSchedule: schedulerEvents.onSchedule.subscribe,
    onPlayNote: schedulerEvents.onPlayNote.subscribe,
    schedule,
    loop,
    dispose,
  };
};
