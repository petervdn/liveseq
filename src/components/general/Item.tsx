import type React from 'react';
import { Box } from './Box';

const variants = {
  regular: 'blue',
  highlighted: 'yellow',
  active: 'lime',
};

export type ItemProps = {
  children: React.ReactNode;
  // style: React.HTMLAttributes<HTMLDivElement>['style'];
  horizontalScale: number;
  verticalScale: number;
  height: number;
  width: number;
  bottom: number;
  left: number;
  variant?: keyof typeof variants;
};

export const Item = ({
  children,
  height,
  width,
  bottom,
  left,
  horizontalScale,
  verticalScale,
  variant = 'regular',
}: ItemProps) => {
  return (
    <Box
      position="absolute"
      height={height}
      width={width * horizontalScale - 1}
      bottom={bottom * verticalScale}
      left={left * horizontalScale}
      style={{
        // TODO: expose these from box
        border: `1px solid ${variants[variant]}`,
        background: 'rgba(0, 0, 0, 0.5)',
      }}
    >
      {children}
    </Box>
  );
};
