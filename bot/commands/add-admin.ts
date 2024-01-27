import { getUserByTelegramId } from '../../core/users';
import { BotContext } from '../types';

export const addAdminUserSuggestionInfo = {
  command: 'add_admin',
  description: 'Додати адміністратора',
};

const add_admin = async (ctx: BotContext) => {
  const user = ctx.from;

  const admin = await getUserByTelegramId({ telegramId: user.id.toString() });

  if (!admin.admin?.isSuperAdmin) {
    ctx.reply('У вас не достатньо прав для використання цієї команди');
  } else {
    ctx.conversation.enter('addAdmin');
  }
};

export default add_admin;
