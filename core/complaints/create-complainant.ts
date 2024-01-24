import prisma from '../db';
import { ICreateComplainantPayload } from './types';

const createComplainant = async (payload: ICreateComplainantPayload) => {
  const { telegramId, username, fullName, phoneNumber } = payload;

  const complainant = await prisma.complainant.create({
    data: {
      telegramId,
      username: username || undefined,
      fullName: fullName || undefined,
      phoneNumber: phoneNumber || undefined,
    },
    select: {
      id: true,
    },
  });

  return complainant;
};

export default createComplainant;
