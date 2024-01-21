import { Bot, Context, SessionFlavor } from 'grammy';
import { Conversation, ConversationFlavor } from '@grammyjs/conversations';

export interface SessionData {}

export type BotContext = Context & SessionFlavor<SessionData> & ConversationFlavor;

export type BotConversation = Conversation<BotContext>;

export type BotInstance = Bot<BotContext>;
