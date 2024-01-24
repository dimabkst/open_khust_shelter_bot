import { Bot, session } from 'grammy';
import { conversations as conversationsPlugin } from '@grammyjs/conversations';
import { autoRetry } from '@grammyjs/auto-retry';
import { BotContext, BotInstance } from './types';
import commands from './commands';
import conversations from './conversations';
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

bot.use(commands);
bot.use(conversations);

bot.command('complain', async (ctx) => {
  await ctx.conversation.enter('complaint');
});

bot.command('close_conversation', async (ctx) => {
  await ctx.conversation.exit();
});

// handle not caught callback queries
bot.on('callback_query:data', async (ctx) => {
  logger.info('Unknown button event with payload', ctx.callbackQuery.data);

  await ctx.answerCallbackQuery(); // remove loading animation
});

bot.catch(handleBotError);

export default bot;
