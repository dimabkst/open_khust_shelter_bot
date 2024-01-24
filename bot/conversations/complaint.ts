import { ComplaintReasonType } from '@prisma/client';
import { BotContext, BotConversation } from '../types';
import {
  requestContactCustomKeyboard,
  yesOrNoInlineKeyboard,
  complaintReasonTypesInlineKeyboard,
  sheltersInlineKeyboard,
} from '../keyboards';
import { yesOrNoButtons } from '../keyboards/inline/yes-or-no';
import { createComplainant, createComplaint } from '../../core/complaints';
import { ICreateComplainantPayload, ICreateComplaintPayload } from '../../core/complaints/types';

const complaint = async (conversation: BotConversation, ctx: BotContext) => {
  ctx.reply('Complaint process started!');

  // TODO: add pagination logic from inline keyboard
  // choosing shelter
  const sheltersKeyboard = await conversation.external(() => sheltersInlineKeyboard());

  ctx.reply('Choose which shelter to complain about', {
    reply_markup: sheltersKeyboard,
  });

  let shelterId: string;

  do {
    const { callbackQuery: shelterCallbackQuery } = await conversation.waitFor('callback_query');

    if (shelterCallbackQuery.data.split(':')[0] === 'shelterId') shelterId = shelterCallbackQuery.data.split(':')[1];

    await ctx.api.answerCallbackQuery(shelterCallbackQuery.id);
  } while (!shelterId);

  // complaint reason type
  ctx.reply(`Choose complaint reason`, {
    reply_markup: complaintReasonTypesInlineKeyboard,
  });

  const { callbackQuery: complaintReasonTypeCallbackQuery } = await conversation.waitForCallbackQuery(
    Object.values(ComplaintReasonType)
  );

  const complaintReasonType = complaintReasonTypeCallbackQuery.data as ComplaintReasonType;

  await ctx.api.answerCallbackQuery(complaintReasonTypeCallbackQuery.id);

  // complaint reason
  let complaintReason: string;

  if (complaintReasonType === ComplaintReasonType.OTHER) {
    ctx.reply(`Provide other complaint reason`);

    const {
      msg: { text: providedComplaintReason },
    } = await conversation.waitFor('message:text');

    complaintReason = providedComplaintReason;
  }

  // TODO: add ability to select few reasons or remove reason table from db

  // consider moving to separate conversation
  // asking about contact info
  let incognito: boolean;

  ctx.reply(`Would you like to make incognito complaint`, { reply_markup: yesOrNoInlineKeyboard });

  const { callbackQuery: yesOrNoCallbackQuery } = await conversation.waitForCallbackQuery(
    Object.values(yesOrNoButtons).map((b) => b.data)
  );

  if (yesOrNoCallbackQuery.data === yesOrNoButtons.yes.data) {
    incognito = true;
  } else {
    incognito = false;
  }

  await ctx.api.answerCallbackQuery(yesOrNoCallbackQuery.id);

  const complainantPayload: ICreateComplainantPayload = {
    telegramId: ctx.from.id.toString(),
    userName: ctx.from.username,
  };

  // TODO: add ability to ask to save info, then use id of existing complainant
  if (!incognito) {
    let contactByTelegram: boolean;

    ctx.reply(`Would you like to share your contact via Telegram`, { reply_markup: yesOrNoInlineKeyboard });

    const { callbackQuery: yesOrNoCallbackQuery } = await conversation.waitForCallbackQuery(
      Object.values(yesOrNoButtons).map((b) => b.data)
    );

    if (yesOrNoCallbackQuery.data === yesOrNoButtons.yes.data) {
      contactByTelegram = true;
    } else if (yesOrNoCallbackQuery.data === yesOrNoButtons.no.data) {
      contactByTelegram = false;
    }

    await ctx.api.answerCallbackQuery(yesOrNoCallbackQuery.id);

    let fullName: string;
    let phoneNumber: string;

    // TODO: fix handling cancel button
    if (contactByTelegram) {
      await ctx.reply('Press the button to share contact', {
        reply_markup: requestContactCustomKeyboard,
      });

      const {
        msg: { contact: telegramContact },
      } = await conversation.waitFor('message:contact');

      fullName = [telegramContact.first_name, telegramContact.last_name].join(' ');

      phoneNumber = telegramContact.phone_number;
    }

    if (!fullName && !phoneNumber) {
      ctx.reply(`What is yor full name?`);

      const {
        msg: { text: providedFullName },
      } = await conversation.waitFor('message:text');

      fullName = providedFullName;

      ctx.reply(`What is yor phone number?`);

      const {
        msg: { text: providedPhoneNumber },
      } = await conversation.waitFor('message:text');

      phoneNumber = providedPhoneNumber;
    }

    complainantPayload.fullName = fullName;
    complainantPayload.phoneNumber = phoneNumber;
  }

  const complainant = await conversation.external(() => createComplainant(complainantPayload));

  const complaintPayload: ICreateComplaintPayload = {
    shelterId,
    complainantId: complainant.id,
    reasonType: complaintReasonType,
    reason: complaintReason,
  };

  const complaint = await conversation.external(() => createComplaint(complaintPayload));

  ctx.reply(`Ending complaint conversation. Created complain: ${complaint.id}`);

  return;
};

export default complaint;
