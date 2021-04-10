import { getFrequency } from '../../liveseq/lib/note/note';
import type { ScheduleItem } from '../../liveseq/lib/scheduler/scheduler';

type ScheduleNotesProps = {
  scheduleItem: ScheduleItem;
  horizontalScale?: number;
  verticalScale?: number;
  height?: number;
  octaves?: number;
};

export const ScheduleNotes = ({
  scheduleItem,
  horizontalScale = 100,
  verticalScale = 0.1,
  octaves = 2,
  height = 200,
}: ScheduleNotesProps) => {
  const noteHeight = height / (12 * octaves);

  const scaleHorizontally = (value: number) => {
    return value * horizontalScale;
  };

  return (
    <>
      <h3>Scheduled Notes</h3>
      {/* note output per instrument (instrument channel??) */}
      <div style={{ position: 'relative', height, width: '100%', border: '1px solid black' }}>
        {scheduleItem.notes.map((note) => {
          return (
            <div
              key={note.schedulingId}
              style={{
                position: 'absolute',
                height: noteHeight,
                width: `${scaleHorizontally(note.end - note.start) - 1}px`,
                bottom: getFrequency(note.pitch) * verticalScale,
                left: scaleHorizontally(note.start),
                background: 'rgba(0,1,0,0.5)',
              }}
            >
              {note.pitch}
            </div>
          );
        })}
      </div>
    </>
  );
};
