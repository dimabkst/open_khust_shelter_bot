import { BotContext } from '../types';

export const closeConversationUserSuggestionInfo = { command: 'close_conversation', description: 'Завершити діалог' };

const close_conversation = async (ctx: BotContext) => {
  await ctx.conversation.exit();
};

export default close_conversation;
