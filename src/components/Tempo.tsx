import { useTempo } from '../packages/liveseq/react/useTempo';

export const Tempo = () => {
  const [tempo, setTempo] = useTempo();

  return (
    <>
      tempo:
      <input
        type="number"
        value={tempo}
        onChange={(changeEvent) => {
          setTempo(parseInt(changeEvent.target.value, 10));
        }}
      />
    </>
  );
};
