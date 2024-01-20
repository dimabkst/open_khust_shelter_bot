import { BotError, GrammyError, HttpError } from 'grammy';
import logger from '../../core/utils/logger';
import handleError from '../../core/utils/error';

const logBotError = (err: BotError) => {
  const ctx = err.ctx;

  logger.error(`Error while handling update ${ctx.update.update_id}:`);

  const e = err.error;

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

const handleBotError = (err: BotError) => {
  logBotError(err);
};

export default handleBotError;
