import prisma from '../../db';
import { IGetAdminsBySettlementPayload } from './types';

const getAdminsBySettlement = async (payload: IGetAdminsBySettlementPayload) => {
  const { settlementId } = payload;

  const admins = await prisma.admin.findMany({
    where: {
      OR: [
        {
          isSuperAdmin: true,
        },
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
