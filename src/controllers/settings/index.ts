import Stage from "telegraf/stage";
import Scene from "telegraf/scenes/base";
import { ITelegramContext } from "../start";
import Keyboard from "telegraf-keyboard";
import { changeLanguageAction } from "./actions";
import { getUserInfo } from "../../middlewares/functional/getUserInfo";
import { logger } from "../../utils/winston";
import { MainNavigation } from "../../utils/keyboards";

const { leave } = Stage;
const settings = new Scene("settings");

settings.enter(async (ctx: ITelegramContext) => {
  logger.debug("entered setting scene");

  const i18n = ctx.i18n;

  const settingKeyboard = new Keyboard({ inline: false })
    .add(i18n.t("scenes.settings.language"))
    .add(i18n.t("navigation.home"));

  ctx.reply(i18n.t("toAction.customizeMe"), settingKeyboard.draw());
});

settings.leave(async (_: ITelegramContext) => {
  logger.debug("leaved setting scene");
});

settings.command("saveme", leave());

settings.hears(
  /(Change language)|(Изменить язык)|(Змінити мову)/i,
  getUserInfo,
  (ctx: ITelegramContext) => {
    logger.debug(`Hears change language`);
    const i18n = ctx.i18n;

    const languageList = new Keyboard({
      inline: true,
    })
      .add(`English:changeLanguage eng`)
      .add(`Русский:changeLanguage ru`)
      .add(`Українська:changeLanguage ukr`);

    ctx.reply(
      i18n.t("toAction.pickLanguage"),
      languageList.draw()
    );
  }
);

settings.hears(
  /(Home)|(Главная)|(Головна)/i,
  getUserInfo,
  (ctx: ITelegramContext) => {
    logger.debug("Hears back home action");
    const i18n = ctx.i18n;

    ctx.reply(i18n.t(`navigation.home`), MainNavigation(ctx).draw());
  }
);
settings.action(/changeLanguage/i, getUserInfo, changeLanguageAction);

export default settings;
