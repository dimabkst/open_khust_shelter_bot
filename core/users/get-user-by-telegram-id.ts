import prisma from '../db';
import { HttpError } from '../utils/error';
import { IGetUserByTelegramId } from './types';

const getUserByTelegramId = async (payload: IGetUserByTelegramId) => {
  const { telegramId } = payload;

  const user = await prisma.user.findUnique({
    where: {
      telegramId,
    },
    select: {
      id: true,
    },
  });

  if (!user) {
    throw new HttpError(404, 'Complaint cannot be found');
  }

  return user;
};

export default getUserByTelegramId;
