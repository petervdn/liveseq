// Usage
// const pubSub = createPubSub<'hello' | 'hi', {message:string}>()
// const unsubscribe = pubSub.subscribe('hello', (props) => {
//   console.log('action:', 'hello', 'props:',props)
// })
// pubSub.dispatch('hello', {message: 'welcome'})
// unsubscribe()
// pubSub.dispatch('hello', {message: 'welcome'})
// pubSub.dispose()

import type { LiveseqState } from '../store/store';

export type PubSub<EventName extends string, CallbackProps> = {
  dispatch: (eventName: EventName, props: CallbackProps) => void;
  subscribe: (eventName: EventName, callback: (props: CallbackProps) => void) => () => void;
  dispose: () => void;
};

// These 2 types below are the concrete types for the pub sub, maybe move somewhere to keep this generic
export type SubscriptionEvents = 'playbackChange' | 'tempoChange';
export type LiveseqPubSub = PubSub<SubscriptionEvents, LiveseqState>;

export const createPubSub = <EventName extends string, CallbackProps>(
  onDispatch?: (eventName: EventName, props: CallbackProps) => void,
): PubSub<EventName, CallbackProps> => {
  // TODO: use an object to find by eventName without running through the whole array
  let subscriptions: Array<{
    eventName: EventName;
    callback: (props: CallbackProps) => void;
  }> = [];

  const subscribe = (eventName: EventName, callback: (props: CallbackProps) => void) => {
    const subscription = {
      eventName,
      callback,
    };

    subscriptions.push(subscription);

    const unsubscribe = () => {
      const index = subscriptions.indexOf(subscription);
      // mutation!
      index !== -1 && subscriptions.splice(index, 1);
    };

    return unsubscribe;
  };

  const dispatch = (eventName: EventName, props: CallbackProps) => {
    onDispatch && onDispatch(eventName, props);

    subscriptions.forEach((subscription) => {
      if (subscription.eventName !== eventName) return;

      subscription.callback(props);
    });
  };

  const dispose = () => {
    subscriptions = [];
  };

  return {
    subscribe,
    dispatch,
    dispose,
  };
};
