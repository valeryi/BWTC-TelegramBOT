import Stage from "telegraf/stage";
import Scene from "telegraf/scenes/base";
import { ITelegramContext } from "../start";
import { TelegrafContext } from "telegraf/typings/context";
import { MainNavigation, CoffeeListNavigation } from "../../utils/keyboards";
import { getUserInfo } from "../../middlewares/functional/getUserInfo";
import { getTemplate } from "../../templates";
// import { ColombiaCategory } from "./actions";
// import { getTemplate } from "../../templates";
import Keyboard from "telegraf-keyboard";
import { logger } from "../../utils/winston";
// import { getActionParams } from "../../utils/_helpers";

const { leave } = Stage;
const shop = new Scene("shop");

shop.enter(async (ctx: ITelegramContext) => {
  console.log("entering shop");

  const questionnaire = {
    cart_items: [],
    active: {
      index: 0,
      product: null,
      questions: [
        {
          text: "Step 1",
          keyboard: null,
          answer: null,
          handler: (ctx: ITelegramContext) => {
            ctx.reply(
              `handler: ${JSON.stringify(
                //@ts-ignore
                ctx.session.questionnaire.active.index
              )}`
            );
          },
        },
        {
          text: "Step 2",
          keyboard: null,
          answer: null,
        },
        {
          text: "Step 3",
          keyboard: null,
          answer: null,
        },
      ],
    },
    to: () => {},
    final: async (ctx: ITelegramContext) => {
      //@ts-ignore
      console.log(ctx.session.questionnaire);
      await ctx.scene.enter("shop");
    },
  };

  //@ts-ignore
  ctx.session.questionnaire = questionnaire;

  await ctx.reply(
    ctx.i18n.t("scenes.shop.pickMore"),
    (CoffeeListNavigation(ctx) as any).draw()
  );
});

shop.leave(async (_: TelegrafContext) => console.log("leaving shop"));

shop.command("saveme", leave());

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
    //@ts-ignore
    const questionnaire: any = ctx.session.questionnaire;

    questionnaire.active.product = active_product;

    console.log(questionnaire);

    logger.debug(
      "Created cart in session",
      //@ts-ignore
      ctx.session.questionnaire.toString()
    );
    ctx.scene.enter("questionnaire");
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
