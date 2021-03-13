// TODO: define union for all action types
// todo: how does global action relate to ActionType (are these type props even actiontypes?)
export type GlobalAction =
  | {
      type: 'playSlots';
      // optional, if not present means all
      slotIds?: Array<string>;
    }
  | {
      type: 'stopSlots';
      // optional, if not present means all
      slotIds?: Array<string>;
    };
