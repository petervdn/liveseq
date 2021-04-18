import { useState } from 'react';
import { Box } from './Box';
import { Button } from './Button';

export type TabsProps = {
  items: Array<{
    component: () => JSX.Element;
    label: string;
  }>;
  children?: React.ReactNode;
};

export const Tabs = ({ items, children, ...props }: TabsProps) => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  return (
    <Box {...props} position="relative">
      {items.map(({ label }, index) => {
        return (
          <Button
            key={label}
            isActive={index === activeTabIndex}
            onClick={() => setActiveTabIndex(index)}
          >
            {label}
          </Button>
        );
      })}
      {children}
      {items[activeTabIndex].component()}
    </Box>
  );
};
