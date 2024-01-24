import prisma from '../db';
import { paginate, responsePayload } from '../utils/pagination';
import { IGetSheltersPayload } from './types';

const getShelters = async (payload: IGetSheltersPayload) => {
  const { limit, page } = payload;

  const pagination = paginate(limit, page);

  const countQuery = prisma.shelter.count({});

  const getQuery = prisma.shelter.findMany({
    ...pagination,
  });

  const [shelters, count] = await Promise.all([getQuery, countQuery]);

  return responsePayload(count, shelters);
};

export default getShelters;
