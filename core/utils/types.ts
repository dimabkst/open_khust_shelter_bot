export interface IHttpErrorMeta extends Record<string, any> {
  message?: void;
  uniqueError?: true;
  deliveredQuantityError?: true;
}

export type BotCommand = {
  command: string;
  description: string;
};

export interface ISavedBotInfo {
  name: string;
  description: string;
  shortDescription: string;
  commands: BotCommand[];
}

export interface IPaginationPayload {
  limit?: string;
  page?: string;
}

export interface IPagination {
  take?: number;
  skip?: number;
}
