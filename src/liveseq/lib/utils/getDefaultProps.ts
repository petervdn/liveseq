import { createProject } from '../project/project';
import { noop } from './noop';
import { getAudioContext } from './getAudioContext';
import type { LiveseqProps, PartialLiveseqProps } from '../liveseq';
import type { TimeInSeconds } from '../time/time';

export const getDefaultProps = ({
  project,
  audioContext,
  ...props
}: PartialLiveseqProps = {}): LiveseqProps => {
  return {
    project: createProject(project),
    onPlay: noop,
    onStop: noop,
    onTempoChange: noop,
    lookAheadTime: 1.2 as TimeInSeconds,
    scheduleInterval: 1 as TimeInSeconds,
    audioContext: audioContext || getAudioContext(),
    ...props,
  };
};
