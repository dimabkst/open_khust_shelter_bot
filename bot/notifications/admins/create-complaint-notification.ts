import { ComplaintReasonType } from '@prisma/client';
import bot from '../../index';
import { ICreateComplaintNotificationPayload } from './types';
import { complaintReasonTypeTextMapper } from '../../utils/text-mappers';
import { getComplaintById } from '../../../core/complaints';
import { getAdminsBySettlement } from '../../../core/users';

const createComplaintAdminNotification = async (payload: ICreateComplaintNotificationPayload) => {
  const { complaintId } = payload;

  const complaint = await getComplaintById({ id: complaintId });

  const adminsToNotify = await getAdminsBySettlement({ settlementId: complaint.settlement.id });

  const shelterInfo = `${complaint.shelterName}, ${complaint.settlement.name}, ${complaint.settlement.hromada.name}`;

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

  const complaintReasonInfo = `${complaint.reasonType === ComplaintReasonType.OTHER ? complaint.reason : complaintReasonTypeTextMapper(complaint.reasonType)}`;

  const message = `<b>Створена нова заявка стосовно укриття:</b> \n- ${shelterInfo}\n<b>Інформація про заявника:</b> \n${complainantInfo}\n<b>Причина заявки:</b> \n- ${complaintReasonInfo}`;

  for (const admin of adminsToNotify) {
    await bot.api.sendMessage(admin.user.telegramId, message, { parse_mode: 'HTML' });
  }
};

export default createComplaintAdminNotification;
