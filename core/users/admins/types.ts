export interface IGetAdminsBySettlementPayload {
  settlementId: number;
}

export interface ICreateAdminPayload {
  userId?: string;
  telegramId?: string;
  hromadaIds?: number[];
  settlementIds?: number[];
}
