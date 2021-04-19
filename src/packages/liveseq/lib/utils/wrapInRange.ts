export const wrapInRange = (
  value: number,
  { start, end }: { start: number; end: number },
): number => {
  return start + ((value - start) % (end - start));
};
