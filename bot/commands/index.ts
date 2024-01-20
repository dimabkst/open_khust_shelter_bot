import { Composer } from 'grammy';
import start, { startUserSuggestionInfo } from './start';

export const commandsUserSuggestions = [startUserSuggestionInfo];

const commandsList = {
  start,
};

const commands = new Composer();

Object.entries(commandsList).forEach(([commandName, commandFunc]) => commands.command(commandName, commandFunc));

export default commands;
