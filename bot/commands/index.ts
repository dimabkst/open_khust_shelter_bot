import { Composer } from 'grammy';
import start, { startUserSuggestionInfo } from './start';
import complain, { complainUserSuggestionInfo } from './complain';
import get_telegram_id, { getTelegramIdUserSuggestionInfo } from './get-telegram-id';
import add_admin, { addAdminUserSuggestionInfo } from './add-admin';
import delete_admin, { deleteAdminUserSuggestionInfo } from './delete-admin';
import close_conversation, { closeConversationUserSuggestionInfo } from './close-conversation';
import menu, { menuUserSuggestionInfo } from './menu';
import commandsWrapper from './utils';
import { BotContext } from '../types';

export const commandsUserSuggestions: { command: string; description: string }[] = [
  startUserSuggestionInfo,
  complainUserSuggestionInfo,
  closeConversationUserSuggestionInfo,
  menuUserSuggestionInfo,
];

const commandsList = {
  start,
  complain,
  get_telegram_id,
  add_admin,
  delete_admin,
  menu,
};

const commands = new Composer<BotContext>();

Object.entries(commandsList).forEach(([commandName, commandFunc]) => commands.command(commandName, commandsWrapper(commandFunc)));

export default commands;
