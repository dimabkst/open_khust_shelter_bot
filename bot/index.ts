import { Bot } from 'grammy';
import { autoRetry } from '@grammyjs/auto-retry';
import commands, { commandsUserSuggestions } from './commands';
import handleBotError from './utils/error';

const { BOT_TOKEN } = process.env;

const bot = new Bot(BOT_TOKEN);

// handle telegram flood control, so the bot won't be banned
bot.api.config.use(autoRetry()); // max retries and delay could be provided

// set bot commands suggestions
(async () => await bot.api.setMyCommands(commandsUserSuggestions))();

bot.use(commands);

bot.catch(handleBotError);

export default bot;
