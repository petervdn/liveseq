import type { SerializableProject } from './project/project';
import { getEninePropsWithDefaults } from './getEninePropsWithDefaults';
import { createEngine, Engine, EngineProps } from './engine';
import type { TimeInSeconds } from '../../time/types';

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
  const propsWithDefaults = getEninePropsWithDefaults(props);

  return createEngine(propsWithDefaults);
};
