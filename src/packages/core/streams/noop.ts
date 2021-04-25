import createSubject from 'callbag-subject';

export const createNoop$ = () => {
  return createSubject<never>();
};
