import { isContextSuspended } from '../../../core/utils/isContextSuspended';
import { errorMessages } from '../errors';
import { createPubSub } from '../../../pubSub/pubSub';
import { objectValues } from '../../../core/utils/objUtils';
import type { Scheduler } from '../scheduler/scheduler';
import { timeToBeats } from '../../../time/musicTime';
import type { Beats, Bpm, TimeInSeconds } from '../../../time/types';

// TODO: this is a bit repeated in scheduler
export const createPlayerEvents = () => {
  const events = {
    onPlaybackChange: createPubSub<PlaybackStates>(),
    onTempoChange: createPubSub<Bpm>(),
  };

  const dispose = () => {
    objectValues(events).forEach((pubSub) => pubSub.dispose());
  };

  return {
    ...events,
    dispose,
  };
};

export type PlayerProps = {
  audioContext: AudioContext;
  lookAheadTime: TimeInSeconds;
  scheduleInterval: TimeInSeconds;
  initialState: Partial<PlayerState>;
  scheduler: Scheduler;
};

export type PlaybackStates = 'playing' | 'paused' | 'stopped';

export type PlayerState = {
  playbackState: PlaybackStates;
  tempo: Bpm;
};

export const createPlayer = ({
  audioContext,
  scheduleInterval,
  lookAheadTime,
  initialState = {},
  scheduler,
}: PlayerProps) => {
  if (lookAheadTime <= scheduleInterval) {
    throw new Error(errorMessages.invalidLookahead());
  }

  const playerEvents = createPlayerEvents();
  let playStartTime: number | null = null;

  let state: PlayerState = {
    playbackState: 'stopped',
    tempo: 120 as Bpm,
    ...initialState,
  };

  let onStopHandlers: Array<() => void> = [];

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

  // TODO: rename to playback status instead of playback state everywhere
  const getPlaybackState = () => {
    return state.playbackState;
  };

  // TODO: consider paused and stopped states
  const getProgressInSeconds = () => {
    if (!playStartTime) return 0 as TimeInSeconds;

    return (audioContext.currentTime - playStartTime) as TimeInSeconds;
  };

  const getProgressInBeats = () => {
    const time = getProgressInSeconds();
    if (!time) return 0 as Beats;

    return timeToBeats(time, getTempo());
  };

  // ACTIONS
  const setPlaybackState = (playbackState: PlaybackStates) => {
    if (state.playbackState === playbackState) return;

    setState({
      playbackState,
    });

    playerEvents.onPlaybackChange.dispatch(playbackState);
  };

  const setTempo = (bpm: Bpm) => {
    if (state.tempo === bpm) return;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setState({
      tempo: bpm,
    });

    playerEvents.onTempoChange.dispatch(bpm);
  };

  const play = () => {
    if (!(audioContext instanceof window.AudioContext)) {
      throw new TypeError(errorMessages.cantPlayWithoutProperAudioContext());
    }

    const handlePlay = () => {
      playStartTime = audioContext.currentTime;

      onStopHandlers.push(
        scheduler.loop(getProgressInSeconds, getTempo, scheduleInterval, lookAheadTime),
      );

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

    onStopHandlers.forEach((callback) => callback());
    onStopHandlers = [];
    setPlaybackState('stopped');
  };

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const pause = () => {
    setPlaybackState('paused');
  };

  // eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/no-unused-vars
  const dispose = () => {
    stop();
    playerEvents.dispose();
    // TODO: we probably want to do some more stuff
  };

  return {
    getPlaybackState,
    getTempo,
    getProgressInSeconds,
    getProgressInBeats,
    onPlaybackChange: playerEvents.onPlaybackChange.subscribe,
    onTempoChange: playerEvents.onTempoChange.subscribe,
    pause,
    play,
    setTempo,
    stop,
    dispose,
  };
};
