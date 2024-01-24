import prisma from '../db';
import { ICreateUserPayload } from './types';

const createUser = async (payload: ICreateUserPayload) => {
  const { lastName, username, languageCode, ...createPayload } = payload;

  const user = await prisma.user.create({
    data: {
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

export default createUser;
