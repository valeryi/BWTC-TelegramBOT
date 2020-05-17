import Scene from "telegraf/scenes/base";
import { ITelegramContext } from "../start";
import { TelegrafContext } from "telegraf/typings/context";
import { MainNavigation, CoffeeListNavigation } from "../../utils/keyboards";
import { getUserInfo } from "../../middlewares/functional/getUserInfo";
import { getTemplate } from "../../templates";
import { logger } from "../../utils/winston";
import { initCart, provideCartProductID } from "./_helpers";

import Keyboard from "telegraf-keyboard";

const shop = new Scene("shop");

shop.enter(getUserInfo, async (ctx: ITelegramContext) => {
  logger.debug("entering shop scene");
  initCart(ctx);
  //@ts-ignore
  console.log(ctx.session.cart);

  await ctx.reply(
    ctx.i18n.t("scenes.shop.pickMore"),
    (CoffeeListNavigation(ctx) as any).draw()
  );
});

shop.leave(async (_: TelegrafContext) => logger.debug("leaving shop scene"));

//@ts-ignore
shop.hears(
  /(⬅ back Home)|(⬅ На главную)|(⬅ На головну)/i,
  getUserInfo,
  async (ctx: ITelegramContext) => {
    ctx.reply(
      ctx.i18n.t("keyboards.home"),
      (MainNavigation(ctx) as any).draw()
    );
  }
);

shop.action(
  /(colombia)|(brazil)|(blend)/i,
  getUserInfo,
  (ctx: ITelegramContext) => {
    const active_product = ctx.match?.input.toLowerCase();
    provideCartProductID(ctx, active_product as string);

    ctx.scene.enter("tocart1");
  }
);

shop.hears(
  /(Colombia)|(Brazil)|(Blend)/i,
  getUserInfo,
  async (ctx: ITelegramContext) => {
    const active_product = ctx.match?.input.toLowerCase();
    const i18n = ctx.i18n;
    const template = getTemplate(`${active_product}_details`, []);
    const toCartAction = new Keyboard({ inline: true }).add(
      `${i18n.t("scenes.shop.toCart")}:${active_product}`
    );

    await ctx.replyWithPhoto(
      "https://images.pexels.com/photos/977878/pexels-photo-977878.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260"
    );
    await ctx.replyWithHTML(template, toCartAction.draw());
  }
);

export default shop;
