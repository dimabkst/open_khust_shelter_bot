import { InlineKeyboard } from 'grammy';
import { navigationRow } from '../navigation';
import { getHromadas } from '../../../../core/hromadas';

const hromadasInlineKeyboard = async (page?: number) => {
  const rowsNumber = 5;

  const colsNumber = 2;

  const hromadasOnPage = rowsNumber * colsNumber;

  const hromadasInfo = await getHromadas({ page: page || 1, limit: hromadasOnPage });

  const { rows: hromadas, count: hromadasCount } = hromadasInfo;

  const buttons = hromadas.map((h) => ({ text: h.name, data: `hromadaId:${h.id}` }));

  const buttonRows = buttons.map((button) => [InlineKeyboard.text(button.text, button.data)]);

  const keyboard = InlineKeyboard.from(buttonRows).toFlowed(colsNumber);

  const pagesNumber = Math.ceil(hromadasCount / hromadasOnPage);

  if (pagesNumber > 1) {
    keyboard.row(
      ...navigationRow({ pageNumber: page || 1, maxPageNumber: pagesNumber, keyboardFunctionName: hromadasInlineKeyboard.name })
    );
  }

  return keyboard;
};

export default hromadasInlineKeyboard;
