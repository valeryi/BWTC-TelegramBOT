import { TelegrafContext } from "telegraf/typings/context";
import Telegraf from "telegraf";
import Stage from "telegraf/stage";

import startScene from "../controllers/start";
import shopScene from "../controllers/shop";
import homeScene from "../controllers/home";
// import cartScene from "../controllers/cart";
import settingsScene from "../controllers/settings";
import contactsScene from "../controllers/contacts";
import toCartQ from "../controllers/shop/steps.tocart";

export const stage = new Stage([
  startScene,
  shopScene,
  settingsScene,
  contactsScene,
  ...toCartQ,
  homeScene,
]);

const stagesMiddleware = (bot: Telegraf<TelegrafContext>) => {
  bot.use(stage.middleware());
};

export default stagesMiddleware;
