import { Bot, session } from 'grammy';
import { conversations as conversationsPlugin } from '@grammyjs/conversations';
import { autoRetry } from '@grammyjs/auto-retry';
import { BotContext, BotInstance } from './types';
import commands from './commands';
import conversations from './conversations';
import close_conversation from './commands/close-conversation';
import { navigationCallbackQueryHandler } from './keyboards/inline/utils';
import setBotInfo from './utils/info';
import handleBotError from './utils/error';
import logger from '../core/utils/logger';

const { BOT_TOKEN } = process.env;

const bot: BotInstance = new Bot<BotContext>(BOT_TOKEN);

// handle telegram flood control, so the bot won't be banned
bot.api.config.use(autoRetry()); // max retries and delay could be provided

// Install the session plugin.
bot.use(
  session({
    initial() {
      // return empty object for now
      return {};
    },
  })
);

// Install the conversations plugin to handle conversations
bot.use(conversationsPlugin());

// set bot info
(async () => await setBotInfo(bot))();

bot.on('callback_query:data', async (ctx, next) => {
  await navigationCallbackQueryHandler(ctx);

  await next();
});

bot.command(close_conversation.name, close_conversation);

bot.use(conversations);

bot.use(commands);

// handle not caught callback queries
bot.on('callback_query:data', async (ctx) => {
  logger.info('Unknown button event with payload', ctx.callbackQuery.data);

  await ctx.answerCallbackQuery(); // remove loading animation
});

bot.catch(handleBotError);

export default bot;
