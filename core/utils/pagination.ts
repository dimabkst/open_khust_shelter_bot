import { IPagination } from './types';

export const paginate = (limit, page): IPagination => {
  const pagination: IPagination = {};

  if (limit) {
    Object.assign(pagination, {
      take: Number(limit),
    });
  }

  if (limit && page) {
    Object.assign(pagination, {
      skip: Number(limit) * (Number(page) - 1),
    });
  }

  return pagination;
};

export const responsePayload = <T>(count: number, rows: Array<T>, meta?: object) => ({ count, ...meta, rows });
