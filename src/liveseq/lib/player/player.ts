import { isContextSuspended } from '../utils/isContextSuspended';
import type { Bpm, TimeInSeconds } from '../types';
import { errorMessages } from '../errors';
import { getScheduleItemsWithinRange } from '../scheduler/utils/getScheduleItemsWithinRange';
import { createPubSub } from '../utils/pubSub';
import { objectValues } from '../utils/objUtils';
import { BeatsRange, timeRangeToBeatsRange } from '../time/beatsRange';
import type { EntityEntries } from '../entities/entities';
import type { ScheduleData, Scheduler } from '../scheduler/scheduler';

export const createPlayerEvents = () => {
  const events = {
    onPlaybackChange: createPubSub<PlaybackStates>(),
    onTempoChange: createPubSub<Bpm>(),
    onSchedule: createPubSub<ScheduleData>(),
  };
  return events;
};

export type PlayerProps = {
  audioContext: AudioContext;
  lookAheadTime: TimeInSeconds;
  scheduleInterval: TimeInSeconds;
  initialState: Partial<PlayerState>;
  entityEntries: EntityEntries;
  scheduler: Scheduler;
};

export type PlaybackStates = 'playing' | 'paused' | 'stopped';

export type PlayerState = {
  playbackState: PlaybackStates;
  tempo: Bpm;
  isMuted: boolean;
};

export const createPlayer = ({
  audioContext,
  scheduleInterval,
  lookAheadTime,
  initialState = {},
  entityEntries,
  scheduler,
}: PlayerProps) => {
  const engineEvents = createPlayerEvents();
  let playStartTime: number | null = null;
  let timeoutId: number | null = null;

  let state: PlayerState = {
    playbackState: 'stopped',
    tempo: 120 as Bpm,
    // TODO: move isMuted to mixer
    isMuted: false,
    ...initialState,
  };

  // UTILS
  const setState = (newState: Partial<PlayerState>) => {
    // mutation!
    state = {
      ...state,
      ...newState,
    };
    return state;
  };

  let onStopCallbacks: Array<() => void> = [];

  // SELECTORS
  const getTempo = () => {
    return state.tempo;
  };

  const getPlaybackState = () => {
    return state.playbackState;
  };

  const getIsPlaying = () => {
    return state.playbackState === 'playing';
  };

  const getIsPaused = () => {
    return state.playbackState === 'paused';
  };

  const getIsStopped = () => {
    return state.playbackState === 'stopped';
  };

  const getIsMuted = () => {
    return state.isMuted;
  };

  const setPlaybackState = (playbackState: PlaybackStates) => {
    if (state.playbackState === playbackState) return;

    setState({
      playbackState,
    });

    engineEvents.onPlaybackChange.dispatch(playbackState);
  };

  // TODO: move to mixer
  const setIsMuted = (isMuted: boolean) => {
    if (getIsMuted() === isMuted) return;

    setState({
      isMuted,
    });
  };

  const setTempo = (bpm: Bpm) => {
    if (state.tempo === bpm) return;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setState({
      tempo: bpm,
    });

    engineEvents.onTempoChange.dispatch(bpm);
  };

  // move to scheduler
  // todo: probably make this an object for more efficient lookup
  // todo: how does this work when slots are played again later on (and loop count is reset)
  // ^ we could assign new ids at every play if that is an issue
  // but we gotta clean up based on some criteria
  let previouslyScheduledNoteIds: Array<string> = [];

  if (lookAheadTime <= scheduleInterval) {
    throw new Error(errorMessages.invalidLookahead());
  }

  // move to scheduler
  const schedule = () => {
    // playStartTime should always be defined when playing
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const songTime = (audioContext.currentTime - playStartTime!) as TimeInSeconds;

    const tempo = getTempo();

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
      scheduler.getSlotPlaybackState(),
      previouslyScheduledNoteIds,
    );

    const { scheduleItems } = stuff;

    // TODO: first calculate one and then the other so we don't need stuff to be an obj
    scheduler.setSlotPlaybackState(stuff.nextSlotPlaybackState);
    engineEvents.onSchedule.dispatch(stuff);

    // TODO: this will grow indefinitely so we need to clean up
    previouslyScheduledNoteIds = previouslyScheduledNoteIds.concat(
      scheduleItems.flatMap((scheduleItem) => {
        return scheduleItem.notes.map((note) => note.schedulingId);
      }),
    );

    scheduleItems.forEach((item) => {
      onStopCallbacks.push(item.instrument.schedule(item.notes, item.channelMixer));
    });

    timeoutId = window.setTimeout(() => schedule(), scheduleInterval * 1000);
  };

  const play = () => {
    const handlePlay = () => {
      playStartTime = audioContext.currentTime;

      schedule();
      setPlaybackState('playing');
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
    playStartTime = null;
    timeoutId !== null && window.clearTimeout(timeoutId);
    setPlaybackState('stopped');

    onStopCallbacks.forEach((callback) => {
      callback();
    });
    onStopCallbacks = [];
  };

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const pause = () => {
    setPlaybackState('paused');
  };

  // eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/no-unused-vars
  const dispose = () => {
    stop();
    objectValues(engineEvents).forEach((pubSub) => pubSub.dispose());
    // TODO: we probably want to do some more stuff
  };

  // TODO: move to scheduler
  // TODO: better naming
  const getScheduleItemsInfo = (beatsRange: BeatsRange) => {
    return getScheduleItemsWithinRange(
      beatsRange,
      entityEntries,
      getTempo(),
      scheduler.getSlotPlaybackState(),
      previouslyScheduledNoteIds, // TODO: use []
    ).scheduleItems.flatMap((scheduleItem) => {
      return scheduleItem.notes.map((note) => {
        return {
          ...note,
          ...scheduleItem.instrument,
        };
      });
    });
  };

  return {
    getIsMuted,
    getIsPaused,
    getIsPlaying,
    getIsStopped,
    getPlaybackState,
    getScheduleItemsInfo,
    getTempo,
    onPlaybackChange: engineEvents.onPlaybackChange.subscribe,
    onSchedule: engineEvents.onSchedule.subscribe,
    onTempoChange: engineEvents.onTempoChange.subscribe,
    pause,
    play,
    setIsMuted,
    setTempo,
    stop,
    dispose,
  };
};
