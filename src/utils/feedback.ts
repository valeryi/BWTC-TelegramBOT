import cron from "node-cron";
import { ITelegramContext } from "../controllers/start";
import Keyboard from "telegraf-keyboard";

import Scene from "telegraf/scenes/base";
import { getUserInfo } from "../middlewares/functional/getUserInfo";

const feedback = new Scene("feedback");

feedback.enter(getUserInfo, async (ctx: ITelegramContext) => {
  await ctx.replyWithHTML(
    ctx.i18n.t("feedback.onCartCancel.noticed") // TODO: Implement feedback function with order was cancelled, user should be asked if he needs any help
  );
  await ctx.reply(
    ctx.i18n.t("feedback.onCartCancel.offer"),
    new Keyboard({ inline: true })
      .add(`${ctx.i18n.t("feedback.onCartCancel.actionButton")}:consult`)
      .draw()
  );
});

export default feedback;

feedback.action("consult", async (ctx: ITelegramContext) => {
  
  //@ts-ignore
  ctx.reply(`${ctx.session.user.first_name}, \n\nНаш специалист свяжется с Вами в ближайшее время`);
  // @ts-ignore
  await ctx.telegram.sendMessage(
    476963932,
    //@ts-ignore
    `Мне нужна консультация.\n\nМеня зовут ${ctx.session.user.first_name}, \nмой ID ${ctx.session.user.telegram_id}\n`
  );
  ctx.answerCbQuery();
});

export async function onCancel(ctx: ITelegramContext) {
  //@ts-ignore
  if (!ctx.session.feedback.active) {
    //@ts-ignore
    ctx.session.feedback = {
      active: true,
    };
    const task = cron.schedule("*/5 * * * *", async () => {
      ctx.scene.enter("feedback");
      //@ts-ignore
      ctx.session.feedback = {};
      task.destroy();
    });
  }
}
