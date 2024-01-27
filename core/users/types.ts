export interface IUpsertUserPayload {
  telegramId: string;
  isBot: boolean;
  firstName: string;
  lastName?: string;
  username?: string;
  languageCode?: string;
}

export interface IGetUserByTelegramId {
  telegramId: string;
  raiseError?: boolean;
}
