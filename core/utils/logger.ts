import winston, { format, transports } from 'winston';
import * as util from 'util';
import colors from 'colors';

const { NODE_ENV } = process.env;

const production = NODE_ENV !== 'development';

const logger = winston.createLogger({
  exitOnError: false,
  transports: [
    new transports.Console({
      format: format.combine(
        format.label({ label: '[Open Khust Shelter Bot]', message: false }),
        format.timestamp({ format: 'YYYY-MM-DDTHH:mm:ss.SSSZ' }),
        format.printf((data) => {
          // eslint-disable-next-line prefer-const
          let { label, timestamp, level, message } = data;

          const header = `${colors.cyan(label)} ${level[0].toUpperCase() + level.slice(1)}  ${colors.yellow(timestamp)}: `;

          if (typeof message === 'object') {
            message = util.inspect(message, { depth: null, colors: true });
          }

          return header + message;
        }),
        production ? format.uncolorize() : format.colorize()
      ),
    }),
  ],
});

logger.error = (data) => {
  if (data instanceof Error) {
    return logger.log({ level: 'error', message: data.stack || data.toString() });
  } else {
    return logger.log({ level: 'error', message: data });
  }
};

export default logger;
