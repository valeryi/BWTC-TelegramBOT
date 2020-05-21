import Keyboard from "telegraf-keyboard";
import { ITelegramContext } from "../start";
import { IProduct } from "../../models/product.model";
import { ReplyKeyboardMarkup } from "telegraf/typings/telegram-types";
import { logger } from "../../utils/winston";

export function product_details_keyboard({ i18n, session }: ITelegramContext) {
  //@ts-ignore
  const products: IProduct[] = session.products;
  //@ts-ignore
  const active: IProduct[] = session.cart.active;
  const currentProduct: IProduct = products.filter(
    //@ts-ignore
    (product: any) => product.id === active.product.id
  )[0];

  const keyboard: any[] = [];

  for (const key in currentProduct.prices) {
    if (currentProduct.prices.hasOwnProperty(key)) {
      const price = (currentProduct as any).prices[key];

      keyboard.push([
        {
          text: `${price.name} : ${price.price} ₴`,
        },
      ]);
    }
  }
  keyboard.push([{ text: i18n.t("navigation.back") }]);

  return (keyboard as unknown) as ReplyKeyboardMarkup["keyboard"];
}

export function home_keyboard({ i18n }: ITelegramContext) {
  const keyboard = new Keyboard()
    .add(i18n.t("keyboards.main.shop"), i18n.t("keyboards.main.cart"))
    .add(i18n.t("keyboards.main.cooperation"), i18n.t("keyboards.main.shops"))
    .add(i18n.t("keyboards.main.settings"), i18n.t("keyboards.main.contacts"));

  return keyboard;
}

export function shop_keyboard(ctx: ITelegramContext) {
  const products: IProduct[] = (ctx.session as any).products;
  const keyboard = new Keyboard();

  try {
    for (let index = 0; index < Math.ceil(products.length / 2); index++) {
      // FIXME: Cannot add item if it's not even

      const first = products[Math.floor(index * 2)].name;
      const second = products[Math.floor(index * 2) + 1].name;

      keyboard.add(first, second);
    }
  } catch (err) {
    logger.error(`Error shop_keyboard: ${err.message}`);
  }

  keyboard.add(ctx.i18n.t("navigation.home"));

  return keyboard;
}
