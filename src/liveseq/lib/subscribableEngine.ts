// TODO: maybe move this to a new file
import { createPubSub, PubSub } from './utils/pubSub';
import { createLiveseq, LiveseqProps } from './liveseq';

export type SubscriptionEvents = 'playbackChange' | 'tempoChange';
export type LiveseqPubSub = PubSub<SubscriptionEvents>;
export type SubscribableEngine = ReturnType<typeof createSubscribableEngine>;

export const createSubscribableEngine = (props: LiveseqProps) => {
  const pubSub = createPubSub() as LiveseqPubSub;

  const liveseq = createLiveseq({
    ...props,
    onPlay: () => {
      props.onPlay && props.onPlay();
      pubSub.dispatch('playbackChange');
    },
    onStop: () => {
      props.onStop && props.onStop();
      pubSub.dispatch('playbackChange');
    },
    onTempoChange: () => {
      props.onTempoChange && props.onTempoChange();
      pubSub.dispatch('tempoChange');
    },
  });

  return {
    ...liveseq,
    subscribe: pubSub.subscribe,
  };
};
