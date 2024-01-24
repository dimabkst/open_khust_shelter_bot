import { InlineKeyboard } from 'grammy';
import { ComplaintReasonType } from '@prisma/client';

const complaintReasonTypeTextMapper = (t: ComplaintReasonType) => {
  switch (t) {
    case ComplaintReasonType.ABSENT_SHELTER:
      return 'Відсутнє';
    case ComplaintReasonType.CLOSED_SHELTER:
      return 'Зачинене укриття';
    case ComplaintReasonType.NOT_ALLOWED_TO_ENTER:
      return 'Не впустили';
    default:
      return 'Інше';
  }
};

const buttons = Object.values(ComplaintReasonType).map((t) => ({ text: complaintReasonTypeTextMapper(t), data: t }));

const buttonRows = Object.values(buttons).map((button) => [InlineKeyboard.text(button.text, button.data)]);

const complaintReasonTypesInlineKeyboard = InlineKeyboard.from(buttonRows);

export default complaintReasonTypesInlineKeyboard;
