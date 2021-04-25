import { useEffect, useRef } from 'react';
import { useLiveseqContext } from '../../packages/sequencer';
import { Wrapper } from '../general/Wrapper';
import { Box } from '../general/Box';

import { SchedulerInterval } from './SchedulerInterval';
import { SchedulerViewers, SchedulerViewersProps } from './SchedulerViewers';

export const Scheduler = (props: SchedulerViewersProps) => {
  const { horizontalScale } = props;

  const liveseq = useLiveseqContext();
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isLooping = true;
    const handleLoop = () => {
      // TODO: put back, but via raf stream with progress
      // if (wrapperRef.current) {
      //   const progress = liveseq.getProgressInBeats();
      //   wrapperRef.current.style.transform = `translate(${progress * horizontalScale}px, 0px)`;
      // }

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
