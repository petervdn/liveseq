import type { Note } from '../note/note';
import type { TimeRange } from '../time/timeRange';
import type { getScheduleItemsWithinRange } from './slotPlaybackState';
import { isContextSuspended } from '../utils/isContextSuspended';
import type { TimeInSeconds } from '../types';
import { errorMessages } from '../errors';

export type ScheduleNote = Note & {
  startTime: TimeInSeconds;
  endTime: TimeInSeconds;
  schedulingId: string;
};

export type ScheduleItem = {
  notes: Array<ScheduleNote>;
  instrument: {
    // when the player calls instrument.schedule, it will already pass notes with time in seconds
    // TODO: maybe the instrument returns a "cancel" fn
    schedule: (notes: Array<ScheduleNote>) => void;
  };
};

export type PlayerProps = {
  audioContext: AudioContext;
  lookAheadTime: TimeInSeconds;
  scheduleInterval: TimeInSeconds;
  // called every time schedule runs to get "what" to schedule from the project
  getScheduleItems: (
    timeRange: TimeRange,
    previouslyScheduledNoteIds: Array<string>,
  ) => ReturnType<typeof getScheduleItemsWithinRange>;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  onSchedule: (value: ReturnType<typeof getScheduleItemsWithinRange>) => void;
};

export type PlayerActions = {
  play: () => void;
  pause: () => void;
  stop: () => void;
};

export type Player = {
  actions: PlayerActions;
  dispose: () => void;
};

export const createPlayer = ({
  audioContext,
  getScheduleItems,
  scheduleInterval,
  lookAheadTime,
  onPlay,
  onPause,
  onStop,
  onSchedule,
}: PlayerProps): Player => {
  let playStartTime: number | null = null;
  let timeoutId: number | null = null;
  // todo: probably make this an object for more efficient lookup
  // todo: how does this work when slots are played again later on (and loop count is reset)
  let previouslyScheduledNoteIds: Array<string> = [];

  if (lookAheadTime <= scheduleInterval) {
    throw new Error(errorMessages.invalidLookahead());
  }

  const schedule = () => {
    // playStartTime should always be defined when playing
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const songTime = (audioContext.currentTime - playStartTime!) as TimeInSeconds;

    // TODO: naming
    const stuff = getScheduleItems(
      {
        start: songTime,
        end: (songTime + lookAheadTime) as TimeInSeconds,
      },
      previouslyScheduledNoteIds,
    );
    const { scheduleItems } = stuff;

    onSchedule(stuff);

    // TODO: this will grow indefinitely so we need to clean up
    previouslyScheduledNoteIds = previouslyScheduledNoteIds.concat(
      scheduleItems.flatMap((scheduleItem) => {
        return scheduleItem.notes.map((note) => note.schedulingId);
      }),
    );

    scheduleItems.forEach((item) => {
      item.instrument.schedule(item.notes);
    });

    timeoutId = window.setTimeout(() => schedule(), scheduleInterval * 1000);
  };

  const play = () => {
    const handlePlay = () => {
      playStartTime = audioContext.currentTime;

      schedule();
      onPlay();
    };

    isContextSuspended(audioContext)
      ? audioContext
          .resume()
          .then(handlePlay)
          .catch(() => {
            if (isContextSuspended(audioContext)) {
              throw new Error(errorMessages.contextSuspended());
            }
          })
      : handlePlay();
  };

  const stop = () => {
    // todo actually stop current sounds

    playStartTime = null;
    timeoutId !== null && window.clearTimeout(timeoutId);
    onStop();
  };

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const pause = () => {
    onPause();
  };

  // eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/no-unused-vars
  const dispose = () => {};

  return {
    actions: {
      play,
      stop,
      pause,
    },
    dispose,
  };
};
