import type { Note } from '../note/note';
import type { TimeInSeconds } from '../time/time';
import type { TimeRange } from '../time/timeRange';
import type { getScheduleItemsWithinRange } from './slotPlaybackState';
import type { Errors } from '../errors';
import { isContextSuspended } from '../utils/isContextSuspended';

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
  onStop: () => void;
  onSchedule: (value: ReturnType<typeof getScheduleItemsWithinRange>) => void;
  errors: Pick<Errors, 'contextSuspended' | 'invalidLookahead'>;
};

// export type Player = ReturnType<typeof createPlayer>;

export const createPlayer = ({
  audioContext,
  getScheduleItems,
  scheduleInterval,
  lookAheadTime,
  onPlay,
  onStop,
  onSchedule,
  errors,
}: PlayerProps) => {
  let playStartTime: number | null = null;
  let timeoutId: number | null = null;
  // todo: probably make this an object for more efficient lookup
  // todo: how does this work when slots are played again later on (and loop count is reset)
  let previouslyScheduledNoteIds: Array<string> = [];

  if (lookAheadTime <= scheduleInterval) {
    errors.invalidLookahead();
  }

  const schedule = () => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const songTime = (audioContext.currentTime - playStartTime!) as TimeInSeconds; // playStartTime should always be defined when playing

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

  const handlePlay = () => {
    playStartTime = audioContext.currentTime;

    schedule();
    onPlay();
  };

  const play = () => {
    isContextSuspended(audioContext)
      ? audioContext
          .resume()
          .then(handlePlay)
          .catch(() => {
            isContextSuspended(audioContext) && errors.contextSuspended();
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
  const pause = () => {};

  // eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/no-unused-vars
  const dispose = () => {};

  return {
    play,
    stop,
    pause,
    dispose,
  };
};
