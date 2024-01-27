import { Composer } from 'grammy';
import { createConversation } from '@grammyjs/conversations';
import { BotContext } from '../types';
import complaint from './complaint';
import addAdmin from './add-admin';
import handleBotError from '../utils/error';

const conversationsList = {
  complaint,
  addAdmin,
};

const conversations = new Composer<BotContext>();

Object.entries(conversationsList).forEach(([conversationName, conversationFunc]) =>
  conversations.errorBoundary((err) => handleBotError(err), createConversation(conversationFunc, conversationName))
);

export default conversations;
