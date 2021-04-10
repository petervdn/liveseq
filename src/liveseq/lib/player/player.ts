import { isContextSuspended } from '../utils/isContextSuspended';
import type { Bpm, TimeInSeconds } from '../types';
import { errorMessages } from '../errors';
import { createPubSub } from '../utils/pubSub';
import { objectValues } from '../utils/objUtils';
import type { Scheduler } from '../scheduler/scheduler';

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
  isMuted: boolean;
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
    // TODO: move isMuted to mixer
    isMuted: false,
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

  const setPlaybackState = (playbackState: PlaybackStates) => {
    if (state.playbackState === playbackState) return;

    setState({
      playbackState,
    });

    playerEvents.onPlaybackChange.dispatch(playbackState);
  };

  // TODO: move to mixer
  const getIsMuted = () => {
    return state.isMuted;
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

    playerEvents.onTempoChange.dispatch(bpm);
  };

  const getTime = () => {
    // will error if called and it's not playing
    return (audioContext.currentTime - playStartTime!) as TimeInSeconds;
  };

  const play = () => {
    const handlePlay = () => {
      playStartTime = audioContext.currentTime;

      onStopHandlers.push(scheduler.loop(getTime, getTempo, scheduleInterval, lookAheadTime));

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
    getIsMuted,
    getIsPaused,
    getIsPlaying,
    getIsStopped,
    getPlaybackState,
    getTempo,
    onPlaybackChange: playerEvents.onPlaybackChange.subscribe,
    onTempoChange: playerEvents.onTempoChange.subscribe,
    pause,
    play,
    setIsMuted,
    setTempo,
    stop,
    dispose,
  };
};
