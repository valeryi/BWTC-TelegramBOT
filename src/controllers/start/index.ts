import Stage from "telegraf/stage";
import Scene from "telegraf/scenes/base";
import { MainNavigation } from "../../utils/keyboards";
import { TelegrafContext } from "telegraf/typings/context";
import { ContextMessageUpdate } from "telegraf";

export type ITelegramContext = ContextMessageUpdate & TelegrafContext;

const { leave } = Stage;
const start = new Scene("start");

start.enter(async (ctx: ITelegramContext) => {

  // TODO: Add i18 internalization - answer in the language it's asked...
  ctx
    .reply(`${ctx.i18n.t("scenes.start.greeting")} ${ctx.from?.first_name}!`)
    .then(() => ctx.reply(ctx.i18n.t("scenes.start.welcome")))
    .then(() =>
      ctx.reply("З чого розпочнемо? 👇", (MainNavigation(ctx) as any).draw())
    );

  await ctx.scene.leave();
});

start.leave(async (_: TelegrafContext) => {});

start.command("saveme", leave());

export default start;
