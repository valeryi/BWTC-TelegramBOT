import Stage from 'telegraf/stage';
import Scene from 'telegraf/scenes/base';
import { TelegrafContext } from 'telegraf/typings/context';
// import { cartStepOneKeyboard } from '../../../utils/keyboards';
import Keyboard from 'telegraf-keyboard';


const { leave } = Stage;
export const cartStepThree = new Scene('cartStepThree');

cartStepThree.enter(async (ctx: TelegrafContext) => {

    const weight = new Keyboard({ inline: false })
        .add('1 кг')
        .add('0,25 кг');

    await ctx.reply('Виберіть вагу 👇', weight.draw());

    cartStepThree.hears(/(1 кг)|(0,25 кг)/, (ctx: TelegrafContext) => {
        const responce = ctx.update.message?.text;

        //@ts-ignore
        ctx.session.cart.active.pack_weight = responce;

        //@ts-ignore
        ctx.scene.enter('cartStepFour');

    });

    // //@ts-ignore
    // console.log(ctx.session.cart);

})

cartStepThree.leave(async (_: TelegrafContext) => {


})

cartStepThree.command('saveme', leave());

export default cartStepThree;