import Scene from "telegraf/scenes/base";
import { getUserInfo } from "../../middlewares/functional/getUserInfo";
import { fetchCartItems } from "../../middlewares/functional/fetchCartItems";
import { updateUserActivity } from "../../middlewares/functional/updateUserActivity";
import { ITelegramContext } from "../start";
import { IProduct } from "../../models/product.model";
import { ICartItem } from "../../models/cart.model";
import Keyboard from "telegraf-keyboard";
import { logger } from "../../utils/winston";
import { currencyFormat, updateCartItem } from "./helpers";

const editPack = new Scene("editPack");

editPack.enter(
  getUserInfo,
  fetchCartItems,
  updateUserActivity,
  async (ctx: ITelegramContext) => {
    const item_id = ctx.match?.input.split(" ")[1] as string;

    //@ts-ignore
    const cart_item = ctx.session.cart.items.filter(
      (item: ICartItem) => item.id === item_id
    )[0];
    //@ts-ignore
    const product = ctx.session.products.filter(
      (product: IProduct) => product.id === cart_item.product_id
    )[0];

    const packs_keyboard = new Keyboard({ inline: true });

    for (const key in product.prices) {
      if (product.prices.hasOwnProperty(key)) {
        const price = product.prices[key];

        packs_keyboard.add(
          `${price.name} - ${currencyFormat(price.price, true)}:packType ${
            cart_item.id
          } ${price.name} ${price.price} ${cart_item.amount}`
        );
      }
    }

    ctx.reply(ctx.i18n.t('toAction.choosePack'), packs_keyboard.draw());
  }
);

editPack.leave(async (_: ITelegramContext) => {});

export default editPack;

editPack.action(/(packType)/i, getUserInfo, async (ctx: ITelegramContext) => {
  const args = ctx.match?.input
    .split(" ")
    .slice(1, ctx.match?.input.split(" ").length) as string[];

  const id = args[0];
  const name = args[1];
  const price = parseFloat(args[2]);
  const amount = parseFloat(args[3]);

  const update = {
    pack: name,
    unit_price: price,
    unit_total: price * amount,
  };

  try {
    await updateCartItem(ctx, id, update);
    await ctx.reply(ctx.i18n.t("alerts.packUpdated"));
    await ctx.scene.enter("cart");
  } catch (err) {
    logger.error(`Cart: Couldn't update cart item`);
    await ctx.reply(ctx.i18n.t("system.error"));
    ctx.scene.enter("cart");
  }
});
