import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import logger from './logger';
import { IHttpErrorMeta } from './types';

export class HttpError extends Error {
  public readonly isHttpError: boolean = true;
  public readonly name: string = 'HttpError';

  constructor(
    public readonly status: number,
    public readonly message: string,
    public readonly meta?: IHttpErrorMeta
  ) {
    super();

    Error.captureStackTrace(this, this.constructor);
  }
}

const handleError = async <T extends Error>(e: T) => {
  let logMessage: string;

  if (e instanceof HttpError) {
    logMessage = `Http error. Status: ${e.status}. Message: ${e.message}. Meta: ${JSON.stringify(e.meta)}.`;
  } else if (e instanceof PrismaClientKnownRequestError) {
    logMessage = 'Database error.';

    if (e.code === 'P2002') {
      logMessage += ' Unique constraint failed';
    }

    if (e.code === 'P2003' || e.code === 'P2025') {
      logMessage += ' Not found';
    }
  }

  if (logMessage) {
    logger.error(logMessage);
  }

  logger.error(e);
};

export default handleError;
