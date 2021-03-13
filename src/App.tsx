import { useLiveseq } from './liveseq/react/hooks/useLiveseq';
import { abSwitch } from './projects/abSwitch';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function App() {
  // Note that LiveseqProvider is a WIP implementation
  // eventually will allow us to use hooks like useIsPlaying
  const { liveseq, LiveseqProvider } = useLiveseq({
    project: abSwitch,
  });

  return (
    <div>
      <LiveseqProvider>
        <button
          type="button"
          onClick={() => {
            liveseq.play();
          }}
        >
          start
        </button>
        <button
          type="button"
          onClick={() => {
            liveseq.stop();
          }}
        >
          stop
        </button>
      </LiveseqProvider>
    </div>
  );
}
