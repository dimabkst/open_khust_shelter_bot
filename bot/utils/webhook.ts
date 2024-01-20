import { Bot, webhookCallback } from 'grammy';

export const expressWebhookCallback = (bot: Bot) => webhookCallback(bot, 'express');
