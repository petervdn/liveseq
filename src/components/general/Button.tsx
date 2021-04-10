import type React from 'react';
import { Text } from './Text';

type ButtonProps = {
  // add more as needed
  children: string;
  onClick: React.HTMLAttributes<HTMLButtonElement>['onClick'];
};

export const Button = ({ children, onClick }: ButtonProps) => {
  return (
    <button type="button" onClick={onClick}>
      <Text>{children}</Text>
    </button>
  );
};
