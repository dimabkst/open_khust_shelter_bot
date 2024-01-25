import prisma from '../db';
import { paginate, responsePayload } from '../utils/pagination';
import { IGetHromadasPayload } from './types';

const getHromadas = async (payload: IGetHromadasPayload) => {
  const { limit, page } = payload;

  const pagination = paginate(limit, page);

  const countQuery = prisma.hromada.count({});

  const getQuery = prisma.hromada.findMany({
    ...pagination,
    select: {
      id: true,
      name: true,
    },
  });

  const [hromadas, count] = await Promise.all([getQuery, countQuery]);

  return responsePayload(count, hromadas);
};

export default getHromadas;
