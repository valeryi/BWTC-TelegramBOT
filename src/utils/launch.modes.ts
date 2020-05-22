import { Express } from "express";
import Telegraf from "telegraf";
import { TelegrafContext } from "telegraf/typings/context";
import { sysLog } from "./winston";

export function launchProdMode(
  bot: Telegraf<TelegrafContext>,
  server: Express,
  TOKEN: string
) {
  const PORT = ((process.env.PORT as unknown) as number) || 3000;

  bot.telegram.setWebhook(
    `https://fathomless-wave-38776.herokuapp.com/bot${TOKEN}`
  );

  server.use(bot.webhookCallback(`/bot${TOKEN}`));

  server.get("/", (_, res) => {
    res.send("BTWC Telegram BOT!");
  });

  server.listen(PORT, () => {
    sysLog.info("Telegram Bot Server launched...");
  });

  const info = bot.telegram.getWebhookInfo();
  sysLog.info(info);
}

export function launchDevMode(bot: Telegraf<TelegrafContext>, server: Express) {
  server.use(bot.webhookCallback(``));
  bot.launch().then(() => sysLog.info("Development mode is active"));
}
