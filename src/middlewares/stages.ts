import { TelegrafContext } from "telegraf/typings/context";
import Telegraf from "telegraf";
import Stage from "telegraf/stage";

import startScene from "../controllers/start";
import shopScene from "../controllers/shop";
import homeScene from "../controllers/home";
import cartScene from "../controllers/cart";
import settingsScene from "../controllers/settings";
import contactsScene from "../controllers/contacts";
import toCartQ from "../controllers/shop/steps.tocart";
import paymentScene from "../controllers/payment";
import editAmountScene from "../controllers/cart/edit.amount";
import editPackScene from "../controllers/cart/edit.pack";
import feedbackScene from "../utils/feedback";

export const stage = new Stage([
  startScene,
  shopScene,
  settingsScene,
  contactsScene,
  ...toCartQ,
  homeScene,
  cartScene,
  paymentScene,
  editAmountScene,
  editPackScene,
  feedbackScene,
]);

const stagesMiddleware = (bot: Telegraf<TelegrafContext>) => {
  bot.use(stage.middleware());
};

export default stagesMiddleware;
