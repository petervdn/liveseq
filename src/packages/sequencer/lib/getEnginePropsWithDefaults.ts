import { createProject } from './project/project';
import type { LiveseqProps } from './liveseq';
import { createMockedAudioContext } from '../../audioContextMock/createMockedAudioContext';
import { getInputProps } from '../../core/lib/getInputProps';
import type { EngineProps } from './engine';
import type { Bpm, TimeInSeconds } from '../../core/lib/types';

export const getEnginePropsWithDefaults = (props: LiveseqProps = {}): EngineProps => {
  const project = createProject(props.project);
  const lookAheadTime = props.lookAheadTime || (2 as TimeInSeconds);
  const scheduleInterval = props.scheduleInterval || (1 as TimeInSeconds);
  const tempo = 120 as Bpm; // TODO: get from project??
  const audioContext = props.audioContext || createMockedAudioContext();
  const inputSources = getInputProps({
    lookAheadTime,
    scheduleInterval,
    tempo,
  });

  return {
    ...props,
    project,
    audioContext,
    ...inputSources,
  };
};
