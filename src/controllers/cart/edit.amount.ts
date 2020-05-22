import Scene from "telegraf/scenes/base";
import { getUserInfo } from "../../middlewares/functional/getUserInfo";
import { fetchCartItems } from "../../middlewares/functional/fetchCartItems";
import { updateUserActivity } from "../../middlewares/functional/updateUserActivity";
import { ITelegramContext } from "../start";
import { ICartItem } from "../../models/cart.model";
import { updateCartItem } from "../../utils/helpers/cart";

const editAmount = new Scene("editAmount");

editAmount.enter(
  getUserInfo,
  fetchCartItems,
  updateUserActivity,
  async (ctx: ITelegramContext) => {
    ctx.reply(ctx.i18n.t("toAction.enterAmount"));
    editAmount.on("text", getUserInfo, async (ctx: ITelegramContext) => {
      //@ts-ignore
      const item_id = ctx.session.cart.correction;

      //@ts-ignore
      const cart_item = ctx.session.cart.items.filter(
        (item: ICartItem) => item.id === item_id
      )[0];

      if (!/^([0-9]+$)/i.test(ctx.message?.text as string)) {
        await ctx.reply(
          ctx.i18n.t("scenes.shop.questions.amount.validation.notNumber1")
        );
        await ctx.reply(
          ctx.i18n.t("scenes.shop.questions.amount.validation.notNumber2")
        );
        await ctx.reply(
          ctx.i18n.t("scenes.shop.questions.amount.validation.notNumber3")
        );
      } else {
        try {
          await updateCartItem(ctx, item_id, {
            amount: ctx.message?.text,
            unit_total:
              cart_item.unit_price * parseInt(ctx.message?.text as string),
          });
          await ctx.reply(ctx.i18n.t("alerts.amountUpdated"));
          await ctx.scene.leave();
          await ctx.scene.enter("cart");
        } catch (err) {
          await ctx.reply(ctx.i18n.t("system.error"));
          await ctx.scene.leave();
          ctx.scene.enter("cart");
        }
      }
    });
  }
);

editAmount.leave(async (ctx: ITelegramContext) => {
  //@ts-ignore
  const item_id = ctx.session.cart.correction;
});

export default editAmount;
