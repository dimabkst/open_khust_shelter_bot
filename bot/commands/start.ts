import { Context } from 'grammy';

export const startUserSuggestionInfo = { command: 'start', description: 'Start the bot' };

const start = (ctx: Context) => {
  ctx.reply('Hello world!');
};

export default start;
