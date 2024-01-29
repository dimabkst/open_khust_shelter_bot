import { inlineKeyboardsWithPages } from '.';
import { navigationDirectionsCallbackData } from './navigation';
import { BotContext } from '../../types';

const navigationCallbackQueryRegex = new RegExp(
  `^(${Object.values(navigationDirectionsCallbackData).join('|')}):(${Object.keys(inlineKeyboardsWithPages).join('|')}):\\d+$`
);

export const navigationCallbackQueryHandler = async (ctx: BotContext) => {
  if (ctx.callbackQuery?.data && ctx.callbackQuery.data.match(navigationCallbackQueryRegex)?.length) {
    const callbackQueryDataSplits = ctx.callbackQuery.data.split(':');

    const navigationDirection = callbackQueryDataSplits[0] as keyof typeof navigationDirectionsCallbackData;

    if (navigationDirection !== navigationDirectionsCallbackData.stay) {
      const keyboardFunctionName = callbackQueryDataSplits[1] as keyof typeof inlineKeyboardsWithPages;

      const keyboardFunction = inlineKeyboardsWithPages[keyboardFunctionName];

      const pageNumber = callbackQueryDataSplits[2];

      const newPageNumber = Number(pageNumber) + (navigationDirection === navigationDirectionsCallbackData.next ? 1 : -1);

      ctx.editMessageReplyMarkup({
        reply_markup: await keyboardFunction(newPageNumber),
      });
    }

    ctx.api.answerCallbackQuery(ctx.callbackQuery.id);
  }
};
