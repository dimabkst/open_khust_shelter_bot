import { getUserByTelegramId } from '../../core/users';
import { GoogleSheetsProvider } from '../../core/utils/google-sheets';
import { BotContext } from '../types';

export const menuUserSuggestionInfo = { command: 'menu', description: 'Меню бота' };

const menu = async (ctx: BotContext) => {
  const user = ctx.from;

  const userInDb = await getUserByTelegramId({ telegramId: user.id.toString() });

  let menuText =
    'Команди бота:\n/start - Запуск бота.\n/complain - Подати заявку зі скаргою на укриття.\n/close_conversation - Дозволяє зупинити довільний діалог з ботом за потреби.';

  if (userInDb?.admin) {
    menuText += `\n\nПосилання на Google таблицю зі скаргами: https://docs.google.com/spreadsheets/d/${GoogleSheetsProvider.COMPLAINT_TABLE_SPREADSHEET_ID}`;
  }

  if (userInDb?.admin?.isSuperAdmin) {
    menuText += `\n\nКоманди супер-адміна:\n/get_telegram_id - Дозволяє отримати ідентифікатор користувача Телеграм.\n/add_admin - Дозволяє додати нового адміністратора.\n/delete_admin - Дозволяє видалити адміністратора зі списку всіх наявних`;
  }

  ctx.reply(menuText);
};

export default menu;
