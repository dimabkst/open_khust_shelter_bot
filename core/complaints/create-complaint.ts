import prisma from '../db';
import { HttpError } from '../utils/error';
import { ICreateComplaintPayload } from './types';

const createComplaint = async (payload: ICreateComplaintPayload) => {
  const { settlementId, shelterName, complainant, reasonType, reason } = payload;

  const settlement = await prisma.settlement.findUnique({
    where: {
      id: settlementId,
    },
    select: {
      id: true,
    },
  });

  if (!settlement) {
    throw new HttpError(404, 'Settlement cannot be found');
  }

  const user = await prisma.user.findUnique({
    where: {
      telegramId: complainant.telegramId,
    },
    select: {
      id: true,
    },
  });

  const complaint = await prisma.complaint.create({
    data: {
      settlementId,
      shelterName,
      complainant: {
        create: {
          ...complainant,
          userId: user?.id || undefined,
        },
      },
      reasonType,
      reason: reason || undefined,
    },
    select: {
      id: true,
    },
  });

  return complaint;
};

export default createComplaint;
