import { abSwitch } from './liveseq/projects/abSwitch';
import { Liveseq } from './components/Liveseq';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function App() {
  return <Liveseq project={abSwitch}></Liveseq>;
}
