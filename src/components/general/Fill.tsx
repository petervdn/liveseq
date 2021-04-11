import { Box } from './Box';

export type FillProps = {
  color: string;
  opacity?: number;
  margin?: number;
};

export const Fill = ({ margin = 0, color, opacity = 1 }: FillProps) => {
  return (
    <Box
      position="absolute"
      top={margin}
      bottom={margin}
      left={margin}
      right={margin}
      style={{
        backgroundColor: color,
        opacity,
      }}
    />
  );
};
