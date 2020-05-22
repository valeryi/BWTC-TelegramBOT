import Scene from "telegraf/scenes/base";
import { ITelegramContext } from "../start";
import { getUserInfo } from "../../middlewares/functional/getUserInfo";
import Keyboard from "telegraf-keyboard";
import { logger } from "../../utils/winston";
import { fetchCartItems } from "../../middlewares/functional/fetchCartItems";
import { addActive } from "../../utils/helpers/cart";
import { createCartItem } from "../../utils/helpers/cart";
import { clearActive } from "../../utils/helpers/cart";
import { addCartItem } from "../../utils/helpers/cart";
import { currencyFormat } from "../../utils/helpers/common";

const grindQuestion = new Scene("grindQuestion");

grindQuestion.enter(getUserInfo, async (ctx: ITelegramContext) => {
  const grindOptions = new Keyboard().add(
    ctx.i18n.t("scenes.shop.questions.grind.answers.yes"),
    ctx.i18n.t("scenes.shop.questions.grind.answers.no")
  );

  await ctx.reply(
    ctx.i18n.t("scenes.shop.questions.grind.question"),
    grindOptions.draw()
  );
  await ctx.reply(ctx.i18n.t("toAction.choose"));

  grindQuestion.on("text", getUserInfo, async (ctx: ITelegramContext) => {
    addActive(ctx, "grind", ctx.message?.text as string);

    if (
      ctx.message?.text ===
      ctx.i18n.t("scenes.shop.questions.grind.answers.yes")
    ) {
      return ctx.scene.enter("methodQuestion");
    } else {
      return ctx.scene.enter("finaltocart");
    }
  });
});

//QUESTION 3
const methodQuestion = new Scene("methodQuestion");

methodQuestion.enter(getUserInfo, async (ctx: ITelegramContext) => {
  await ctx.reply(
    ctx.i18n.t("scenes.shop.questions.method.question"),
    new Keyboard().clear()
  );

  methodQuestion.on("text", getUserInfo, (ctx: ITelegramContext) => {
    addActive(ctx, "description", ctx.message?.text as string);

    return ctx.scene.enter("finaltocart");
  });
});

//QUESTION AMOUNT
const amountQuestion = new Scene("amountQuestion");

amountQuestion.enter(getUserInfo, async (ctx: ITelegramContext) => {
  ctx.reply(
    ctx.i18n.t("scenes.shop.questions.amount.question"),
    new Keyboard().clear()
  );

  amountQuestion.on("text", getUserInfo, async (ctx: ITelegramContext) => {
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
      addActive(ctx, "amount", ctx.message?.text as string);

      //@ts-ignore
      return ctx.scene.enter("grindQuestion");
    }
  });
});

//FINAL SCENE TO CART
const finaltocart = new Scene("finaltocart");

finaltocart.enter(getUserInfo, async (ctx: ITelegramContext) => {
  const cart_item = createCartItem(ctx);

  const keyboard = new Keyboard()
    .add(ctx.i18n.t("navigation.addToCart"), ctx.i18n.t("navigation.pay"))
    .add(ctx.i18n.t("navigation.cancel"));

  await ctx.replyWithHTML(
    `${ctx.i18n.t("scenes.shop.youPicked")} - <b>${cart_item.product_name}</b>`
  );
  await ctx.replyWithHTML(
    `${ctx.i18n.t("scenes.shop.itCosts")} - <b>${currencyFormat(
      cart_item.unit_total,
      true
    )}</b> ${ctx.i18n.t("scenes.shop.for")} ${cart_item.amount} ${ctx.i18n.t(
      "scenes.shop.items"
    )}`
  );
  await ctx.reply(
    `${ctx.i18n.t("scenes.shop.questions.addOrPay")}`,
    keyboard.draw()
  );
});

finaltocart.leave((ctx: ITelegramContext) => {
  logger.debug("Shop: cleaning active and leaving shop");
  clearActive(ctx);
});

export default [grindQuestion, methodQuestion, amountQuestion, finaltocart];

finaltocart.hears(
  /(Cancel)|(Скасувати)|(Отметить)/i,
  getUserInfo,
  async (ctx: ITelegramContext) => {
    //@ts-ignore
    const cart_item = ctx.session.cart.cart_item;

    setTimeout(() => {
      ctx.replyWithHTML(
        ctx.i18n.t("feedback.onCartCancel.noticed") // TODO: Implement feedback function with order was cancelled, user should be asked if he needs any help
      );
      ctx.reply(
        ctx.i18n.t("feedback.onCartCancel.noticed"),
        new Keyboard({ inline: true })
          .add(ctx.i18n.t("feedback.onCartCancel.actionButton"))
          .draw()
      );
    }, 1000 * 60 * 5);

    //@ts-ignore
    ctx.session.cart.cart_item = null; //TODO: Implement order tracking with two states - cancelled and in cart but not bought.

    await ctx.reply(`${ctx.i18n.t("alerts.cancelled")} 😓`);
    await ctx.scene.enter("shop");
    //@ts-ignore
  }
);

finaltocart.hears(
  /(Pay)|(Оплатити)|(Оплатить)/i,
  async (ctx: ITelegramContext) => {
    //@ts-ignore
    const user_id = ctx.session.user.id;
    //@ts-ignore
    const item = ctx.session.cart.cart_item;

    await addCartItem(ctx, user_id, item);
    ctx.scene.enter("payment");
  }
);

finaltocart.hears(
  /(To cart)|(Добавить)|(Додати)/i,
  getUserInfo,
  fetchCartItems,
  async (ctx: ITelegramContext) => {
    //@ts-ignore
    const user_id = ctx.session.user.id;
    //@ts-ignore
    const item = ctx.session.cart.cart_item;

    await addCartItem(ctx, user_id, item);

    //@ts-ignore
    await ctx.reply(ctx.i18n.t("alerts.putToCart"));
    ctx.scene.enter("shop");
  }
);
