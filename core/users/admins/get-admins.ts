import prisma from '../../db';
import { paginate, responsePayload } from '../../utils/pagination';
import { IGetAdminsPayload } from './types';

const getAdmins = async (payload: IGetAdminsPayload) => {
  const { limit, page } = payload;

  const pagination = paginate(limit, page);

  const countQuery = prisma.admin.count({});

  const getQuery = prisma.admin.findMany({
    ...pagination,
    where: {
      isSuperAdmin: false,
    },
    select: {
      id: true,
      user: {
        select: {
          id: true,
          telegramId: true,
          username: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });

  const [admins, count] = await Promise.all([getQuery, countQuery]);

  return responsePayload(count, admins);
};

export default getAdmins;
