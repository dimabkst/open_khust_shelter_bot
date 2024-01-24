import bot from '../../index';
import { getComplaintById } from '../../../core/complaints';
import { getAdminsByDistrict } from '../../../core/users';
import { ICreateComplaintNotificationPayload } from './types';

const createComplaintAdminNotification = async (payload: ICreateComplaintNotificationPayload) => {
  const { complaintId } = payload;

  const complaint = await getComplaintById({ id: complaintId });

  const adminsToNotify = await getAdminsByDistrict({ district: complaint.shelter.district });

  const message = `Створена нова заявка стосовно укриття: ${complaint.shelter.name}`;

  for (const admin of adminsToNotify) {
    await bot.api.sendMessage(admin.user.telegramId, message);
  }
};

export default createComplaintAdminNotification;
