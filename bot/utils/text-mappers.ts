import { ComplaintReasonType, Prisma } from '@prisma/client';

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

export const complainantInfoKeysTextMapper = (key: keyof typeof Prisma.ComplainantScalarFieldEnum) => {
  switch (key) {
    case 'username':
      return 'Нікнейм';
    case 'fullName':
      return `Ім'я`;
    case 'phoneNumber':
      return 'Номер телефону';
  }
};

export const userInfoKeysTextMapper = (key: keyof typeof Prisma.UserScalarFieldEnum) => {
  switch (key) {
    case 'username':
      return 'Нікнейм';
    case 'firstName':
      return `Ім'я`;
    case 'lastName':
      return 'Прізвище';
    case 'phoneNumber':
      return 'Номер телефону';
  }
};
