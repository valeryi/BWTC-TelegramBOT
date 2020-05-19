import Scene from "telegraf/scenes/base";
import { TelegrafContext } from "telegraf/typings/context";
import { ContextMessageUpdate } from "telegraf";

export type ITelegramContext = ContextMessageUpdate & TelegrafContext;

const start = new Scene("start");

start.enter(async (ctx: ITelegramContext) => {
  
  await ctx.reply(
    `${ctx.i18n.t("scenes.start.greeting")} ${ctx.from?.first_name}!`
  );
  await ctx.reply(ctx.i18n.t("scenes.start.welcome"));

  await ctx.scene.enter('home');
});

export default start;
