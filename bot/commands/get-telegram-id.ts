import { BotContext } from '../types';

export const getTelegramIdUserSuggestionInfo = {
  command: 'get_telegram_id',
  description: 'Отримати Телеграм ідентифікатор акаунту',
};

const get_telegram_id = async (ctx: BotContext) => {
  const user = ctx.from;

  ctx.reply(`Ваш Телеграм ідентифікатор: ${user.id.toString()}`);
};

export default get_telegram_id;
