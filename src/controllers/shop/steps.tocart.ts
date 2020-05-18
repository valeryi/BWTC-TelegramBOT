import Scene from "telegraf/scenes/base";
import { ITelegramContext } from "../start";
import { getUserInfo } from "../../middlewares/functional/getUserInfo";
import Keyboard from "telegraf-keyboard";
import { addActive, clearActive } from "./_helpers";
import { logger } from "../../utils/winston";
// import { CoffeeListNavigation } from "../../utils/keyboards";

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
  //@ts-ignore
  const products = ctx.session.products;
  //@ts-ignore
  const activeProduct = ctx.session.cart.active;
  let price: number = 0;

  if (activeProduct.product_id === "colombia") {
    price = activeProduct.details[0].answer === 0.25 ? 170 : 640;
  }

  if (activeProduct.product_id === "brazil") {
    price = activeProduct.details[0].answer === 0.25 ? 150 : 540;
  }

  if (activeProduct.product_id === "blend") {
    price = activeProduct.details[0].answer === 0.25 ? 150 : 540;
  }

  const ConfirmPrice = new Keyboard()
    .add(`${ctx.i18n.t("keyboards.addToCart")}`)
    .add(`${ctx.i18n.t("keyboards.cancel")}`)
    .add(`${ctx.i18n.t("keyboards.buy")}`);

  ctx.reply(
    `${ctx.i18n.t("scenes.shop.confirmPrice")} : ${price}`,
    ConfirmPrice.draw()
  );

  finaltocart.on("text", getUserInfo, (ctx: ITelegramContext) => {
    //@ts-ignore
    return ctx.scene.enter("shop");
  });
});

//QUESTION 1
const enterAmount = new Scene("enterAmount");

enterAmount.enter(getUserInfo, async (ctx: ITelegramContext) => {
  ctx.reply(ctx.i18n.t("scenes.shop.addAmount"), new Keyboard().clear());

  enterAmount.on("text", getUserInfo, async (ctx: ITelegramContext) => {
    //@ts-ignore
    const products = ctx.session.products;
    //@ts-ignore
    const activeProduct = ctx.session.cart.active;
    let price: number = 0;

    if (activeProduct.product_id === "colombia") {
      price = activeProduct.details[0].answer === 0.25 ? 170 : 640;
    }

    if (activeProduct.product_id === "brazil") {
      price = activeProduct.details[0].answer === 0.25 ? 150 : 540;
    }

    if (activeProduct.product_id === "blend") {
      price = activeProduct.details[0].answer === 0.25 ? 150 : 540;
    }
    addActive(ctx, "amount", ctx.message?.text as string);

    const ready = {
      product: {
        id: products.id,
        name: products.name,
        price,
        weight: activeProduct.details[0].answer,
      },
      details: {
        ...activeProduct,
      },
      //@ts-ignore
      client: ctx.session.user,
    };

    //@ts-ignore
    ctx.session.cart.items.push(ready);
    clearActive(ctx);

    await informManager(ctx, 476963932, ready);

    //@ts-ignore
    console.log(ctx.session.cart);

    ctx.reply(ctx.i18n.t("scenes.shop.addedToCartMessage"));

    //@ts-ignore
    return ctx.scene.enter("shop");
  });
});

export default [tocart1, tocart2, tocart3, enterAmount, finaltocart];

finaltocart.hears(
  /(Add)|(Додати)|(Добавить)/i,
  getUserInfo,
  async (ctx: ITelegramContext) => ctx.scene.enter("enterAmount")

);
finaltocart.hears(
  /(Cancel)|(Відмінити)|(Отметить)/i,
  getUserInfo,
  async (ctx: ITelegramContext) => {
    //@ts-ignore
    ctx.session.cart.active = {};

    await ctx.reply(`${ctx.i18n.t("keyboards.cancelled")} 😓`);
    await ctx.scene.enter("shop");
  }
);
// finaltocart.hears(/(Buy)|(Оплатити)|(Оплатить)/i, (ctx: ITelegramContext) => {
// });

async function informManager(
  ctx: ITelegramContext,
  manager_id: number,
  order: any
) {
  // Set proper style
  await ctx.telegram.sendMessage(manager_id, "test");
  logger.debug("informed manager about order: " + JSON.stringify(order));
}
