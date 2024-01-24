import { ComplaintReasonType } from '@prisma/client';
import { BotContext, BotConversation } from '../types';
import { getShelterById, getShelters } from '../../core/shelters';
import { createComplainant, createComplaint } from '../../core/complaints';
import { ICreateComplainantPayload, ICreateComplaintPayload } from '../../core/complaints/types';
import { HttpError } from '../../core/utils/error';

const complaint = async (conversation: BotConversation, ctx: BotContext) => {
  ctx.reply('Complaint process started!');

  // TODO: add pagination logic from inline keyboard
  const shelters = await conversation.external(() => getShelters({}));

  let shelter: { id: string; name: string };

  do {
    ctx.reply(`Choose which shelter to complain about: ${shelters.rows.map((s) => s.id)}`);

    const {
      msg: { text: shelterId },
    } = await conversation.waitFor('message:text');

    shelter = await conversation.external(async () => {
      try {
        return await getShelterById({ id: shelterId });
      } catch (e) {
        if (!(e instanceof HttpError)) {
          throw e;
        }
      }
    });
  } while (!shelter);

  ctx.reply(`You chose shelter: ${shelter.id}`);

  const complaintReasonTypes = Object.values(ComplaintReasonType);

  let complaintReasonType: ComplaintReasonType;

  do {
    ctx.reply(`Choose complaint reason: ${complaintReasonTypes}`);

    const {
      msg: { text: chosenComplaintReasonType },
    } = await conversation.waitFor('message:text');

    if (complaintReasonTypes.includes(chosenComplaintReasonType as ComplaintReasonType)) {
      complaintReasonType = chosenComplaintReasonType as ComplaintReasonType;
    }
  } while (!complaintReasonType);

  let complaintReason: string;

  if (complaintReasonType === ComplaintReasonType.OTHER) {
    do {
      ctx.reply(`Provide other complaint reason`);

      const {
        msg: { text: providedComplaintReason },
      } = await conversation.waitFor('message:text');

      if (providedComplaintReason.length) {
        complaintReason = providedComplaintReason;
      }
    } while (!complaintReason);
  }

  // TODO: add ability to select few reasons or remove reason table from db

  // consider moving to separate conversation
  let incognito: boolean;

  // TODO: add ability to ask to save info, then use id of existing complainant
  do {
    ctx.reply(`Would you like to share your contact info: y/n`);

    const {
      msg: { text: wouldShareContactInfo },
    } = await conversation.waitFor('message:text');

    if (wouldShareContactInfo.toLowerCase() === 'y') {
      incognito = false;
    } else if (wouldShareContactInfo.toLowerCase() === 'n') {
      incognito = true;
    }
  } while (incognito === undefined);

  const complainantPayload: ICreateComplainantPayload = {
    telegramId: ctx.from.id.toString(),
    userName: ctx.from.username,
  };

  // TODO: add share contact
  if (!incognito) {
    let fullName: string;
    let phoneNumber: string;

    do {
      ctx.reply(`What is yor full name?`);

      const {
        msg: { text: providedFullName },
      } = await conversation.waitFor('message:text');

      if (providedFullName.length) {
        fullName = providedFullName;
      }
    } while (!fullName);

    do {
      ctx.reply(`What is yor phone number?`);

      const {
        msg: { text: providedPhoneNumber },
      } = await conversation.waitFor('message:text');

      if (providedPhoneNumber.length) {
        phoneNumber = providedPhoneNumber;
      }
    } while (!phoneNumber);

    complainantPayload.fullName = fullName;
    complainantPayload.phoneNumber = phoneNumber;
  }

  const complainant = await conversation.external(() => createComplainant(complainantPayload));

  const complaintPayload: ICreateComplaintPayload = {
    shelterId: shelter.id,
    complainantId: complainant.id,
    reasonType: complaintReasonType,
    reason: complaintReason,
  };

  const complaint = await conversation.external(() => createComplaint(complaintPayload));

  ctx.reply(`Ending complaint conversation. Created complain: ${complaint.id}`);

  return;
};

export default complaint;
