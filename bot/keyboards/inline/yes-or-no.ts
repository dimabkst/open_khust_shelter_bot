import { InlineKeyboard } from 'grammy';

export const yesOrNoButtons = {
  yes: { text: 'Так', data: 'yes-button' },
  no: { text: 'Ні', data: 'no-button' },
};

const buttonRows = Object.values(yesOrNoButtons).map((button) => [InlineKeyboard.text(button.text, button.data)]);

const yesOrNoInlineKeyboard = InlineKeyboard.from(buttonRows).toFlowed(2);

export default yesOrNoInlineKeyboard;
