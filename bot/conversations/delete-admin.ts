import { BotContext, BotConversation } from '../types';
import { yesOrNoInlineKeyboard } from '../keyboards';
import { adminsInlineKeyboard } from '../keyboards/inline/admins';
import { yesOrNoButtons } from '../keyboards/inline/yes-or-no';
import { userInfoKeysTextMapper } from '../utils/text-mappers';
import { deleteAdmin, getAdminById } from '../../core/users';
import { IDeleteAdminPayload } from '../../core/users/admins/types';
import { multiplePick } from '../../core/utils/data';

const deleteAdminConversation = async (conversation: BotConversation, ctx: BotContext) => {
  //choosing admin
  let adminId: string;

  let providedAdminId: string;

  let triedDeleting = false;

  const adminsKeyboard = await conversation.external(async () => await adminsInlineKeyboard());

  do {
    ctx.reply(
      `Оберіть адміністратора якого необхідно видалити${triedDeleting ? ' ще раз.\nЯкщо бажаєте закінчити цей діалог виконайте команду /close_conversation' : ':'}`,
      {
        reply_markup: adminsKeyboard,
      }
    );

    triedDeleting = true;

    do {
      const { callbackQuery: adminCallbackQuery } = await conversation.waitFor('callback_query');

      if (adminCallbackQuery.data.split(':')[0] === 'adminId') providedAdminId = adminCallbackQuery.data.split(':')[1];

      await ctx.api.answerCallbackQuery(adminCallbackQuery.id);
    } while (!providedAdminId);

    const admin = await conversation.external(() => getAdminById({ adminId: providedAdminId, raiseError: false }));

    if (admin) {
      const userInfo = multiplePick(admin.user, ['username', 'firstName', 'lastName']);

      ctx.reply(
        `Дані обраного адміністратора:\n${Object.entries(userInfo)
          .filter(([key, value]) => value)
          .map(([key, value]) => `- ${userInfoKeysTextMapper(key as keyof typeof userInfo)}: ${value}`)
          .join('\n')}`
      );

      // user choice confirmation
      let confirmedChoice: boolean;

      ctx.reply(`Ви підтверджуєте Ваш вибір?`, {
        reply_markup: yesOrNoInlineKeyboard,
      });

      const { callbackQuery: yesOrNoCallbackQuery } = await conversation.waitForCallbackQuery(
        Object.values(yesOrNoButtons).map((b) => b.data)
      );

      if (yesOrNoCallbackQuery.data === yesOrNoButtons.yes.data) {
        confirmedChoice = true;
      } else {
        confirmedChoice = false;
      }

      await ctx.api.answerCallbackQuery(yesOrNoCallbackQuery.id);

      if (confirmedChoice) {
        adminId = admin.id;
      } else {
        providedAdminId = null;
      }
    } else {
      ctx.reply('Адміністратора не було знайдено');
    }
  } while (!adminId);

  const deletePayload: IDeleteAdminPayload = {
    adminId,
  };

  await conversation.external(() => deleteAdmin(deletePayload));

  ctx.reply('Адміністратора видалено');

  return;
};

export default deleteAdminConversation;
