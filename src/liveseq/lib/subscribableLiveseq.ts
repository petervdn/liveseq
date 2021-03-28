// TODO: maybe move this to a new file
import { createPubSub, PubSub } from './utils/pubSub';
import { createLiveseq, PartialLiveseqProps } from './liveseq';

export type SubscriptionEvents = 'playbackChange' | 'tempoChange';
export type LiveseqPubSub = PubSub<SubscriptionEvents>;
export type SubscribableLiveseq = ReturnType<typeof createSubscribableLiveseq>;

export const createSubscribableLiveseq = (props: PartialLiveseqProps) => {
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
