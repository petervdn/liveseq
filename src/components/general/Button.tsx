import type React from 'react';
import { Text } from './Text';
import { Box } from './Box';

type ButtonProps = {
  isActive?: boolean;
  isDisabled?: boolean;
  // add more as needed
  children: string;
  onClick: React.HTMLAttributes<HTMLButtonElement>['onClick'];
};

export const Button = ({ children, isActive, onClick, isDisabled }: ButtonProps) => {
  return (
    <Box
      as="button"
      type="button"
      onClick={isDisabled ? undefined : onClick}
      backgroundColor="white"
      color={isActive ? 'blue' : 'black'}
      margin="2px"
      padding="7px 18px"
      style={{
        border: `1px solid ${isActive ? 'red' : 'white'}`,
        // borderRadius: '1000px',
      }}
    >
      <Text>{children}</Text>
    </Box>
  );
};
