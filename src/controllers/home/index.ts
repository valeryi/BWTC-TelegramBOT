import Scene from "telegraf/scenes/base";
import { TelegrafContext } from "telegraf/typings/context";
import { ContextMessageUpdate } from "telegraf";
import { home_keyboard } from "../shop/keyboards";

export type ITelegramContext = ContextMessageUpdate & TelegrafContext;

const home = new Scene("home");

home.enter(async (ctx: ITelegramContext) => {
  
    ctx.reply(ctx.i18n.t('scenes.start.backToHome'), home_keyboard(ctx).draw())
});

export default home;
