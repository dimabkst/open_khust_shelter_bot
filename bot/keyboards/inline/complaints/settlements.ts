import { InlineKeyboard } from 'grammy';
import { getSettlementsByHromadaId } from '../../../../core/settlements';

const settlementsInlineKeyboard = async (hromadaId: number) => {
  // TODO: add pagination
  const settlements = (await getSettlementsByHromadaId({ hromadaId })).rows;

  const buttons = settlements.map((s) => ({ text: s.name, data: `settlementId:${s.id}` }));

  const buttonRows = Object.values(buttons).map((button) => [InlineKeyboard.text(button.text, button.data)]);

  return InlineKeyboard.from(buttonRows).toFlowed(2);
};

export default settlementsInlineKeyboard;
