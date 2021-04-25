import { createProject } from './project/project';
import type { LiveseqProps } from './liveseq';
import { createMockedAudioContext } from '../../audioContextMock/createMockedAudioContext';
import type { TimeInSeconds, Bpm } from '../../time/types';
import { createInputProps } from '../../core/createInputProps';
import type { EngineProps } from './engine';

export const getEninePropsWithDefaults = (props: LiveseqProps = {}): EngineProps => {
  const project = createProject(props.project);
  const lookAheadTime = 2 as TimeInSeconds; // TODO: get from props
  const scheduleInterval = 1 as TimeInSeconds; // TODO: get from props
  const tempo = 120 as Bpm; // TODO: get from project??
  const audioContext = props.audioContext || createMockedAudioContext();
  const inputSources = createInputProps({
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
