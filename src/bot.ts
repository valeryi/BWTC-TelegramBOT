require("dotenv").config();

import { Telegraf } from "telegraf";
import { database } from "./db/mongoose";
import { applyMiddlewares } from "./middlewares";
// import { sysLog } from "./utils/winston";

import { updateUserActivity } from "./middlewares/functional/updateUserActivity"; // TODO: Structure well - this is a common function
import { ITelegramContext } from "./controllers/start";
import { getUserInfo } from "./middlewares/functional/getUserInfo";
import { getProducts } from "./middlewares/functional/getProducts";
import { errorHandler } from "./error handlers";

database.init().then(() => {
  const bot = new Telegraf(process.env.TELEGRAM_TOKEN as string);

  applyMiddlewares(bot);
  errorHandler(bot);

  //@ts-ignore
  bot.start(getUserInfo, updateUserActivity, async (ctx: ITelegramContext) => {
    ctx.scene.enter("start");
  });

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

  bot.hears(
    /(Cart)|(Корзина)|(Кошик)/i,
    //@ts-ignore
    async (ctx: ITelegramContext) => ctx.scene.enter("cart")
  );

  bot.hears(
    /^(Shops)|(Магазины)|(Магазини)$/i,
    //@ts-ignore
    getUserInfo,
    getProducts,
    updateUserActivity,
    (ctx: ITelegramContext) => {
      ctx.reply("Раздел в разработке");
    }
  );

  bot.hears(
    /(Shop)|(Магазин)|(Магазин)/i,
    //@ts-ignore
    getUserInfo,
    getProducts,
    updateUserActivity,
    (ctx: ITelegramContext) => {
      //@ts-ignore
      ctx.scene.enter("shop");
    }
  );

  bot.hears(
    /(Work)|(Работаем)|(Працюємо)/i,
    //@ts-ignore
    getUserInfo,
    getProducts,
    updateUserActivity,
    (ctx: ITelegramContext) => {
      ctx.reply("Раздел в разработке");
    }
  );

  const PORT = process.env.PORT as unknown as number;

  //@ts-ignore
  bot.command("home", async (ctx: ITelegramContext) => ctx.scene.enter("home"));

  // bot.telegram.setWebhook("");
  // bot.launch();
  bot.telegram.setWebhook("https://fathomless-wave-38776.herokuapp.com/");
  bot.startWebhook(
    "/1123799335:AAH4JyWrKUFlEkTIIClFF_GfQebGnfvwQYo",
    null,
    PORT
  );
});
