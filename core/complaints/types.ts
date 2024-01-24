import { ComplaintReasonType } from '@prisma/client';

export interface ICreateComplainantPayload {
  telegramId: number;
  username?: string;
  fullName?: string;
  phoneNumber?: string;
}

export interface ICreateComplaintPayload {
  shelterId: string;
  complainantId: string;
  reasonType: ComplaintReasonType;
  reason?: string;
}

export interface IGetComplaintByIdPayload {
  id: string;
}
