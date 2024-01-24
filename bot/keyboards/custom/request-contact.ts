import { Keyboard } from 'grammy';

export const buttons = ['Поділитись Контактом'];

const buttonRows = buttons.map((button) => [Keyboard.requestContact(button)]);

const requestContactCustomKeyboard = Keyboard.from(buttonRows).resized().oneTime();

export default requestContactCustomKeyboard;
