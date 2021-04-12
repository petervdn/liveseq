import { getFrequency } from '../../liveseq/lib/note/note';
import type { ScheduleItem } from '../../liveseq/lib/scheduler/scheduler';
import { ItemsViewer } from '../general/ItemsViewer';
import { Item } from '../general/Item';
import { Box } from '../general/Box';
import { Heading } from '../general/Heading';

type ScheduleNotesProps = {
  scheduleItem: ScheduleItem;
  totalBeats: number;
  horizontalScale: number;
  verticalScale?: number;
  height?: number;
  octaves?: number;
};

export const ScheduleNotes = ({
  scheduleItem,
  horizontalScale,
  totalBeats,
  verticalScale = 0.1,
  octaves = 2,
  height = 200,
}: ScheduleNotesProps) => {
  const noteHeight = height / (12 * octaves);
  // TODO: note output per instrument (instrument channel??)
  return (
    <ItemsViewer
      horizontalScale={horizontalScale}
      totalBeats={totalBeats}
      title="Scheduled Notes"
      height={height}
    >
      {scheduleItem.notes.map((note) => {
        return (
          <Item
            key={note.schedulingId}
            height={noteHeight}
            width={note.end - note.start}
            bottom={getFrequency(note.pitch)}
            left={note.start}
            horizontalScale={horizontalScale}
            verticalScale={verticalScale}
          >
            <Box
              width={`${note.velocity * 100}%`}
              marginTop={1}
              height={1}
              style={{ background: 'red' }}
            />
            <Heading sizeLevel={5}>{`${note.start} ${note.pitch}`}</Heading>
          </Item>
        );
      })}
    </ItemsViewer>
  );
};
