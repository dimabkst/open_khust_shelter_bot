import fs from 'fs/promises';
import path from 'path';
import { ISavedBotInfo } from './types';
import logger from './logger';

const fileDirectory = path.join(__dirname, '../db/bot-info.json');

export const saveBotInfo = async (payload: ISavedBotInfo) => {
  await fs.writeFile(fileDirectory, JSON.stringify(payload), { encoding: 'utf-8' });

  logger.info('Bot info file has been saved');
};

export const getBotInfo = async () => {
  try {
    const fileBuffer = await fs.readFile(fileDirectory, { encoding: 'utf-8' });

    logger.info('Bot info file has been read');

    const storedBotInfo = JSON.parse(fileBuffer) as ISavedBotInfo;

    return storedBotInfo;
  } catch (e) {
    return;
  }
};
