import { TelegrafContext } from "telegraf/typings/context";
import Telegraf from "telegraf";
import Stage from "telegraf/stage";

import startScene from "../controllers/start";
import shopScene from "../controllers/shop";
import cartScene from "../controllers/cart";

import cartStepOne from "../controllers/shop/steps/cartStepOne";
import cartStepTwo from "../controllers/shop/steps/cartStepTwo";
import cartStepThree from "../controllers/shop/steps/cartStepThree";
import cartStepFour from "../controllers/shop/steps/cartStepFour";
import settingsScene from "../controllers/settings";
import contactsScene from "../controllers/contacts";

const stage = new Stage([
  startScene,
  shopScene,
  cartScene,
  cartStepOne,
  cartStepTwo,
  cartStepThree,
  cartStepFour,
  settingsScene,
  contactsScene,
]);

const stagesMiddleware = (bot: Telegraf<TelegrafContext>) => {
  bot.use(stage.middleware());
};

export default stagesMiddleware;
