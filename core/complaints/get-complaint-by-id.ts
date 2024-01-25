import prisma from '../db';
import { HttpError } from '../utils/error';
import { IGetComplaintByIdPayload } from './types';

const getComplaintById = async (payload: IGetComplaintByIdPayload) => {
  const { id } = payload;

  const complaint = await prisma.complaint.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      settlement: {
        select: {
          id: true,
          name: true,
          hromada: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      shelterName: true,
      complainant: {
        select: {
          username: true,
          fullName: true,
          phoneNumber: true,
        },
      },
      reasonType: true,
      reason: true,
    },
  });

  if (!complaint) {
    throw new HttpError(404, 'Complaint cannot be found');
  }

  return complaint;
};

export default getComplaintById;
