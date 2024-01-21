import { BotError, GrammyError, HttpError } from 'grammy';
import logger from '../../core/utils/logger';
import handleError from '../../core/utils/error';

// log internal bot errors from both user and non-user calls
const logBotInternalError = (e: any) => {
  let logMessage: string;

  let shouldLogError = true;

  if (e instanceof GrammyError) {
    logMessage = `Error in request. ${e.description}`;
  } else if (e instanceof HttpError) {
    logMessage = `Could not contact Telegram. ${e}`;
  } else if (e instanceof Error) {
    handleError(e);

    shouldLogError = false;
  } else {
    logMessage = 'Unknown error.';
  }

  if (logMessage) {
    logger.error(logMessage);
  }

  if (shouldLogError) {
    logger.error(e);
  }
};

// handle internal bot errors from both user and non-user calls
export const handleInternalBotError = (e: any) => {
  logBotInternalError(e);
};

// log errors from bot.catch
const logBotError = (err: BotError) => {
  const ctx = err.ctx;

  logger.error(`Error while handling update ${ctx.update.update_id}:`);

  const e = err.error;

  logBotInternalError(e);
};

// handle errors from bot.catch
const handleBotError = (err: BotError) => {
  logBotError(err);
};

export default handleBotError;
