import { useTempo } from '../packages/sequencer/react/useTempo';
import type { Bpm } from '../packages/time/types';

export const Tempo = () => {
  const [tempo, setTempo] = useTempo();

  return (
    <>
      tempo:
      <input
        type="number"
        value={tempo}
        onChange={(changeEvent) => {
          setTempo(parseInt(changeEvent.target.value, 10) as Bpm);
        }}
      />
    </>
  );
};
