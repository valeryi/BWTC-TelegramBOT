import Scene from "telegraf/scenes/base";
import { getUserInfo } from "../../middlewares/functional/getUserInfo";
import { fetchCartItems } from "../../middlewares/functional/fetchCartItems";
import { updateUserActivity } from "../../middlewares/functional/updateUserActivity";
import { ITelegramContext } from "../start";
import Keyboard from "telegraf-keyboard";
import { UserModel, IUser } from "../../models/user.model";
import { IOrder, OrderModel } from "../../models/order.model";
import { ICartItem, CartModel } from "../../models/cart.model";
import { logger } from "../../utils/winston";
import { orderNotifier } from "../../utils/helpers/common";

export const payment = new Scene("payment");

payment.enter(
  getUserInfo,
  fetchCartItems,
  updateUserActivity,
  async (ctx: ITelegramContext) => {
    const payment_list = new Keyboard({ inline: true })
      .add(`${ctx.i18n.t("scenes.payment.options.privatBank")}:PrivatBank`)
      .add(`${ctx.i18n.t("scenes.payment.options.novaPoshta")}:NovaPoshta`)
      .add(`${ctx.i18n.t("scenes.payment.options.pickup")}:Pickup`)
      .add(`${ctx.i18n.t("scenes.payment.options.delivery")}:Delivery`);

    await ctx.reply(
      ctx.i18n.t("scenes.payment.paymentList"),
      payment_list.draw()
    );

    await ctx.reply(
      ctx.i18n.t("toAction.chooseOptionToPay"),
      new Keyboard().add(ctx.i18n.t("navigation.cancel")).draw()
    );
  }
);

payment.hears(
  /(Cancel)|(Скасувати)|(Отметить)/i,
  getUserInfo,
  async (ctx: ITelegramContext) => {
    //@ts-ignore
    const cart_item = ctx.session.cart.cart_item;

    await ctx.reply(ctx.i18n.t("alerts.cancelled"));
    ctx.scene.enter("home");
  }
);

payment.leave(async (_: ITelegramContext) => {});

export default payment;

payment.action("PrivatBank", getUserInfo, async (ctx: ITelegramContext) => {
  //@ts-ignore
  const user = ctx.session.user;

  if (!user.phone_number) {
    ctx.reply(ctx.i18n.t("scenes.payment.phoneNumberQuestion"));

    payment.on("text", getUserInfo, async (ctx: ITelegramContext) => {
      //@ts-ignore
      const user = ctx.session.user;
      const feedback = ctx.message?.text as string;

      if (/\+{0,1}[0-9]+/i.test(feedback)) {
        try {
          await updateUser(ctx, user.id, { phone_number: feedback });
          await createOrder(ctx, "PrivatBank");

          await ctx.reply(ctx.i18n.t("scenes.payment.managerWillContact"));
          await ctx.scene.enter("shop");
        } catch (err) {
          await ctx.reply(ctx.i18n.t("system.error"));
          logger.error(`Payment: ${err.message}`);
          await ctx.scene.enter("cart");
        }
      }
    });
  } else {
    await createOrder(ctx, "PrivatBank");

    await ctx.reply(`${user.first_name}!`);
    await ctx.reply(ctx.i18n.t("scenes.payment.managerWillContact"));
    await ctx.scene.enter("shop");
  }
  ctx.answerCbQuery();
});

payment.action("NovaPoshta", getUserInfo, (ctx: ITelegramContext) => {
  console.log("NovaPoshta");
  ctx.answerCbQuery();
});

payment.action("Pickup", getUserInfo, (ctx: ITelegramContext) => {
  ctx.answerCbQuery(`This method currently doesn't work.`,true);
});

payment.action("Delivery", getUserInfo, (ctx: ITelegramContext) => {
  ctx.answerCbQuery(`This method currently doesn't work.`, true);
});

export async function createOrder(
  ctx: ITelegramContext,
  payment_method: string
) {
  //@ts-ignore
  const user = ctx.session.user;
  //@ts-ignore
  const cart_items = ctx.session.cart.items;
  const order_total = cart_items.reduce(
    (acc: number, value: ICartItem) => acc + value.unit_total,
    0
  );

  const order: IOrder = {
    user_id: user.id,
    user_name: `${user.first_name} ${user.last_name}`,
    user_phone_number: user.phone_number,
    item_number: cart_items.length,
    items: cart_items,
    order_total,
    payment_method: payment_method,
  };

  const createdOrder = await new OrderModel(order).save();

  //@ts-ignore
  ctx.session.cart.orders.push(createdOrder);

  if (createdOrder) {
    CartModel.deleteMany({ user_id: user.id }).exec();
    //@ts-ignore
    ctx.session.cart.items = [];
  }

  orderNotifier(ctx, 476963932, (createdOrder as unknown) as IOrder);

  return createdOrder;
}

export async function updateUser(
  ctx: ITelegramContext,
  id: string,
  update: object
) {
  try {
    const updated = ((await UserModel.findByIdAndUpdate(id, update, {
      new: true,
    })) as unknown) as IUser;

    if (updated) {
      //@ts-ignore
      ctx.session.user = updated as IUser;
    }

    return updated;
  } catch (err) {
    logger.error(`User: ${err.message}`);
    return;
  }
}
