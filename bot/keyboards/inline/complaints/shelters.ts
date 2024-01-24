import { InlineKeyboard } from 'grammy';
import { getShelters } from '../../../../core/shelters';

const sheltersInlineKeyboard = async () => {
  // TODO: add pagination
  const shelters = (await getShelters({})).rows;

  const buttons = shelters.map((s) => ({ text: s.name, data: `shelterId:${s.id}` }));

  const buttonRows = Object.values(buttons).map((button) => [InlineKeyboard.text(button.text, button.data)]);

  return InlineKeyboard.from(buttonRows);
};

export default sheltersInlineKeyboard;
