import { BotContext } from '../types';

export const complainUserSuggestionInfo = { command: 'complain', description: 'Подати заявку' };

const complain = async (ctx: BotContext) => {
  await ctx.conversation.enter('complaint');
};

export default complain;
