import { BotContext, BotConversation } from '../types';

const complaint = async (conversation: BotConversation, ctx: BotContext) => {
  ctx.reply('Complaint started!');

  // Wait for the next text message update:
  const {
    msg: { text },
  } = await conversation.waitFor('message:text');

  ctx.reply(`You texted: ${text}`);

  ctx.reply('Ending complaint conversation');

  return;
};

export default complaint;
