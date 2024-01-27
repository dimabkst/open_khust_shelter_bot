import { Composer } from 'grammy';
import start, { startUserSuggestionInfo } from './start';
import complain, { complainUserSuggestionInfo } from './complain';
import get_telegram_id, { getTelegramIdUserSuggestionInfo } from './get-telegram-id';
import add_admin, { addAdminUserSuggestionInfo } from './add-admin';
import commandsWrapper from './utils';
import { BotContext } from '../types';

export const commandsUserSuggestions: { command: string; description: string }[] = [
  startUserSuggestionInfo,
  complainUserSuggestionInfo,
];

const commandsList = {
  start,
  complain,
  get_telegram_id,
  add_admin,
};

const commands = new Composer<BotContext>();

Object.entries(commandsList).forEach(([commandName, commandFunc]) => commands.command(commandName, commandsWrapper(commandFunc)));

export default commands;
