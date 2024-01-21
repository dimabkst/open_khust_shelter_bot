import { webhookCallback } from 'grammy';
import { BotInstance } from '../types';

export const expressWebhookCallback = (bot: BotInstance) => webhookCallback(bot, 'express');
