import Keyboard from 'telegraf-keyboard';

export const MainNavigation = () => {

    const options = {
        inline: false, // default
        duplicates: false, // default
        newline: false, // default
    };

    const MainMenu = new Keyboard(options)
        .add('🤟 Магазин', '🛒 Кошик')
        .add('📦 Замовлення', '📌 Блог')
        .add('⚙ Налаштування', '📲 Контакти')
        .add('📘 Інформація про каву');

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
