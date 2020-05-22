import { logger } from "../../utils/winston";
import { IOrder } from "../../models/order.model";
import { ITelegramContext } from "../../controllers/start";

export function getActionParams(ctx: ITelegramContext): string[] {
  const args = (ctx.match?.input || "")
    .split(" ")
    .slice(1, ctx.match?.input.split(" ").length);

  return args as string[];
}


export async function orderNotifier(
  ctx: ITelegramContext,
  manager_id: number,
  order: IOrder
) {
  const content = order.items.reduce((acc: string, item: any) => {
    return acc.concat(
      ` - <b>${item.product_name}</b> x ${item.amount} | ${
        item.pack
      } = ${currencyFormat(item.unit_total)}\n`
    );
  }, "");

  const header = `
<b>Новый заказ</b>  

`;

  const footer = `
<i>Клиент:</i> ${order.user_name}
<i>Оплата через:</i> ${order.payment_method}
<i>Контактный номер телефона:</i> ${order.user_phone_number}
<i>Сумма заказа:</i> ${currencyFormat(order.order_total)}
<i>ID заказа:</i> ${order.id}
`;

  const template = [header, content, footer].join("");

  // Set proper style
  await ctx.telegram.sendMessage(manager_id, template, { parse_mode: "HTML" });
  logger.debug("informed manager about order: " + JSON.stringify(order));
}

export function currencyFormat(number: number, symbol?: true) {
  const UAH = "₴";

  if (symbol) {
    const result = number.toLocaleString("ru-RU");
    return result + " " + UAH;
  }

  const result = number.toLocaleString("uk-UK", {
    style: "currency",
    currency: "UAH",
  });

  return result; //TODO: try to implement formating myself
}
