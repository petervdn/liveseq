import type React from 'react';
import { Text } from './Text';
import { Box } from './Box';

type ButtonProps = {
  // add more as needed
  children: string;
  onClick: React.HTMLAttributes<HTMLButtonElement>['onClick'];
};

export const Button = ({ children, onClick }: ButtonProps) => {
  return (
    <Box as="button" type="button" onClick={onClick}>
      <Text>{children}</Text>
    </Box>
  );
};
