import { handleInternalBotError } from './error';
import { BotInstance } from '../types';
import { commandsUserSuggestions } from '../commands';
import { getBotInfo, saveBotInfo } from '../../core/utils/bot-info';
import { BotCommand } from '../../core/utils/types';

const botInfo = {
  name: 'Open Khust Shelter Bot',
  description: `Bot's description`,
  shortDescription: `Bot's short description`,
  commands: commandsUserSuggestions,
};

const setBotInfo = async (bot: BotInstance) => {
  try {
    const botInfoUpdateCommands = {
      name: (name: string) => bot.api.setMyName(name),
      description: (description: string) => bot.api.setMyDescription(description),
      shortDescription: (shortDescription: string) => bot.api.setMyShortDescription(shortDescription),
      commands: (commands: BotCommand[]) => bot.api.setMyCommands(commands),
    };

    const shouldSetInfo = Object.fromEntries(Object.keys(botInfo).map((key) => [key, false])) as Record<
      keyof typeof botInfo,
      boolean
    >;

    const currentBotInfo = await getBotInfo();

    if (currentBotInfo) {
      Object.keys(botInfo).map(async (key) => {
        if (botInfo[key] !== currentBotInfo[key]) {
          shouldSetInfo[key] = true;
        }
      });
    } else {
      await saveBotInfo(botInfo);
    }

    for (const key of Object.entries(shouldSetInfo)
      .filter(([key, value]) => value)
      .map(([key, value]) => key)) {
      await botInfoUpdateCommands[key](botInfo[key]);

      // commented due to using auto retry plugin
      // to avoid to many requests error
      // setTimeout(() => {}, 1000);
    }
  } catch (e) {
    handleInternalBotError(e);
  }
};

export default setBotInfo;
