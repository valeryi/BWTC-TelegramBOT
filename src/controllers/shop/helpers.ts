import { ITelegramContext } from "../start";
import { logger } from "../../utils/winston";
import { initCart, currencyFormat } from "../cart/helpers";
import { IOrder } from "../../models/order.model";

export function addActive(
  ctx: ITelegramContext,
  question?: string,
  answer?: string
) {
  if (!question || !answer) {
    logger.error(`Cart: No data provided to put to cart`);
    return;
  }

  if (
    //@ts-ignore
    !ctx.session.cart ||
    //@ts-ignore
    ctx.session.cart === null ||
    //@ts-ignore
    ctx.session.cart === undefined
  )
    initCart(ctx);

  //@ts-ignore
  ctx.session.cart.active.details.push({ question, answer });

  logger.debug(
    `Cart: adding details to active products : ${question} - ${answer}`
  );
}

export async function orderNotifier(
  ctx: ITelegramContext,
  manager_id: number,
  order: IOrder
) {

  const content = order.items.reduce((acc: string, item: any) => {
    return acc.concat(` - <b>${item.product_name}</b> x ${item.amount} | ${item.pack} = ${currencyFormat(item.unit_total)}\n`);
  }, '');

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
