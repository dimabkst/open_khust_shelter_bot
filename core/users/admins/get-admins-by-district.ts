import prisma from '../../db';
import { IGetAdminsByDistrict } from './types';

const getAdminsByDistrict = async (payload: IGetAdminsByDistrict) => {
  const { district } = payload;

  const admins = await prisma.admin.findMany({
    where: {
      districts: {
        has: district,
      },
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

  return admins;
};

export default getAdminsByDistrict;
