import type React from 'react';
import { useScheduleData } from '../liveseq/react/useScheduleData';
import { getFrequency } from '../liveseq/lib/note/note';

const scaleHorizontally = (value: number) => {
  return value * 100;
};

const scaleFrequency = (value: number) => {
  return value * 0.1;
};

export const SchedulerInspector: React.FunctionComponent = () => {
  const scheduleData = useScheduleData(0, 8);
  const height = 200;
  const noteHeight = height / (12 * 2);

  return (
    <>
      <h3>Scheduler Info</h3>
      <div style={{ position: 'relative', height, width: '100%', border: '1px solid black' }}></div>

      {scheduleData.scheduleItems.map((scheduleItem, index) => {
        return (
          <div
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            style={{ position: 'relative', height, width: '100%', border: '1px solid black' }}
          >
            {scheduleItem.notes.map((note) => {
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
        );
      })}

      <pre>{JSON.stringify(scheduleData, undefined, 2)}</pre>
    </>
  );
};
