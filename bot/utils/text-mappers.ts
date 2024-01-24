import { ComplaintReasonType } from '@prisma/client';

export const complaintReasonTypeTextMapper = (t: ComplaintReasonType) => {
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
