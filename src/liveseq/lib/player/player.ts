import type { Note } from '../note/note';
import type { TimeRange } from '../time/timeRange';
import { isContextSuspended } from '../utils/isContextSuspended';
import type { TimeInSeconds, Bpm } from '../types';
import { errorMessages } from '../errors';
import type { getScheduleItemsWithinRange } from './utils/getScheduleItemsWithinRange';
import type { Instrument } from '../entities/instrumentChannel';
import type { MixerChannel } from '../mixer/mixer';
import {
  addScenesToQueue,
  createSlotPlaybackState,
  QueuedScene,
  removeScenesFromQueue,
  SlotPlaybackState,
} from './slotPlaybackState';
import type { EngineEvents } from '../engine';

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

export type PlayerProps = {
  audioContext: AudioContext;
  lookAheadTime: TimeInSeconds;
  scheduleInterval: TimeInSeconds;
  // called every time schedule runs to get "what" to schedule from the project
  getScheduleItems: (
    timeRange: TimeRange,
    previouslyScheduledNoteIds: Array<string>,
    currentBpm: Bpm,
    currentSlotPlaybackState: SlotPlaybackState,
  ) => ReturnType<typeof getScheduleItemsWithinRange>;
  onSchedule: (value: ReturnType<typeof getScheduleItemsWithinRange>) => void;
  initialState: Partial<PlayerState>;
  engineEvents: EngineEvents;
};

export type PlaybackStates = 'playing' | 'paused' | 'stopped';

export type PlayerState = {
  playbackState: PlaybackStates;
  tempo: Bpm;
  slotPlaybackState: SlotPlaybackState;
  isMuted: boolean;
};

export const createPlayer = ({
  audioContext,
  getScheduleItems,
  scheduleInterval,
  lookAheadTime,
  onSchedule,
  engineEvents,
  initialState = {},
}: PlayerProps) => {
  let playStartTime: number | null = null;
  let timeoutId: number | null = null;

  let state: PlayerState = {
    playbackState: 'stopped',
    tempo: 120 as Bpm,
    slotPlaybackState: createSlotPlaybackState(), // TODO: this line always executes
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

  const getSlotPlaybackState = () => {
    return state.slotPlaybackState;
  };

  const setPlaybackState = (playbackState: PlaybackStates) => {
    if (state.playbackState === playbackState) return;

    setState({
      playbackState,
    });

    engineEvents.playbackChange.dispatch(playbackState);
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

    engineEvents.tempoChange.dispatch(bpm);
  };

  const setSlotPlaybackState = (slotPlaybackState: SlotPlaybackState) => {
    setState({
      slotPlaybackState,
    });
  };

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
      getTempo(),
      getSlotPlaybackState(),
    );
    const { scheduleItems } = stuff;

    setSlotPlaybackState(stuff.nextSlotPlaybackState);

    onSchedule(stuff);

    // TODO: this will grow indefinitely so we need to clean up
    previouslyScheduledNoteIds = previouslyScheduledNoteIds.concat(
      scheduleItems.flatMap((scheduleItem) => {
        return scheduleItem.notes.map((note) => note.schedulingId);
      }),
    );

    scheduleItems.forEach((item) => {
      item.instrument.schedule(item.notes, item.channelMixer);
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
    // todo actually stop current sounds

    playStartTime = null;
    timeoutId !== null && window.clearTimeout(timeoutId);
    setPlaybackState('stopped');
  };

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const pause = () => {
    setPlaybackState('paused');
  };

  // eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/no-unused-vars
  const dispose = () => {
    stop();
    // TODO: we probably want to do some more stuff
  };

  return {
    addSceneToQueue,
    getIsMuted,
    getIsPaused,
    getIsPlaying,
    getIsStopped,
    getPlaybackState,
    getSlotPlaybackState,
    getTempo,
    pause,
    play,
    removeSceneFromQueue,
    setIsMuted,
    setTempo,
    stop,
    dispose,
  };
};
