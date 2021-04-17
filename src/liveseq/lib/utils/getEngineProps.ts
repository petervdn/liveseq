import { createProject } from '../project/project';
import type { LiveseqProps } from '../liveseq';
import type { TimeInSeconds } from '../types';
import type { EngineProps } from '../engine';
import { createMockedAudioContext } from './createMockedAudioContext';

export const getEngineProps = ({
  project,
  audioContext,
  ...props
}: LiveseqProps = {}): EngineProps => {
  return {
    project: createProject(project),
    lookAheadTime: 1.2 as TimeInSeconds,
    scheduleInterval: 1 as TimeInSeconds,
    audioContext: audioContext || createMockedAudioContext(),
    ...props,
  };
};
