import Scene from "telegraf/scenes/base";
import { ITelegramContext } from "../start";
import { TelegrafContext } from "telegraf/typings/context";
import { getUserInfo } from "../../middlewares/functional/getUserInfo";
import { logger } from "../../utils/winston";
import { addActive } from "./helpers";
import { product_details_keyboard, shop_keyboard } from "./keyboards";
import { IProduct } from "../../models/product.model";
import { provideCartProduct, clearActive } from "../cart/helpers";

const shop = new Scene("shop");

shop.enter(getUserInfo, async (ctx: ITelegramContext) => {
  logger.debug("entering shop scene");

  await ctx.reply(ctx.i18n.t("scenes.shop.popup"), shop_keyboard(ctx).draw());
});

shop.leave(async (_: TelegrafContext) => logger.debug("leaving shop scene"));

shop.on("text", getUserInfo, async (ctx: ITelegramContext) => {
  //@ts-ignore
  const products = ctx.session.products.filter(
    (product: any) => product.group === "coffee-beans"
  );

  // Detecting product clicking
  const pattern = products.reduce((acc: string, value: IProduct, i: number) => {
    return i === 0 ? acc + `(${value.name})` : acc + `|(${value.name})`;
  }, "");

  const productExp = new RegExp(pattern, "i");

  if (productExp.test(ctx.message?.text as string)) {
    const product: IProduct = products.filter(
      (product: IProduct) => product.name === ctx.message?.text
    )[0];

    await provideCartProduct(ctx, product);

    const product_details = `
<b><u>${product.name}</u></b>

${product.details["farm"] ? `<b>Farm</b>: ${product.details["farm"]}` : ""}
${
  product.details["variety"]
    ? `<b>Variety</b>: ${product.details["variety"]}`
    : ""
}
${
  product.details["processing"]
    ? `<b>Processing</b>: ${product.details["processing"]}`
    : ""
}
${product.details["taste"] ? `<b>Taste</b>: ${product.details["taste"]}` : ""}
`;

    ctx.replyWithPhoto(
      product.photo,
      {
        caption: product_details,
        parse_mode: "HTML",
        reply_markup: {
          keyboard: product_details_keyboard(ctx),
          resize_keyboard: true,
        },
      }
    );
  } else if (/(back)|(назад)|(назад)/i.test(ctx.message?.text as string)) {
    clearActive(ctx);
    await ctx.scene.enter("shop");
  } else if (
    /(Home)|(Главная)|(Головна)/i.test(ctx.message?.text as string) // TODO: write match function for i81n
  ) {
    await ctx.scene.enter("home");
  } else if (/₴/i.test(ctx.message?.text as string)) {
    const pack = ctx.update.message?.text?.split(":")[0].trim();

    addActive(ctx, "pack", pack);
    ctx.scene.enter("amountQuestion");
  } else {
    ctx.reply(ctx.i18n.t("system.commandNotFound"));
  }
});

export default shop;
