import Scene from "telegraf/scenes/base";
import { TelegrafContext } from "telegraf/typings/context";
import { ContextMessageUpdate } from "telegraf";

export type ITelegramContext = ContextMessageUpdate & TelegrafContext;

const contacts = new Scene("contacts");

contacts.enter(async (ctx: ITelegramContext) => {
  //@ts-ignore
  await ctx.telegram.sendContact(
    ctx.chat?.id,
    +380631895794,
    "Олейник Валентин"
  );

  setTimeout(() => {
    //@ts-ignore
    ctx.telegram.sendContact(ctx.chat?.id, +380938880808, "Богдан");
  }, 100);
});

contacts.leave(async (_: TelegrafContext) => {});

export default contacts;
