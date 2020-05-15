import TelegrafI18n from "telegraf-i18n";
import path from "path";
import { TelegrafContext } from "telegraf/typings/context";
import Telegraf from "telegraf";

const i18n = new TelegrafI18n({
  defaultLanguage: "en",
  allowMissing: false,
  directory: path.resolve(process.cwd(), "src", "locales"),
});

const i18nMiddleware = (bot: Telegraf<TelegrafContext>) => {
  bot.use(i18n.middleware());
};

export default i18nMiddleware;
