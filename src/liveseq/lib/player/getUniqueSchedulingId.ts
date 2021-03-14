// the props that make a note be considered the same note to the scheduler
export type UniqueSchedulingIdProps = {
  iteration: number;
  noteId: string;
  channelId: string;
  slotId: string;
  clipId: string;
};
export const getUniqueSchedulingId = (props: UniqueSchedulingIdProps) => JSON.stringify(props);
