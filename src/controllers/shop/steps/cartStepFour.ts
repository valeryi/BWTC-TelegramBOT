import Stage from 'telegraf/stage';
import Scene from 'telegraf/scenes/base';
import { TelegrafContext } from 'telegraf/typings/context';
import Keyboard from 'telegraf-keyboard';


const { leave } = Stage;
export const cartStepFour = new Scene('cartStepFour');

cartStepFour.enter(async (ctx: TelegrafContext) => {

    ctx.reply('Напишіть кількість упаково?', new Keyboard({ inline: false }).clear());

    cartStepFour.on('text', (ctx: TelegrafContext) => {

        const responce = ctx.update.message?.text;

        //@ts-ignore
        ctx.session.cart.active.amount = responce;

        //@ts-ignore
        const cart = ctx.session.cart;
        const bill_total = cart.active.amount * cart.active.product.price / 100;

        const item = {
            client_id: cart.client._id,
            client_telegram_id: cart.client.telegram_id,
            product_id: cart.active.product._id,
            unit_price: cart.active.product.price,
            amount: cart.active.amount,
            bill_total: bill_total
        }

        // const items = 

        //@ts-ignore
        ctx.session.cart.items = [...ctx.session.cart.items, item];
        cart.active = null;

        ctx.reply('Добавлено у кошик!');
        //@ts-ignore
        ctx.scene.enter('shop');
        // console.log(cart);

    })

    // cartStepTwo.hears(/(Змолоти)|(Не змелювати)/, (ctx: TelegrafContext) => {




    // });

    //@ts-ignore
    // console.log(ctx.session.cart);

})

cartStepFour.leave(async (_: TelegrafContext) => { })

cartStepFour.command('saveme', leave());

export default cartStepFour;