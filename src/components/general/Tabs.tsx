import { useState } from 'react';
import { Box } from './Box';
import { Button } from './Button';

export type TabsProps = {
  items: Array<{
    component: () => JSX.Element;
    label: string;
  }>;
};

export const Tabs = ({ items, ...props }: TabsProps) => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  return (
    <Box {...props} position="relative">
      {items.map(({ label }, index) => {
        return (
          <Button key={label} onClick={() => setActiveTabIndex(index)}>
            {label}
          </Button>
        );
      })}

      {items[activeTabIndex].component()}
    </Box>
  );
};
