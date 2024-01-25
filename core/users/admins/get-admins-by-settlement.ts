import prisma from '../../db';
import { IGetAdminsBySettlement } from './types';

const getAdminsBySettlement = async (payload: IGetAdminsBySettlement) => {
  const { settlementId } = payload;

  const admins = await prisma.admin.findMany({
    where: {
      OR: [
        {
          settlements: {
            some: {
              settlementId,
            },
          },
        },
        {
          hromadas: {
            some: {
              hromada: {
                settlements: {
                  some: {
                    id: settlementId,
                  },
                },
              },
            },
          },
        },
      ],
    },
    select: {
      id: true,
      user: {
        select: {
          id: true,
          telegramId: true,
        },
      },
    },
    distinct: ['id'],
  });

  return admins;
};

export default getAdminsBySettlement;
