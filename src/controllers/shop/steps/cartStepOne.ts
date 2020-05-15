import Stage from 'telegraf/stage';
import Scene from 'telegraf/scenes/base';
import { TelegrafContext } from 'telegraf/typings/context';
import { cartStepOneKeyboard } from '../../../utils/keyboards';
// import Keyboard from 'telegraf-keyboard';


const { leave } = Stage;
export const cartStepOne = new Scene('cartStepOne');

cartStepOne.enter(async (ctx: TelegrafContext) => {

    await ctx.reply('Виберіть 👇', cartStepOneKeyboard().draw());

    cartStepOne.hears(/(Змолоти)|(Не змелювати)/, (ctx: TelegrafContext) => {
        const responce = ctx.update.message?.text;

        //@ts-ignore
        ctx.session.cart.active.grind = responce;

        //@ts-ignore
        ctx.scene.enter('cartStepTwo');

    });

    // //@ts-ignore
    // console.log(ctx.session.cart);

})

cartStepOne.leave(async (_: TelegrafContext) => {


})

cartStepOne.command('saveme', leave());

export default cartStepOne;