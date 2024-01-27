import prisma from '../../db';
import { HttpError } from '../../utils/error';
import { IDeleteAdminPayload } from './types';

const deleteAdmin = async (payload: IDeleteAdminPayload) => {
  const { adminId } = payload;

  const admin = await prisma.admin.findUnique({
    where: {
      id: adminId,
    },
    select: {
      id: true,
      isSuperAdmin: true,
    },
  });

  if (!admin) {
    throw new HttpError(404, 'Admin cannot be found');
  }

  if (admin.isSuperAdmin) {
    throw new HttpError(403, 'You cannot delete super admin');
  }

  const deleted = await prisma.admin.delete({
    where: {
      id: adminId,
    },
    select: {
      id: true,
    },
  });

  return deleted;
};

export default deleteAdmin;
