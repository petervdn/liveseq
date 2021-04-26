import type { Source } from 'callbag-common';
import { combine, pipe, subscribe, tap } from 'callbag-common';
import share from 'callbag-share';
import type { Note } from '../../../note/note';
import type { Instrument } from '../entities/instrumentChannel';
import type { EntityEntries } from '../entities/entities';
import { getQueuedScenesWithinRange } from './utils/getQueuedScenesWithinRange';
import { groupQueuedScenesByStart } from './utils/groupQueuedScenesByStart';
import { getSlotPlaybackStateRanges } from './utils/getSlotPlaybackStateRanges';
import { getNotesForInstrumentInTimeRange } from '../entities/utils/getNotesForInstrumentInTimeRange';
import { createSchedulerEvents } from './schedulerEvents';
import { createSchedulerState, SchedulerState, SlotPlaybackState } from './schedulerState';
import { setTimer } from '../../../core/lib/utils/setTimer';
import type { Beats, BeatsRange, Bpm, TimeInSeconds } from '../../../core';

export type ScheduleNote = Note & {
  startTime: TimeInSeconds;
  endTime: TimeInSeconds;
  schedulingId: string;
};

export type ScheduleItem = {
  notes: Array<ScheduleNote>;
  instrument: Instrument;
};

export type ScheduleData = {
  beatsRange: BeatsRange;
  slotPlaybackStateRanges: Array<BeatsRange & SlotPlaybackState>;
  scheduleItems: Array<ScheduleItem>;
};

type SchedulerProps = {
  beatsRange$: Source<BeatsRange>;
  tempo$: Source<Bpm>;
  entityEntries: EntityEntries;
  initialState: Partial<SchedulerState>;
};

export type Scheduler = ReturnType<typeof createScheduler>;

export const createScheduler = ({
  initialState,
  entityEntries,
  beatsRange$,
  tempo$,
}: SchedulerProps) => {
  const schedulerEvents = createSchedulerEvents();
  const {
    getSlotPlaybackState,
    setSlotPlaybackState,
    addSceneToQueue,
    removeSceneFromQueue,
    reset,
    ...schedulerState
  } = createSchedulerState(initialState);
  const onStopCallbacks: Array<() => void> = [];

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
        onStopCallbacks.push(item.instrument.schedule(note));

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

  // react to beatsRange$ and tempo$
  const update$ = pipe(
    combine(beatsRange$, tempo$),
    tap(([beatsRange, tempo]) => {
      // we must split the beatsRange into sections where the playing slots in the slotPlaybackState changes
      const scheduleData = getScheduleDataWithinRange(beatsRange, tempo);

      schedule(scheduleData.scheduleItems);
      schedulerEvents.onSchedule.dispatch(scheduleData);
    }),
    share,
  );

  // eslint-disable-next-line no-console
  subscribe((x) => console.log('update$', x))(update$);

  const dispose = () => {
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
    dispose,
  };
};
