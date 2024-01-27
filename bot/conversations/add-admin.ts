import { BotContext, BotConversation } from '../types';
import { hromadasInlineKeyboard, yesOrNoInlineKeyboard } from '../keyboards';
import { yesOrNoButtons } from '../keyboards/inline/yes-or-no';
import { userInfoKeysTextMapper } from '../utils/text-mappers';
import { createAdmin, getUserByTelegramId } from '../../core/users';
import { ICreateAdminPayload } from '../../core/users/admins/types';
import { multiplePick } from '../../core/utils/data';

const addAdmin = async (conversation: BotConversation, ctx: BotContext) => {
  //choosing user
  let telegramId: string;

  let triedAdding = false;

  do {
    ctx.reply(
      `Будь ласка, уведіть Телеграм ідентифікатор нового адміністратора${triedAdding ? ' ще раз.\nЯкщо бажаєте закінчити цей діалог виконайте команду /close_conversation' : ''}`
    );

    triedAdding = true;

    const {
      msg: { text: providedTelegramId },
    } = await conversation.waitFor('message:text');

    const user = await conversation.external(() => getUserByTelegramId({ telegramId: providedTelegramId, raiseError: false }));

    if (user) {
      if (user.admin?.id) {
        ctx.reply(`Обраний користувач вже є адміністратором`);
      } else {
        const userInfo = multiplePick(user, ['username', 'firstName', 'lastName', 'phoneNumber']);

        ctx.reply(
          `Дані обраного користувача:\n${Object.entries(userInfo)
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
          telegramId = providedTelegramId;
        }
      }
    } else {
      ctx.reply('Користувача з таким ідентифікатором не знайдено, перевірте правильність введеного тексту');
    }
  } while (!telegramId);

  // TODO: add pagination logic from inline keyboard
  // choosing hromada
  const hromadasKeyboard = await conversation.external(() => hromadasInlineKeyboard());

  ctx.reply('Оберіть територіальну громаду для нового адміністратора:', {
    reply_markup: hromadasKeyboard,
  });

  let hromadaId: number;

  do {
    const { callbackQuery: hromadaCallbackQuery } = await conversation.waitFor('callback_query');

    if (hromadaCallbackQuery.data.split(':')[0] === 'hromadaId') hromadaId = Number(hromadaCallbackQuery.data.split(':')[1]);

    await ctx.api.answerCallbackQuery(hromadaCallbackQuery.id);
  } while (hromadaId === undefined);

  const adminPayload: ICreateAdminPayload = {
    telegramId,
    hromadaIds: [hromadaId],
  };

  await conversation.external(() => createAdmin(adminPayload));

  ctx.reply('Адміністратора створено');

  return;
};

export default addAdmin;
