export const multiplePick = <T, F extends Array<keyof T>>(obj: T, keys: F): Pick<T, (typeof keys)[number]> => {
  const res: any = {};

  keys.forEach((k) => {
    res[k] = obj[k];
  });

  return res;
};
