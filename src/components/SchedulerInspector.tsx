import type React from 'react';
import { useScheduleInfo } from '../liveseq/react/useScheduleInfo';
import { getFrequency } from '../liveseq/lib/note/note';

const scaleHorizontally = (value: number) => {
  return value * 100;
};

const scaleFrequency = (value: number) => {
  return value * 0.1;
};

export const SchedulerInspector: React.FunctionComponent = () => {
  const info = useScheduleInfo();
  const height = 200;
  // 5 octaves for now
  const noteHeight = height / (12 * 2);

  return (
    <>
      <h3>Scheduler Info</h3>
      <div style={{ position: 'relative', height, width: '100%', border: '1px solid black' }}>
        {info.map((note) => {
          return (
            <div
              key={note.schedulingId}
              style={{
                position: 'absolute',
                height: noteHeight,
                width: `${scaleHorizontally(note.end - note.start) - 1}px`,
                bottom: scaleFrequency(getFrequency(note.pitch)),
                left: scaleHorizontally(note.start),
                background: 'rgba(0,1,0,0.5)',
              }}
            >
              {note.pitch}
            </div>
          );
        })}
      </div>
      <pre>{JSON.stringify(info, undefined, 2)}</pre>
    </>
  );
};
