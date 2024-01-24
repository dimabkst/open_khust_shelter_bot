import { ComplaintReasonType } from '@prisma/client';

export interface ICreateComplainantPayload {
  telegramId: string;
  userName?: string;
  fullName?: string;
  phoneNumber?: string;
}

export interface ICreateComplaintPayload {
  shelterId: string;
  complainantId: string;
  reasonType: ComplaintReasonType;
  reason?: string;
}
