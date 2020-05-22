require("dotenv").config();

import { Telegraf } from "telegraf";
import express from "express";
import { database } from "./db/mongoose";
import { applyMiddlewares } from "./middlewares";

import { updateUserActivity } from "./middlewares/functional/updateUserActivity"; // TODO: Structure well - this is a common function
import { ITelegramContext } from "./controllers/start";
import { getUserInfo } from "./middlewares/functional/getUserInfo";
import { getProducts } from "./middlewares/functional/getProducts";
import { errorHandler } from "./error handlers";
import { launchDevMode, launchProdMode } from "./utils/launch.modes";

database.init().then(() => {
  const TOKEN =
    process.env.NODE_ENV === "DEVELOPMENT"
      ? (process.env.DEV_TOKEN as string)
      : (process.env.TELEGRAM_TOKEN as string);

  const server = express();
  const bot = new Telegraf(TOKEN);

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
      ctx.reply(ctx.i18n.t("system.underConstruction"));
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
      ctx.reply(ctx.i18n.t("system.underConstruction"));
    }
  );

  //@ts-ignore
  bot.command("home", async (ctx: ITelegramContext) => ctx.scene.enter("home"));

  process.env.NODE_ENV === "DEVELOPMENT"
    ? launchDevMode(bot, server)
    : launchProdMode(bot, server, TOKEN);
});
