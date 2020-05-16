import Keyboard from 'telegraf-keyboard';
import { ITelegramContext } from '../controllers/start';

export const MainNavigation = (ctx: ITelegramContext) => {
    const i18n = ctx.i18n;


    const options = {
        inline: false,
        duplicates: false,
        newline: false,
    };

    const MainMenu = new Keyboard(options)
      .add(i18n.t("keyboards.main.shop"), i18n.t("keyboards.main.cart"))
      .add(i18n.t("keyboards.main.cooperation"), i18n.t("keyboards.main.shops"))
      .add(i18n.t("keyboards.main.settings"), i18n.t("keyboards.main.contacts"));

    return MainMenu;

}

export const CoffeeListNavigation = () => {

    const options = {
        inline: false, // default
        duplicates: false, // default
        newline: false, // default
    };

    const CoffeeList = new Keyboard(options);

    return CoffeeList
        .add('Colombia')
        .add('Brazil')
        .add('Blend')
        .add('⬅ На головну');

}

export const cartStepOneKeyboard = () => {

    const options = {
        inline: false, // default
        duplicates: false, // default
        newline: false, // default
    };

    const stepOne = new Keyboard(options)
        .add('Змолоти')
        .add('Не змелювати');

    return stepOne;
}
