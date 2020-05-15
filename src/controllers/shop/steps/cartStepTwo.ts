import Stage from 'telegraf/stage';
import Scene from 'telegraf/scenes/base';
import { TelegrafContext } from 'telegraf/typings/context';
import Keyboard from 'telegraf-keyboard';


const { leave } = Stage;
export const cartStepTwo = new Scene('cartStepTwo');

cartStepTwo.enter(async (ctx: TelegrafContext) => {

    ctx.reply('Напишіть, яким методом Ви готуєте каву?', new Keyboard({inline: false}).clear());

    cartStepTwo.on('text', (ctx: TelegrafContext) => {

        const responce = ctx.update.message?.text;

        //@ts-ignore
        ctx.session.cart.active.method = responce;

        // //@ts-ignore
        // console.log(ctx.session.cart)
        //@ts-ignore
        ctx.scene.enter('cartStepThree');
    })



    // });

    // //@ts-ignore
    // console.log(ctx.session.cart);

})

cartStepTwo.leave(async (_: TelegrafContext) => { })

cartStepTwo.command('saveme', leave());

export default cartStepTwo;