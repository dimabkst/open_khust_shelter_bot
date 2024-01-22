import fs from 'fs/promises';
import { ISavedBotInfo } from './types';
import logger from './logger';

export const saveBotInfo = async (payload: ISavedBotInfo) => {
  await fs.writeFile('core/db/bot-info.json', JSON.stringify(payload), { encoding: 'utf-8' });

  logger.info('Bot info file has been saved');
};

export const getBotInfo = async () => {
  try {
    const fileBuffer = await fs.readFile('core/db/bot-info.json', { encoding: 'utf-8' });

    logger.info('Bot info file has been read');

    const storedBotInfo = JSON.parse(fileBuffer) as ISavedBotInfo;

    return storedBotInfo;
  } catch (e) {
    return;
  }
};
