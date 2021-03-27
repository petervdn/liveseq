import { propsForTests } from '../lib/utils/propsForTests';
import { createLiveseq } from '../lib/liveseq';
import { isStable } from '../lib/utils/isStable';

it("doesn't throw when using its functions on init", () => {
  expect(() => {
    propsForTests.forEach((props) => isStable(createLiveseq(props), true));
  }).not.toThrow();
});
