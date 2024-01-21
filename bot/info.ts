import { Bot } from 'grammy';
import { commandsUserSuggestions } from './commands';
import { handleInternalBotError } from './utils/error';

const botDescription = `Bot's description`;

const botName = 'Open Khust Shelter Bot';

const botShortDescription = `Bot's short description`;

const setBotInfo = async (bot: Bot) => {
  try {
    await bot.api.setMyCommands(commandsUserSuggestions);

    await bot.api.setMyDescription(botDescription);

    await bot.api.setMyName(botName);

    await bot.api.setMyShortDescription(botShortDescription);
  } catch (e) {
    handleInternalBotError(e);
  }
};

export default setBotInfo;
