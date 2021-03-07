import { createPlayer } from './player';
import { getAudioContext } from './utils/getAudioContext';
import type { Project } from './io/projectStructure';
import { defaultProject } from './io/projectStructure';

type LiveseqState = {
  project: Project;
};

const getInitialState = (props: LiveseqProps): LiveseqState => {
  return {
    project: props.project || defaultProject,
  };
};

type LiveseqProps = {
  project?: Project;
  audioContext?: AudioContext;
};

export type Liveseq = ReturnType<typeof createLiveseq>;

export const createLiveseq = (props: LiveseqProps = {}) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const state = getInitialState(props);
  state;

  const audioContext = props.audioContext || getAudioContext();
  const player = createPlayer(audioContext);

  return {
    ...player,
    audioContext,
  };
};
