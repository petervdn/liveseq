import { Box, BoxProps } from './Box';

export type WrapperProps = {
  children: React.ReactNode;
} & Pick<BoxProps, 'marginTop' | 'marginBottom' | 'height' | 'padding'>;

export const Wrapper = ({ children, ...props }: WrapperProps) => {
  return (
    <Box {...props} position="relative">
      {children}
    </Box>
  );
};
