import { ComplaintReasonType } from '@prisma/client';

export interface ICreateComplaintPayload {
  settlementId: number;
  shelterName: string;
  complainant: {
    telegramId: string;
    username?: string;
    fullName?: string;
    phoneNumber?: string;
  };
  reasonType: ComplaintReasonType;
  reason?: string;
}

export interface IGetComplaintByIdPayload {
  id: string;
}
