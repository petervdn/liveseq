import { Text, TextProps } from './Text';

type LabelProps = {
  children: React.ReactNode;
} & Omit<TextProps, 'fontSize' | 'as'>;

export const Label = ({ children, ...props }: LabelProps) => {
  return (
    <Text {...props} as="span" fontSize={12}>
      {children}
    </Text>
  );
};
