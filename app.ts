require('dotenv').config();
import express, { Express } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import logger from './core/utils/logger';
import prisma from './core/db';
import bot from './bot';
import { expressWebhookCallback } from './bot/utils/webhook';

const { NODE_ENV, PORT } = process.env;

const app: Express = express();

app.use(bodyParser.json());
app.use(cors());

const checkDb = async () => {
  await prisma.$connect();
};

checkDb()
  .then(() => {
    logger.info('Database successfully connected');

    if (NODE_ENV === 'development') {
      bot.start();

      logger.info(`Bot started`);
    } else {
      const port = PORT || 8081;

      app.use(express.json());

      app.use(`/${bot.token}`, expressWebhookCallback(bot));

      app.listen(port, () => logger.info(`Application started on port ${port}!`));
    }
  })
  .catch((e) => {
    logger.error(e);
    process.exit(1);
  });
