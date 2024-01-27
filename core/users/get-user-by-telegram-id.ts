import prisma from '../db';
import { HttpError } from '../utils/error';
import { IGetUserByTelegramId } from './types';

const getUserByTelegramId = async (payload: IGetUserByTelegramId) => {
  const { telegramId, raiseError = true } = payload;

  const user = await prisma.user.findUnique({
    where: {
      telegramId,
    },
    select: {
      id: true,
      username: true,
      firstName: true,
      lastName: true,
      phoneNumber: true,
      admin: {
        select: {
          id: true,
          isSuperAdmin: true,
        },
      },
    },
  });

  if (!user && raiseError) {
    throw new HttpError(404, 'Complaint cannot be found');
  }

  return user;
};

export default getUserByTelegramId;
