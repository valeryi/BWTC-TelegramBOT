import Scene from "telegraf/scenes/base";
import { getUserInfo } from "../../middlewares/functional/getUserInfo";
import { fetchCartItems } from "../../middlewares/functional/fetchCartItems";
import { updateUserActivity } from "../../middlewares/functional/updateUserActivity";
import { ITelegramContext } from "../start";
import Keyboard from "telegraf-keyboard";
import { ICartItem } from "../../models/cart.model";
import { logger } from "../../utils/winston";
import { getProducts } from "../../middlewares/functional/getProducts";
import { edit, deleteItem, amount, pack } from "./action";
import { currencyFormat } from "../../utils/helpers/common";

export const cart = new Scene("cart");

cart.enter(
  getUserInfo,
  getProducts,
  fetchCartItems,
  updateUserActivity,
  async (ctx: ITelegramContext) => {
    //@ts-ignore
    const cart_items = ctx.session.cart.items;
    const total_price = cart_items.reduce(
      (acc: number, item: ICartItem) => acc + item.unit_total, //BUG: null pops up here
      0
    );

    if (cart_items.length <= 0) {
      const empty_keyboard = new Keyboard()
        .add(ctx.i18n.t("keyboards.main.shop"))
        .add(ctx.i18n.t("navigation.back"));

      await ctx.reply(
        ctx.i18n.t("scenes.cart.empty.isEmpty"),
        empty_keyboard.draw()
      );
      await ctx.reply(ctx.i18n.t("toAction.pickCoffee"));
    } else {
      const cart_list_keyboard = new Keyboard({ inline: true });

      for (let i = 0; i < cart_items.length; i++) {
        const item = cart_items[i];

        cart_list_keyboard.add(
          `${item.product_name} - ${item.amount} ${ctx.i18n.t(
            "scenes.shop.items"
          )} - ${currencyFormat(item.unit_total, true)}:edit ${item.id}`
        );
      }

      const cart_keyboard = new Keyboard()
        .add(ctx.i18n.t("navigation.pay"))
        .add(ctx.i18n.t("navigation.back"));

      await ctx.reply(
        ctx.i18n.t("scenes.cart.notEmpty.have"),
        cart_list_keyboard.draw()
      );

      await ctx.reply(
        `${ctx.i18n.t("scenes.cart.notEmpty.totalInCart")} ${currencyFormat(
          total_price,
          true
        )}`,
        cart_keyboard.draw()
      );

      await ctx.reply(ctx.i18n.t("toAction.needEdit"));
    }
  }
);

cart.leave(async (_: ITelegramContext) => {
  logger.debug("Cart: leacing cart scene");
});

cart.hears(
  /(Pay)|(Оплатить)|(Оплатити)/i,
  getUserInfo,
  async (ctx: ITelegramContext) => {
    await ctx.scene.enter("payment");
  }
);

cart.hears(
  /(back)|(назад)|(назад)/i,
  getUserInfo,
  async (ctx: ITelegramContext) => {
    await ctx.scene.enter("home");
  }
);

cart.hears(
  /(Cancel)|(Скасувати)|(Отметить)/i,
  getUserInfo,
  async (ctx: ITelegramContext) => {
    await ctx.scene.enter("cart");
  }
);

export default cart;

cart.action(/(edit)/i, getUserInfo, edit);

cart.action(/(delete)/i, getUserInfo, deleteItem);

cart.action(/(pack)/i, getUserInfo, pack);

cart.action(/(amount)/i, getUserInfo, amount);
