import { BotContext } from '../types';

export const startUserSuggestionInfo = { command: 'start', description: 'Start the bot' };

const start = (ctx: BotContext) => {
  ctx.reply('Hello world!');
};

export default start;
