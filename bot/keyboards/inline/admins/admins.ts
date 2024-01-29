import { InlineKeyboard } from 'grammy';
import { navigationRow } from '../navigation';
import { getAdmins } from '../../../../core/users';

const adminsInlineKeyboard = async function (page?: number) {
  const rowsNumber = 10;

  const colsNumber = 2;

  const adminsOnPage = rowsNumber * colsNumber;

  const adminsInfo = await getAdmins({ page: page || 1, limit: adminsOnPage });

  const { rows: admins, count: adminsCount } = adminsInfo;

  const buttons = admins.map((a) => ({ text: [a.user.firstName, a.user.lastName].join(' '), data: `adminId:${a.id}` }));

  const buttonRows = buttons.map((button) => [InlineKeyboard.text(button.text, button.data)]);

  const keyboard = InlineKeyboard.from(buttonRows).toFlowed(colsNumber);

  const pagesNumber = Math.ceil(adminsCount / adminsOnPage);

  if (pagesNumber > 1) {
    keyboard.row(
      ...navigationRow({ pageNumber: page || 1, maxPageNumber: pagesNumber, keyboardFunctionName: adminsInlineKeyboard.name })
    );
  }

  return keyboard;
};

export default adminsInlineKeyboard;
