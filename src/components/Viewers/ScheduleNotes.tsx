import { getFrequency } from '../../liveseq/lib/note/note';
import type { ScheduleItem } from '../../liveseq/lib/scheduler/scheduler';
import { ItemsViewer, ViewerVisualProps } from '../general/ItemsViewer';
import { Item } from '../general/Item';
import { Box } from '../general/Box';
import { Label } from '../general/Label';

type ScheduleNotesProps = {
  scheduleItem: ScheduleItem;
  verticalScale?: number;
  octaves?: number;
  scheduledNotes: Array<string>;
} & ViewerVisualProps;

export const ScheduleNotes = ({
  scheduleItem,
  horizontalScale,
  end,
  verticalScale = 0.1,
  octaves = 2,
  height = 200,
  scheduledNotes,
}: ScheduleNotesProps) => {
  const noteHeight = height / (12 * octaves);
  // TODO: note output per instrument (instrument channel??)
  return (
    <ItemsViewer
      horizontalScale={horizontalScale}
      end={end}
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
            isHighlighted={scheduledNotes.includes(note.schedulingId)}
          >
            <Box
              width={`${note.velocity * 100}%`}
              marginTop={1}
              height={1}
              style={{ background: 'red' }}
            />
            <Label>{`${note.id} ${note.pitch}`}</Label>
          </Item>
        );
      })}
    </ItemsViewer>
  );
};
