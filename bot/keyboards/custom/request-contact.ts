import { Keyboard } from 'grammy';

const labels = ['Share Contact'];

const buttonRows = labels.map((label) => [Keyboard.requestContact(label)]);

const requestContactCustomKeyboard = Keyboard.from(buttonRows).resized().persistent().oneTime();

export default requestContactCustomKeyboard;
