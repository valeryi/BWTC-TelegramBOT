import Stage from "telegraf/stage";
import Scene from "telegraf/scenes/base";
import { TelegrafContext } from "telegraf/typings/context";
import { ContextMessageUpdate } from "telegraf";
import { getTemplate } from "../../templates";

export type ITelegramContext = ContextMessageUpdate & TelegrafContext;

const { leave } = Stage;
const contacts = new Scene("contacts");

contacts.enter(async (ctx: ITelegramContext) => {
  const valentin = getTemplate("contact", {
    person_name: "Олейник Валентин",
    person_position: "Совладелец",
    person_phone_number: "+380938880808",
    person_email: "email@address.com",
  });

  const bogdan = getTemplate("contact", {
    person_name: "Богдан Баткович",
    person_position: "Совладелец",
    person_phone_number: "+380938880808",
    person_email: "email@address.com",
  });

  await ctx.telegram.sendMessage(ctx.update?.message?.chat.id as number, valentin, {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Instagram",
            url: "www.instagram.com/oleinik9382",
          },
        ],
        [
          {
            text: "Telegram",
            url: "tg://user?id=476963932",
          },
        ],
      ],
    },
  });

  await ctx.telegram.sendMessage(ctx.update?.message?.chat.id as number, bogdan, {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Instagram",
            url: "www.instagram.com/oleinik9382",
          },
        ],
        [
          {
            text: "Telegram",
            url: "tg://user?id=476963932",
          },
        ],
      ],
    },
  });
});

contacts.leave(async (_: TelegrafContext) => {});

contacts.command("saveme", leave());

export default contacts;
