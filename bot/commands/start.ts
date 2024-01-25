import { createUser } from '../../core/users';
import { BotContext } from '../types';

export const startUserSuggestionInfo = { command: 'start', description: 'Запуск бота' };

const start = async (ctx: BotContext) => {
  ctx.reply(
    `Вітаємо, ${ctx.message.from.first_name}! Цей бот було створено для вирішення проблем, що стосуються укриттів Хустського району під час повітряної тривоги`
  );

  const user = ctx.from;

  await createUser({
    telegramId: user.id.toString(),
    isBot: user.is_bot,
    firstName: user.first_name,
    lastName: user.last_name,
    username: user.username,
    languageCode: user.language_code,
  });
};

export default start;
