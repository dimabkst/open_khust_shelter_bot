import { InlineKeyboard } from 'grammy';
import { getHromadas } from '../../../../core/hromadas';

const hromadasInlineKeyboard = async () => {
  // TODO: add pagination
  const hromadas = (await getHromadas({})).rows;

  const buttons = hromadas.map((h) => ({ text: h.name, data: `hromadaId:${h.id}` }));

  const buttonRows = buttons.map((button) => [InlineKeyboard.text(button.text, button.data)]);

  return InlineKeyboard.from(buttonRows).toFlowed(2);
};

export default hromadasInlineKeyboard;
