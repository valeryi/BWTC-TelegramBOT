import Scene from "telegraf/scenes/base";
import { ITelegramContext } from "../start";
import { getUserInfo } from "../../middlewares/functional/getUserInfo";
import Keyboard from "telegraf-keyboard";
import {
  addActive,
  clearActive,
  createCartItem,
  addCartItem,
} from "./_helpers";
import { logger } from "../../utils/winston";
import { fetchCartItems } from "../../middlewares/functional/fetchCartItems";

//QUESTION 2
const grindQuestion = new Scene("grindQuestion");

grindQuestion.enter(getUserInfo, async (ctx: ITelegramContext) => {
  // SECOND QUESTION
  const grindOptions = new Keyboard().add(
    ctx.i18n.t("scenes.shop.question_grind_answer1"),
    ctx.i18n.t("scenes.shop.question_grind_answer2")
  );

  await ctx.reply(
    ctx.i18n.t("scenes.shop.question_grind"),
    grindOptions.draw()
  );
  await ctx.reply(ctx.i18n.t("scenes.shop.choose"));

  grindQuestion.on("text", getUserInfo, async (ctx: ITelegramContext) => {
    addActive(ctx, "grind", ctx.message?.text as string);

    if (
      ctx.message?.text === ctx.i18n.t("scenes.shop.question_grind_answer1")
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
    ctx.i18n.t("scenes.shop.question_for"),
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
  ctx.reply(ctx.i18n.t("scenes.shop.addAmount"), new Keyboard().clear());

  amountQuestion.on("text", getUserInfo, async (ctx: ITelegramContext) => {
    if (!/^([0-9]+$)/i.test(ctx.message?.text as string)) {
      await ctx.reply(ctx.i18n.t("scenes.shop.validation.notNumber1"));
      await ctx.reply(ctx.i18n.t("scenes.shop.validation.notNumber2"));
      await ctx.reply(ctx.i18n.t("scenes.shop.validation.notNumber3"));
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
    .add(ctx.i18n.t("keyboards.addToCart"), ctx.i18n.t("keyboards.buy"))
    .add(ctx.i18n.t("keyboards.cancel"));

  await ctx.replyWithHTML(
    `${ctx.i18n.t("scenes.shop.toCartConfirmation.message1")} - <b>${
      cart_item.product_name
    }</b>`
  );
  await ctx.replyWithHTML(
    `${ctx.i18n.t("scenes.shop.toCartConfirmation.message2")} - <b>${
      cart_item.unit_total
    }</b>₴ ${ctx.i18n.t("scenes.shop.toCartConfirmation.for")} ${
      cart_item.amount
    } ${ctx.i18n.t("scenes.shop.toCartConfirmation.items")}`
  );
  await ctx.reply(
    `${ctx.i18n.t("scenes.shop.toCartConfirmation.message3")}`,
    keyboard.draw()
  );
});

finaltocart.leave((ctx: ITelegramContext) => {
  logger.debug("Shop: cleaning active and leaving shop");
  clearActive(ctx);
});

export default [grindQuestion, methodQuestion, amountQuestion, finaltocart];

finaltocart.hears(
  /(Cancel)|(Відмінити)|(Отметить)/i,
  getUserInfo,
  async (ctx: ITelegramContext) => {
    //@ts-ignore
    const cart_item = ctx.session.cart.cart_item;

    setTimeout(() => {
      ctx.replyWithHTML(
        `Мы заметили что Вы отменили покупку - <b>${cart_item.product_name}</b>` // TODO: Implement feedback function with order was cancelled, user should be asked if he needs any help
      );
      ctx.reply(
        `Если Вам нужна помощь нашего консультанта, нажмите на кнопку под сообщением`,
        new Keyboard({ inline: true }).add("Нужна консультация").draw()
      );
    }, 1000 * 60 * 5);

    await ctx.reply(`${ctx.i18n.t("keyboards.cancelled")} 😓`);
    await ctx.scene.enter("shop");
    //@ts-ignore
  }
);

finaltocart.hears(/(Buy)|(Оплатити)|(Оплатить)/i, (ctx: ITelegramContext) => {
  ctx.reply("buy action");
});

finaltocart.hears(
  /(Add)|(Добавить)|(Додати)/i,
  getUserInfo,
  fetchCartItems,
  async (ctx: ITelegramContext) => {
    //@ts-ignore
    const user_id = ctx.session.user.id;
    //@ts-ignore
    const item = ctx.session.cart.cart_item;

    await addCartItem(ctx, user_id, item);

    //@ts-ignore
    await ctx.reply(ctx.i18n.t("scenes.shop.addedToCartMessage"));
    ctx.scene.enter("shop");
  }
);

//  finaltocart.hears(//i.test(), getUserInfo, (ctx: ITelegramContext) => {
//    //@ts-ignore
//    return ctx.scene.enter("shop");
//  });
