import prisma from '../../db';
import { HttpError } from '../../utils/error';
import { ICreateAdminPayload } from './types';

const createAdmin = async (payload: ICreateAdminPayload) => {
  const { userId, telegramId, hromadaIds, settlementIds } = payload;

  if (!userId && !telegramId) {
    throw new HttpError(400, 'Provide id or telegram id of new admin user');
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId || undefined,
      telegramId: telegramId || undefined,
    },
    select: {
      id: true,
    },
  });

  if (!user) {
    throw new HttpError(404, 'User cannot be found');
  }

  if (!hromadaIds?.length && !settlementIds?.length) {
    throw new HttpError(400, 'Provide at least one hromada or settlement for new admin');
  }

  if (hromadaIds?.length) {
    const hromadas = await prisma.hromada.findMany({
      where: {
        id: { in: hromadaIds },
      },
      select: {
        id: true,
      },
    });

    if (hromadas.length !== hromadaIds.length) {
      throw new HttpError(404, 'Some hromadas cannot be found');
    }
  }

  if (settlementIds?.length) {
    const settlements = await prisma.settlement.findMany({
      where: {
        id: { in: settlementIds },
      },
      select: {
        id: true,
      },
    });

    if (settlements.length !== settlementIds.length) {
      throw new HttpError(404, 'Some settlements cannot be found');
    }
  }

  const newAdmin = await prisma.admin.create({
    data: {
      userId: user.id,
      hromadas: hromadaIds?.length
        ? {
            createMany: {
              data: hromadaIds.map((h) => ({ hromadaId: h })),
            },
          }
        : undefined,
      settlements: settlementIds?.length
        ? {
            createMany: {
              data: settlementIds.map((s) => ({ settlementId: s })),
            },
          }
        : undefined,
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
  });

  return newAdmin;
};

export default createAdmin;
