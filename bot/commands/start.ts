import { BotContext } from '../types';

export const startUserSuggestionInfo = { command: 'start', description: 'Запуск бота' };

const start = (ctx: BotContext) => {
  ctx.reply(
    `Вітаємо, ${ctx.message.from.first_name}! Цей бот було створено для вирішення проблем, що стосуються укриттів Хустського району під час повітряної тривоги`
  );
};

export default start;
