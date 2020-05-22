require("dotenv").config();

import { Telegraf } from "telegraf";
import express from "express";
import { database } from "./db/mongoose";
import { applyMiddlewares } from "./middlewares";
import { sysLog } from "./utils/winston";

import { updateUserActivity } from "./middlewares/functional/updateUserActivity"; // TODO: Structure well - this is a common function
import { ITelegramContext } from "./controllers/start";
import { getUserInfo } from "./middlewares/functional/getUserInfo";
import { getProducts } from "./middlewares/functional/getProducts";
import { errorHandler } from "./error handlers";
// import { sysLog } from "./utils/winston";

const server = express();

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
    async (ctx: ITelegramContext) => {
      //@ts-ignore
      bot.telegram.sendContact(
        ctx.chat?.id,
        +380631895794,
        "Олейник Валентин"
      );
    }
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
      ctx.reply(ctx.i18n.t("system.underConstruction"));
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
      ctx.reply(ctx.i18n.t('system.underConstruction'));
    }
  );

  const PORT = ((process.env.PORT as unknown) as number) || 3000;

  //@ts-ignore
  bot.command("home", async (ctx: ITelegramContext) => ctx.scene.enter("home"));

  bot.telegram.setWebhook(
    `https://fathomless-wave-38776.herokuapp.com/bot${process.env.TELEGRAM_TOKEN}`
  );

  server.use(bot.webhookCallback(`/bot${process.env.TELEGRAM_TOKEN}`));

  server.get("/", (_, res) => {
    res.send("BTWC Telegram BOT!");
  });

  server.listen(PORT, () => {
    sysLog.info("Telegram Bot Server launched...");
  });

  // bot.launch();
});
