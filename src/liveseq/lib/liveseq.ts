import type { SerializableProject } from './project/project';
import { getEngineProps } from './utils/getEngineProps';
import { createEngine, Engine, EngineProps } from './engine';

export type Liveseq = Engine;

export type LiveseqProps = Partial<
  Omit<EngineProps, 'project'> & { project: Partial<SerializableProject> }
>;

export const createLiveseq = (props: LiveseqProps = {}): Liveseq => {
  const propsWithDefaults = getEngineProps(props);

  return createEngine(propsWithDefaults);
};
