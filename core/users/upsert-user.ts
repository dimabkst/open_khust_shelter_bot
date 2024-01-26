import prisma from '../db';
import { IUpsertUserPayload } from './types';

const upsertUser = async (payload: IUpsertUserPayload) => {
  const { lastName, username, languageCode, ...createPayload } = payload;

  const user = await prisma.user.upsert({
    where: {
      telegramId: createPayload.telegramId,
    },
    update: {
      firstName: createPayload.firstName,
      username: username || undefined,
      lastName: lastName || undefined,
      languageCode: languageCode || undefined,
    },
    create: {
      ...createPayload,
      username: username || undefined,
      lastName: lastName || undefined,
      languageCode: languageCode || undefined,
    },
    select: {
      id: true,
    },
  });

  return user;
};

export default upsertUser;
