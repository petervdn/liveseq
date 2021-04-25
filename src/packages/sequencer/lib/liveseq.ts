import type { SerializableProject } from './project/project';
import { getEnginePropsWithDefaults } from './getEnginePropsWithDefaults';
import { createEngine, Engine, EngineProps } from './engine';
import type { TimeInSeconds } from '../../core/types';

export type Liveseq = Engine;

export type LiveseqProps = Partial<
  Omit<EngineProps, 'project'> & {
    project: Partial<SerializableProject>;
  } & {
    lookAheadTime: TimeInSeconds;
    scheduleInterval: TimeInSeconds;
  }
>;

export const createLiveseq = (props: LiveseqProps = {}): Liveseq => {
  const propsWithDefaults = getEnginePropsWithDefaults(props);

  return createEngine(propsWithDefaults);
};
