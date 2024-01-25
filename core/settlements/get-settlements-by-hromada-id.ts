import prisma from '../db';
import { IGetSettlementsPayload } from './types';
import { paginate, responsePayload } from '../utils/pagination';
import { HttpError } from '../utils/error';

const getSettlementsByHromadaId = async (payload: IGetSettlementsPayload) => {
  const { limit, page, hromadaId } = payload;

  const hromada = await prisma.hromada.findUnique({
    where: {
      id: hromadaId,
    },
    select: {
      id: true,
    },
  });

  if (!hromada) {
    throw new HttpError(404, 'Hromada cannot be found');
  }

  const pagination = paginate(limit, page);

  const countQuery = prisma.settlement.count({
    where: {
      hromadaId,
    },
  });

  const getQuery = prisma.settlement.findMany({
    where: {
      hromadaId,
    },
    select: {
      id: true,
      name: true,
    },
    ...pagination,
  });

  const [settlements, count] = await Promise.all([getQuery, countQuery]);

  return responsePayload(count, settlements);
};

export default getSettlementsByHromadaId;
