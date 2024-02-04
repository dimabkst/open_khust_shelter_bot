import { ComplaintReasonType } from '@prisma/client';
import { BotContext, BotConversation } from '../types';
import {
  requestContactCustomKeyboard,
  yesOrNoInlineKeyboard,
  complaintReasonTypesInlineKeyboard,
  hromadasInlineKeyboard,
  settlementsInlineKeyboard,
} from '../keyboards';
import { createComplaintAdminNotification } from '../notifications';
import { yesOrNoButtons } from '../keyboards/inline/yes-or-no';
import { appendComplaintInfoToTable, createComplaint } from '../../core/complaints';
import { ICreateComplaintPayload } from '../../core/complaints/types';

const complaintConversation = async (conversation: BotConversation, ctx: BotContext) => {
  // TODO: add pagination logic from inline keyboard
  // choosing hromada
  const hromadasKeyboard = await conversation.external(() => hromadasInlineKeyboard());

  ctx.reply('Оберіть територіальну громаду в якому знаходиться укриття:', {
    reply_markup: hromadasKeyboard,
  });

  let hromadaId: number;

  do {
    const { callbackQuery: hromadaCallbackQuery } = await conversation.waitFor('callback_query');

    if (hromadaCallbackQuery.data.split(':')[0] === 'hromadaId') hromadaId = Number(hromadaCallbackQuery.data.split(':')[1]);

    await ctx.api.answerCallbackQuery(hromadaCallbackQuery.id);
  } while (hromadaId === undefined);

  // choosing settlement
  const settlementsKeyboard = await conversation.external(() => settlementsInlineKeyboard(hromadaId));

  ctx.reply('Оберіть населений пункт в якому знаходиться укриття:', {
    reply_markup: settlementsKeyboard,
  });

  let settlementId: number;

  do {
    const { callbackQuery: settlementCallbackQuery } = await conversation.waitFor('callback_query');

    if (settlementCallbackQuery.data.split(':')[0] === 'settlementId')
      settlementId = Number(settlementCallbackQuery.data.split(':')[1]);

    await ctx.api.answerCallbackQuery(settlementCallbackQuery.id);
  } while (settlementId === undefined);

  // asking for shelter name
  ctx.reply(`Будь ласка, вкажіть назву проблемного укриття`);

  const {
    msg: { text: shelterName },
  } = await conversation.waitFor('message:text');

  // complaint reason type
  ctx.reply(`З чим виникла проблема:`, {
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
    ctx.reply(`Будь ласка, уточніть з чим саме виникла проблема`);

    const {
      msg: { text: providedComplaintReason },
    } = await conversation.waitFor('message:text');

    complaintReason = providedComplaintReason;
  }

  // asking about contact info
  let incognito: boolean;

  ctx.reply(`Бажаєте подати заявку анонімно?\n(У разі анонімної подачі заяви, ми не зможемо повідомити Вас про її статус)`, {
    reply_markup: yesOrNoInlineKeyboard,
  });

  const { callbackQuery: yesOrNoCallbackQuery } = await conversation.waitForCallbackQuery(
    Object.values(yesOrNoButtons).map((b) => b.data)
  );

  if (yesOrNoCallbackQuery.data === yesOrNoButtons.yes.data) {
    incognito = true;
  } else {
    incognito = false;
  }

  await ctx.api.answerCallbackQuery(yesOrNoCallbackQuery.id);

  const complainantPayload: ICreateComplaintPayload['complainant'] = {
    telegramId: ctx.from.id.toString(),
    username: ctx.from.username,
  };

  if (!incognito) {
    let contactByTelegram: boolean;

    ctx.reply(`Бажаєте поділитись Телеграм контактом?`, { reply_markup: yesOrNoInlineKeyboard });

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

    if (contactByTelegram) {
      await ctx.reply('Натисніть "Поділитись Контактом"', {
        reply_markup: requestContactCustomKeyboard,
      });

      const {
        msg: { contact: telegramContact },
      } = await conversation.waitFor('message:contact');

      fullName = [telegramContact.first_name, telegramContact.last_name].join(' ');

      phoneNumber = telegramContact.phone_number;
    }

    if (!fullName && !phoneNumber) {
      ctx.reply(`Будь ласка, напишіть Ваше прізвище, ім'я та по батькові`);

      const {
        msg: { text: providedFullName },
      } = await conversation.waitFor('message:text');

      fullName = providedFullName;

      ctx.reply(`Будь ласка, введіть Ваш номер телефону`);

      const {
        msg: { text: providedPhoneNumber },
      } = await conversation.waitFor('message:text');

      phoneNumber = providedPhoneNumber;
    }

    complainantPayload.fullName = fullName;
    complainantPayload.phoneNumber = phoneNumber;
  }

  const complaintPayload: ICreateComplaintPayload = {
    settlementId,
    shelterName,
    complainant: complainantPayload,
    reasonType: complaintReasonType,
    reason: complaintReason,
  };

  const complaint = await conversation.external(() => createComplaint(complaintPayload));

  ctx.reply(`Дякуємо за ваше звернення${incognito ? '' : ', найближчим часом ми повідомимо Вас про його статус'}.`, {
    reply_markup: { remove_keyboard: true },
  });

  await conversation.external(() => createComplaintAdminNotification({ complaintId: complaint.id }));

  await conversation.external(() => appendComplaintInfoToTable({ complaintId: complaint.id }));

  return;
};

export default complaintConversation;
