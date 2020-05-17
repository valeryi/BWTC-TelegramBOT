import Scene from "telegraf/scenes/base";
import { ITelegramContext } from "../start";
import { getUserInfo } from "../../middlewares/functional/getUserInfo";
import Keyboard from "telegraf-keyboard";
import { addActive } from "./_helpers";
import { CoffeeListNavigation } from "../../utils/keyboards";

//QUESTION 1
const tocart1 = new Scene("tocart1");

tocart1.enter(getUserInfo, async (ctx: ITelegramContext) => {
  const packOptions = new Keyboard().add("250", "500", "1000");

  await ctx.reply(ctx.i18n.t("scenes.shop.question_pack"), packOptions.draw());
  await ctx.reply(ctx.i18n.t("scenes.shop.choose"), packOptions.draw());

  tocart1.on("text", getUserInfo, (ctx: ITelegramContext) => {
    addActive(
      ctx,
      ctx.i18n.t("scenes.shop.question_pack"),
      ctx.message?.text as string
    );

    //@ts-ignore
    return ctx.scene.enter("tocart2");
  });
});

//QUESTION 2
const tocart2 = new Scene("tocart2");

tocart2.enter(getUserInfo, async (ctx: ITelegramContext) => {
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

  tocart2.on("text", getUserInfo, async (ctx: ITelegramContext) => {
    addActive(
      ctx,
      ctx.i18n.t("scenes.shop.question_grind"),
      ctx.message?.text as string
    );

    if (
      ctx.message?.text === ctx.i18n.t("scenes.shop.question_grind_answer1")
    ) {
      return ctx.scene.enter("tocart3");
    } else {
      return ctx.scene.enter("finaltocart");
    }
  });
});

//QUESTION 3
const tocart3 = new Scene("tocart3");

tocart3.enter(getUserInfo, async (ctx: ITelegramContext) => {
  await ctx.reply(
    ctx.i18n.t("scenes.shop.question_for"),
    new Keyboard().clear()
  );

  tocart3.on("text", getUserInfo, (ctx: ITelegramContext) => {
    addActive(
      ctx,
      ctx.i18n.t("scenes.shop.question_for"),
      ctx.message?.text as string
    );

    return ctx.scene.enter("finaltocart");
  });
});

//FINAL SCENE TO CART
const finaltocart = new Scene("finaltocart");

finaltocart.enter(getUserInfo, async (ctx: ITelegramContext) => {
  ctx.reply(
    `${ctx.i18n.t("scenes.shop.addedToCartMessage")}`,
    CoffeeListNavigation(ctx).draw()
  );

  finaltocart.on("text", getUserInfo, (ctx: ITelegramContext) => {
    //@ts-ignore
    return ctx.scene.enter("shop");
  });
});

export default [tocart1, tocart2, tocart3, finaltocart];
