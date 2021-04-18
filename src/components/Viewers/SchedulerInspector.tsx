import { useEffect, useRef, useState } from 'react';
import { useScheduleData } from '../../liveseq/react/useScheduleData';
import { ScheduleNotes } from './ScheduleNotes';
import { ScheduleSlots } from './ScheduleSlots';
import { ScheduleScenes } from './ScheduledScenes';
import { CodeViewer } from '../general/CodeViewer';
import { removeNonSerializableProps } from '../utils/removeNonSerializableProps';
import { Tabs } from '../general/Tabs';
import type { ViewerVisualProps } from '../general/ItemsViewer';
import { useLiveseqContext } from '../../liveseq';
import { Wrapper } from '../general/Wrapper';
import { Box } from '../general/Box';

type SchedulerInspectorProps = ViewerVisualProps & {
  // eslint-disable-next-line react/no-unused-prop-types
  // start: number;
};

type SchedulerProps = SchedulerInspectorProps & {
  // eslint-disable-next-line react/no-unused-prop-types
  start: number;
};

const Scheduler = ({ totalBeats, horizontalScale, height, start }: SchedulerProps) => {
  const { scheduleData, scheduledNotes, beatsRange } = useScheduleData(start, totalBeats);
  const liveseq = useLiveseqContext();
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isLooping = true;
    const handleLoop = () => {
      if (wrapperRef.current) {
        const progress = liveseq.getProgressInBeats();
        wrapperRef.current.style.transform = `translate(${progress * horizontalScale}px, 0px)`;
      }

      isLooping && requestAnimationFrame(handleLoop);
    };
    requestAnimationFrame(handleLoop);

    return () => {
      isLooping = false;
    };
  }, [horizontalScale, liveseq]);

  return (
    <>
      <Box
        position="absolute"
        marginTop="13px"
        left={scheduleData.beatsRange.start * horizontalScale}
        width={(scheduleData.beatsRange.end - scheduleData.beatsRange.start) * horizontalScale}
        height="4px"
        backgroundColor="blue"
      />
      <Box
        position="absolute"
        marginTop="10px"
        left={beatsRange.start * horizontalScale}
        width={(beatsRange.end - beatsRange.start) * horizontalScale}
        height="10px"
        backgroundColor="yellow"
      />
      <Wrapper marginTop="40px">
        {/* note output per instrument (instrument channel??) */}
        {scheduleData.scheduleItems.map((scheduleItem, index) => {
          return (
            <ScheduleNotes
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              totalBeats={totalBeats}
              horizontalScale={horizontalScale}
              scheduleItem={scheduleItem}
              height={height}
              scheduledNotes={scheduledNotes}
            />
          );
        })}
        <ScheduleSlots
          totalBeats={totalBeats}
          horizontalScale={horizontalScale}
          height={height}
          slotPlaybackStateRanges={scheduleData.slotPlaybackStateRanges}
        />
        <ScheduleScenes
          totalBeats={totalBeats}
          horizontalScale={horizontalScale}
          height={height}
          slotPlaybackStateRanges={scheduleData.slotPlaybackStateRanges}
        />
        <Box
          ref={wrapperRef}
          width="2px"
          position="absolute"
          top={0}
          bottom={0}
          backgroundColor="lime"
          opacity={0.5}
        />
      </Wrapper>
    </>
  );
};

const ScheduleData = ({ totalBeats }: SchedulerProps) => {
  const { scheduleData } = useScheduleData(0, totalBeats);

  return <CodeViewer name="Schedule Data">{removeNonSerializableProps(scheduleData)}</CodeViewer>;
};

export const SchedulerInspector = (props: SchedulerInspectorProps) => {
  const [start, setStart] = useState(0);
  const [totalBeats, setTotalBeats] = useState(props.totalBeats);

  return (
    <Tabs
      items={[
        {
          label: 'Visualizer',
          component: () => <Scheduler {...props} start={start} totalBeats={totalBeats} />,
        },
        {
          label: 'Schedule Data',
          component: () => <ScheduleData {...props} start={start} totalBeats={totalBeats} />,
        },
      ]}
    >
      <input
        type="number"
        value={start}
        min="0"
        max="100"
        onChange={(event) => {
          setStart(parseInt(event.target.value, 10));
        }}
      />
      <input
        type="number"
        value={totalBeats}
        min="0"
        max="100"
        onChange={(event) => {
          setTotalBeats(parseInt(event.target.value, 10));
        }}
      />
    </Tabs>
  );
};
