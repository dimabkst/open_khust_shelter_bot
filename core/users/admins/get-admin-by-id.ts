import prisma from '../../db';
import { HttpError } from '../../utils/error';
import { IGetAdminByIdPayload } from './types';

const getAdminById = async (payload: IGetAdminByIdPayload) => {
  const { adminId, raiseError = true } = payload;

  const admin = await prisma.admin.findUnique({
    where: {
      id: adminId,
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

  if (!admin && raiseError) {
    throw new HttpError(404, 'Admin cannot be found');
  }

  return admin;
};

export default getAdminById;
