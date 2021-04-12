import { Text, TextProps } from './Text';

const sizesPerLevel = {
  h1: 89,
  h2: 55,
  h3: 34,
  h4: 21,
  h5: 13,
  h6: 9,
};

export type HeadingLevel = keyof typeof sizesPerLevel;

type HeadingProps = {
  sizeLevel: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
} & Omit<TextProps, 'fontSize' | 'as'>;

export const Heading = ({ sizeLevel, children, marginTop = 0, ...props }: HeadingProps) => {
  const headingLevel = `h${sizeLevel}` as HeadingLevel;
  return (
    <Text {...{ ...props, marginTop }} as={headingLevel} fontSize={sizesPerLevel[headingLevel]}>
      {children}
    </Text>
  );
};
