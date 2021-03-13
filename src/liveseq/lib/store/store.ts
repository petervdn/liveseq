import { createPubSub } from '../utils/pubSub';

// simple and lightweight store implementation tuned for this use

type StateChange<State> = { state: State; previousState: State };

export type Store<State, ActionType> = {
  setState: (newState: State) => StateChange<State>;
  subscribe: (actionType: ActionType, callback: (props: StateChange<State>) => void) => () => void;
  dispatch: (actionType: ActionType, props: StateChange<State>) => void;
  getState: () => State;
  dispose: () => void;
};

export const createStore = <State, ActionType extends string>(
  defaultState: State,
  initialState: Partial<State>,
  logger?: (actionType: string, props: unknown) => void,
): Store<State, ActionType> => {
  const pubSub = createPubSub<ActionType, StateChange<State>>(logger);

  let state: State = {
    ...defaultState,
    ...initialState,
  };

  const setState = (newState: State) => {
    const previousState = state;

    // mutation!
    state = newState;

    return { state, previousState };
  };

  const getState = () => {
    return state;
  };

  const dispose = () => {
    pubSub.dispose();
  };

  return {
    subscribe: pubSub.subscribe,
    dispatch: pubSub.dispatch,
    setState,
    getState,
    dispose,
  };
};
