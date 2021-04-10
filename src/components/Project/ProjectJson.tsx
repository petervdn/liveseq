import { JsonViewer } from '../general/JsonViewer';
import { useLiveseqContext } from '../../liveseq';

export const ProjectJson = () => {
  const liveseq = useLiveseqContext();
  const project = liveseq.getProject();
  return <JsonViewer name={project.name}>{project}</JsonViewer>;
};
