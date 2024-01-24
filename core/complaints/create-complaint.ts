import prisma from '../db';
import { HttpError } from '../utils/error';
import { ICreateComplaintPayload } from './types';

const createComplaint = async (payload: ICreateComplaintPayload) => {
  const { shelterId, complainantId, reasonType, reason } = payload;

  const shelter = await prisma.shelter.findUnique({
    where: {
      id: shelterId,
    },
    select: {
      id: true,
    },
  });

  if (!shelter) {
    throw new HttpError(404, 'Shelter cannot be found');
  }

  const complainant = await prisma.complainant.findUnique({
    where: {
      id: complainantId,
    },
    select: {
      id: true,
    },
  });

  if (!complainant) {
    throw new HttpError(404, 'Complainant cannot be found');
  }

  const complaint = await prisma.complaint.create({
    data: {
      shelterId,
      complainantId,
      reasons: {
        create: {
          type: reasonType,
          reason,
        },
      },
    },
    select: {
      id: true,
    },
  });

  return complaint;
};

export default createComplaint;
