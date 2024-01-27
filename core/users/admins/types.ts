import { IPaginationPayload } from '../../utils/types';

export interface IGetAdminsPayload extends IPaginationPayload {}

export interface IGetAdminByIdPayload {
  adminId: string;
  raiseError?: boolean;
}

export interface IGetAdminsBySettlementPayload {
  settlementId: number;
}

export interface ICreateAdminPayload {
  userId?: string;
  hromadaIds?: number[];
  settlementIds?: number[];
}

export interface IDeleteAdminPayload {
  adminId?: string;
}
