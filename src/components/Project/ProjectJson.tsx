import { CodeViewer } from '../general/CodeViewer';
import { useLiveseqContext } from '../../liveseq';

export const ProjectJson = () => {
  const liveseq = useLiveseqContext();
  const project = liveseq.getProject();
  return <CodeViewer name={project.name}>{project}</CodeViewer>;
};
