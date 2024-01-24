import { InlineKeyboard } from 'grammy';

export const yesOrNoButtons = {
  yes: { text: 'Yes', data: 'yes-button' },
  no: { text: 'No', data: 'no-button' },
};

const buttonRows = Object.values(yesOrNoButtons).map((button) => [InlineKeyboard.text(button.text, button.data)]);

const yesOrNoInlineKeyboard = InlineKeyboard.from(buttonRows);

export default yesOrNoInlineKeyboard;
