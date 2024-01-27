import { getUserByTelegramId } from '../../core/users';
import { BotContext } from '../types';

export const deleteAdminUserSuggestionInfo = {
  command: 'delete_admin',
  description: 'Видалити адміністратора',
};

const delete_admin = async (ctx: BotContext) => {
  const user = ctx.from;

  const admin = await getUserByTelegramId({ telegramId: user.id.toString() });

  if (!admin.admin?.isSuperAdmin) {
    ctx.reply('У вас не достатньо прав для використання цієї команди');
  } else {
    await ctx.conversation.enter('deleteAdminConversation');
  }
};

export default delete_admin;
