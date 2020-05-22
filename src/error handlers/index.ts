import Telegraf from "telegraf";
import { TelegrafContext } from "telegraf/typings/context";
import { ITelegramContext } from "../controllers/start";
import { sysLog } from "../utils/winston";

export function errorHandler(bot: Telegraf<TelegrafContext>) {
  bot.catch((err: Error, _: ITelegramContext) => {
    bot.telegram.sendMessage(
      476963932,
      `uncaughtException: "${err.message}" at /${Date.now()}/`
    );
  });

  process.on("uncaughtException", (err) => {
    sysLog.error(`uncaughtException: ${err.message}`);
    bot.telegram.sendMessage(
      476963932,
      `uncaughtException: "${err.message}" at /${Date.now()}/`
    );
  });

  
  process.on("exit", () => {
    sysLog.debug(`exiting process at /${Date.now()}/`);
    bot.telegram.sendMessage(
      476963932,
      `Exiting process of TelegramBOT - BWTC at ${Date.now()}`
    );
    process.exit(1);
  });
}
