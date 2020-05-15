import Stage from 'telegraf/stage';
import Scene from 'telegraf/scenes/base';
import { TelegrafContext } from 'telegraf/typings/context';
// import { cartStepOne } from '../../utils/keyboards';
// import { stepTwo } from './actions';
// import { stepOne } from './actions';

const { leave } = Stage;
export const cart = new Scene('cart');

cart.enter(async (ctx: TelegrafContext) => {

    const match = ctx.match?.input;
    const id = (match as string).split(' ')[1];

    //@ts-ignore
    const client = ctx.session.current_user;
    //@ts-ignore
    const callback_query_id = ctx.update.callback_query?.id;

    //@ts-ignore
    const product = ctx.session.products.filter(product => product._id == id)[0];

    //@ts-ignore
    ctx.session.cart = {
        query_id: callback_query_id,
        client: client,
        active: {product},
        items: [],
        payment_method: '',
        paid: false,
    }

    //@ts-ignore
    console.log(ctx.session.cart);

    //@ts-ignore
    ctx.scene.enter('cartStepOne');

})

cart.leave(async (_: TelegrafContext) => {})

cart.command('saveme', leave());

// shop.hears('Colombia', ColombiaCategory);
// shop.hears('Brazil', BrazilCategory);
// shop.hears('Blend', BlendCategory);
// shop.hears('⬅ На головну', (ctx: TelegrafContext) => {

//     //@ts-ignore
//     ctx.scene.leave();
//     ctx.reply('Ось головне меню 👇', (MainNavigation() as any).draw());
// });

// shop.action(/productDetails/i, getProductDetails);
// shop.action(/toCart/i, toCart);

export default cart;