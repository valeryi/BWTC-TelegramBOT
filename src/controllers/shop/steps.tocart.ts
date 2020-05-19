import Scene from "telegraf/scenes/base";
import { ITelegramContext } from "../start";
import { getUserInfo } from "../../middlewares/functional/getUserInfo";
import Keyboard from "telegraf-keyboard";
import { addActive, clearActive } from "./_helpers";

// import { CoffeeListNavigation } from "../../utils/keyboards";

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

//FINAL SCENE TO CART
const finaltocart = new Scene("finaltocart");

finaltocart.enter(getUserInfo, async (ctx: ITelegramContext) => {
  //@ts-ignore
  const products = ctx.session.products;
  //@ts-ignore
  const activeProduct = ctx.session.cart.active;
 
  const pack = activeProduct.details.filter(
    (n: any) => n.question === "pack"
  )[0].answer;
  const amount = +activeProduct.details.filter(
    (n: any) => n.question === "amount"
  )[0].answer;

  const unit_price = +activeProduct.product.prices.filter(
    (p: any) => p.name === pack
  )[0].price;

  const cart_item = {
    //@ts-ignore
    user_id: ctx.session.user.id,
    product_id: activeProduct.product.id,
    product_name: activeProduct.product.name,
    pack,
    amount,
    unit_price,
    unit_total: unit_price * amount,
    details: activeProduct.details.filter(
      (q: any) => q.question !== "amount" && q.question !== "pack"
    ),
  };

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

  clearActive(ctx);
  finaltocart.on("text", getUserInfo, (ctx: ITelegramContext) => {
    //@ts-ignore
    return ctx.scene.enter("shop");
  });
});

//QUESTION AMOUNT
const amountQuestion = new Scene("amountQuestion");

amountQuestion.enter(getUserInfo, async (ctx: ITelegramContext) => {
  ctx.reply(ctx.i18n.t("scenes.shop.addAmount"), new Keyboard().clear());

  amountQuestion.on("text", getUserInfo, async (ctx: ITelegramContext) => {
    if (!/([0-9]+)/i.test(ctx.message?.text as string)) {
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

export default [grindQuestion, methodQuestion, amountQuestion, finaltocart];

finaltocart.hears(
  /(Cancel)|(Відмінити)|(Отметить)/i,
  getUserInfo,
  async (ctx: ITelegramContext) => {
    clearActive(ctx);

    await ctx.reply(`${ctx.i18n.t("keyboards.cancelled")} 😓`);
    await ctx.scene.enter("shop");
  }
);
// finaltocart.hears(/(Buy)|(Оплатити)|(Оплатить)/i, (ctx: ITelegramContext) => {
// });
