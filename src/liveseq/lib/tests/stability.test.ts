import { propsForTests } from '../utils/propsForTests';
import { createLiveseq } from '../liveseq';
import { isStable } from '../utils/isStable';

it("doesn't throw when using its functions on init", () => {
  expect(() => {
    propsForTests.forEach((props) => isStable(createLiveseq(props), true));
  }).not.toThrow();
});
