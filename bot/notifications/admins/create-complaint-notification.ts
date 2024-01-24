import { ComplaintReasonType } from '@prisma/client';
import bot from '../../index';
import { ICreateComplaintNotificationPayload } from './types';
import { complaintReasonTypeTextMapper } from '../../utils/text-mappers';
import { getComplaintById } from '../../../core/complaints';
import { getAdminsByDistrict } from '../../../core/users';

const createComplaintAdminNotification = async (payload: ICreateComplaintNotificationPayload) => {
  const { complaintId } = payload;

  const complaint = await getComplaintById({ id: complaintId });

  const adminsToNotify = await getAdminsByDistrict({ district: complaint.shelter.district });

  const incognito = !complaint.complainant.fullName && !complaint.complainant.phoneNumber;

  const complainant = complaint.complainant;

  const complainantInfoKeysTextMapper = (key: keyof typeof complainant) => {
    switch (key) {
      case 'username':
        return 'Нікнейм';
      case 'fullName':
        return `Ім'я`;
      case 'phoneNumber':
        return 'Номер телефону';
    }
  };

  const complainantInfo = `${
    incognito
      ? `- Заявка подана анонімно`
      : Object.entries(complainant)
          .filter(([key, value]) => value)
          .map(([key, value]) => `- ${complainantInfoKeysTextMapper(key as keyof typeof complainant)}: ${value}`)
          .join('\n')
  }`;

  const complaintReason = complaint.reasons[0];

  const complaintReasonInfo = `${complaintReason.type === ComplaintReasonType.OTHER ? complaintReason.reason : complaintReasonTypeTextMapper(complaintReason.type)}`;

  const message = `<b>Створена нова заявка стосовно укриття:</b> \n- ${complaint.shelter.name}.\n<b>Інформація про заявника:</b> \n${complainantInfo}.\n<b>Причина заявки:</b> \n- ${complaintReasonInfo}.`;

  for (const admin of adminsToNotify) {
    await bot.api.sendMessage(admin.user.telegramId, message, { parse_mode: 'HTML' });
  }
};

export default createComplaintAdminNotification;
