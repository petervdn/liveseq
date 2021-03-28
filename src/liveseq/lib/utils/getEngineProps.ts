import { createProject } from '../project/project';
import { noop } from './noop';
import { getAudioContext } from './getAudioContext';
import type { LiveseqProps } from '../liveseq';
import type { TimeInSeconds } from '../types';
import type { EngineProps } from '../engine';

export const getEngineProps = ({
  project,
  audioContext,
  ...props
}: LiveseqProps = {}): EngineProps => {
  return {
    project: createProject(project),
    onPlay: noop,
    onPause: noop,
    onStop: noop,
    onSchedule: noop,
    onTempoChange: noop,
    lookAheadTime: 1.2 as TimeInSeconds,
    scheduleInterval: 1 as TimeInSeconds,
    audioContext: audioContext || getAudioContext(),
    ...props,
  };
};
