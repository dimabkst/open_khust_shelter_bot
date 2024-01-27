import { BotContext } from '../types';

const commandsWrapper = (commandFunc: (ctx: BotContext) => Promise<any>) => {
  return async (ctx: BotContext) => {
    await ctx.conversation.exit();

    await commandFunc(ctx);
  };
};

export default commandsWrapper;
