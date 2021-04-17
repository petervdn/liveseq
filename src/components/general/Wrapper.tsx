import { forwardRef } from 'react';
import { Box, BoxProps } from './Box';

export type WrapperProps = {
  children: React.ReactNode;
} & Pick<BoxProps, 'marginTop' | 'marginBottom' | 'height' | 'padding'>;

export const Wrapper = forwardRef<HTMLDivElement, WrapperProps>(({ children, ...props }, ref) => {
  return (
    <Box {...props} ref={ref} as="div" position="relative">
      {children}
    </Box>
  );
});
