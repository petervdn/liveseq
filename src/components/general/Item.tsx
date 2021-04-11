import type React from 'react';
import { Box } from './Box';

export type ItemProps = {
  children: React.ReactNode;
  // style: React.HTMLAttributes<HTMLDivElement>['style'];
  horizontalScale: number;
  verticalScale: number;
  height: number;
  width: number;
  bottom: number;
  left: number;
};

export const Item = ({
  children,
  height,
  width,
  bottom,
  left,
  horizontalScale,
  verticalScale,
}: ItemProps) => {
  return (
    <Box
      position="absolute"
      height={height}
      width={width * horizontalScale - 1}
      bottom={bottom * verticalScale}
      left={left * horizontalScale}
      style={{
        background: 'rgba(0, 0, 0, 0.7)',
      }}
    >
      {children}
    </Box>
  );
};
