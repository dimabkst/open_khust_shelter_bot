import { ComplaintReasonType } from '@prisma/client';
import { InlineKeyboard } from 'grammy';
import { complaintReasonTypeTextMapper } from '../../../utils/text-mappers';

const buttons = Object.values(ComplaintReasonType).map((t) => ({ text: complaintReasonTypeTextMapper(t), data: t }));

const buttonRows = buttons.map((button) => [InlineKeyboard.text(button.text, button.data)]);

const complaintReasonTypesInlineKeyboard = InlineKeyboard.from(buttonRows);

export default complaintReasonTypesInlineKeyboard;
