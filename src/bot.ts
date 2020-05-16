require("dotenv").config();

import { Telegraf } from "telegraf";
// import { TelegrafContext } from "telegraf/typings/context";
import { database } from "./db/mongoose";
import { applyMiddlewares } from "./middlewares";
import { sysLog } from "./utils/winston";

import { MainNavigation } from "./utils/keyboards";
import { updateUserActivity } from "./middlewares/functional/updateUserActivity"; // TODO: Structure well - this is a common function
import { ITelegramContext } from "./controllers/start";
import { getUserInfo } from "./middlewares/functional/getUserInfo";
// import { preStart } from "./middlewares/functional/preStart";
// import { getUserInfo } from "./middlewares/functional/getUserInfo";

database.init().then(() => {
  const bot = new Telegraf(process.env.TELEGRAM_TOKEN as string);

  applyMiddlewares(bot);

  //@ts-ignore
  bot.start(getUserInfo, updateUserActivity, async (ctx: ITelegramContext) =>
    ctx.scene.enter("start")
  );

  bot.hears(
    /(Settings)|(Настройки)|(Налаштування)/i,
    //@ts-ignore
    getUserInfo,
    updateUserActivity,
    async (ctx: ITelegramContext) => ctx.scene.enter("settings")
  );

   bot.hears(
     /(Contacts)|(Контакты)|(Контакти)/i,
     //@ts-ignore
     getUserInfo,
     updateUserActivity,
     async (ctx: ITelegramContext) => ctx.scene.enter("contacts")
   );

  //@ts-ignore
  // bot.hears("🤟 Магазин", updateUserTimestamp, (ctx: TelegrafContext) =>
  //   //@ts-ignore
  //   ctx.scene.enter("shop")
  // );

  bot.command("saveme", async (ctx: ITelegramContext) => {
    console.debug(ctx, "User uses /saveme command");

    ctx.reply("Ось головне меню 👇", MainNavigation(ctx).draw());
  });

  bot.launch().then(() => sysLog.info("Telegram BOT launched"));
});
