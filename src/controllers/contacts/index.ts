import Stage from "telegraf/stage";
import Scene from "telegraf/scenes/base";
import { TelegrafContext } from "telegraf/typings/context";
import { ContextMessageUpdate } from "telegraf";

export type ITelegramContext = ContextMessageUpdate & TelegrafContext;

const { leave } = Stage;
const contacts = new Scene("contacts");

contacts.enter(async (ctx: ITelegramContext) => {
  //@ts-ignore
  await ctx.telegram.sendContact(
    ctx.chat?.id,
    +380631895794,
    "Олейник Валентин"
  );

  //@ts-ignore
  await ctx.telegram.sendContact(ctx.chat?.id, +380938880808, "Богдан");

});

contacts.leave(async (_: TelegrafContext) => {});

contacts.command("saveme", leave());

export default contacts;
