import { InlineKeyboard } from 'grammy';

export const navigationDirectionsCallbackData = {
  previous: 'pages-previous-button',
  stay: 'pages-stay-button',
  next: 'pages-next-button',
};

export const navigationRow = (payload: { pageNumber: number; maxPageNumber: number; keyboardFunctionName: string }) => {
  const { pageNumber, maxPageNumber, keyboardFunctionName } = payload;

  const functionAndPageInfo = `${keyboardFunctionName}:${pageNumber}`;

  const stayInfo = `${navigationDirectionsCallbackData.stay}:${functionAndPageInfo}`;

  const buttons = [
    pageNumber > 1
      ? { text: '⬅️', data: `${navigationDirectionsCallbackData.previous}:${functionAndPageInfo}` }
      : { text: '⏺', data: stayInfo },
    pageNumber < maxPageNumber
      ? { text: '➡️', data: `${navigationDirectionsCallbackData.next}:${functionAndPageInfo}` }
      : { text: '⏺', data: stayInfo },
  ];

  const navigationRow = buttons.map((button) => InlineKeyboard.text(button.text, button.data));

  return navigationRow;
};
