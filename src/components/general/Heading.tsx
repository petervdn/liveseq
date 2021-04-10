import { Text } from './Text';

const sizesPerLevel = {
  h1: 89,
  h2: 55,
  h3: 34,
  h4: 21,
  h5: 13,
  h6: 8,
};

export type HeadingLevel = keyof typeof sizesPerLevel;

type HeadingProps = {
  sizeLevel: 1 | 2 | 3 | 4 | 5 | 6;
  children: string;
};

export const Heading = (props: HeadingProps) => {
  const headingLevel = `h${props.sizeLevel}` as HeadingLevel;
  return (
    <Text as={headingLevel} fontSize={sizesPerLevel[headingLevel]}>
      {props.children}
    </Text>
  );
};
