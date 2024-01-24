import { Composer } from 'grammy';
import start, { startUserSuggestionInfo } from './start';
import complain, { complainUserSuggestionInfo } from './complain';
import { BotContext } from '../types';

export const commandsUserSuggestions: { command: string; description: string }[] = [
  startUserSuggestionInfo,
  complainUserSuggestionInfo,
];

const commandsList = {
  start,
  complain,
};

const commands = new Composer<BotContext>();

Object.entries(commandsList).forEach(([commandName, commandFunc]) => commands.command(commandName, commandFunc));

export default commands;
