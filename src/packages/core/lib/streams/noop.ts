import createSubject from 'callbag-subject';

export const createNoopSource = () => {
  return createSubject<never>();
};
