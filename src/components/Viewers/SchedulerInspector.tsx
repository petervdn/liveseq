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
import { useSchedulerInterval } from '../../liveseq/react/useSchedulerInterval';

type SchedulerInspectorProps = ViewerVisualProps & {
  // eslint-disable-next-line react/no-unused-prop-types
  // start: number;
};

type SchedulerProps = SchedulerInspectorProps & {
  // eslint-disable-next-line react/no-unused-prop-types
  start: number;
};

const SchedulerViewers = ({ end, horizontalScale, height, start }: SchedulerProps) => {
  const { scheduleData, scheduledNotes } = useScheduleData(start, end);

  return (
    <>
      {/* note output per instrument (instrument channel??) */}
      {scheduleData.scheduleItems.map((scheduleItem, index) => {
        return (
          <ScheduleNotes
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            end={end}
            horizontalScale={horizontalScale}
            scheduleItem={scheduleItem}
            height={height}
            scheduledNotes={scheduledNotes}
          />
        );
      })}
      <ScheduleSlots
        end={end}
        horizontalScale={horizontalScale}
        height={height}
        slotPlaybackStateRanges={scheduleData.slotPlaybackStateRanges}
      />
      <ScheduleScenes
        end={end}
        horizontalScale={horizontalScale}
        height={height}
        slotPlaybackStateRanges={scheduleData.slotPlaybackStateRanges}
      />
    </>
  );
};

type SchedulerIntervalProps = {
  start: number;
  end: number;
  horizontalScale: number;
};
const SchedulerInterval = ({ start, end, horizontalScale }: SchedulerIntervalProps) => {
  const beatsRange = useSchedulerInterval();
  return (
    <>
      <Box
        position="absolute"
        marginTop="13px"
        left={start * horizontalScale}
        width={(end - start) * horizontalScale}
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
    </>
  );
};

const Scheduler = (props: SchedulerProps) => {
  const { horizontalScale } = props;

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
      <SchedulerInterval {...props} />
      <Wrapper marginTop="40px">
        <SchedulerViewers {...props} />
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

const ScheduleData = ({ end }: SchedulerProps) => {
  const { scheduleData } = useScheduleData(0, end);

  return <CodeViewer name="Schedule Data">{removeNonSerializableProps(scheduleData)}</CodeViewer>;
};

export const SchedulerInspector = (props: SchedulerInspectorProps) => {
  const [start, setStart] = useState(0);
  const [end, setTotalBeats] = useState(props.end);

  return (
    <Tabs
      items={[
        {
          label: 'Visualizer',
          component: () => <Scheduler {...props} start={start} end={end} />,
        },
        {
          label: 'Schedule Data',
          component: () => <ScheduleData {...props} start={start} end={end} />,
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
        value={end}
        min="0"
        max="100"
        onChange={(event) => {
          setTotalBeats(parseInt(event.target.value, 10));
        }}
      />
    </Tabs>
  );
};
