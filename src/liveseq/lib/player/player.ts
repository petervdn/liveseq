import type { Note } from '../note/note';
import type { TimeInSeconds } from '../time/time';
import type { TimeRange } from '../time/timeRange';

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
  lookAheadTime?: TimeInSeconds;
  scheduleInterval?: TimeInSeconds;
  // called every time schedule runs to get "what" to schedule from the project
  getScheduleItems: (
    timeRange: TimeRange,
    previouslyScheduledNoteIds: Array<string>,
  ) => Array<ScheduleItem>;
  onPlay: () => void;
  onStop: () => void;
};

// export type Player = ReturnType<typeof createPlayer>;

export const createPlayer = ({
  audioContext,
  getScheduleItems,
  scheduleInterval = 1 as TimeInSeconds,
  lookAheadTime = 1.2 as TimeInSeconds,
  onPlay,
  onStop,
}: PlayerProps) => {
  let playStartTime: number | null = null;
  let timeoutId: number | null = null;
  // todo: probably make this an object for more efficient lookup
  // todo: how does this work when slots are played again later on (and loop count is reset)
  let previouslyScheduledNoteIds: Array<string> = [];

  if (lookAheadTime <= scheduleInterval) {
    throw new Error('LookAheadTime should be larger than the scheduleInterval');
  }

  // filteredNotes.map((note) => note.schedulingId)
  const schedule = () => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const songTime = (audioContext.currentTime - playStartTime!) as TimeInSeconds; // playStartTime should always be defined when playing

    const scheduleItems = getScheduleItems(
      {
        start: songTime,
        end: (songTime + lookAheadTime) as TimeInSeconds,
      },
      previouslyScheduledNoteIds,
    );

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
    audioContext.state === 'suspended'
      ? audioContext
          .resume()
          .then(handlePlay)
          .catch(() => {
            if (audioContext.state === 'suspended') {
              throw new Error('Cannot play, AudioContext is suspended');
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
