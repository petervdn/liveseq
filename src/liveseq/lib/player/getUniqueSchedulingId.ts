// the props that make a note be considered the same note to the scheduler
export type UniqueSchedulingIdProps = {
  offset: number;
  noteId: string;
  channelId: string;
  slotId: string;
  clipId: string;
};

// todo: i dont think we can rely on the prop order when converting to string? most likely they will be the same, especially on the same client but i would just write them out fully
export const getUniqueSchedulingId = (props: UniqueSchedulingIdProps) => JSON.stringify(props);
