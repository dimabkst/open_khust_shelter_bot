import { Composer } from 'grammy';
import { createConversation } from '@grammyjs/conversations';
import { BotContext } from '../types';
import complaintConversation from './complaint';
import addAdminConversation from './add-admin';
import deleteAdminConversation from './delete-admin';
import handleBotError from '../utils/error';

const conversationsList = {
  complaintConversation,
  addAdminConversation,
  deleteAdminConversation,
};

const conversations = new Composer<BotContext>();

Object.entries(conversationsList).forEach(([conversationName, conversationFunc]) =>
  conversations.errorBoundary((err) => handleBotError(err), createConversation(conversationFunc, conversationName))
);

export default conversations;
