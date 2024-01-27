import { InlineKeyboard } from 'grammy';
import { getAdmins } from '../../../../core/users';

const adminsInlineKeyboard = async () => {
  // TODO: add pagination
  const admins = (await getAdmins({})).rows;

  const buttons = admins.map((a) => ({ text: [a.user.firstName, a.user.lastName].join(' '), data: `adminId:${a.id}` }));

  const buttonRows = Object.values(buttons).map((button) => [InlineKeyboard.text(button.text, button.data)]);

  return InlineKeyboard.from(buttonRows).toFlowed(2);
};

export default adminsInlineKeyboard;
