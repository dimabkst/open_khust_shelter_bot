export interface ICreateUserPayload {
  telegramId: number;
  isBot: boolean;
  firstName: string;
  lastName?: string;
  username?: string;
  languageCode?: string;
}

export interface IGetUserByTelegramId {
  telegramId: number;
}
