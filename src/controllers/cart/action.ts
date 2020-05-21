import { ITelegramContext } from "../start";
import Keyboard from "telegraf-keyboard";
import { ICartItem } from "../../models/cart.model";
import { deleteCartItem } from "./helpers";

export async function edit(ctx: ITelegramContext) {
  const item_id = ctx.match?.input.split(" ")[1];
  //@ts-ignore
  const cart_item = ctx.session.cart.items.filter(
    (item: ICartItem) => item.id === item_id
  )[0];

  const edit_keyboard = new Keyboard({ inline: true })
    .add(
      `${ctx.i18n.t("scenes.cart.edit.options.pack")}:pack ${item_id}`,
      `${ctx.i18n.t("scenes.cart.edit.options.amount")}:amount ${item_id}`
    )
    .add(`${ctx.i18n.t("scenes.cart.edit.options.delete")}:delete ${item_id}`);

  const confirm_keyboard = new Keyboard().add(ctx.i18n.t("navigation.cancel"));

  ctx.reply(cart_item.product_name, edit_keyboard.draw());
  ctx.reply(ctx.i18n.t("scenes.cart.edit.question"), confirm_keyboard.draw());
}

export async function deleteItem(ctx: ITelegramContext) {
  const item_id = ctx.match?.input.split(" ")[1] as string;
  //@ts-ignore
  const cart_item = ctx.session.cart.items.filter(
    (item: ICartItem) => item.id === item_id
  )[0];

  if (!cart_item) {
    ctx.reply(ctx.i18n.t("alerts.itemNotFound"));
  } else {
    try {
      await deleteCartItem(ctx, item_id);
      await ctx.reply(ctx.i18n.t("alerts.deleted"));
      await ctx.scene.reenter("cart");
    } catch (err) {
      await ctx.reply(ctx.i18n.t("alerts.notDeleted"));
      await ctx.scene.enter("cart");
    }
  }
}

export async function pack(ctx: ITelegramContext) {
  const item_id = ctx.match?.input.split(" ")[1] as string;
  //@ts-ignore
  const cart_item = ctx.session.cart.items.filter(
    (item: ICartItem) => item.id === item_id
  )[0];

  if (!cart_item) {
    ctx.reply(ctx.i18n.t("alerts.itemNotFound"));
  } else {
    await ctx.scene.enter("editPack");
  }
}

export async function amount(ctx: ITelegramContext) {
  const item_id = ctx.match?.input.split(" ")[1] as string;
  //@ts-ignore
  const cart_item = ctx.session.cart.items.filter(
    (item: ICartItem) => item.id === item_id
  )[0];

  if (!cart_item) {
    ctx.reply(ctx.i18n.t("alerts.itemNotFound"));
  } else {
    //@ts-ignore
    ctx.session.cart.correction = item_id;
    ctx.scene.enter("editAmount");
  }
}
