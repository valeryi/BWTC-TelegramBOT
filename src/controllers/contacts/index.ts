import Scene from "telegraf/scenes/base";
import { TelegrafContext } from "telegraf/typings/context";
import { ContextMessageUpdate } from "telegraf";

export type ITelegramContext = ContextMessageUpdate & TelegrafContext;

const contacts = new Scene("contacts");

contacts.enter(async (ctx: ITelegramContext) => {

  //@ts-ignore
  await ctx.telegram.sendContact(
    //@ts-ignore
    ctx.session.user.telegram_id,
    +380631895794,
    "Олейник Валентин"
  );

});

contacts.leave(async (_: TelegrafContext) => {});

export default contacts;
